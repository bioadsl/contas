StartTest(t => {

    const
        calendar       = bryntum.query('calendar'),
        { eventStore } = calendar;

    t.it('Sanity', async t => {
        await t.waitForSelector('.b-cal-event-wrap');
    });

    t.it('Should not throw on subsequent event edit', async t => {
        await calendar.editEvent(eventStore.getById(1));
        await t.waitForSelector('.b-eventeditor');
        await calendar.editEvent(eventStore.getById(2));
        await t.waitForSelector('.b-eventeditor');
    });

});
