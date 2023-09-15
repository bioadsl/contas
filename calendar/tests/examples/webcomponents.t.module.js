StartTest(async t => {

    const calendar = bryntum.query('calendar');

    const sel = selector => `bryntum-calendar -> ${selector}`;
    await t.waitForSelector(sel('.b-cal-event'));
    await t.waitForProjectReady(calendar.project);

    t.it('Config sanity', async t => {
        t.ok(calendar.events);
        t.ok(calendar.resources);
        t.ok(calendar.modes);
        t.ok(calendar.assignments);
        t.notOk(calendar.dependencies);
        t.notOk(calendar.columns);
    });

    t.it('Should support rendering + dragging event in a webcomponent', async t => {
        t.firesOnce(calendar, 'eventclick');
        t.firesOnce(calendar.eventStore, 'update');

        await t.click(sel('.b-cal-event:contains(Click me)'));
        await t.dragBy({
            source : sel('.b-cal-event'),
            delta  : [-100, 0]
        });

        await t.waitForSelectorNotFound('.b-dragging');

        let movedTask;
        await t.waitFor(() => (movedTask = calendar.eventStore.changes?.modified[0]));

        t.is(movedTask.startDate, new Date(2018, 3, 2, 10), 'Start Date updated');
    });

    t.it('Should support typing', async t => {
        t.firesOnce(calendar, 'eventdblclick');
        t.firesOnce(calendar.eventStore, 'update');

        await t.doubleClick(sel('.b-cal-event:contains(Drag me)'));
        await t.type(null, 'foo[ENTER]', null, null, null, true);
        await t.waitForSelector(sel('.b-cal-event:contains(foo)'));
    });

    // https://github.com/bryntum/support/issues/4969
    t.it('Should have demo toolbar localization', async t => {
        await t.moveMouseTo('[data-ref="fullscreenButton"]');
        await t.waitForSelector('.b-tooltip:contains("Full screen")');
    });

    // https://github.com/bryntum/support/issues/6629
    t.it('Should hide context menu when body scrolls', async t => {
        await t.rightClick(sel('.b-dayview-day-detail'));

        t.selectorCountIs(sel('.b-menu:contains(Add event)'), 1);

        // Scroll listener is added after a delay
        await t.waitFor(100);

        calendar.activeView.scrollable.y += 10;

        // Menu must hide
        await t.waitForSelectorNotFound(sel('bryntum-calendar -> .b-menu:contains(Add event)'));
    });
});
