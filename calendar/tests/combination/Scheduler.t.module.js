
StartTest(t => {
    let calendar, scheduler;

    t.beforeEach(() => calendar?.destroy?.());

    async function setup(schedulerConfig = {}, calendarConfig = {}) {
        calendar = new Calendar(Config.merge(calendarConfig, {
            appendTo : document.body,

            mode : 'timeline',

            date : new Date(2021, 7, 22),

            modes : {
                day    : null,
                week   : null,
                month  : null,
                year   : null,
                agenda : null,

                timeline : {
                    type : 'scheduler',

                    displayName : 'Timeline',

                    eventStyle : 'calendar',

                    columns : [
                        { field : 'name', text : 'Resource', width : 165 }
                    ],

                    viewPreset : {
                        base : 'hourAndDay',

                        tickWidth : 40,

                        headers : [{
                            unit       : 'day',
                            dateFormat : 'ddd MM/DD'
                        }, {
                            unit       : 'hour',
                            dateFormat : 'h'
                        }]
                    },

                    ...schedulerConfig
                }
            }
        }));

        scheduler = calendar.modes.timeline;

        await calendar.project.commitAsync();
    }

    t.it('Should scroll when clicking dates in current range in sidebar calendar', async t => {
        await setup();

        t.is(scheduler.startDate, new Date(2021, 7, 22), 'Correct time axis start');
        t.is(scheduler.endDate, new Date(2021, 7, 29), 'Correct time axis end');

        await t.click('.b-sidebar [data-date="2021-08-24"]');

        // Only ticks in range are rendered, this assertions checks that it has scrolled as expected
        await t.waitForSelector('[data-tick-index="62"]');

        t.is(scheduler.startDate, new Date(2021, 7, 22), 'Time axis start unaffected');
        t.is(scheduler.endDate, new Date(2021, 7, 29), 'Time axis end unaffected');

        await t.click('.b-sidebar [data-date="2021-08-28"]');

        await t.waitForSelector('[data-tick-index="158"]');

        await t.click('.b-sidebar [data-date="2021-08-22"]');

        await t.waitForSelector('[data-tick-index="0"]');

        t.pass('Scrolled as expected');
    });

    t.it('Should change week when clicking dates out of range in sidebar calendar', async t => {
        await setup();

        await t.click('.b-sidebar [data-date="2021-08-31"]');

        await t.waitForSelector('[data-tick-index="62"]');

        t.is(scheduler.startDate, new Date(2021, 7, 29), 'Correct time axis start');
        t.is(scheduler.endDate, new Date(2021, 8, 5), 'Correct time axis end');

        t.selectorExists('.b-calendar-view-desc:textEquals("Aug - Sep 2021 (Week 35)")');

        await t.click('.b-sidebar [data-date="2021-08-08"]');

        await t.waitForSelector('[data-tick-index="0"]');

        t.is(scheduler.startDate, new Date(2021, 7, 8), 'Correct time axis start');
        t.is(scheduler.endDate, new Date(2021, 7, 15), 'Correct time axis end');

        t.selectorExists('.b-calendar-view-desc:textEquals("August 2021 (Week 32)")');
    });

    t.it('Should support changing range', async t => {
        await setup({
            range : 'month'
        });

        await t.waitForSelector('.b-calendar-view-desc:textEquals(August, 2021)');
        t.is(scheduler.startDate, new Date(2021, 7, 1), 'Correct time axis start with initial range specified');
        t.is(scheduler.endDate, new Date(2021, 8, 1), 'Correct time axis end with initial range specified');
        t.is(scheduler.date, new Date(2021, 7, 22), 'Date unchanged');

        scheduler.range = 'day';

        await t.waitForSelector('.b-calendar-view-desc:textEquals(August 22, 2021)');
        t.is(scheduler.startDate, new Date(2021, 7, 22), 'Correct time axis start after changing range');
        t.is(scheduler.endDate, new Date(2021, 7, 23), 'Correct time axis end after changing range');
        t.is(scheduler.date, new Date(2021, 7, 22), 'Date unchanged');
    });

    t.it('Should step with next and previous buttons', async t => {
        await setup();

        await t.click('[data-ref=prevButton]');

        t.is(scheduler.startDate, new Date(2021, 7, 15), 'Correct time axis start after step back');
        t.is(scheduler.endDate, new Date(2021, 7, 22), 'Correct time axis end');

        await t.click('[data-ref=prevButton]');

        t.is(scheduler.startDate, new Date(2021, 7, 8), 'Correct time axis start after another step back');
        t.is(scheduler.endDate, new Date(2021, 7, 15), 'Correct time axis end');

        await t.click('[data-ref=nextButton]');

        t.is(scheduler.startDate, new Date(2021, 7, 15), 'Correct time axis start after step forward');
        t.is(scheduler.endDate, new Date(2021, 7, 22), 'Correct time axis end');

        await t.click('[data-ref=nextButton]');

        t.is(scheduler.startDate, new Date(2021, 7, 22), 'Correct time axis start after another step forward');
        t.is(scheduler.endDate, new Date(2021, 7, 29), 'Correct time axis end');
    });

    t.it('Should support changing step size', async t => {
        await setup({
            range    : 'month',
            stepUnit : 'day'
        });

        await t.click('[data-ref=prevButton]');

        await t.waitForSelector('[data-tick-index="480"]');

        t.is(scheduler.startDate, new Date(2021, 7, 1), 'Correct time axis start after step #1');
        t.is(scheduler.endDate, new Date(2021, 8, 1), 'Correct time axis end');
        t.is(scheduler.date, new Date(2021, 7, 21), 'Correct date');

        await t.click('[data-ref=prevButton]');

        await t.waitForSelector('[data-tick-index="456"]');

        t.is(scheduler.startDate, new Date(2021, 7, 1), 'Correct time axis start after step #2');
        t.is(scheduler.endDate, new Date(2021, 8, 1), 'Correct time axis end');
        t.is(scheduler.date, new Date(2021, 7, 20), 'Correct date');

        scheduler.stepUnit = 'month';

        await t.click('[data-ref=nextButton]');

        t.is(scheduler.startDate, new Date(2021, 8, 1), 'Correct time axis start after step #3');
        t.is(scheduler.endDate, new Date(2021, 9, 1), 'Correct time axis end');
        t.is(scheduler.date, new Date(2021, 8, 20), 'Correct date');
    });

    t.it('Should not crash when clicking time axis header', async t => {
        await setup();

        await t.click('.b-sch-header-timeaxis-cell');

        t.pass('Did not crash');
    });

    t.it('Editing recurring event', async t => {
        await setup(undefined, {
            sidebar : false,
            events  : [{
                duration       : 8,
                durationUnit   : 'hour',
                id             : 'twice-weekly',
                name           : 'Recurring Meeting',
                recurrenceRule : 'FREQ=WEEKLY;BYDAY=TU,TH',
                startDate      : new Date(2021, 7, 22, 8),
                resourceId     : 1
            }],
            resources : [{
                id   : 1,
                name : 'Resource'
            }],
            modes : {
                week : true
            }
        });
        const event = scheduler.eventStore.first;

        await t.doubleClick('.b-sch-event-wrap');

        await t.waitFor(() => calendar.features.eventEdit.editor?.containsFocus);

        await t.click('[data-ref="startTimeField"] [data-ref="forward"]');
        await t.click('[data-ref="startTimeField"] [data-ref="forward"]');

        await t.click('[data-ref="saveButton"]');

        await t.click('.b-recurrenceconfirmationpopup [data-ref="changeMultipleButton"]');

        // We have budged it forward to 9
        await t.waitFor(() => scheduler.getDateFromCoordinate(scheduler.getEventElement(event).getBoundingClientRect().x + 1, null, false).getHours() === 9);

        t.pass('Did not crash');
    });

    // https://github.com/bryntum/support/issues/4529
    t.it('Should not trigger sync double clicking to create event in Scheduler child view', async t => {
        await setup({}, {
            crudManager : {
                autoSyncTimeout : 1,
                resourceStore   : {
                    data : [{ name : 'Bob' }]
                },
                autoLoad : false,
                autoSync : true
            }
        });

        t.wontFire(calendar.crudManager, 'beforesync');

        await t.doubleClick('.b-sch-timeaxis-cell', null, null, null, [10, 10]);

        await t.waitFor(100);
    });

    // https://github.com/bryntum/support/issues/6514-create
    t.it('Should support creating event using ScheduleMenu', async t => {
        await setup({}, {
            resources : [{
                id   : 1,
                name : 'Resource'
            }]
        });

        t.firesOnce(calendar.eventStore, 'add');

        await t.rightClick('.b-sch-timeaxis-cell', null, null, null, [10, 10]);

        await t.click('.b-menuitem:contains(Add)');
        await t.waitForSelector('.b-sch-event');
        await t.type(null, 'foo[ENTER]');
        await t.waitForSelector('.b-sch-event:textEquals(foo)');
    });

    // https://github.com/bryntum/support/issues/6513
    t.it('Should not show event tooltip after double clicking event', async t => {
        await setup({}, {
            resources : [{
                id   : 1,
                name : 'Resource'
            }],
            events : [{
                duration   : 1,
                id         : 'twice-weekly',
                startDate  : new Date(2021, 7, 22, 8),
                resourceId : 1
            }]
        });

        await t.doubleClick('.b-sch-event');

        t.selectorNotExists('.b-tooltip');
    });

    // https://github.com/bryntum/support/issues/6458
    t.it('Should call onBeforeEventDrag and similar event methods on the Calendar', async t => {
        let callCount = 0;
        await setup({

        }, {
            resourceStore : {
                data : [{ id : 1, name : 'Bob' }]
            },
            eventStore : {
                data : [{ startDate : new Date(2021, 7, 22, 4), duration : 1, durationUnit : 'h', resourceId : 1 }]
            },
            onBeforeEventDrag() {
                callCount++;
            }
        });

        t.firesOnce(calendar, 'beforeEventDrag');

        await t.dragBy({ source : '.b-sch-event', delta : [50, 0] });

        t.is(callCount, 1);
    });

    // https://github.com/bryntum/support/issues/6567
    t.it('Should not make a data request from a hidden scheduler', async t => {
        await setup({}, {
            resourceStore : {
                data : t.getHackathonData().resources.rows
            },
            eventStore : {
                data : t.getHackathonData().events.rows
            },
            date  : new Date(2019, 9, 14),
            mode  : 'month',
            modes : {
                month : {}
            }
        });
        const
            monthView = calendar.activeView,
            testEvent = calendar.eventStore.getById(3);

        await t.waitForAnimationFrame();
        t.wontFire(calendar, 'dateRangeChange');

        await t.dragBy({
            source : '.b-cal-event-wrap[data-event-id="3"]',
            delta  : [0, -monthView.height / 6]
        });

        await t.doubleClick('.b-cal-event-wrap[data-event-id="3"]');

        await t.waitFor(() => calendar.features.eventEdit.editor?.containsFocus);

        await t.type({
            text          : 'New EventName[TAB]',
            clearExisting : true
        });

        await t.type({
            text : '[DOWN][UP][ENTER]'
        });

        await t.type({
            text : '[ENTER]'
        });

        t.is(testEvent.name, 'New EventName');
        t.is(testEvent.resource.name, 'Hotel Park');

        await t.rightClick('.b-cal-event-wrap[data-event-id="3"]');

        await t.click('.b-menuitem[data-ref="deleteEvent"]');

        t.notOk(calendar.eventStore.includes(testEvent));

        await t.doubleClick('.b-monthview .b-calendar-cell[data-date="2019-10-10"]');

        await t.type({
            text          : 'Added Event[TAB]',
            clearExisting : true
        });

        await t.type({
            text : '[DOWN][UP][UP][ENTER]'
        });

        await t.type({
            text : '[ENTER]'
        });

        const addedEvent = calendar.eventStore.last;

        t.is(addedEvent.name, 'Added Event');
        t.is(addedEvent.resource.name, 'Bryntum team');

        await t.click('.b-resourcefilter .b-list-item');

        await t.waitForAnimationFrame();

        await t.click('.b-resourcefilter .b-list-item');

        await t.waitForAnimationFrame();

        // Wait for data changes to get through in case they cause the Scheduler to react
        await t.waitFor(100);
    });

    // https://github.com/bryntum/support/issues/6612
    t.it('Should only call tooltip renderer once in the scheduler', async t => {
        let calls = 0;
        await setup({}, {
            resourceStore : {
                data : t.getHackathonData().resources.rows
            },
            eventStore : {
                data : t.getHackathonData().events.rows
            },
            features : {
                eventTooltip : {
                    renderer() {
                        calls++;
                        return 'foo' + calls;
                    }
                }
            },
            modes : {
                timeline : {
                    visibleDate : new Date(2019, 9, 18)
                }
            },
            date : new Date(2019, 9, 18)
        });

        // FF cant click b-sch-event-content, because of some weird position sticky issue
        await t.click('.b-sch-event-wrap[data-event-id="1"] .b-sch-event');
        await t.waitForSelector('.b-tooltip:contains(foo1)');
        t.is(calls, 1);

        await t.click('.b-sch-event-wrap[data-event-id="23"] .b-sch-event');
        await t.waitForSelector('.b-tooltip:contains(foo2)');

        t.is(calls, 2);
    });

    // https://github.com/bryntum/support/issues/6995
    t.it('should initialize scheduler in calendar if current time is not a workingTime', async t => {
        const resourceBaseConfig = {
            type        : 'scheduler',
            workingTime : (new Date()).getHours() < 12
                ? {
                    fromHour : 13,
                    toHour   : 22
                }
                : {
                    fromHour : 3,
                    toHour   : 11
                },
            columns : [
                {
                    id    : 'resource',
                    type  : 'resourceInfo',
                    field : 'name',
                    text  : 'Inspectors',
                    width : 175
                }
            ]
        };

        const calendarConfig = {
            mode  : 'day',
            modes : {
                day : {
                    ...resourceBaseConfig,
                    id          : 'day',
                    displayName : 'Day',
                    features    : {
                        eventEdit : {
                            items : {
                                allDay : null
                            }
                        }
                    },
                    viewPreset : {
                        base           : 'hourAndDay',
                        shiftIncrement : 1,
                        shiftUnit      : 'day',
                        defaultSpan    : 1,
                        mainUnit       : 'day'
                    }
                },
                week : {
                    ...resourceBaseConfig,
                    displayName : 'Week',
                    viewPreset  : 'hourAndDay'
                },
                month : {
                    features : {
                        eventEdit : {
                            items : {
                                allDay : null
                            }
                        }
                    }
                },
                year   : null,
                agenda : null
            }
        };

        calendar = await setup({}, calendarConfig);

        // Prior to fix, the above would throw an exception
        await t.waitForSelector('.b-calendar-content .b-scheduler');
    });
});
