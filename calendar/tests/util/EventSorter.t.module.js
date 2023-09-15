
StartTest(t => {
    let calendar;

    t.beforeEach(() => {
        t.setupCalendarTest(calendar);
    });

    // https://github.com/bryntum/support/issues/7185
    t.it('Events should sort correctly in month view mode, following the rule of start date before duration', async t => {
        const
            eventStore = new EventStore({
                // Add a recurring meeting
                data : t.getHackathonData().events.rows.concat([{
                    duration       : 1,
                    durationUnit   : 'hour',
                    id             : 'twice-weekly',
                    name           : 'Recurring Meeting',
                    recurrenceRule : 'FREQ=WEEKLY;BYDAY=TU,TH',
                    startDate      : new Date(2019, 9, 15, 13)
                }])
            }),
            resourceStore = new ResourceStore({
                data : t.getHackathonData().resources.rows
            });

        calendar = await t.getCalendar({
            date  : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            modes : {
                day  : null,
                week : null,
                year : null
            }
        });

        await t.click('.b-calendar-cell[data-date="2019-10-15"] button[data-event-id="overflow"]');

        t.selectorExists('.b-cal-event-bar-container > div:nth-child(2) .b-cal-event-desc:textEquals(Breakfast)', 'Breakfast should be listed before Lunch');
        t.selectorExists('.b-cal-event-bar-container > div:nth-child(6) .b-cal-event-desc:textEquals(Lunch)', 'Lunch should be listed before Dinner');
        t.selectorExists('.b-cal-event-bar-container > div:nth-child(8) .b-cal-event-desc:textEquals(Dinner)', 'Dinner should be listed as last element');
    });
});
