
StartTest(t => {
    let calendar;

    t.beforeEach(function() {
        calendar?.destroy();
    });

    t.it('Should support recurring events + exceptionDates', async t => {
        calendar = await t.getCalendar({
            date   : new Date(2019, 9, 14),
            mode   : 'week',
            events : [{
                id             : 1,
                startDate      : new Date(2019, 9, 14, 12),
                recurrenceRule : 'FREQ=DAILY',
                // Support array
                exceptionDates : ['2019-10-17'],
                cls            : 'recur1',
                duration       : 1,
                durationUnit   : 'h'
            },
            {
                id             : 2,
                startDate      : new Date(2019, 9, 14, 15),
                recurrenceRule : 'FREQ=DAILY',
                // Support comma based string
                exceptionDates : '2019-10-17,2019-10-18',
                cls            : 'recur2',
                duration       : 1,
                durationUnit   : 'h'
            }]
        });

        t.selectorCountIs('.b-cal-event-wrap.recur1', 5, '5 events in the week since we start on Monday and skip Friday');
        t.selectorCountIs('.b-cal-event-wrap.recur2', 4, '4 events in the week since we start on Monday and skip Friday + Saturday');
    });

    t.it('Should be able to delete the base of a recurring event series and leave the series starting from the next occurrence', async t => {
        calendar = await t.getCalendar({
            date   : new Date(2019, 9, 14),
            mode   : 'week',
            events : [{
                name           : 'Recurring',
                id             : 1,
                startDate      : new Date(2019, 9, 14, 12),
                recurrenceRule : 'FREQ=DAILY',
                // Support array
                exceptionDates : ['2019-10-17'],
                cls            : 'recur1',
                duration       : 1,
                durationUnit   : 'h'
            }]
        });

        t.selectorCountIs('.b-cal-event-wrap.recur1', 5, '5 events in the week since we start on Monday and skip Friday');

        await t.doubleClick('.b-dayview-day-detail[data-date="2019-10-14"] .recur1');

        await t.click('[data-ref="deleteButton"]');

        await t.click('[data-ref="changeSingleButton"]');

        t.selectorCountIs('.b-cal-event-wrap.recur1', 4, '4 events in the week since we start on Monday and skip Friday');
    });
});
