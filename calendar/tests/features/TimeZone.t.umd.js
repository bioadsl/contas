
StartTest(t => {
    let calendar;

    t.beforeEach(function() {
        calendar?.destroy();
    });

    async function assertTimeZoneConversion(t, { startDateString, endDateString, events }) {
        t.is(calendar.activeView.startDate.toString(), new Date(startDateString).toString());
        t.is(calendar.activeView.endDate.toString(), new Date(endDateString).toString());

        // Check events
        for (const expectEvent of events) {
            if (expectEvent.id) {
                t.diag('Checking event ' + expectEvent.id);
                const event = calendar.eventStore.getById(expectEvent.id);
                if (expectEvent.startDateString) {
                    t.is(event.startDate.toString(), new Date(expectEvent.startDateString), 'Start date ok');
                }
                if (expectEvent.endDateString) {
                    t.is(event.endDate.toString(), new Date(expectEvent.endDateString), 'End date ok');
                }
            }
        }

        t.is(calendar.eventStore.modified.count, 0, 'No modifications found');
    }

    t.it('Should work to set IANA time zone initially', async t => {
        calendar = await t.getCalendar({
            timeZone : 'America/Chicago',
            date     : new Date('2022-10-11T13:00:00-05:00'),
            events   : [
                { id : 1, startDate : '2022-10-11T20:00:00Z', duration : 1, durationUnit : 'hour', resourceId : 'r1' }
            ]
        });

        await assertTimeZoneConversion(t, {
            startDateString : '2022-10-09T00:00:00',
            endDateString   : '2022-10-16T00:00:00',
            events          : [
                { id : 1, startDateString : '2022-10-11T15:00:00' }
            ]
        });
    });

    t.it('Should work to set time zone at runtime', async t => {
        calendar = await t.getCalendar({
            date   : new Date('2022-10-11T13:00:00Z'),
            events : [
                { id : 1, startDate : '2022-10-11T20:00:00Z', duration : 1, durationUnit : 'hour' }
            ]
        });

        calendar.timeZone = 'America/Chicago';
        await assertTimeZoneConversion(t, {
            startDateString : '2022-10-09T00:00:00',
            endDateString   : '2022-10-16T00:00:00',
            events          : [
                { id : 1, startDateString : '2022-10-11T15:00:00' }
            ]
        });
    });

    t.it('Should work to change time zone at runtime', async t => {
        calendar = await t.getCalendar({
            date     : new Date('2022-10-11T13:00:00-05:00'),
            timeZone : 'America/Chicago',
            events   : [
                { id : 1, startDate : '2022-10-11T20:00:00Z', duration : 1, durationUnit : 'hour' }
            ]
        });

        calendar.timeZone = 'Europe/Stockholm';
        await assertTimeZoneConversion(t, {
            startDateString : '2022-10-09T00:00:00',
            endDateString   : '2022-10-16T00:00:00',
            events          : [
                { id : 1, startDateString : '2022-10-11T22:00:00' }
            ]
        });
    });

    t.it('Should get local unconverted date when commiting', async t => {
        calendar = await t.getCalendar({
            date     : new Date('2022-10-24T10:00:00-05:00'),
            timeZone : 'America/Chicago',
            events   : [
                { id : 1, startDate : '2022-10-24T20:00:00Z', duration : 1, durationUnit : 'hour' }
            ]
        });

        const rec = calendar.eventStore.first;

        t.is(rec.persistableData.startDate.toISOString(), '2022-10-24T20:00:00.000Z', 'Original date correct');

        rec.startDate = DateHelper.add(rec.startDate, 2, 'hour');

        t.is(rec.persistableData.startDate.toISOString(), '2022-10-24T22:00:00.000Z', 'Modified date correct');
    });

    t.it('New record should be created with dates in current active time zone', async t => {
        calendar = await t.getCalendar({
            date     : new Date('2022-10-11T13:00:00-05:00'),
            timeZone : 'America/Chicago',
            events   : [
                { id : 1, startDate : '2022-10-11T20:00:00Z', duration : 1, durationUnit : 'hour' }
            ]
        });
        calendar.eventStore.add({ id : 2, startDate : new Date('2022-10-12T01:00:00'), duration : 1, durationUnit : 'hour' });

        await assertTimeZoneConversion(t, {
            startDateString : '2022-10-09T00:00:00',
            endDateString   : '2022-10-16T00:00:00',
            events          : [
                { id : 1, startDateString : '2022-10-11T15:00:00' },
                { id : 2, startDateString : '2022-10-12T01:00:00' }
            ]
        });
    });

    t.it('Should display correct today when converted to timezone', async t => {
        // Snoozing test until we have a fix
        if (new Date() < new Date(2023, 10, 1)) {
            return;
        }
        else {
            t.fail('Snoozed test woke up');
        }
        const
            localToday = new Date(),
            // Using a UTC offset in minutes to simplify this test.
            // If today is Sunday, we go forward in time instead, not to shift week
            timeZone   = -24 * (localToday.getDay() === 0 ? -1 : 1) * 60,
            utcToday   = TimeZoneHelper.toTimeZone(localToday, 0),
            tzToday    = TimeZoneHelper.toTimeZone(localToday, timeZone);

        calendar = await t.getCalendar({
            timeZone,
            mode : 'day',
            date : utcToday
        });

        // All views
        t.selectorExists(`.b-calendar-days .b-today[data-date="${DateHelper.makeKey(tzToday)}"]`, 'Converted today marked in datepicker correctly');

        t.diag('Testing day view');
        t.selectorExists(`.b-calendarrow-header .b-today[data-header-date="${DateHelper.makeKey(tzToday)}"]`, 'Converted today marked in header correctly');

        t.diag('Testing week view');
        calendar.mode = 'week';
        await t.waitForAnimations();

        t.selectorExists(`.b-calendarrow-header .b-today[data-header-date="${DateHelper.makeKey(tzToday)}"]`, 'Converted today marked in header correctly');
        t.selectorNotExists(`[data-date="${DateHelper.makeKey(localToday)}"] .b-current-time-indicator`, 'No current time indicator present at local today');
        t.selectorExists(`[data-date="${DateHelper.makeKey(tzToday)}"] .b-current-time-indicator`, 'Current time indicator present at tz today');

        t.diag('Testing month view');
        calendar.mode = 'month';
        await t.waitForAnimations();
        t.selectorExists(`.b-monthview .b-calendar-cell.b-today[data-date="${DateHelper.makeKey(tzToday)}"]`, 'Correct cell marked as today');

        t.diag('Testing year view');
        calendar.mode = 'year';
        await t.waitForAnimations();
        t.selectorExists(`.b-yearview .b-calendar-cell.b-today[data-date="${DateHelper.makeKey(tzToday)}"]`, 'Correct cell marked as today');
    });

    // https://github.com/bryntum/support/issues/6839
    t.it('Should update the current time indicator when configuring a timeZone', async t => {
        const
            localToday = new Date(),
            timeZone   = 'America/Chicago',
            tzNow      = TimeZoneHelper.toTimeZone(localToday, timeZone);

        calendar = await t.getCalendar({
            timeZone,
            mode : 'day',
            date : tzNow
        });

        calendar.date = tzNow;

        const
            { activeView  } = calendar,
            dayLengthMs = activeView.getDayLength('ms'),
            nowMS       = activeView.dayTime.delta(tzNow, 'ms'),
            expectedTop = DomHelper.percentify(nowMS / dayLengthMs * 100),
            [indicator] = t.query('.b-current-time-indicator');

        t.isApprox(parseFloat(indicator.style.top), parseFloat(expectedTop), 0.1, 'Current time indicator correctly positioned');
    });

    t.it('TimeZone should only affect current date in dayview and when the center point of current days event changes date', async t => {

        calendar = await t.getCalendar({
            date   : new Date('2023-05-28T00:00Z'),
            events : [{ id : 1, startDate : '2023-05-28T00:00Z', endDate : '2023-05-28T01:00Z', name : '1' }]
        });

        const currentDate = calendar.date.toString();

        calendar.timeZone = 'America/Chicago';
        await calendar.project.commitAsync();

        t.is(calendar.events[0].startDate.toString(), new Date('2023-05-27T19:00').toString());
        t.is(calendar.date.toString(), currentDate, 'Date did not change in week view');

        calendar.timeZone = 0;
        await calendar.project.commitAsync();

        t.is(calendar.events[0].startDate.toString(), new Date('2023-05-28T00:00').toString());
        t.is(calendar.date.toString(), currentDate, 'Date did not change in week view converting back');

        calendar.mode = 'day';
        await t.waitFor(() => calendar.activeView.duration === 1);

        calendar.timeZone = -60;
        await calendar.project.commitAsync();

        t.is(calendar.events[0].startDate.toString(), new Date('2023-05-27T23:00').toString());

        const expectedDate = new Date('2023-05-27T00:00').toString();
        t.is(calendar.date.toString(), expectedDate, 'Date did change in day view');

        calendar.timeZone = null;
        await calendar.project.commitAsync();
        t.is(calendar.events[0].startDate.toString(), new Date('2023-05-28T00:00Z').toString());
        t.is(calendar.date.toString(), currentDate, 'Date changed in day view converting back');

        calendar.eventStore.add({ id : 2, startDate : '2023-05-28T16:00Z', endDate : '2023-05-28T16:00Z', name : '2' });
        await calendar.project.commitAsync();

        calendar.timeZone = -180;
        await calendar.project.commitAsync();

        t.is(calendar.events[0].startDate.toString(), new Date('2023-05-27T21:00').toString());
        t.is(calendar.events[1].startDate.toString(), new Date('2023-05-28T13:00').toString());
        t.is(calendar.date.toString(), currentDate, 'Date did not change in day view when center point remains on same date');

        calendar.timeZone = null;
        await calendar.project.commitAsync();
        t.is(calendar.date.toString(), currentDate, 'Date did not change in day view when converting back');

    });

});
