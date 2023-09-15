
StartTest(t => {
    let calendar, /* eventStore, resourceStore,*/ harness;

    const getCalendar = async config => {
        const calendar = await t.getCalendar(config);
        // eventStore = calendar.eventStore;
        // resourceStore = calendar.resourceStore;
        return calendar;
    };

    t.beforeEach(() => {
        t.setupCalendarTest(calendar, harness);
    });

    // https://github.com/bryntum/support/issues/5433
    t.it('Should keep sidebar datePicker date in sync when "Today" button is clicked', async t => {
        const
            today         = DateHelper.clearTime(new Date()),
            previousMonth = DateHelper.add(today, -1, 'month').getMonth();

        calendar = await getCalendar({
            date      : today,
            events    : [],
            resources : []
        });
        const { datePicker } = calendar.sidebar.widgetMap;

        t.is(calendar.date, today);
        t.is(datePicker.date, today);

        await t.click('button[data-ref="prevMonth"]');

        t.is(datePicker.date.getMonth(), previousMonth, 'Correct month');

        await t.click(calendar.widgetMap.todayButton.element);

        t.is(calendar.date, today);
        t.is(datePicker.date, today);
    });

    // https://github.com/bryntum/support/issues/5460
    t.it('Should correctly duplicate multi assigned events', async t => {
        t.mockUrl('test-duplicate-multi-assigned-data', {
            delay        : 100,
            responseText : JSON.stringify({
                success   : true,
                resources : {
                    rows : [{
                        id   : 1,
                        name : 'Resource 1'
                    }, {
                        id   : 2,
                        name : 'Resource 2'
                    }]
                },
                events : {
                    rows : [{
                        id           : 1,
                        name         : 'Event 1',
                        startDate    : '2022-06-05',
                        endDate      : '2022-06-10',
                        duration     : 5,
                        durationUnit : 'd'
                    }]
                },
                assignments : {
                    rows : [{
                        id         : 1,
                        eventId    : 1,
                        resourceId : 1
                    }, {
                        id         : 2,
                        eventId    : 1,
                        resourceId : 2
                    }]
                }
            })
        });

        calendar = await getCalendar({
            crudManager : {
                loadUrl  : 'test-duplicate-multi-assigned-data',
                autoLoad : true,
                autoSync : false
            },
            modes : {
                day    : null,
                week   : null,
                year   : null,
                agenda : null
            },
            date : '2022-06-05'
        });

        await t.waitForSelector('.b-cal-event-wrap');

        const { eventStore } = calendar;

        // Starting condition
        t.is(eventStore.count, 1);

        await t.rightClick('.b-cal-event-wrap');

        await t.click('.b-menuitem[data-ref="duplicate"]');

        // Duplicate has worked
        t.is(eventStore.count, 2);

        // Same assignments
        t.isDeeply(eventStore.first.resources, eventStore.last.resources);

        await t.doubleClick(`.b-cal-event-wrap[data-event-id="${eventStore.last.id}"]`);

        // Resource field must be a multiselect with two chips
        await t.waitForSelectorCount('[data-ref="resourceField"] .b-chip', 2);
    });

    // https://github.com/bryntum/support/issues/5528
    t.it('Should fire dayNumberClick and monthNameClick', async t => {
        calendar = await getCalendar({
            events : [{
                startDate : '2022-06-01',
                endDate   : '2022-06-02',
                name      : 'Just to get an Agenda cell'
            }],
            resources : [],
            sidebar   : false,
            mode      : 'week',
            date      : '2022-06-03',
            listeners : {
                dayNumberClick(e) {
                    events.push([e.type, e.source.type]);
                },
                weekNumberClick(e) {
                    events.push([e.type, e.source.type]);
                },
                monthNameClick(e) {
                    events.push([e.type, e.source.type]);
                }
            }
        });
        const events = [];

        await t.click('.b-cal-cell-header[data-header-date="2022-06-03"]');

        // Clicking the week view's day header must navigate to day view
        await t.waitFor(() => calendar.mode === 'day');
        await t.waitForAnimations();

        await t.click('[data-ref="monthShowButton"]');

        await t.waitFor(() => calendar.mode === 'month');
        await t.waitForAnimations();

        await t.click('.b-week-num');

        // Clicking the month view's first column week number must navigate to week view
        await t.waitFor(() => calendar.mode === 'week');
        await t.waitForAnimations();

        await t.click('[data-ref="monthShowButton"]');

        await t.waitFor(() => calendar.mode === 'month');
        await t.waitForAnimations();

        // Clicking the month view's in-cell day number must navigate to day view
        await t.click('.b-calendar-cell[data-date="2022-06-03"] .b-day-num');

        await t.waitFor(() => calendar.mode === 'day');
        await t.waitForAnimations();

        await t.click('[data-ref="yearShowButton"]');

        await t.waitFor(() => calendar.mode === 'year');
        await t.waitForAnimations();

        // Clicking the year view's month name must navigate to month view
        await t.click('.b-yearview-month-name[data-month-date="2022-06-01"');

        await t.waitFor(() => calendar.mode === 'month');
        await t.waitForAnimations();

        await t.click('[data-ref="yearShowButton"]');

        await t.waitFor(() => calendar.mode === 'year');
        await t.waitForAnimations();

        // Clicking the year view's week number cell must navigate to month view
        await t.click('.b-yearview [data-week="2022,23"] .b-week-number-cell');

        await t.waitFor(() => calendar.mode === 'week');
        await t.waitForAnimations();

        await t.click('[data-ref="agendaShowButton"]');

        await t.waitFor(() => calendar.mode === 'agenda');
        await t.waitForAnimations();

        await t.click('[data-date="2022-06-01"] .b-cal-agenda-date-date-number');

        await t.waitFor(() => calendar.mode === 'day');
        await t.waitForAnimations();

        t.isDeeply(events, [
            ['daynumberclick', 'calendarrow'],
            ['weeknumberclick', 'monthview'],
            ['daynumberclick', 'monthview'],
            ['monthnameclick', 'yearview'],
            ['weeknumberclick', 'yearview'],
            ['daynumberclick', 'agendaview']
        ]);
    });

    t.it('Should always have modeDefaults available as a Proxy', async t => {
        calendar = await getCalendar({
            modes : {
                week   : false,
                month  : false,
                year   : false,
                agenda : false
            }
        });
        const { hourHeight } = calendar.modes.day;

        calendar.modeDefaults.hourHeight = 60;

        // Must have changed
        t.isGreater(calendar.modes.day.hourHeight, hourHeight);
    });

    t.it('maxDots and eventCountTip', async t => {
        const events = (() => {
            const result = [];

            for (let i = 0; i < 10; i++) {
                result.push({
                    startDate : '2019-01-01T09:00',
                    endDate   : '2019-01-01T10:00',
                    name      : `Event ${i + 1}`
                });
            }
            return result;
        })();

        calendar = await t.getCalendar({
            events,
            datePicker : {
                showEvents    : 'dots',
                maxDots       : 12,
                eventCountTip : true
            },
            date : new Date(2019, 0, 1)
        });

        await t.moveMouseTo('.b-calendardatepicker .b-calendar-cell[data-date="2019-01-01"]');

        // eventCountTip present
        await t.waitForSelector('.b-tooltip:contains(10 events)');

        // All dots present
        t.selectorCountIs('.b-calendardatepicker .b-calendar-cell[data-date="2019-01-01"] .b-cal-event-wrap', 10);
    });

    t.it('datepicker eventFilter config should work as a function', async t => {
        let filterValue = 'birthday';

        calendar = await t.getCalendar({
            date   : new Date(2019, 5, 1),
            events : [{
                startDate  : '2019-06-17',
                endDate    : '2019-06-17',
                name       : 'My birthday',
                allDay     : true,
                type       : 'birthday',
                eventColor : 'red'
            }, {
                startDate  : '2019-06-18T09:00',
                endDate    : '2019-06-18T10:00',
                name       : 'Dental appointment',
                type       : 'appointment',
                eventColor : 'red'
            }],
            modeDefaults : {
                eventFilter(e) {
                    return e.type === filterValue;
                }
            },
            mode       : 'month',
            datePicker : {
                showEvents    : 'dots',
                maxDots       : 12,
                eventCountTip : true,
                eventFilter(e) {
                    return e.type === filterValue;
                }
            }
        });

        // The only event in the month view is my birthday
        t.selectorCountIs('.b-monthview .b-cal-event-wrap', 1);
        t.selectorCountIs('.b-monthview [data-date="2019-06-17"] .b-cal-event-wrap', 1);

        // Also in the date picker
        t.selectorCountIs('.b-calendardatepicker .b-datepicker-1-to-3-events', 1);
        t.selectorCountIs('.b-calendardatepicker [data-date="2019-06-17"] .b-datepicker-1-to-3-events', 1);

        filterValue = 'appointment';
        calendar.refresh();
        calendar.datePicker.refresh();

        await t.waitForAnimationFrame();

        // The only event in the month view is my dentist appointment
        t.selectorCountIs('.b-monthview .b-cal-event-wrap', 1);
        t.selectorCountIs('.b-monthview [data-date="2019-06-18"] .b-cal-event-wrap', 1);

        // Also in the date picker
        t.selectorCountIs('.b-calendardatepicker .b-datepicker-1-to-3-events', 1);
        t.selectorCountIs('.b-calendardatepicker [data-date="2019-06-18"] .b-datepicker-1-to-3-events', 1);
    });

    t.it('datepicker eventFilter config should work as a string', async t => {
        calendar = await t.getCalendar({
            date   : new Date(2019, 5, 1),
            events : [{
                startDate  : '2019-06-17',
                endDate    : '2019-06-17',
                name       : 'My birthday',
                allDay     : true,
                type       : 'birthday',
                eventColor : 'red'
            }, {
                startDate  : '2019-06-18T09:00',
                endDate    : '2019-06-18T10:00',
                name       : 'Dental appointment',
                type       : 'appointment',
                eventColor : 'red'
            }],
            tbar : {
                items : {
                    eventTypeFilter : {
                        type  : 'combo',
                        items : [
                            ['birthday', 'Birthday'],
                            ['appointment', 'Appointment']
                        ],
                        value    : 'birthday',
                        onChange : 'up.onEventTypeFilterChange'
                    }
                }
            },
            modeDefaults : {
                eventFilter : 'up.sidebarEventFilter'
            },
            mode       : 'month',
            datePicker : {
                showEvents    : 'dots',
                maxDots       : 12,
                eventCountTip : true,
                eventFilter   : 'up.sidebarEventFilter'
            },

            sidebarEventFilter(e) {
                return e.type === this.widgetMap.eventTypeFilter.value;
            },
            onEventTypeFilterChange() {
                this.datePicker.refresh();
                this.refresh();
            }
        });

        // The only event in the month view is my birthday
        t.selectorCountIs('.b-monthview .b-cal-event-wrap', 1);
        t.selectorCountIs('.b-monthview [data-date="2019-06-17"] .b-cal-event-wrap', 1);

        // Also in the date picker
        t.selectorCountIs('.b-calendardatepicker .b-datepicker-1-to-3-events', 1);
        t.selectorCountIs('.b-calendardatepicker [data-date="2019-06-17"] .b-datepicker-1-to-3-events', 1);

        await t.click('[data-ref="eventTypeFilter"] [data-ref="expand"]');

        await t.click('.b-list-item:contains(Appointment)');

        await t.waitForAnimationFrame();

        // The only event in the month view is my dentist appointment
        t.selectorCountIs('.b-monthview .b-cal-event-wrap', 1);
        t.selectorCountIs('.b-monthview [data-date="2019-06-18"] .b-cal-event-wrap', 1);

        // Also in the date picker
        t.selectorCountIs('.b-calendardatepicker .b-datepicker-1-to-3-events', 1);
        t.selectorCountIs('.b-calendardatepicker [data-date="2019-06-18"] .b-datepicker-1-to-3-events', 1);
    });

    // https://github.com/bryntum/support/issues/6683
    t.it('Should allow click on Combo dropdown in revealed sidebar', async t => {
        calendar = await getCalendar({
            width     : 500,
            events    : [],
            resources : [],
            sidebar   : {
                items : {
                    testCombo : {
                        weight : 100,
                        type   : 'combo',
                        items  : ['Fanta', 'Loranga', 'Jaffa', 'Zingo', 'Orangina'],
                        label  : 'Things'
                    }
                }
            }
        });
        const { testCombo } = calendar.sidebar.widgetMap;

        await t.click(calendar.widgetMap.toggleSideBar.element);

        await t.waitForAnimations();

        await t.click(testCombo.triggers.expand.element);

        await t.click('.b-list-item:contains(Orangina)');

        await t.waitForAnimations();

        t.is(testCombo.value, 'Orangina');

        t.ok(calendar.sidebar.revealed);
    });

    t.it('defaultState should reflect the configured values', async t => {
        const
            targetDate    = new Date(2019, 0, 1),
            newDate       = new Date(2020, 11, 1),
            stateProvider = new StateProvider({
                storage : 'memory'
            });

        calendar = await t.getCalendar({
            stateProvider,
            date     : targetDate,
            stateId  : 'pan01',
            stateful : ['date'],
            modes    : {
                day    : false,
                month  : null,
                year   : null,
                agenda : null
            }
        });

        t.is(calendar.date, targetDate);

        t.selectorCountIs('.b-dayview-day-detail.b-calendar-cell', 7);

        calendar.date = newDate;

        calendar.hideNonWorkingDays = true;

        t.selectorCountIs('.b-dayview-day-detail.b-calendar-cell', 5);

        // Wait for state to be flushed to storage
        await t.waitFor(() => !calendar.isSaveStatePending);

        calendar.destroy();

        // Upon recreation, the new date should be applied as the Calendar's newly set centered date
        calendar = await t.getCalendar({
            stateProvider,
            date     : targetDate,
            stateId  : 'pan01',
            stateful : ['date'],
            modes    : {
                day    : false,
                month  : null,
                year   : null,
                agenda : null
            }
        });

        await t.waitFor(500);

        // State restored
        t.is(calendar.date, newDate);
        t.selectorCountIs('.b-dayview-day-detail.b-calendar-cell', 5);

        // The default state should be the *configured* state
        t.is(calendar.defaultState.date, targetDate);

        calendar.resetDefaultState();

        // State back to configured state
        t.is(calendar.date, targetDate);
        t.selectorCountIs('.b-dayview-day-detail.b-calendar-cell', 7);
    });

    t.it('resourceFilter configured selection should apply to first load of eventStore', async t => {
        calendar = await t.getCalendar({
            date      : new Date(2019, 9, 14),
            events    : [],
            resources : t.getHackathonData().resources.rows,
            sidebar   : {
                items : {
                    resourceFilter : {
                        selected : []
                    }
                }
            },
            modes : {
                day    : null,
                week   : null,
                year   : null,
                agenda : null
            }
        });

        await t.waitFor(300);
        calendar.eventStore.data = t.getHackathonData().events.rows;

        await t.waitForAnimationFrame();

        // The resourceFilter has no selection, so no events should be visible
        t.selectorCountIs('.b-cal-event-wrap', 0);
    });

    // https://github.com/bryntum/support/issues/6732
    t.it('Should not remove deassigned events', async t => {
        t.mockUrl('test-deassigning-multi-assigned-data', {
            delay        : 100,
            responseText : JSON.stringify({
                success   : true,
                resources : {
                    rows : [{
                        id   : 1,
                        name : 'Resource 1'
                    }, {
                        id   : 2,
                        name : 'Resource 2'
                    }]
                },
                events : {
                    rows : [{
                        id           : 1,
                        name         : 'Event 1',
                        startDate    : '2022-06-05',
                        endDate      : '2022-06-10',
                        duration     : 5,
                        durationUnit : 'd'
                    }]
                },
                assignments : {
                    rows : [{
                        id         : 1,
                        eventId    : 1,
                        resourceId : 1
                    }, {
                        id         : 2,
                        eventId    : 1,
                        resourceId : 2
                    }]
                }
            })
        });

        calendar = await getCalendar({
            crudManager : {
                loadUrl  : 'test-deassigning-multi-assigned-data',
                autoLoad : true,
                autoSync : false
            },
            modes : {
                day    : null,
                week   : null,
                year   : null,
                agenda : null
            },
            date : '2022-06-05'
        });

        await t.waitForSelector('.b-cal-event-wrap');

        const { eventStore } = calendar;

        // Starting condition
        t.is(eventStore.count, 1);

        await t.rightClick('.b-cal-event-wrap');

        await t.doubleClick(`.b-cal-event-wrap[data-event-id="${eventStore.last.id}"]`);

        // Resource field must be a multiselect with two chips
        await t.waitForSelectorCount('[data-ref="resourceField"] .b-chip', 2);

        await t.click('.b-eventeditor .b-resourcecombo .b-chip .b-close-icon');
        await t.click('.b-eventeditor .b-resourcecombo .b-chip .b-close-icon');

        await t.click('.b-eventeditor [data-ref="saveButton"]');

        // Event has not been removed
        t.selectorExists('.b-cal-event-wrap');
    });

    // https://github.com/bryntum/support/issues/6772
    t.it('Should use eventColor from only filtered-in resources if configured to do so', async t => {
        t.mockUrl('6772-test-event-resource-colour-source', {
            responseText : JSON.stringify({
                success   : true,
                resources : {
                    rows : [{
                        id         : 1,
                        name       : 'Resource 1',
                        eventColor : 'red'
                    }, {
                        id         : 2,
                        name       : 'Resource 2',
                        eventColor : 'blue'
                    }]
                },
                events : {
                    rows : [{
                        id           : 1,
                        name         : 'Event 1',
                        startDate    : '2022-06-05',
                        endDate      : '2022-06-10',
                        duration     : 5,
                        durationUnit : 'd'
                    }]
                },
                assignments : {
                    rows : [{
                        id         : 1,
                        eventId    : 1,
                        resourceId : 1
                    }, {
                        id         : 2,
                        eventId    : 1,
                        resourceId : 2
                    }]
                }
            })
        });

        calendar = await getCalendar({
            crudManager : {
                loadUrl  : '6772-test-event-resource-colour-source',
                autoLoad : true,
                autoSync : false
            },
            // When rendering wants a resource to get a colour from, ensure
            // we use the first resource that is still filtered in
            filterEventResources : true,
            modes                : {
                day    : null,
                week   : null,
                year   : null,
                agenda : null
            },
            date : '2022-06-05'
        });

        const eventEl = (await t.waitForSelector('.b-cal-event'))[0];

        // Color is red from resource 1
        t.hasStyle(eventEl, 'background-color', 'rgb(239, 83, 80)');

        await t.click('.b-resourcefilter .b-list-item[data-id="1"]');

        await t.waitFor(100);

        // The "Red" resource is deselected, so now the event must be blue
        t.hasStyle(eventEl, 'background-color', 'rgb(66, 165, 245)');
    });

    // https://github.com/bryntum/support/issues/7007
    t.it('Configs from Calendar should not override configs in modes', async t => {
        calendar = await getCalendar({
            modes : {
                day : {
                    coreHours : { start : 9, end : 17, overlayDay : true }
                }
            },
            coreHours : { start : 8, end : 18, overlayDay : true },
            date      : '2022-06-05'
        });

        // Day mode's differing config not have been overwritten by the Calendar
        t.isDeeply(calendar.modes.day.coreHours, { start : 9, end : 17, overlayDay : true, _overlayDay : true });

        t.isDeeply(calendar.modes.week.coreHours, { start : 8, end : 18, overlayDay : true, _overlayDay : true });
    });

    // https://github.com/bryntum/support/issues/7208
    t.it('Should keep Calendar date in sync when sidebar datepicker date selected', async t => {
        const
            beginningDate = new Date(2023, 6, 25),
            newDate = new Date(2023, 6, 11);

        calendar = await getCalendar({
            date      : beginningDate,
            events    : [],
            resources : []
        });
        const { datePicker } = calendar.sidebar.widgetMap;

        t.is(calendar.date, beginningDate);
        t.is(datePicker.date, beginningDate);
        t.is(calendar.activeView.date, beginningDate);

        await t.click('[data-ref="monthShowButton"]');

        await t.waitForAnimations();

        await t.click('.b-calendardatepicker .b-calendar-cell[data-date="2023-07-11"]');

        await t.click('[data-ref="weekShowButton"]');

        await t.waitForAnimations();

        t.is(calendar.date, newDate);
        t.is(datePicker.date, newDate);
        t.is(calendar.activeView.date, newDate);
    });

    // https://github.com/bryntum/support/issues/7331
    t.it('Should keep activeItem date in sync when Calendar date changed - 1', async t => {
        calendar = await getCalendar({
            date      : new Date(2023, 9, 12),
            events    : [],
            resources : []
        });

        calendar.mode = 'day';
        calendar.date = new Date(2023, 9, 11);

        await t.waitForAnimations();

        // Calendar mode must have followed the new date
        t.is(calendar.modes.day.date, new Date(2023, 9, 11));
    });
    t.it('Should keep activeItem date in sync when Calendar date changed-  2', async t => {
        calendar = await getCalendar({
            date      : new Date(2023, 9, 12),
            events    : [],
            resources : []
        });

        calendar.viewContainer.layout.activeItem = calendar.modes.day;
        calendar.date = new Date(2023, 9, 11);

        await t.waitForAnimations();

        // Calendar mode must have followed the new date
        t.is(calendar.modes.day.date, new Date(2023, 9, 11));
    });
    t.it('Should keep activeItem date in sync when Calendar date changed - 3', async t => {
        calendar = await getCalendar({
            date      : new Date(2023, 9, 12),
            events    : [],
            resources : []
        });

        calendar.mode = calendar.modes.day;
        calendar.date = new Date(2023, 9, 11);

        await t.waitForAnimations();

        // Calendar mode must have followed the new date
        t.is(calendar.modes.day.date, new Date(2023, 9, 11));
    });
});
