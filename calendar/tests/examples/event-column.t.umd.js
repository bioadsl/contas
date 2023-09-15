StartTest(t => {

    t.it('Should not have undefined on creating new room', async t => {
        await t.doubleClick('[data-column-id="agenda"]');
        await t.waitForSelector('.b-eventeditor');
        t.is(t.queryWidget('[data-ref="roomSelector"]').value, 'New room');
        t.selectorNotExists('.my-agenda-room-name :contains(undefined)');
        t.selectorExists('.my-agenda-room-name:contains(New room)');
    });

});
