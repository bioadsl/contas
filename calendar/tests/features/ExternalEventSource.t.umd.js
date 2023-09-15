
StartTest(t => {
    let harness, calendar, dragSourceEl, grid;

    t.beforeEach(t => {
        dragSourceEl = dragSourceEl?.remove();
        grid?.destroy();
        harness?.destroy();
        harness = null;

        t.clearPageScroll();
    });

    async function setup(setupFn, extraConfig) {
        const useGrid = extraConfig?.grid;

        document.body.style.cssText = 'display:flex;align-items:stretch;height:100%;margin:0;overflow:hidden';
        harness = setupFn.call(t);

        t.mockUrl('no-initial-events', {
            delay        : 100,
            responseText : JSON.stringify({
                success   : true,
                resources : {
                    rows : [
                        {
                            id         : 'bryntum',
                            name       : 'Bryntum team',
                            eventColor : '#249fbc'
                        }
                    ]
                },
                events : {
                    rows : []
                }
            })
        });

        await harness.init(t, Objects.assign({
            appendTo : null,
            sidebar  : false,
            flex     : '1 1 75%',

            crudManager : {
                transport : {
                    load : {
                        url : 'no-initial-events'
                    }
                },
                autoLoad : true,
                autoSync : false
            },

            // Features named by the properties are included.
            // An object is used to configure the feature.
            features : {
                externalEventSource : {
                    [useGrid === false ? '_' : 'grid'] : 'test-grid'
                }
            }
        }, extraConfig));

        calendar = harness.calendar;

        calendar.render(document.body);

        if (useGrid !== false) {
            grid = new Grid({
                id       : 'test-grid',
                flex     : '1 1 25%',
                appendTo : document.body,
                // Calendar's stores are contained by a project, pass it to the grid to allow it to access them
                project  : calendar.project,
                columns  : [{
                    text       : 'Unassigned tasks',
                    flex       : 1,
                    field      : 'name',
                    htmlEncode : false,
                    renderer   : (data) => `${data.record.iconCls ? `<i class="${data.record.iconCls}"></i>'` : ''}${data.record.name}`
                }, {
                    text     : 'Duration',
                    width    : 100,
                    align    : 'right',
                    editor   : false,
                    field    : 'duration',
                    renderer : (data) => `${data.record.duration} ${data.record.durationUnit}`
                }],
                data : [
                    {
                        id           : 1001,
                        name         : 'Fun task',
                        duration     : 4,
                        durationUnit : 'h',
                        iconCls      : 'b-fa b-fa-fw b-fa-beer'
                    },
                    {
                        id           : 1002,
                        name         : 'Medium fun task',
                        duration     : 8,
                        durationUnit : 'h',
                        iconCls      : 'b-fa b-fa-fw b-fa-cog'
                    },
                    {
                        id           : 1003,
                        name         : 'Outright boring task',
                        duration     : 2,
                        durationUnit : 'h',
                        iconCls      : 'b-fa b-fa-fw b-fa-book'
                    },
                    {
                        id           : 1004,
                        name         : 'Inspiring task',
                        duration     : 2,
                        durationUnit : 'h',
                        iconCls      : 'b-fa b-fa-fw b-fa-book'
                    },
                    {
                        id           : 1005,
                        name         : 'Mysterious task',
                        duration     : 2,
                        durationUnit : 'h',
                        iconCls      : 'b-fa b-fa-fw b-fa-question'
                    },
                    {
                        id           : 1006,
                        name         : 'Answer forum question',
                        duration     : 4,
                        durationUnit : 'h',
                        iconCls      : 'b-fa b-fa-fw b-fa-life-ring'
                    },
                    {
                        id           : 1007,
                        name         : 'Gym',
                        duration     : 1,
                        durationUnit : 'h',
                        iconCls      : 'b-fa b-fa-fw b-fa-dumbbell'
                    },
                    {
                        id           : 1009,
                        name         : 'Book flight',
                        duration     : 7,
                        durationUnit : 'h',
                        iconCls      : 'b-fa b-fa-fw b-fa-plane'
                    },
                    {
                        id           : 1010,
                        name         : 'Customer support call',
                        duration     : 3,
                        durationUnit : 'h',
                        iconCls      : 'b-fa b-fa-fw b-fa-phone'
                    },
                    {
                        id           : 1011,
                        name         : 'Angular bug fix',
                        duration     : 3,
                        durationUnit : 'h',
                        iconCls      : 'b-fa b-fa-fw b-fa-bug'
                    },
                    {
                        id           : 1012,
                        name         : 'React feature fix',
                        duration     : 2,
                        durationUnit : 'h',
                        iconCls      : 'b-fa b-fa-fw b-fa-cog'
                    },
                    {
                        id             : 1013,
                        name           : 'Weekly Backup',
                        recurrenceRule : 'FREQ=WEEKLY',
                        duration       : 1,
                        durationUnit   : 'h',
                        iconCls        : 'b-fa b-fa-fw b-fa-tape'
                    }
                ]
            });
        }

        await t.waitForScroll();

        return harness;
    }

    t.describe('DayView', t => {
        t.it('All day row should work', async t => {
            harness = await setup(t.setupDayViewAllDayDragHarness, {
                modes : {
                    // Just right to *start* with no scrollbars, but for scrollbars
                    // to appear when we drag over the all day row and it autoexpands.
                    day : {
                        dayStartTime : 8,
                        dayEndTime   : 22
                    }
                }
            });

            await t.waitForAnimations();

            const
                {
                    allDayEvents
                } = calendar.activeView,
                {
                    eventHeight,
                    eventSpacing,
                    height : allDayRowHeight
                } = allDayEvents;

            // Click in empty part should not throw.
            await t.click(grid.element, null, null, null, ['50%', '100%-20']);

            await harness.dragDrop(grid.getCell({ row : 0, column : 0 }), {
                to       : harness.headerCellSelector('2019-10-14'),
                dragOnly : true
            });

            // Must have auto-expanded the gutter size to accommodate dropping.
            await t.waitFor(() => Math.abs(allDayEvents.height - (allDayRowHeight + eventHeight + eventSpacing)) < 2);

            // Drop the new event
            await t.mouseUp();

            const newCalendarRec = calendar.eventStore.first;

            t.is(newCalendarRec.name, 'Fun task');
            t.is(newCalendarRec.startDate, new Date(2019, 9, 14));
            t.ok(newCalendarRec.allDay);
        });

        t.it('Drag out of all day row should work', async t => {
            harness = await setup(t.setupDayViewAllDayDragHarness, {
                events      : t.getHackathonData().events.rows,
                resources   : t.getHackathonData().resources.rows,
                crudManager : null,
                features    : {
                    externalEventSource : {
                        grid      : 'test-grid',
                        droppable : true
                    }
                }
            });
            await harness.dragDrop('.b-cal-event-wrap[data-event-id="1"]', {
                to       : grid.getRow(0).element,
                toOffset : ['50%', '45%']
            });

            t.is(grid.store.getAt(0).id, 1);

            await harness.dragDrop('.b-cal-event-wrap[data-event-id="3"]', {
                to       : grid.getRow(0).element,
                toOffset : ['50%', '55%']
            });

            t.is(grid.store.getAt(1).id, 3);
        });

        t.it('Day detail should work', async t => {
            harness = await setup(t.setupDayViewDragHarness);

            await harness.dragDrop(grid.getCell({ row : 0, column : 0 }), {
                to       : harness.cellSelector('2019-10-14'),
                toOffset : ['50%', calendar.activeView.hourHeight * 9 + 1]
            });

            const newCalendarRec = calendar.eventStore.first;

            t.is(newCalendarRec.name, 'Fun task');
            t.is(newCalendarRec.startDate, new Date(2019, 9, 14, 9));
            t.notOk(newCalendarRec.allDay);
        });

        t.it('Drag out of day detail should work', async t => {
            harness = await setup(t.setupDayViewDragHarness, {
                events      : t.getHackathonData().events.rows,
                resources   : t.getHackathonData().resources.rows,
                crudManager : null,
                features    : {
                    externalEventSource : {
                        grid      : 'test-grid',
                        droppable : true
                    }
                }
            });
            await harness.dragDrop('.b-cal-event-wrap[data-event-id="2"]', {
                to       : grid.getRow(0).element,
                toOffset : ['50%', '45%']
            });

            t.is(grid.store.getAt(0).id, 2);

            await harness.dragDrop('.b-cal-event-wrap[data-event-id="4"]', {
                to       : grid.getRow(0).element,
                toOffset : ['50%', '55%']
            });

            t.is(grid.store.getAt(1).id, 4);
        });

        t.it('Drag out of day detail should abort cleanly on ESC', async t => {
            harness = await setup(t.setupDayViewDragHarness, {
                events      : t.getHackathonData().events.rows,
                resources   : t.getHackathonData().resources.rows,
                crudManager : null,
                features    : {
                    externalEventSource : {
                        grid      : 'test-grid',
                        droppable : true
                    }
                }
            });

            await harness.dragDrop('.b-cal-event-wrap[data-event-id="4"]', {
                to       : grid.getRow(0).element,
                toOffset : ['50%', '55%'],
                dragOnly : true
            });

            t.ok(grid.getRow(0).element.classList.contains('b-drop-below'));
            t.selectorExists(`.b-grid-to-cal-drag-proxy:contains(Dinner)`);

            await t.type(null, '[ESCAPE]');

            t.notOk(grid.getRow(0).element.classList.contains('b-drop-below'));
            t.selectorNotExists(`.b-grid-to-cal-drag-proxy:contains(Dinner)`);
        });

        t.it('Resize out of day detail should not show a proxy', async t => {
            harness = await setup(t.setupDayViewDragHarness, {
                events      : t.getHackathonData().events.rows,
                resources   : t.getHackathonData().resources.rows,
                crudManager : null,
                features    : {
                    externalEventSource : {
                        grid      : 'test-grid',
                        droppable : true
                    }
                }
            });

            await harness.dragDrop('.b-cal-event-wrap[data-event-id="2"]', {
                offset   : ['50%', 3],
                to       : grid.getRow(4).element,
                toOffset : ['50%', '55%'],
                dragOnly : true
            });

            // Not dragging over the grid
            t.selectorNotExists('.b-grid-row.b-drop-below');
            t.selectorNotExists('.b-grid-to-cal-drag-proxy');
        });
    });

    t.describe('WeekView', t => {
        t.it('All day row should work', async t => {
            harness = await setup(t.setupWeekViewAllDayDragHarness);

            await harness.dragDrop(grid.getCell({ row : 0, column : 0 }), {
                to : harness.headerCellSelector('2019-10-14')
            });

            const newCalendarRec = calendar.eventStore.first;

            t.is(newCalendarRec.name, 'Fun task');
            t.is(newCalendarRec.startDate, new Date(2019, 9, 14));
            t.ok(newCalendarRec.allDay);
        });

        t.it('Day detail should work', async t => {
            harness = await setup(t.setupWeekViewDragHarness);

            await harness.dragDrop(grid.getCell({ row : 0, column : 0 }), {
                by       : [0, 200],
                dragOnly : true
            });

            await t.mouseUp(harness.cellSelector('2019-10-14'), null, ['50%', calendar.activeView.hourHeight * 9 + 1]);

            const newCalendarRec = calendar.eventStore.first;

            t.is(newCalendarRec.name, 'Fun task');
            t.is(newCalendarRec.startDate, new Date(2019, 9, 14, 9));
            t.notOk(newCalendarRec.allDay);
        });
    });

    t.describe('MonthView', t => {
        t.it('Should work', async t => {
            harness = await setup(t.setupMonthViewDragHarness);

            await harness.dragDrop(grid.getCell({ row : 0, column : 0 }), {
                to : harness.cellSelector('2019-10-14')
            });

            const newCalendarRec = calendar.eventStore.first;

            t.is(newCalendarRec.name, 'Fun task');
            t.is(newCalendarRec.startDate, new Date(2019, 9, 14, calendar.modes.month.autoCreate.startHour));
            t.notOk(newCalendarRec.allDay);
        });
    });

    t.describe('YearView', t => {
        t.it('Should work', async t => {
            harness = await setup(t.setupYearViewDragHarness);

            await harness.dragDrop(grid.getCell({ row : 0, column : 0 }), {
                to : harness.cellSelector('2019-05-14')
            });

            const newCalendarRec = calendar.eventStore.first;

            t.is(newCalendarRec.name, 'Fun task');
            t.is(newCalendarRec.startDate, new Date(2019, 4, 14, calendar.modes.month.autoCreate.startHour));
            t.notOk(newCalendarRec.allDay);
        });
    });

    // https://github.com/bryntum/support/issues/3461
    t.it('Should respect multi-assignment configuration', async t => {
        harness = await setup(t.setupWeekViewDragHarness);

        t.notOk(calendar.eventStore.usesSingleAssignment, 'eventStore not using single assignment');

        await harness.dragDrop(grid.getCell({ row : 0, column : 0 }), {
            by       : [0, 200],
            dragOnly : true
        });

        await t.mouseUp(harness.cellSelector('2019-10-14'), null, ['50%', calendar.activeView.hourHeight * 9 + 1]);

        t.notOk(calendar.eventStore.usesSingleAssignment, 'eventStore not using single assignment after drop');

        t.is(calendar.eventStore.first.resources.length, 1, '1 resource assigned');
        t.is(calendar.eventStore.first.resources[0].id, 'bryntum', 'Correct default resource assigned');
    });

    t.describe('ResourceDayView', t => {
        // https://github.com/bryntum/support/issues/7026
        t.it('Drag into resourceless Calendar should work', async t => {
            harness = await setup(t.setupDayViewDragHarness, {
                crudManager : {
                    eventStore : {
                        data                 : [],
                        usesSingleAssignment : false
                    },
                    resources   : [],
                    assignments : []
                },
                features : {
                    externalEventSource : {
                        grid      : 'test-grid',
                        droppable : true
                    }
                }
            });

            const { count } = calendar.eventStore;
            await harness.dragDrop(grid.getCell({ row : 4, column : 0 }), {
                to       : harness.cellSelector('2019-10-14'),
                toOffset : ['50%', calendar.activeView.hourHeight * 9 + 1]
            });

            // Drag in successful
            t.ok(calendar.eventStore.count, count + 1);
        });

        // https://github.com/bryntum/support/issues/7106
        t.it('Drag into DayResourceView hours should work', async t => {
            harness = await setup(t.setupDayViewDragHarness, {
                crudManager : {
                    eventStore : {
                        data                 : [],
                        usesSingleAssignment : false
                    },
                    resources   : [{ id : 1, name : 'foo' }],
                    assignments : []
                },
                features : {
                    externalEventSource : {
                        grid      : 'test-grid',
                        droppable : true
                    }
                },
                modes : {
                    agenda      : null,
                    dayresource : {
                        // Save a little space by hiding weekends.
                        hideNonWorkingDays : true,

                        // Configure a nice min-width for the resource columns
                        minResourceWidth : '10em',

                        // Demo uses more padding than default, switch to the short event duration "earlier" to fit contents
                        shortEventDuration : '1 hour'
                    }
                }
            });

            const { count } = calendar.eventStore;

            calendar.mode = 'dayresource';

            await harness.dragDrop(grid.getCell({ row : 4, column : 0 }), {
                to       : '.b-dayresourceview-column[data-date="2019-10-14"]',
                toOffset : ['50%', calendar.activeView.hourHeight * 10]
            });

            // Drag in successful
            t.ok(calendar.eventStore.count, count + 1);

            const assignments = calendar.assignmentStore.added.values;

            t.isStrict(assignments[0].eventId, 1005, 'Correct event assigned');
            t.isStrict(assignments[0].resourceId, 1, 'Correct resource assigned');

            const events = calendar.eventStore.added.values;

            t.isStrict(events[0].id, 1005, 'Correct event dragged');
            t.is(events[0].startDate, new Date(2019, 9, 14, 10), 'Correct startDate');
            t.is(events[0].endDate, new Date(2019, 9, 14, 12), 'Correct endDate');
            t.notOk(events[0].allDay);
        });

        // https://github.com/bryntum/support/issues/7106
        t.it('Drag into DayResourceView all day section should work', async t => {
            harness = await setup(t.setupDayViewDragHarness, {
                crudManager : {
                    eventStore : {
                        data                 : [],
                        usesSingleAssignment : false
                    },
                    resources   : [{ id : 1, name : 'foo' }],
                    assignments : []
                },
                features : {
                    externalEventSource : {
                        grid      : 'test-grid',
                        droppable : true
                    }
                },
                modes : {
                    agenda      : null,
                    dayresource : {
                        // Save a little space by hiding weekends.
                        hideNonWorkingDays : true,

                        // Configure a nice min-width for the resource columns
                        minResourceWidth : '10em',

                        // Demo uses more padding than default, switch to the short event duration "earlier" to fit contents
                        shortEventDuration : '1 hour'
                    }
                }
            });

            const { count } = calendar.eventStore;

            calendar.mode = 'dayresource';

            await harness.dragDrop(grid.getCell({ row : 4, column : 0 }), {
                to       : '.b-dayresource-allday[data-header-date="2019-10-16"]',
                toOffset : ['50%', '100%-5px']
            });

            // Drag in successful
            t.ok(calendar.eventStore.count, count + 1);

            const assignments = calendar.assignmentStore.added.values;

            t.isStrict(assignments[0].eventId, 1005, 'Correct event assigned');
            t.isStrict(assignments[0].resourceId, 1, 'Correct resource assigned');

            const events = calendar.eventStore.added.values;

            t.isStrict(events[0].id, 1005, 'Correct event dragged');
            t.is(events[0].startDate, new Date(2019, 9, 16), 'Correct startDate');
            t.is(events[0].endDate, new Date(2019, 9, 17), 'Correct endDate');
            t.ok(events[0].allDay);
        });
    });

    t.describe('ResourceView', async t => {
        async function setupResourceView() {
            document.body.innerHTML = `
                <style>
                    body {
                        display        : flex;
                        flex-direction : column;
                        align-items    : stretch;
                    }
                    .draggable-event-container {
                        margin-top: 1em;
                        border: 1px solid #4557f1;
                        border-radius: 5px;
                        user-select: none;
                        padding: 0 0 .4em;
                        flex: 1
                    }
                        
                    .draggable-event-container legend {
                        margin-bottom: .4em;
                        border-top-left-radius: 3px;
                        border-top-right-radius: 3px;
                        background-color: #4557f1;
                        padding: .3em;
                        color: #fff
                    }
                        
                    .draggable-event-container .draggable-event {
                        height: 25px;
                        align-items: center;
                        display: flex;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        background-color: #249fbc;
                        border-radius: 4px;
                        color: #fdfdfd;
                        padding-left: .3em;
                        font-size: .9em;
                        margin: .4em .4em 0
                    }
                </style>
            `;

            dragSourceEl = document.createElement('div');
            dragSourceEl.id = 'event-source';
            dragSourceEl.className = 'draggable-event-container';
            dragSourceEl.innerHTML = `
                <legend>Currently outstanding tasks</legend>
                <div class="draggable-event">Do This</div>
                <div class="draggable-event">Do That</div>
                <div class="draggable-event">Do The other</div>
            `;
            document.body.appendChild(dragSourceEl);

            harness = await setup(t.setupResourceViewDragHarness, {
                grid        : false,
                crudManager : null,
                features    : {
                    externalEventSource : {
                        dragRootElement  : 'event-source',
                        dragItemSelector : '.draggable-event'
                    }
                },
                resources : [
                    {
                        id         : 1,
                        name       : 'Don Taylor',
                        title      : 'Resident',
                        eventColor : 'blue'
                    },
                    {
                        id         : 3,
                        name       : 'Jenny Brown',
                        title      : 'Attending',
                        eventColor : 'deep-orange'
                    },
                    {
                        id         : 2,
                        name       : 'John Adams',
                        title      : 'Fellow',
                        eventColor : 'orange'
                    },
                    {
                        id         : 4,
                        name       : 'Tim Anderson',
                        title      : 'Attending',
                        eventColor : 'red'
                    }
                ],
                events : [],
                modes  : {
                    day          : null,
                    week         : null,
                    month        : null,
                    year         : null,
                    agenda       : null,
                    resourceView : {
                        resourceWidth : 150,
                        view          : {
                            visibleStartTime : 0
                        }
                    }
                }
            });
        }

        t.it('Should assign correct resource', async t => {
            await setupResourceView();

            await t.dragTo({
                source       : '.draggable-event',
                target       : '.b-resourceview-resource[data-resource-id="1"] .b-dayview-day-container',
                targetOffset : [80, 100]
            });

            t.is(calendar.eventStore.count, 1);
            t.is(calendar.eventStore.getAt(0).resources[0].id, 1);

            await t.dragTo({
                source       : '.draggable-event',
                target       : '.b-resourceview-resource[data-resource-id="2"] .b-dayview-day-container',
                targetOffset : [80, 100]
            });

            t.is(calendar.eventStore.count, 2);
            t.is(calendar.eventStore.getAt(1).resources[0].id, 2);

            await t.dragTo({
                source       : '.draggable-event',
                target       : '.b-resourceview-resource[data-resource-id="3"] .b-dayview-day-container',
                targetOffset : [80, 100]
            });

            t.is(calendar.eventStore.count, 3);
            t.is(calendar.eventStore.getAt(2).resources[0].id, 3);

            await t.dragTo({
                source       : '.draggable-event',
                target       : '.b-resourceview-resource[data-resource-id="4"] .b-dayview-day-container',
                targetOffset : [80, 100]
            });

            t.is(calendar.eventStore.count, 4);
            t.is(calendar.eventStore.getAt(3).resources[0].id, 4);
        });
    });
    // do NOT add tests below this one ^^ - it changes the body HTML
});
