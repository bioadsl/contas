
StartTest(t => {
    // Safari fails this test when on TC
    if (t.bowser.safari) {
        return;
    }

    // Some test's expectations require legacy eventSorting
    // This allows the tests to continue to pass
    const eventSorter = function(event1, event2) {
        // Handle event wrapping which is what MonthView does.
        event1 = event1.eventRecord || event1;
        event2 = event2.eventRecord || event2;

        const
            {
                startDate  : start1,
                isInterDay : event1InterDay
            } = event1,
            {
                startDate  : start2,
                isInterDay : event2InterDay
            } = event2;

        // Unscheduled events sort to the top.
        if (!start1) {
            return -1;
        }
        if (!start2) {
            return 1;
        }

        // InterDay events sort to the top (https://github.com/bryntum/support/issues/1693).
        if (event1InterDay !== event2InterDay) {
            return Number(event2InterDay) - Number(event1InterDay);
        }

        // Sort by start timestamp first, then duration.
        // This is *in-cell* sorting.
        return start1 - start2 || event2.durationMS - event1.durationMS;
    };

    let calendar, eventStore, resourceStore, hackathon, relax, roadMap, review;

    function objectsMatch(t, a, b) {
        t.isStrict(a.length, b.length, 'Array lengths match');

        a.forEach((ea, i) => t.isStrict(ea, b[i], `Element ${i} matches`));
    }

    async function getCalendar(config) {
        const calendar = await t.getCalendar(Object.assign({
            features : {
                eventTooltip : false
            }
        }, config));

        eventStore     = calendar.eventStore;
        resourceStore  = calendar.resourceStore;

        hackathon = calendar.eventStore.find(r => r.name === 'Hackathon 2019');
        relax     = calendar.eventStore.find(r => r.name === 'Relax and official arrival beer');
        roadMap   = eventStore.find(r => r.name === 'Roadmapping for 2020');
        review    = eventStore.find(r => r.name === 'Review Assembla tickets and decide features to add');

        return calendar;
    }

    t.beforeEach(t => {
        calendar?.destroy();

        // Check that none of the floating things are persisting
        if (t.query('.b-overflowpopup,.b-sch-event-tooltip, .b-eventeditor').length > 0) {
            t.selectorNotExists('.b-overflowpopup:visible');
            t.selectorNotExists('.b-sch-event-tooltip');
            t.selectorNotExists('.b-eventeditor');
        }

        // Some of these tests occasionally fail in turbo mode.
        t.simulator.setSpeed('speedRun');
    });

    t.afterEach(t => {
        t.simulator.setSpeed('turboMode');
    });

    t.it('Should select single events on click in all day row', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date : new Date(2019, 9, 14),
            eventStore,
            resourceStore
        });

        const
            selectionValidators = [
                function({ action, selection, selected, deselected }) {
                    t.ok(action, 'select');
                    objectsMatch(t, selection, [hackathon]);
                    objectsMatch(t, selected, [hackathon]);
                    objectsMatch(t, deselected, []);
                },
                function({ action, selection, selected, deselected }) {
                    t.ok(action, 'clear');
                    objectsMatch(t, selection, []);
                    objectsMatch(t, selected, []);
                    objectsMatch(t, deselected, [hackathon]);
                },
                function({ action, selection, selected, deselected }) {
                    t.ok(action, 'update');
                    objectsMatch(t, selection, [relax]);
                    objectsMatch(t, selected, [relax]);
                    objectsMatch(t, deselected, []);
                }
            ];

        let selectionChangeCount = 0;

        calendar.on({
            selectionChange(e) {
                selectionValidators[selectionChangeCount](e);
                selectionChangeCount++;
            }
        });

        t.willFireNTimes(calendar, 'selectionChange', 3);

        t.chain(
            {
                waitForEvent : [calendar, 'selectionChange'],
                trigger      : { click : '.b-cal-event-wrap:contains(Hackathon 2019)' }
            },

            next => {
                t.is(calendar.selectedEvents.length, 1, 'One event selected');
                t.is(calendar.selectedEvents[0].name, 'Hackathon 2019', 'Correct event selected');
                next();
            },

            {
                waitForEvent : [calendar, 'selectionChange'],
                trigger      : { type : '[DELETE]' }
            },

            // "activeItem" must not be lost after a keyboard event delete
            {
                waitForSelector : '.b-cal-event-wrap.b-active'
            },

            { waitFor : () => calendar.selectedEvents.length === 1 },

            () => {
                t.is(calendar.selectedEvents.length, 1, 'One event selected');
                t.is(calendar.selectedEvents[0].name, 'Relax and official arrival beer', 'Correct event selected');

                t.notOk(calendar.eventStore.includes(hackathon), 'Event correctly deleted');
                t.notOk(calendar.selectedEvents.includes(hackathon), 'Event correctly selected');
            }
        );
    });

    t.it('Should select single events on click in day detail', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date : new Date(2019, 9, 14),
            eventStore,
            resourceStore
        });

        const
            selectionValidators = [
                function({ action, selection, selected, deselected }) {
                    t.ok(action, 'select');
                    objectsMatch(t, selection, [roadMap]);
                    objectsMatch(t, selected, [roadMap]);
                    objectsMatch(t, deselected, []);
                },
                function({ action, selection, selected, deselected }) {
                    t.ok(action, 'clear');
                    objectsMatch(t, selection, []);
                    objectsMatch(t, selected, []);
                    objectsMatch(t, deselected, [roadMap]);
                },
                function({ action, selection, selected, deselected }) {
                    t.ok(action, 'update');
                    objectsMatch(t, selection, [review]);
                    objectsMatch(t, selected, [review]);
                    objectsMatch(t, deselected, []);
                }
            ];

        let selectionChangeCount = 0;

        calendar.on({
            selectionChange(e) {
                selectionValidators[selectionChangeCount](e);
                selectionChangeCount++;
            }
        });

        t.willFireNTimes(calendar, 'selectionChange', 3);

        t.chain(
            {
                waitForEvent : [calendar, 'selectionChange'],
                trigger      : { click : '.b-cal-event-wrap:contains(Roadmapping for 2020)' }
            },

            next => {
                t.is(calendar.selectedEvents.length, 1, 'One event selected');
                t.is(calendar.selectedEvents[0].name, 'Roadmapping for 2020', 'Correct event selected');
                next();
            },

            {
                waitForEvent : [calendar, 'selectionChange'],
                trigger      : { type : '[DELETE]' }
            },

            // "activeItem" must not be lost after a keyboard event delete
            {
                waitForSelector : '.b-cal-event-wrap.b-active'
            },

            { waitFor : () => calendar.selectedEvents.length === 1 },

            () => {
                t.is(calendar.selectedEvents.length, 1, 'One event selected');
                t.is(calendar.selectedEvents[0].name, 'Review Assembla tickets and decide features to add', 'Correct event selected');

                t.notOk(calendar.eventStore.includes(roadMap), 'Event correctly deleted');
                t.notOk(calendar.selectedEvents.includes(roadMap), 'Event correctly selected');
            }
        );
    });

    t.it('Should select single events on click in a month cell', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            mode : 'month'
        });

        const
            selectionValidators = [
                function({ action, selection, selected, deselected }) {
                    t.ok(action, 'select');
                    objectsMatch(t, selection, [hackathon]);
                    objectsMatch(t, selected, [hackathon]);
                    objectsMatch(t, deselected, []);
                },
                function({ action, selection, selected, deselected }) {
                    t.ok(action, 'clear');
                    objectsMatch(t, selection, []);
                    objectsMatch(t, selected, []);
                    objectsMatch(t, deselected, [hackathon]);
                },
                function({ action, selection, selected, deselected }) {
                    t.ok(action, 'update');
                    objectsMatch(t, selection, [relax]);
                    objectsMatch(t, selected, [relax]);
                    objectsMatch(t, deselected, []);
                }
            ];

        let selectionChangeCount = 0;

        const removeListeners = calendar.on({
            selectionChange(e) {
                selectionValidators[selectionChangeCount](e);
                selectionChangeCount++;
            }
        });

        t.willFireNTimes(calendar, 'selectionChange', 3);

        t.chain(
            {
                waitForEvent : [calendar, 'selectionChange'],
                trigger      : { click : '.b-cal-event-wrap:contains(Hackathon 2019)' }
            },

            next => {
                t.is(calendar.selectedEvents.length, 1, 'One event selected');
                t.is(calendar.selectedEvents[0].name, 'Hackathon 2019', 'Correct event selected');
                next();
            },

            {
                waitForEvent : [calendar, 'selectionChange'],
                trigger      : { type : '[DELETE]' }
            },

            // "activeItem" must not be lost after a keyboard event delete
            {
                waitForSelector : '.b-cal-event-wrap.b-active'
            },

            { waitFor : () => calendar.selectedEvents.length === 1 },

            () => {
                removeListeners();
                t.is(calendar.selectedEvents.length, 1, 'One event selected');
                t.is(calendar.selectedEvents[0].name, 'Relax and official arrival beer', 'Correct event selected');

                t.notOk(calendar.eventStore.includes(hackathon), 'Event correctly deleted');
                t.notOk(calendar.selectedEvents.includes(hackathon), 'Event correctly selected');
            }
        );
    });

    t.it('Should select single events on click in a month overflow popup', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date         : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            mode         : 'month',
            modeDefaults : {
                eventSorter,
                overflowPopup : {
                    eventSorter
                }
            }
        });

        const
            selectionValidators = [
                function({ action, selection, selected, deselected }) {
                    t.ok(action, 'select');
                    objectsMatch(t, selection, [hackathon]);
                    objectsMatch(t, selected, [hackathon]);
                    objectsMatch(t, deselected, []);
                },
                function({ action, selection, selected, deselected }) {
                    t.ok(action, 'update');
                    objectsMatch(t, selection, [roadMap]);
                    objectsMatch(t, selected, [roadMap]);
                    objectsMatch(t, deselected, [hackathon]);
                },
                function({ action, selection, selected, deselected }) {
                    t.ok(action, 'clear');
                    objectsMatch(t, selection, []);
                    objectsMatch(t, selected, []);
                    objectsMatch(t, deselected, [roadMap]);
                },
                function({ action, selection, selected, deselected }) {
                    t.ok(action, 'update');
                    objectsMatch(t, selection, [review]);
                    objectsMatch(t, selected, [review]);
                    objectsMatch(t, deselected, []);
                },
                function({ action, selection, selected, deselected }) {
                    t.ok(action, 'clear');
                    objectsMatch(t, selection, []);
                    objectsMatch(t, selected, []);
                    objectsMatch(t, deselected, [review]);
                }
            ];

        let selectionChangeCount = 0;

        calendar.on({
            selectionChange(e) {
                selectionValidators[selectionChangeCount](e);
                selectionChangeCount++;
            }
        });

        t.willFireNTimes(calendar, 'selectionChange', 5);

        t.chain(
            {
                // Wait for focus to be on an event inside the popup
                waitFor : () => {
                    return calendar.modes.month._overflowPopup?.containsFocus &&
                        t.query('.b-cal-event-wrap.b-active', calendar.modes.month.overflowPopup.element) &&
                        calendar.selectedEvents.map(e => e.id)[0] === 1;
                },
                trigger : { click : '[data-date="2019-10-16"] .b-cal-cell-overflow' }
            },

            {
                waitForEvent : [calendar, 'selectionChange'],
                trigger      : { click : '.b-cal-event-wrap:contains(Roadmapping for 2020)' }
            },

            next => {
                t.is(calendar.selectedEvents.length, 1, 'One event selected');
                t.is(calendar.selectedEvents[0].name, 'Roadmapping for 2020', 'Correct event selected');
                next();
            },

            {
                waitForEvent : [calendar, 'selectionChange'],
                trigger      : { type : '[DELETE]' }
            },

            // "activeItem" must not be lost after a keyboard event delete
            {
                waitForSelector : '.b-cal-event-wrap.b-active'
            },

            { waitFor : () => calendar.selectedEvents.length === 1 },

            next => {
                t.is(calendar.selectedEvents.length, 1, 'One event selected');
                t.is(calendar.selectedEvents[0].name, 'Review Assembla tickets and decide features to add', 'Correct event selected');

                t.notOk(calendar.eventStore.includes(roadMap), 'Event correctly deleted');
                t.notOk(calendar.selectedEvents.includes(roadMap), 'Event correctly selected');
                next();
            },

            {
                waitFor : () => document.activeElement === document.querySelector('[data-date="2019-10-16"] .b-cal-cell-overflow'),
                trigger : { type : '[ESCAPE]' }
            }
        );
    });

    if (BrowserHelper.isChrome) {
        t.it('Should select single events on click in a year overflow popup', async t => {
            eventStore = new EventStore({
                data : t.getHackathonData().events.rows.concat([{
                    startDate : '2019-10-22',
                    endDate   : '2019-10-23',
                    name      : 'Lone event',
                    id        : 'lone-event'
                }])
            });

            resourceStore = new ResourceStore({
                data : t.getHackathonData().resources.rows
            });

            calendar = await getCalendar({
                date         : new Date(2019, 9, 14),
                eventStore,
                resourceStore,
                sidebar      : false,
                mode         : 'year',
                modeDefaults : {
                    eventSorter,
                    overflowPopup : {
                        eventSorter
                    }
                }
            });

            const loneEvent = eventStore.getById('lone-event');

            const
                selectionValidators = [
                    function({ action, selection, selected, deselected }) {
                        t.ok(action, 'select');
                        objectsMatch(t, selection, [hackathon]);
                        objectsMatch(t, selected, [hackathon]);
                        objectsMatch(t, deselected, []);
                    },
                    function({ action, selection, selected, deselected }) {
                        t.ok(action, 'update');
                        objectsMatch(t, selection, [roadMap]);
                        objectsMatch(t, selected, [roadMap]);
                        objectsMatch(t, deselected, [hackathon]);
                    },
                    function({ action, selection, selected, deselected }) {
                        t.ok(action, 'clear');
                        objectsMatch(t, selection, []);
                        objectsMatch(t, selected, []);
                        objectsMatch(t, deselected, [roadMap]);
                    },
                    function({ action, selection, selected, deselected }) {
                        t.ok(action, 'update');
                        objectsMatch(t, selection, [review]);
                        objectsMatch(t, selected, [review]);
                        objectsMatch(t, deselected, []);
                    },
                    function({ action, selection, selected, deselected }) {
                        t.ok(action, 'update');
                        objectsMatch(t, selection, [loneEvent]);
                        objectsMatch(t, selected, [loneEvent]);
                        objectsMatch(t, deselected, [review]);
                    },
                    function({ action, selection, selected, deselected }) {
                        t.ok(action, 'clear');
                        objectsMatch(t, selection, []);
                        objectsMatch(t, selected, []);
                        objectsMatch(t, deselected, [loneEvent]);
                    }
                ];

            let selectionChangeCount = 0;

            calendar.on({
                selectionChange(e) {
                    selectionValidators[selectionChangeCount](e);
                    selectionChangeCount++;
                }
            });

            t.willFireNTimes(calendar, 'selectionChange', 6);

            t.chain(
                {
                    // Wait for focus to be on an event inside the popup
                    waitFor : () => calendar.modes.year._overflowPopup?.containsFocus && t.query('.b-cal-event-wrap.b-active', calendar.modes.year.overflowPopup.element),
                    trigger : { click : '[data-date="2019-10-16"].b-cal-cell-overflow' }
                },

                {
                    waitForEvent : [calendar, 'selectionChange'],
                    trigger      : { click : '.b-cal-event-wrap:contains(Roadmapping for 2020)' }
                },

                next => {
                    t.is(calendar.selectedEvents.length, 1, 'One event selected');
                    t.is(calendar.selectedEvents[0].name, 'Roadmapping for 2020', 'Correct event selected');
                    next();
                },

                {
                    waitForEvent : [calendar, 'selectionChange'],
                    trigger      : { type : '[DELETE]' }
                },

                // "activeItem" must not be lost after a keyboard event delete
                {
                    waitForSelector : '.b-cal-event-wrap.b-active'
                },

                { waitFor : () => calendar.selectedEvents.length === 1 },

                next => {
                    t.is(calendar.selectedEvents.length, 1, 'One event selected');
                    t.is(calendar.selectedEvents[0].name, 'Review Assembla tickets and decide features to add', 'Correct event selected');

                    t.notOk(calendar.eventStore.includes(roadMap), 'Event correctly deleted');
                    t.notOk(calendar.selectedEvents.includes(roadMap), 'Event correctly selected');
                    next();
                },

                {
                    // Wait for first and only event in popup to be selected
                    waitForEvent : [calendar, 'selectionChange'],
                    trigger      : { click : '[data-date="2019-10-22"].b-cal-cell-overflow' }
                },

                // Focus must be in the popup
                {
                    waitFor : () => calendar.modes.year._overflowPopup?.containsFocus && t.query('.b-cal-event-wrap.b-active', calendar.modes.year.overflowPopup.element)
                },

                next => {
                    t.is(calendar.selectedEvents.length, 1, 'One event selected');
                    t.is(calendar.selectedEvents[0].name, 'Lone event', 'Correct event selected');
                    next();
                },

                // Deleting right now leaves focus with nowhere to go.
                // YearView is not yet keyboard-navigable.
                // It must not throw.
                {
                    waitForEvent : [calendar, 'selectionChange'],
                    trigger      : { type : '[DELETE]' }
                },

                // Popup must have hidden
                {
                    waitFor : () => !calendar.modes.year.overflowPopup.isVisible
                }
            );
        });
    }

    t.it('Should select single events on click in agenda view', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            eventStore,
            resourceStore,
            date     : new Date(2019, 9, 14),
            mode     : 'agenda',
            features : {
                eventTooltip : false
            },
            modeDefaults : {
                eventSorter,
                overflowPopup : {
                    eventSorter
                }
            }
        });

        const
            selectionValidators = [
                function({ action, selection, selected, deselected }) {
                    t.ok(action, 'select');
                    objectsMatch(t, selection, [roadMap]);
                    objectsMatch(t, selected, [roadMap]);
                    objectsMatch(t, deselected, []);
                },
                function({ action, selection, selected, deselected }) {
                    t.ok(action, 'clear');
                    objectsMatch(t, selection, []);
                    objectsMatch(t, selected, []);
                    objectsMatch(t, deselected, [roadMap]);
                },
                function({ action, selection, selected, deselected }) {
                    t.ok(action, 'update');
                    objectsMatch(t, selection, [review]);
                    objectsMatch(t, selected, [review]);
                    objectsMatch(t, deselected, []);
                }
            ];

        let selectionChangeCount = 0;

        calendar.on({
            selectionChange(e) {
                selectionValidators[selectionChangeCount](e);
                selectionChangeCount++;
            }
        });

        t.willFireNTimes(calendar, 'selectionChange', 3);

        t.chain(
            {
                waitForEvent : [calendar, 'selectionChange'],
                trigger      : { click : '.b-cal-event-wrap:contains(Roadmapping for 2020)' }
            },

            next => {
                t.is(calendar.selectedEvents.length, 1, 'One event selected');
                t.is(calendar.selectedEvents[0].name, 'Roadmapping for 2020', 'Correct event selected');
                next();
            },

            {
                waitForEvent : [calendar, 'selectionChange'],
                trigger      : { type : '[DELETE]' }
            },

            // "activeItem" must not be lost after a keyboard event delete
            {
                waitForSelector : '.b-cal-event-wrap.b-active'
            },

            { waitFor : () => calendar.selectedEvents.length === 1 },

            () => {
                t.is(calendar.selectedEvents.length, 1, 'One event selected');
                t.is(calendar.selectedEvents[0].name, 'Review Assembla tickets and decide features to add', 'Correct event selected');

                t.notOk(calendar.eventStore.includes(roadMap), 'Event correctly deleted');
                t.notOk(calendar.selectedEvents.includes(roadMap), 'Event correctly selected');
            }
        );
    });

    t.it('Should work to select multiple events with multiEventSelect = true', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });
        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });
        calendar = await getCalendar({
            eventStore,
            resourceStore,
            date             : new Date(2019, 9, 14),
            multiEventSelect : true
        });

        await t.click('[data-event-id="6"]');
        t.is(calendar.selectedEvents.map(e => e.id).join(','), '6', 'Correct event selected');

        await t.click({ el : '[data-event-id="7"]', options : { ctrlKey : true } });
        t.is(calendar.selectedEvents.map(e => e.id).join(','), '6,7', 'Correct event selected');

        await t.rightClick({ el : '[data-event-id="7"]', options : { ctrlKey : true } });
        t.is(calendar.selectedEvents.map(e => e.id).join(','), '6,7', 'Context menu did not deselect event');

        await t.click({ el : '[data-event-id="6"]', options : { ctrlKey : true } });
        t.is(calendar.selectedEvents.map(e => e.id).join(','), '7', 'Correct deselected event 6');

        await t.click('[data-event-id="9"]');
        t.is(calendar.selectedEvents.map(e => e.id).join(','), '9', 'Correct event selected');

        await t.click({ el : '[data-event-id="7"]', options : { ctrlKey : true } });
        await t.click({ el : '[data-event-id="9"]', options : { ctrlKey : true } });
        await t.click({ el : '[data-event-id="7"]', options : { ctrlKey : true } });
        t.is(calendar.selectedEvents.length, 0, 'No events selected');
    });

    // https://github.com/bryntum/support/issues/6177
    t.it('isEventSelectable should be able to veto selection', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });
        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });
        calendar = await getCalendar({
            eventStore,
            resourceStore,
            date              : new Date(2019, 9, 14),
            isEventSelectable : () => false
        });

        t.wontFire(calendar, 'selectionChange');

        await t.click('[data-event-id="6"]');
        t.notOk(calendar.selectedEvents.length);

        await t.click({ el : '[data-event-id="7"]', options : { ctrlKey : true } });
        t.notOk(calendar.selectedEvents.length);

        // await t.rightClick({ el : '[data-event-id="7"]', options : { ctrlKey : true } });
        // t.notOk(calendar.selectedEvents.length);

        // await t.click({ el : '[data-event-id="6"]', options : { ctrlKey : true } });
        // t.notOk(calendar.selectedEvents.length);

        // await t.click('[data-event-id="9"]');
        // t.notOk(calendar.selectedEvents.length);

        // await t.click({ el : '[data-event-id="7"]', options : { ctrlKey : true } });
        // await t.click({ el : '[data-event-id="9"]', options : { ctrlKey : true } });
        // await t.click({ el : '[data-event-id="7"]', options : { ctrlKey : true } });
        // t.notOk(calendar.selectedEvents.length);
    });

    t.it('Should work to select multiple events with multiEventSelect = true', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });
        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });
        calendar = await getCalendar({
            eventStore,
            resourceStore,
            date             : new Date(2019, 9, 14),
            multiEventSelect : true
        });

        await t.click('[data-event-id="6"');
        t.is(calendar.selectedEvents.map(e => e.id).join(','), '6', 'Correct event selected');

        await t.click({ el : '[data-event-id="7"', options : { ctrlKey : true } });
        t.is(calendar.selectedEvents.map(e => e.id).join(','), '6,7', 'Correct event selected');

        await t.click('[data-event-id="9"');
        t.is(calendar.selectedEvents.map(e => e.id).join(','), '9', 'Correct event selected');

        await t.click({ el : '[data-event-id="7"', options : { ctrlKey : true } });
        await t.click({ el : '[data-event-id="9"', options : { ctrlKey : true } });
        await t.click({ el : '[data-event-id="7"', options : { ctrlKey : true } });
        t.is(calendar.selectedEvents.length, 0, 'No events selected');
    });
});
