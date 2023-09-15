StartTest(t => {
    t.it('Sanity', async t => {
        await t.waitForSelector('.b-cal-event-wrap');

        await t.moveMouseTo('.b-cal-event-wrap:contains(Bryntum onsite meeting)');

        // Check that HTML has been rendered all the way down
        await t.waitForSelector('.b-sch-event-tooltip .b-header-title:contains(Bryntum onsite meeting)');
        await t.waitForSelector('.b-sch-event-tooltip .b-eventtip-content dd > a > i.b-fa.b-fa-globe');
    });
});
