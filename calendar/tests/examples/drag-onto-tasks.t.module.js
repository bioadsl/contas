StartTest(t => {
    const
        calendar       = bryntum.query('mycalendar'),
        equipment      = bryntum.query('equipmentgrid'),
        equipmentStore = equipment.store,
        eventStore     = calendar.eventStore;

    t.beforeEach(() => {
        eventStore.revertChanges();
    });

    t.it('Should be able to drag equipment from grid onto a task', async t => {
        await t.dragTo({
            source : '.b-equipment:contains(Video camera)',
            target : '[data-event-id="r4"]'
        });

        await t.waitForSelectorNotFound('.b-drag-final-transition');
        await t.waitForSelector('[data-event-id="r4"] .b-fa-video');
    });

    t.it('Should be able to drag equipment from grid onto a task in week view', async t => {
        await t.waitFor(() => eventStore.count === 6 && equipmentStore.count === 9);
        await t.waitForSelector(calendar.eventSelector + '[data-event-id="r3"]');

        t.willFireNTimes(eventStore, 'change', 2);
        t.wontFire(equipmentStore, 'change');

        await t.dragTo({
            source : '.b-equipment:contains(Video camera)',
            target : calendar.eventSelector + '[data-event-id="r3"]'
        });

        await t.waitForSelectorNotFound('.b-drag-final-transition');
        await t.waitForSelector(calendar.eventSelector + '[data-event-id="r3"] .b-fa.b-fa-video');

        await t.dragTo({
            source : '.b-equipment:contains(Microphone)',
            target : calendar.eventSelector + '[data-event-id="r3"]'
        });

        await t.waitForSelectorNotFound('.b-drag-final-transition');

        await t.waitForSelector(calendar.eventSelector + '[data-event-id="r3"] .b-fa.b-fa-microphone');

        await t.doubleClick('[data-event-id="r3"]');

        const equipmentCombo = calendar.features.eventEdit.editor.widgetMap.equipment;
        t.is(equipmentCombo.store.count, 9, 'Equipment store has correct contents');

        await t.click('.b-button:contains(Cancel)');
    });

    t.it('Dragging to invalid place should have no side effect on data', t => {
        const equipmentStore = equipment.store;
        const eventStore     = calendar.eventStore;

        t.wontFire(equipmentStore, 'change');
        t.wontFire(eventStore, 'change');

        t.chain(
            {
                drag : '[data-ref=equipment] .b-grid-cell',
                to   : '[data-date="2023-10-08"]'
            }
        );
    });

    t.it('Should be able to drag equipment from grid onto a task', async t => {
        await t.waitFor(() => eventStore.count === 6 && equipmentStore.count === 9);
        await t.waitForSelector(calendar.eventSelector + '[data-event-id="r3"]');

        t.willFireNTimes(eventStore, 'change', 2);
        t.wontFire(equipmentStore, 'change');

        await t.dragTo({
            source : '.b-equipment:contains(Video camera)',
            target : '.b-weekview [data-event-id="r3"]'
        });

        await t.waitForSelectorNotFound('.b-drag-final-transition');
        await t.waitForSelector('.b-weekview [data-event-id="r3"] .b-fa.b-fa-video');

        await t.dragTo({
            source : '.b-equipment:contains(Microphone)',
            target : '.b-weekview [data-event-id="r3"]'
        });

        await t.waitForSelectorNotFound('.b-drag-final-transition');
        await t.waitForSelector('.b-weekview [data-event-id="r3"] .b-fa.b-fa-microphone');

        await t.doubleClick('.b-weekview [data-event-id="r3"]');

        const equipmentCombo = calendar.features.eventEdit.editor.widgetMap.equipment;
        t.is(equipmentCombo.store.count, 9, 'Equipment store has correct contents');

        await t.click('.b-button:contains(Cancel)');
    });

    t.it('Should be able to drag equipment from grid onto a task in day view', async t => {
        calendar.date = new Date(2023, 9, 12);
        calendar.mode = 'day';

        await t.waitForSelector('.b-dayview:not(.b-weekview) [data-event-id="r2"]');

        t.willFireNTimes(eventStore, 'change', 1);
        t.wontFire(equipmentStore, 'change');

        await t.dragTo({
            source : '.b-equipment:contains(Video camera)',
            target : '.b-dayview:not(.b-weekview) [data-event-id="r2"]'
        });

        await t.waitForSelectorNotFound('.b-drag-final-transition');
        await t.waitForSelector(calendar.eventSelector + '[data-event-id="r2"] .b-fa.b-fa-video');
    });

    t.it('Should be able to drag equipment from grid onto a task in month view', async t => {
        calendar.mode = 'month';
        await t.waitForAnimations();

        t.willFireNTimes(eventStore, 'change', 1);
        t.wontFire(equipmentStore, 'change');

        await t.dragTo({
            source : '.b-equipment:contains(Video camera)',
            target : '.b-monthview [data-event-id="r4"]'
        });

        t.ok(eventStore.getById('r4').equipment.find(e => e.name === 'Video camera'));
    });

});
