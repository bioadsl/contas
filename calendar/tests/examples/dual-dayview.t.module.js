StartTest(async t => {
    await t.waitForSelector('.b-dualdayview-content .b-dayview:nth-child(2) .b-cal-event-wrap');

    const
        calendar = bryntum.query('calendar'),
        dDayView = calendar.activeView;

    t.it('Sanity', async t => {
        t.is(dDayView.primaryView.hourHeight, 42);
        t.is(dDayView.primaryView.eventStore.count, 0);

        await t.click('[data-ref="zoomButton"]');

        await t.waitFor(() => dDayView.primaryView.hourHeight === 63);

        await t.dragBy({
            source : '.b-cal-event-wrap[data-event-id="1"]',
            delta  : [-380, dDayView.primaryView.hourHeight * 2]
        });

        // Drag into Calendar project works
        t.is(dDayView.primaryView.eventStore.first.name, 'Team Building Workshop');
        t.is(dDayView.primaryView.eventStore.first.startDate.getHours(), 9, 'Team Building Workshop');

        const
            { count : calendarStoreCount } = calendar.eventStore,
            { count : sourceStoreCount }   = dDayView.sourceView.eventStore;

        // This should not create a new event. https://github.com/bryntum/support/issues/7332
        await t.doubleClick(`#${dDayView.sourceView.id} .b-dayview-day-detail.b-calendar-cell`, null, null, null, ['50%', dDayView.sourceView.hourHeight * 8]);

        // dblClick should not create anything
        t.is(calendar.eventStore.count, calendarStoreCount);
        t.is(dDayView.sourceView.eventStore.count, sourceStoreCount);
    });
});
