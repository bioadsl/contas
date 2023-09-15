StartTest(t => {
    const
        calendar = bryntum.query('calendar'),
        { eventStore } = calendar;

    t.it('Sanity', async t => {
        await t.waitForSelector('.b-cal-event-wrap');
        await t.waitForSelector('.b-avatars-container');
    });

    t.it('Can add to guests list', async t => {
        await calendar.editEvent(eventStore.getById(5));
        await t.waitForSelector('.b-guestselector');
        await t.click('.b-guestselector');
        await t.click('.b-combo-picker .b-list-item[data-id=3]');
        await t.click('.b-guestselector');
        await t.click('[data-ref=saveButton]');
        await t.is(eventStore.getById(5).guests[0], 3);
    });

});
