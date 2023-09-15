
StartTest(t => {
    t.it('Should instantiate CalendarRow', async t => {
        let calendarRow;

        t.livesOk(() => {
            calendarRow = new CalendarRow({
                appendTo  : document.body,
                startDate : new Date(2020, 8, 3),
                endDate   : new Date(2020, 8, 8),
                events    : [
                    { startDate : '2020-09-04T07:00', duration : 5, durationUnit : 'h', name : 'Walk the dog', eventColor : 'yellow', allDay : true },
                    { startDate : '2020-09-04T09:00', duration : 2, durationUnit : 'h', name : 'Buy masks', eventColor : 'orange' },
                    { startDate : '2020-09-05T07:00', duration : 1, durationUnit : 'h', name : 'Zoom meeting', eventColor : 'deep-orange' },
                    { startDate : '2020-09-05T09:00', duration : 1, durationUnit : 'h', name : 'Get a haircut', eventColor : 'gray' }
                ]
            });
        }, 'Should instantiate CalendarRow');

        await t.waitForSelectorCount('.b-cal-event-icon', 3);

        t.selectorCountIs('.b-cal-event-icon', 3);

        t.hasStyle(`.b-cal-event-wrap[data-event-id="${calendarRow.eventStore.first.id}"] .b-cal-event`, 'background-color', 'rgb(253, 216, 53)');
        t.hasStyle(`.b-cal-event-wrap[data-event-id="${calendarRow.eventStore.getAt(1).id}"] .b-cal-event-icon`, 'color', 'rgb(255, 167, 38)');
        t.hasStyle(`.b-cal-event-wrap[data-event-id="${calendarRow.eventStore.getAt(2).id}"] .b-cal-event-icon`, 'color', 'rgb(255, 112, 67)');
        t.hasStyle(`.b-cal-event-wrap[data-event-id="${calendarRow.eventStore.getAt(3).id}"] .b-cal-event-icon`, 'color', 'rgb(160, 160, 160)');
    });
});
