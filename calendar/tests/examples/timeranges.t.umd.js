StartTest(t => {
    t.it('Sanity', async t => {
        await t.waitForSelector('.b-cal-timerange');

        const calendar = bryntum.query('calendar');

        t.selectorCountIs('.b-cal-timerange', calendar.activeView.element, calendar.timeRangeStore.count);

        await t.click('button[data-ref="weekResourcesShowButton"]');

        await t.waitForAnimations();

        t.selectorCountIs('.b-cal-timerange', calendar.activeView.element, calendar.resourceTimeRangeStore.count);
    });
});
