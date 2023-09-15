
StartTest(t => {
    let calendar, eventStore, resourceStore;

    t.beforeEach(() => {
        calendar?.destroy();

        // Check that none of the floating things are persisting
        if (t.query('.b-overflowpopup,.b-sch-event-tooltip, .b-eventeditor').length > 0) {
            t.selectorNotExists('.b-overflowpopup:visible');
            t.selectorNotExists('.b-sch-event-tooltip');
            t.selectorNotExists('.b-eventeditor');
        }
    });

    t.it('autoCreate main part', async t => {
        eventStore = new EventStore({
            data              : [],
            defaultCalendarId : 'r2'
        });

        resourceStore = new ResourceStore({
            data : [{
                id   : 'r1',
                name : 'Calendar 1'
            }, {
                id   : 'r2',
                name : 'Calendar 2'
            }]
        });

        calendar = await t.getCalendar({
            date     : new Date(2019, 9, 7),
            eventStore,
            resourceStore,
            sidebar  : false,
            features : {
                eventTooltip : false,
                eventEdit    : false
            },
            modes : {
                agenda : null,
                year   : null,
                week   : true,
                day    : null,
                month  : null
            }
        });
        t.selectorCountIs('.b-cal-event-wrap', 0, 'No events');

        t.chain(
            { dblclick : '.b-dayview-day-detail.b-calendar-cell[data-date="2019-10-07"]' },

            { waitForSelector : '.b-cal-event-wrap' },

            next => {
                t.is(calendar.eventStore.count, 1);
                t.selectorCountIs('.b-cal-event-wrap', 1, '1 event');

                const newEvent = calendar.eventStore.first;

                t.is(newEvent.startDate, new Date(2019, 9, 7, 12), 'Correct start date');
                t.is(newEvent.endDate, new Date(2019, 9, 7, 13), 'Correct end date');
                t.is(newEvent.resource, calendar.resourceStore.getAt(1), 'Correct resource');

                calendar.autoCreate = false;
                next();
            },

            { dblclick : '.b-dayview-day-detail.b-calendar-cell[data-date="2019-10-08"]' },

            next => {
                t.is(calendar.eventStore.count, 1, 'Still one event, autoCreate disabled');
                t.selectorCountIs('.b-cal-event-wrap', 1, 'Still one event, autoCreate disabled');

                calendar.autoCreate = 'click';
                next();
            },

            // Step over the click block time
            { waitFor : 500 },

            { click : '.b-dayview-day-detail.b-calendar-cell[data-date="2019-10-08"]' },

            { waitFor : () => calendar.activeView.element.querySelectorAll('.b-cal-event-wrap').length === 2 },

            () => {
                t.is(calendar.eventStore.count, 2);
                t.selectorCountIs('.b-cal-event-wrap', 2, 'Two events');

                const newEvent = calendar.eventStore.getAt(1);

                t.is(newEvent.startDate, new Date(2019, 9, 8, 12), 'Correct start date');
                t.is(newEvent.endDate, new Date(2019, 9, 8, 13), 'Correct end date');
                t.is(newEvent.resource, calendar.resourceStore.getAt(1), 'Correct resource');
            }
        );
    });

    t.it('dateChange event', async t => {
        eventStore = new EventStore({
            data              : [],
            defaultCalendarId : 'r2'
        });

        resourceStore = new ResourceStore({
            data : [{
                id   : 'r1',
                name : 'Calendar 1'
            }, {
                id   : 'r2',
                name : 'Calendar 2'
            }]
        });

        calendar = await t.getCalendar({
            date     : new Date(2019, 9, 7),
            eventStore,
            resourceStore,
            sidebar  : false,
            features : {
                eventTooltip : false,
                eventEdit    : false
            },
            modes : {
                agenda : null,
                year   : null,
                week   : true,
                day    : null,
                month  : null
            }
        });
        t.firesOnce(calendar, 'dateChange');

        await t.click('.b-dayview-day-detail.b-calendar-cell[data-date="2019-10-11"]');
    });

    t.it('autoCreate all day part', async t => {
        eventStore = new EventStore({
            data              : [],
            defaultCalendarId : 'r2'
        });

        resourceStore = new ResourceStore({
            data : [{
                id   : 'r1',
                name : 'Calendar 1'
            }, {
                id   : 'r2',
                name : 'Calendar 2'
            }]
        });

        calendar = await t.getCalendar({
            date     : new Date(2019, 9, 7),
            eventStore,
            resourceStore,
            sidebar  : false,
            features : {
                eventTooltip : false,
                eventEdit    : false
            },
            modes : {
                agenda : null,
                year   : null,
                week   : true,
                day    : null,
                month  : null
            }
        });
        t.selectorCountIs('.b-cal-event-wrap', 0, 'No events');

        t.chain(
            { dblclick : '.b-cal-cell-header[data-header-date="2019-10-07"]' },

            { waitForSelector : '.b-cal-event-wrap.b-allday' },

            next => {
                t.is(calendar.eventStore.count, 1);
                t.selectorCountIs('.b-cal-event-wrap:contains(New event)', 1, '1 event');

                const newEvent = calendar.eventStore.first;

                t.is(newEvent.startDate, new Date(2019, 9, 7), 'Correct start date');
                t.is(newEvent.endDate, new Date(2019, 9, 8), 'Correct end date');
                t.is(newEvent.allDay, true, 'Correctly and allDay event');
                t.is(newEvent.resource, calendar.resourceStore.getAt(1), 'Correct resource');

                calendar.autoCreate = false;
                next();
            },

            { dblclick : '.b-cal-cell-header[data-header-date="2019-10-08"]' },

            next => {
                t.is(calendar.eventStore.count, 1, 'Still one event, autoCreate disabled');
                t.selectorCountIs('.b-cal-event-wrap', 1, 'Still one event, autoCreate disabled');

                calendar.autoCreate = 'click';
                next();
            },

            // Step over the click block time
            { waitFor : 500 },

            { click : '.b-cal-cell-header[data-header-date="2019-10-08"]' },

            { waitFor : () => calendar.activeView.element.querySelectorAll('.b-cal-event-wrap').length === 2 },

            () => {
                t.is(calendar.eventStore.count, 2);
                t.selectorCountIs('.b-cal-event-wrap:contains(New event)', 2, 'Two events');

                const newEvent = calendar.eventStore.getAt(1);

                t.is(newEvent.startDate, new Date(2019, 9, 8), 'Correct start date');
                t.is(newEvent.endDate, new Date(2019, 9, 9), 'Correct end date');
                t.is(newEvent.resource, calendar.resourceStore.getAt(1), 'Correct resource');
            }
        );
    });

    t.it('showAllDayHeader : false', async t => {
        // Let's only see interDay events so as not to clutter the UI any more than necessary
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows.filter(e => {
                const event = new EventModel(e);
                return event.isInterDay;
            }).concat([{
                duration     : 8,
                durationUnit : 'hour',
                id           : 'overnighter',
                name         : 'Party',
                startDate    : new Date(2019, 9, 18, 20)
            }])
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await t.getCalendar({
            eventStore,
            resourceStore,
            date     : new Date(2019, 9, 14),
            sidebar  : false,
            features : {
                eventTooltip : false
            },
            modes : {
                agenda : null,
                year   : null,
                week   : {
                    visibleStartTime : 0,
                    showAllDayHeader : false
                },
                day   : null,
                month : null
            }
        });

        // Event 1 is spread over 6 days
        t.selectorCountIs('.b-dayview-day-detail.b-calendar-cell .b-cal-event-wrap.b-allday[data-event-id="1"]', 6);
        document.querySelectorAll('.b-dayview-day-detail.b-calendar-cell .b-cal-event-wrap.b-allday[data-event-id="1"]').forEach(e => {
            t.is(e.offsetHeight, calendar.modes.week.dayContainerElement.offsetHeight);
        });

        // Event 3 is spread over 1 day
        t.selectorCountIs('.b-dayview-day-detail.b-calendar-cell .b-cal-event-wrap.b-allday[data-event-id="3"]', 1);
        document.querySelectorAll('.b-dayview-day-detail.b-calendar-cell .b-cal-event-wrap.b-allday[data-event-id="3"]').forEach(e => {
            t.is(e.offsetHeight, calendar.modes.week.dayContainerElement.offsetHeight);
        });

        // The first four hours of the all night party is represented on Friday
        t.selectorCountIs('.b-dayview-day-detail.b-calendar-cell[data-date="2019-10-18"] .b-cal-event-wrap.b-allday[data-event-id="overnighter"]', 1);
        const p1 = document.querySelector('.b-dayview-day-detail.b-calendar-cell[data-date="2019-10-18"] .b-cal-event-wrap.b-allday[data-event-id="overnighter"]');
        t.is(p1.offsetHeight, calendar.modes.week.hourHeight * 4);
        t.is(p1.offsetTop, calendar.modes.week.hourHeight * 20);

        // The last four hours of the all night party is represented on Saturday
        t.selectorCountIs('.b-dayview-day-detail.b-calendar-cell[data-date="2019-10-19"] .b-cal-event-wrap.b-allday[data-event-id="overnighter"]', 1);
        const p2 = document.querySelector('.b-dayview-day-detail.b-calendar-cell[data-date="2019-10-19"] .b-cal-event-wrap.b-allday[data-event-id="overnighter"]');
        t.is(p2.offsetHeight, calendar.modes.week.hourHeight * 4);
        t.is(p2.offsetTop, 0);

        await t.doubleClick('.b-cal-cell-header');

        await t.waitFor(() => calendar.features.eventEdit.editor?.containsFocus);

        t.pass('No errors thrown');
    });

    t.it('overflowButtonRenderer', async t => {
        eventStore = t.getEventStore({
            data : [{
                id         : 'event1',
                cls        : 'event1',
                resourceId : 'r1',
                name       : 'Assignment 1',
                color      : 'red',
                startDate  : new Date(2011, 0, 10, 9),
                endDate    : new Date(2011, 0, 10, 10),
                allDay     : true
            }, {
                id         : 'event2',
                cls        : 'event2',
                resourceId : 'r1',
                name       : 'Assignment 2',
                color      : '#f1c114',
                startDate  : new Date(2011, 0, 10, 10),
                endDate    : new Date(2011, 0, 10, 11),
                allDay     : true
            }, {
                id         : 'event3',
                cls        : 'event3',
                resourceId : 'r1',
                name       : 'Assignment 3',
                color      : 'green',
                startDate  : new Date(2011, 0, 10, 11),
                endDate    : new Date(2011, 0, 10, 12),
                allDay     : true
            }, {
                id         : 'event4',
                cls        : 'event4',
                resourceId : 'r1',
                name       : 'Assignment 4',
                color      : 'blue',
                startDate  : new Date(2011, 0, 10, 12),
                endDate    : new Date(2011, 0, 10, 13),
                allDay     : true
            }, {
                id         : 'event5',
                cls        : 'event5',
                resourceId : 'r1',
                name       : 'Assignment 5',
                color      : 'indigo',
                startDate  : new Date(2011, 0, 10, 13),
                endDate    : new Date(2011, 0, 10, 14),
                allDay     : true
            }]
        });

        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Mike',  eventColor : 'red' }
            ]
        });

        calendar = await t.getCalendar({
            eventStore,
            resourceStore,
            sidebar : false,
            width   : 1000,
            height  : 750,
            date    : new Date(2011, 0, 10),
            mode    : 'week',
            modes   : {
                week : {
                    overflowButtonRenderer(buttonConfig, count) {
                        buttonConfig.className['b-fa'] = buttonConfig.className['b-fa-list'] = 1;
                        buttonConfig.text = `overflow by ${count}`;
                        buttonConfig.style.justifyContent = 'unset';

                        return buttonConfig;
                    }
                }
            }
        });

        // WeekViews should pass overflowButtonRenderer down to its allDayEvents widget
        t.selectorExists('.b-calendar-cell.b-dayview-allday .b-cal-cell-overflow.b-fa-list.b-fa:contains(overflow by 3)');
    });

    t.it('reconfiguring overflowPopup', async t => {
        eventStore = t.getEventStore({
            data : [{
                id         : 'event1',
                cls        : 'event1',
                resourceId : 'r1',
                name       : 'Assignment 1',
                color      : 'red',
                startDate  : new Date(2011, 0, 10, 9),
                endDate    : new Date(2011, 0, 10, 10),
                allDay     : true
            }, {
                id         : 'event2',
                cls        : 'event2',
                resourceId : 'r1',
                name       : 'Assignment 2',
                color      : '#f1c114',
                startDate  : new Date(2011, 0, 10, 10),
                endDate    : new Date(2011, 0, 10, 11),
                allDay     : true
            }, {
                id         : 'event3',
                cls        : 'event3',
                resourceId : 'r1',
                name       : 'Assignment 3',
                color      : 'green',
                startDate  : new Date(2011, 0, 10, 11),
                endDate    : new Date(2011, 0, 10, 12),
                allDay     : true
            }, {
                id         : 'event4',
                cls        : 'event4',
                resourceId : 'r1',
                name       : 'Assignment 4',
                color      : 'blue',
                startDate  : new Date(2011, 0, 10, 12),
                endDate    : new Date(2011, 0, 10, 13),
                allDay     : true
            }, {
                id         : 'event5',
                cls        : 'event5',
                resourceId : 'r1',
                name       : 'Assignment 5',
                color      : 'indigo',
                startDate  : new Date(2011, 0, 10, 13),
                endDate    : new Date(2011, 0, 10, 14),
                allDay     : true
            }]
        });

        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Mike',  eventColor : 'red' }
            ]
        });

        calendar = await t.getCalendar({
            eventStore,
            resourceStore,
            sidebar : false,
            width   : 1000,
            height  : 750,
            date    : new Date(2011, 0, 10),
            mode    : 'week',
            modes   : {
                week : {
                    overflowPopup : {
                        eventList : false,
                        items     : {
                            testWidget : {
                                cls  : 'test-class',
                                html : 'There is overflow'
                            }
                        }
                    }
                }
            }
        });
        t.firesOnce(calendar.modes.week, 'showOverflowPopup');

        await t.click('.b-cal-cell-overflow');

        // Popup is there with extra content
        await t.waitForSelector('.b-overflowpopup .test-class:contains(There is overflow)');

        // eventList has been configured away
        t.selectorNotExists('.b-overflowpopup [data-ref="eventList"]');

        // WeekView exposes the overflowPopup from its allDayEvents as a convenience
        t.ok(calendar.modes.week.overflowPopup.isOverflowPopup);
    });

    t.it('vetoing overflowPopup', async t => {
        eventStore = t.getEventStore({
            data : [{
                id         : 'event1',
                cls        : 'event1',
                resourceId : 'r1',
                name       : 'Assignment 1',
                color      : 'red',
                startDate  : new Date(2011, 0, 10, 9),
                endDate    : new Date(2011, 0, 10, 10),
                allDay     : true
            }, {
                id         : 'event2',
                cls        : 'event2',
                resourceId : 'r1',
                name       : 'Assignment 2',
                color      : '#f1c114',
                startDate  : new Date(2011, 0, 10, 10),
                endDate    : new Date(2011, 0, 10, 11),
                allDay     : true
            }, {
                id         : 'event3',
                cls        : 'event3',
                resourceId : 'r1',
                name       : 'Assignment 3',
                color      : 'green',
                startDate  : new Date(2011, 0, 10, 11),
                endDate    : new Date(2011, 0, 10, 12),
                allDay     : true
            }, {
                id         : 'event4',
                cls        : 'event4',
                resourceId : 'r1',
                name       : 'Assignment 4',
                color      : 'blue',
                startDate  : new Date(2011, 0, 10, 12),
                endDate    : new Date(2011, 0, 10, 13),
                allDay     : true
            }, {
                id         : 'event5',
                cls        : 'event5',
                resourceId : 'r1',
                name       : 'Assignment 5',
                color      : 'indigo',
                startDate  : new Date(2011, 0, 10, 13),
                endDate    : new Date(2011, 0, 10, 14),
                allDay     : true
            }]
        });

        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Mike',  eventColor : 'red' }
            ]
        });

        calendar = await t.getCalendar({
            eventStore,
            resourceStore,
            sidebar : false,
            width   : 1000,
            height  : 750,
            date    : new Date(2011, 0, 10),
            mode    : 'week',
            modes   : {
                week : {
                    overflowPopup : {
                        eventList : false,
                        items     : {
                            testWidget : {
                                cls  : 'test-class',
                                html : 'There is overflow'
                            }
                        }
                    },
                    listeners : {
                        beforeShowOverflowPopup() {
                            return false;
                        }
                    }
                }
            }
        });

        await t.click('.b-cal-cell-overflow');

        // Wait for any erroneous show of the overflow popup
        await t.waitFor(100);

        // Popup is not visible. It gets rendered because the showOverflowPopup event includes it
        t.selectorNotExists('.b-overflowpopup:visible');
    });

    t.it('Expanding on cell overflow click', async t => {
        eventStore = t.getEventStore({
            data : [{
                id         : 'event1',
                cls        : 'event1',
                resourceId : 'r1',
                name       : 'Assignment 1',
                color      : 'red',
                startDate  : new Date(2011, 0, 10, 9),
                endDate    : new Date(2011, 0, 10, 10),
                allDay     : true
            }, {
                id         : 'event2',
                cls        : 'event2',
                resourceId : 'r1',
                name       : 'Assignment 2',
                color      : '#f1c114',
                startDate  : new Date(2011, 0, 10, 10),
                endDate    : new Date(2011, 0, 10, 11),
                allDay     : true
            }, {
                id         : 'event3',
                cls        : 'event3',
                resourceId : 'r1',
                name       : 'Assignment 3',
                color      : 'green',
                startDate  : new Date(2011, 0, 10, 11),
                endDate    : new Date(2011, 0, 10, 12),
                allDay     : true
            }, {
                id         : 'event4',
                cls        : 'event4',
                resourceId : 'r1',
                name       : 'Assignment 4',
                color      : 'blue',
                startDate  : new Date(2011, 0, 10, 12),
                endDate    : new Date(2011, 0, 10, 13),
                allDay     : true
            }, {
                id         : 'event5',
                cls        : 'event5',
                resourceId : 'r1',
                name       : 'Assignment 5',
                color      : 'indigo',
                startDate  : new Date(2011, 0, 10, 13),
                endDate    : new Date(2011, 0, 10, 14),
                allDay     : true
            }]
        });

        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Mike',  eventColor : 'red' }
            ]
        });

        calendar = await t.getCalendar({
            eventStore,
            resourceStore,
            sidebar : false,
            width   : 1000,
            height  : 750,
            date    : new Date(2011, 0, 10),
            mode    : 'week',
            modes   : {
                week : {
                    // This is passed into the allDayEvents child widget.
                    overflowClickAction : 'expand',
                    listeners           : {
                        beforeShowOverflowPopup() {
                            return false;
                        }
                    }
                }
            }
        });
        const allDayHeight = calendar.modes.week.allDayEvents.height;

        await t.click('.b-cal-cell-overflow');

        // Wait for any erroneous show of the overflow popup
        await t.waitFor(100);

        await t.waitForAnimations();

        // Popup is not visible. It gets rendered because the showOverflowPopup event includes it
        t.selectorNotExists('.b-overflowpopup:visible');

        // All day row expanded
        t.isGreater(calendar.modes.week.allDayEvents.height, allDayHeight);
    });

    t.it('overflowPopup configured away', async t => {
        eventStore = t.getEventStore({
            data : [{
                id         : 'event1',
                cls        : 'event1',
                resourceId : 'r1',
                name       : 'Assignment 1',
                color      : 'red',
                startDate  : new Date(2011, 0, 10, 9),
                endDate    : new Date(2011, 0, 10, 10),
                allDay     : true
            }, {
                id         : 'event2',
                cls        : 'event2',
                resourceId : 'r1',
                name       : 'Assignment 2',
                color      : '#f1c114',
                startDate  : new Date(2011, 0, 10, 10),
                endDate    : new Date(2011, 0, 10, 11),
                allDay     : true
            }, {
                id         : 'event3',
                cls        : 'event3',
                resourceId : 'r1',
                name       : 'Assignment 3',
                color      : 'green',
                startDate  : new Date(2011, 0, 10, 11),
                endDate    : new Date(2011, 0, 10, 12),
                allDay     : true
            }, {
                id         : 'event4',
                cls        : 'event4',
                resourceId : 'r1',
                name       : 'Assignment 4',
                color      : 'blue',
                startDate  : new Date(2011, 0, 10, 12),
                endDate    : new Date(2011, 0, 10, 13),
                allDay     : true
            }, {
                id         : 'event5',
                cls        : 'event5',
                resourceId : 'r1',
                name       : 'Assignment 5',
                color      : 'indigo',
                startDate  : new Date(2011, 0, 10, 13),
                endDate    : new Date(2011, 0, 10, 14),
                allDay     : true
            }]
        });

        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Mike',  eventColor : 'red' }
            ]
        });

        calendar = await t.getCalendar({
            eventStore,
            resourceStore,
            sidebar : false,
            width   : 1000,
            height  : 750,
            date    : new Date(2011, 0, 10),
            mode    : 'week',
            modes   : {
                week : {
                    overflowPopup : null
                }
            }
        });

        await t.click('.b-cal-cell-overflow');

        // Wait for any erroneous show of the overflow popup
        await t.waitFor(100);

        // Popup is not there
        t.selectorNotExists('.b-overflowpopup');
    });

    t.it('overflowPopup with eventRenderer', async t => {
        eventStore = t.getEventStore({
            data : [{
                id         : 'event1',
                cls        : 'event1',
                resourceId : 'r1',
                name       : 'Assignment 1',
                color      : 'red',
                startDate  : new Date(2011, 0, 10, 9),
                endDate    : new Date(2011, 0, 10, 10),
                allDay     : true
            }, {
                id         : 'event2',
                cls        : 'event2',
                resourceId : 'r1',
                name       : 'Assignment 2',
                color      : '#f1c114',
                startDate  : new Date(2011, 0, 10, 10),
                endDate    : new Date(2011, 0, 10, 11),
                allDay     : true
            }, {
                id         : 'event3',
                cls        : 'event3',
                resourceId : 'r1',
                name       : 'Assignment 3',
                color      : 'green',
                startDate  : new Date(2011, 0, 10, 11),
                endDate    : new Date(2011, 0, 10, 12),
                allDay     : true
            }, {
                id         : 'event4',
                cls        : 'event4',
                resourceId : 'r1',
                name       : 'Assignment 4',
                color      : 'blue',
                startDate  : new Date(2011, 0, 10, 12),
                endDate    : new Date(2011, 0, 10, 13),
                allDay     : true
            }, {
                id         : 'event5',
                cls        : 'event5',
                resourceId : 'r1',
                name       : 'Assignment 5',
                color      : 'indigo',
                startDate  : new Date(2011, 0, 10, 13),
                endDate    : new Date(2011, 0, 10, 14),
                allDay     : true
            }]
        });

        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Mike',  eventColor : 'red' }
            ]
        });

        calendar = await t.getCalendar({
            eventStore,
            resourceStore,
            sidebar : false,
            width   : 1000,
            height  : 750,
            date    : new Date(2011, 0, 10),
            mode    : 'week',
            modes   : {
                week : {
                    overflowPopup : {
                        eventRenderer({ eventRecord, renderData }) {
                            renderData.cls['b-overflow-event'] = 1;
                        }
                    }
                }
            }
        });

        await t.click('.b-cal-cell-overflow');

        // Wait for custom rendered events
        await t.waitForSelector('.b-overflowpopup .b-cal-event-wrap.b-overflow-event');
        t.selectorCountIs('.b-overflowpopup .b-cal-event-wrap.b-overflow-event', 5);
    });

    t.it('dayCellRenderer as a string', async t => {
        calendar = await t.getCalendar({
            sidebar : null,
            date    : new Date(2021, 11, 8),
            modes   : {
                week : {
                    dayCellRenderer : 'up.fixDayCell'
                }
            },
            fixDayCell(domConfig, { day }) {
                // Scope correct
                t.ok(this.isCalendar);

                if (day === 3) {
                    domConfig.className['wednesday'] = 1;
                }
                return domConfig;
            }
        });

        // Wait for layout to be correct
        await t.waitForAnimationFrame();

        t.selectorCountIs('.b-dayview-day-detail.b-calendar-cell.wednesday', 1);
        t.selectorExists('.b-dayview-day-detail.b-calendar-cell[data-date="2021-12-08"].wednesday');
    });

    t.it('dayCellRenderer as a function', async t => {
        calendar = await t.getCalendar({
            sidebar : null,
            date    : new Date(2021, 11, 8),
            modes   : {
                week : {
                    dayCellRenderer : function(domConfig, { day }) {
                        // Scope correct
                        t.ok(this.isWeekView);

                        if (day === 3) {
                            domConfig.className['wednesday'] = 1;
                        }
                        return domConfig;
                    }
                }
            }
        });

        // Wait for layout to be correct
        await t.waitForAnimationFrame();

        t.selectorCountIs('.b-dayview-day-detail.b-calendar-cell.wednesday', 1);
        t.selectorExists('.b-dayview-day-detail.b-calendar-cell[data-date="2021-12-08"].wednesday');
    });

    t.it('dayHeaderRenderer as a function', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await t.getCalendar({
            eventStore,
            resourceStore,
            date     : new Date(2019, 9, 14),
            sidebar  : false,
            features : {
                eventTooltip : false,
                eventEdit    : false
            },
            modes : {
                agenda : null,
                year   : null,
                week   : {
                    dayHeaderRenderer(headerDomConfig, cellData) {
                        headerDomConfig.className['foo'] = 1;
                        headerDomConfig.children.push({
                            className : 'bar'
                        });
                    }
                },
                day   : null,
                month : null
            }
        });

        // Day headers all modified correctly
        t.selectorCountIs('.b-cal-cell-header.foo .bar', 7);

        // Check that theme's weekend colour is being applied.
        t.hasStyle('.b-cal-cell-header[data-header-date="2019-10-13"] > *', 'color', 'rgb(244, 67, 54)');
        t.hasStyle('.b-cal-cell-header[data-header-date="2019-10-19"] > *', 'color', 'rgb(244, 67, 54)');
    });

    t.it('dayHeaderRenderer as a string', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await t.getCalendar({
            eventStore,
            resourceStore,
            date     : new Date(2019, 9, 14),
            sidebar  : false,
            features : {
                eventTooltip : false,
                eventEdit    : false
            },
            modes : {
                agenda : null,
                year   : null,
                week   : {
                    dayHeaderRenderer : 'up.fixCellHeader'
                },
                day   : null,
                month : null
            },
            fixCellHeader(headerDomConfig, cellData) {
                headerDomConfig.className['foo'] = 1;
                headerDomConfig.children.push({
                    className : 'bar'
                });
            }
        });

        // Day headers all modified correctly
        t.selectorCountIs('.b-cal-cell-header.foo .bar', 7);

        // Check that theme's weekend colour is being applied.
        t.hasStyle('.b-cal-cell-header[data-header-date="2019-10-13"] > *', 'color', 'rgb(244, 67, 54)');
        t.hasStyle('.b-cal-cell-header[data-header-date="2019-10-19"] > *', 'color', 'rgb(244, 67, 54)');
    });

    t.it('Week view showing today when shifted', async t => {
        eventStore = new EventStore({
            data : []
        });

        resourceStore = new ResourceStore({
            data : []
        });

        const todayStart = new DayTime(64800000).startOfDay(new Date());

        calendar = await t.getCalendar({
            eventStore,
            resourceStore,
            date     : todayStart,
            sidebar  : false,
            features : {
                eventTooltip : false,
                eventEdit    : false
            },
            modes : {
                agenda : null,
                year   : null,
                week   : {
                    dayStartShift    : 18,
                    visibleStartTime : 18
                },
                day   : null,
                month : null
            }
        });

        // The "today" column must be correctly identified
        t.selectorCountIs('.b-dayview-day-detail.b-calendar-cell.b-today .b-current-time-indicator', 1);
    });

    // https://github.com/bryntum/support/issues/4103
    t.it('Should maintain weekStartDay when using prev/next buttons', async t => {
        calendar = await t.getCalendar({
            sidebar      : false,
            weekStartDay : 1,
            modes        : {
                agenda : null,
                year   : null,
                week   : true,
                day    : null,
                month  : null
            }
        });

        await t.waitForSelector('.b-cal-cell-header:first-child:contains(Mon)');
        await t.click('.b-icon-next');
        await t.waitForSelector('.b-cal-cell-header:first-child:contains(Mon)');

        t.is(calendar.activeView.month.weekStartDay, 1, 'month of WeekView has correct value');
    });

    t.it('should resort events clipped to start of day', async t => {
        calendar = await t.getCalendar({
            date    : '2022-02-13',
            mode    : 'week',
            sidebar : null,
            modes   : {
                week : {
                    showAllDayHeader : false,
                    dayStartTime     : 6,
                    dayEndTime       : 20
                }
            },
            events : [
                {
                    id        : 1,
                    name      : 'Event 1',
                    startDate : '2022-02-14T11:00',
                    endDate   : '2022-02-14T16:00'
                },
                {
                    id        : 2,
                    name      : 'Event 2',
                    startDate : '2022-02-14T16:00',
                    endDate   : '2022-02-15T21:00'
                },
                {
                    id        : 3,
                    name      : 'Event 3',
                    startDate : '2022-02-14T11:30',
                    endDate   : '2022-02-15T12:00'
                }
            ]
        });

        await t.waitForSelector('.b-calendar-cell[data-date="2022-02-14"]');

        const event2El = document.querySelector('[data-date="2022-02-15"] .b-cal-event-wrap[data-event-id="2"]');
        const event3El = document.querySelector('[data-date="2022-02-15"] .b-cal-event-wrap[data-event-id="3"]');

        t.is(event2El.offsetLeft, 0, 'Event 2 has left = 0');
        t.ok(event2El.offsetLeft < event3El.offsetLeft, 'Event 3 has left > 0');
    });

    t.it('should resort events with duration clipped to start of day', async t => {
        calendar = await t.getCalendar({
            date    : '2022-02-13',
            mode    : 'week',
            sidebar : null,
            modes   : {
                week : {
                    showAllDayHeader : false,
                    dayStartTime     : 6,
                    dayEndTime       : 20
                }
            },
            events : [
                {
                    id        : 1,
                    name      : 'Event 1',
                    startDate : '2022-02-14T07:00',
                    endDate   : '2022-02-14T16:00'
                },
                {
                    id        : 2,
                    name      : 'Event 2',
                    startDate : '2022-02-14T16:00',
                    endDate   : '2022-02-15T18:00'
                },
                // event3.duration > event2.duration until we clip startDate to Tues, Feb 15 midnight
                {
                    id        : 3,
                    name      : 'Event 3',
                    startDate : '2022-02-14T07:30',
                    endDate   : '2022-02-15T12:00'
                }
            ]
        });

        await t.waitForSelector('.b-calendar-cell[data-date="2022-02-14"]');

        const event2El = document.querySelector('[data-date="2022-02-15"] .b-cal-event-wrap[data-event-id="2"]');
        const event3El = document.querySelector('[data-date="2022-02-15"] .b-cal-event-wrap[data-event-id="3"]');

        t.is(event2El.offsetLeft, 0, 'Event 2 has left = 0');
        t.ok(event2El.offsetLeft < event3El.offsetLeft, 'Event 3 has left > 0');
    });

    // DayView's cellMapEventFilter must include zero duration allDay events which its dayTime object
    // rejects as not being intraDay.
    // And filtering intersecting occurrences in EventStoreMixin.getEvents must include zero duration
    // allDay events.
    t.it('Should render zero-duration events which are allDay', async t => {
        calendar = await t.getCalendar({
            date   : '2022-05-25',
            mode   : 'week',
            events : [
                {
                    id             : 1,
                    name           : 'Dave\'s birthday',
                    startDate      : '1980-05-25',
                    allDay         : true,
                    recurrenceRule : 'FREQ=YEARLY'
                }
            ]
        });
        const weekView = calendar.activeView;

        // Future occurrence must render
        await t.waitForSelector('.b-calendarrow-cell-container .b-calendar-cell[data-date="2022-05-25"] .b-cal-event-wrap.b-allday:contains(Dave\'s birthday)');

        weekView.date = '1980-05-25';

        // Event base must render
        await t.waitForSelector('.b-calendarrow-cell-container .b-calendar-cell[data-date="1980-05-25"] .b-cal-event-wrap.b-allday:contains(Dave\'s birthday)');
    });

    t.it('minDayWidth', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows.filter(e => !e.allDay)
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await t.getCalendar({
            eventStore,
            resourceStore,
            date     : new Date(2019, 9, 14),
            sidebar  : false,
            features : {
                eventTooltip : false
            },
            modes : {
                agenda : null,
                year   : null,
                day    : null,
                month  : null
            }
        });
        const
            weekView  = calendar.activeView,
            allDayRow = weekView.allDayEvents;

        // No overflow, so no virtual scroller
        t.selectorNotExists('.b-virtual-scroller:visible');

        // Make day columns too wide to fit
        weekView.minDayWidth = 200;

        await t.waitForSelector('.b-virtual-scroller:visible');

        // Virtual scrollbar must have 7*200 content scrollable.
        t.is(weekView.scrollbarScroller.scrollWidth, 1400);

        await weekView.scrollTo(new Date('2019-10-19T07:00'));

        // That should have scrolled ll the way to the right
        t.is(weekView.horizontalScroller.x, weekView.horizontalScroller.maxX);

        // CalendarRow must be in sync
        t.is(allDayRow.headerScroller.scrollWidth, 1400);
        t.is(allDayRow.scrollable.scrollWidth, 1400);
    });

    t.it('OverflowPopup should render overflowing events correctly', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await t.getCalendar({
            eventStore,
            resourceStore,
            date     : new Date(2019, 9, 14),
            sidebar  : false,
            features : {
                eventTooltip : false,
                eventEdit    : false
            },
            modes : {
                agenda : null,
                year   : null,
                day    : null,
                month  : null
            }
        });
        const
            hackathon = calendar.eventStore.getById(1),
            e1 = [2, 4, 5, 6],
            e2 = [21, 22, 25, 26];

        hackathon.set({
            startDate : DateHelper.add(hackathon.startDate, -10, 'd'),
            endDate   : DateHelper.add(hackathon.endDate, 10, 'd')
        });
        e1.forEach(e => {
            calendar.eventStore.getById(e).set({
                startDate : '2019-10-13',
                allDay    : true
            });
        });
        e2.forEach(e => {
            calendar.eventStore.getById(e).set({
                startDate : '2019-10-19',
                allDay    : true
            });
        });

        await t.click('[data-date="2019-10-13"] .b-cal-cell-overflow');

        // Ensure all elements are marked up with time information and that the event's overflow status is correct
        await t.waitForSelector('.b-overflowpopup .b-cal-event-bar-container[data-date="2019-10-13"].b-day-of-week-0 .b-cal-event-wrap[data-event-id="1"].b-continues-past.b-continues-future');

        await t.click('[data-date="2019-10-19"] .b-cal-cell-overflow');

        // Ensure all elements are marked up with time information and that the event's overflow status is correct
        await t.waitForSelector('.b-overflowpopup .b-cal-event-bar-container[data-date="2019-10-19"].b-day-of-week-6 .b-cal-event-wrap[data-event-id="1"].b-continues-past.b-continues-future');
    });

    // https://github.com/bryntum/support/issues/5333
    t.it('today can be a hidden non working day', async t => {
        calendar = await t.getCalendar({
            date  : new Date(),
            modes : {
                day    : false,
                month  : false,
                year   : false,
                agenda : false
            },
            nonWorkingDays : {
                [new Date().getDay()] : true
            },
            modeDefaults : {
                hideNonWorkingDays : true
            }
        });
        t.selectorNotExists('.b-current-time-indicator');
    });

    // https://github.com/bryntum/support/issues/5827
    t.it('hidden week start day', async t => {
        calendar = await t.getCalendar({
            date   : new Date(2022, 10, 22),
            events : [{
                startDate    : '2022-11-25T07:00',
                duration     : 7,
                durationUnit : 'd',
                name         : 'TTTT1',
                eventColor   : 'yellow',
                draggable    : false
            }, {
                startDate    : '2022-11-26T09:00',
                duration     : 4,
                durationUnit : 'd',
                name         : 'TTTT2',
                eventColor   : 'orange',
                draggable    : false
            }],
            hideNonWorkingDays : true,
            sidebar            : false,
            features           : {
                eventTooltip : false,
                eventEdit    : false
            },
            modes : {
                agenda : null,
                year   : null,
                week   : true,
                day    : null,
                month  : null
            }
        });

        await t.waitForSelector('.b-cal-event-wrap');

        await t.click('button[data-ref="nextButton"]');

        t.pass('No error thrown');
    });

    // https://github.com/bryntum/support/issues/6043
    t.describe('coreHours', async t => {
        const coreHours = [{
                start : 4,
                end   : 14
            }, {
                start : 5,
                end   : 15
            }, {
                start : 6,
                end   : 16
            }, {
                start : 7,
                end   : 17
            }, {
                start : 8,
                end   : 18
            }, {
                start : 9,
                end   : 19
            }, {
                start : 10,
                end   : 20
            }],
            coreHoursTimes = [{
                start : '04:00',
                end   : '14:00'
            }, {
                start : '05:00',
                end   : '15:00'
            }, {
                start : '06:00',
                end   : '16:00'
            }, {
                start : '07:00',
                end   : '17:00'
            }, {
                start : '08:00',
                end   : '18:00'
            }, {
                start : '09:00',
                end   : '19:00'
            }, {
                start : '10:00',
                end   : '20:00'
            }],
            normalBrowserBackgrounds = [
                'linear-gradient(rgba(135, 135, 135, 0.1) 0%, rgba(135, 135, 135, 0.1) 16.67%, rgba(0, 0, 0, 0) 16.67%, rgba(0, 0, 0, 0) 58.33%, rgba(135, 135, 135, 0.1) 58.33%, rgba(135, 135, 135, 0.1) 100%)',
                'linear-gradient(rgba(135, 135, 135, 0.1) 0%, rgba(135, 135, 135, 0.1) 20.83%, rgba(0, 0, 0, 0) 20.83%, rgba(0, 0, 0, 0) 62.5%, rgba(135, 135, 135, 0.1) 62.5%, rgba(135, 135, 135, 0.1) 100%)',
                'linear-gradient(rgba(135, 135, 135, 0.1) 0%, rgba(135, 135, 135, 0.1) 25%, rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 0) 66.67%, rgba(135, 135, 135, 0.1) 66.67%, rgba(135, 135, 135, 0.1) 100%)',
                'linear-gradient(rgba(135, 135, 135, 0.1) 0%, rgba(135, 135, 135, 0.1) 29.17%, rgba(0, 0, 0, 0) 29.17%, rgba(0, 0, 0, 0) 70.83%, rgba(135, 135, 135, 0.1) 70.83%, rgba(135, 135, 135, 0.1) 100%)',
                'linear-gradient(rgba(135, 135, 135, 0.1) 0%, rgba(135, 135, 135, 0.1) 33.33%, rgba(0, 0, 0, 0) 33.33%, rgba(0, 0, 0, 0) 75%, rgba(135, 135, 135, 0.1) 75%, rgba(135, 135, 135, 0.1) 100%)',
                'linear-gradient(rgba(135, 135, 135, 0.1) 0%, rgba(135, 135, 135, 0.1) 37.5%, rgba(0, 0, 0, 0) 37.5%, rgba(0, 0, 0, 0) 79.17%, rgba(135, 135, 135, 0.1) 79.17%, rgba(135, 135, 135, 0.1) 100%)',
                'linear-gradient(rgba(135, 135, 135, 0.1) 0%, rgba(135, 135, 135, 0.1) 41.67%, rgba(0, 0, 0, 0) 41.67%, rgba(0, 0, 0, 0) 83.33%, rgba(135, 135, 135, 0.1) 83.33%, rgba(135, 135, 135, 0.1) 100%)'
            ],
            safariBackgrounds = [
                'linear-gradient(rgba(135, 135, 135, 0.1) 0%, rgba(135, 135, 135, 0.1) 16.67%, transparent 16.67%, transparent 58.33%, rgba(135, 135, 135, 0.1) 58.33%, rgba(135, 135, 135, 0.1) 100%)',
                'linear-gradient(rgba(135, 135, 135, 0.1) 0%, rgba(135, 135, 135, 0.1) 20.83%, transparent 20.83%, transparent 62.5%, rgba(135, 135, 135, 0.1) 62.5%, rgba(135, 135, 135, 0.1) 100%)',
                'linear-gradient(rgba(135, 135, 135, 0.1) 0%, rgba(135, 135, 135, 0.1) 25%, transparent 25%, transparent 66.67%, rgba(135, 135, 135, 0.1) 66.67%, rgba(135, 135, 135, 0.1) 100%)',
                'linear-gradient(rgba(135, 135, 135, 0.1) 0%, rgba(135, 135, 135, 0.1) 29.17%, transparent 29.17%, transparent 70.83%, rgba(135, 135, 135, 0.1) 70.83%, rgba(135, 135, 135, 0.1) 100%)',
                'linear-gradient(rgba(135, 135, 135, 0.1) 0%, rgba(135, 135, 135, 0.1) 33.33%, transparent 33.33%, transparent 75%, rgba(135, 135, 135, 0.1) 75%, rgba(135, 135, 135, 0.1) 100%)',
                'linear-gradient(rgba(135, 135, 135, 0.1) 0%, rgba(135, 135, 135, 0.1) 37.5%, transparent 37.5%, transparent 79.17%, rgba(135, 135, 135, 0.1) 79.17%, rgba(135, 135, 135, 0.1) 100%)',
                'linear-gradient(rgba(135, 135, 135, 0.1) 0%, rgba(135, 135, 135, 0.1) 41.67%, transparent 41.67%, transparent 83.33%, rgba(135, 135, 135, 0.1) 83.33%, rgba(135, 135, 135, 0.1) 100%)'
            ],
            backgrounds = BrowserHelper.isSafari && BrowserHelper.safariVersion < 16.5 ? safariBackgrounds : normalBrowserBackgrounds;

        t.it('As an Array with hour integers', async t => {
            calendar = await t.getCalendar({
                date  : new Date(2022, 10, 22),
                modes : {
                    agenda : null,
                    year   : null,
                    week   : {
                        fitHours : true
                    },
                    day   : null,
                    month : null
                },
                coreHours
            });

            t.query('.b-calendar-cell.b-dayview-day-detail', calendar.activeView.element).forEach((dayCell, i) => {
                const bi = getComputedStyle(dayCell).backgroundImage;

                t.is(bi, backgrounds[i]);
            });
        });

        t.it('As an Array with hour times', async t => {
            calendar = await t.getCalendar({
                date  : new Date(2022, 10, 22),
                modes : {
                    agenda : null,
                    year   : null,
                    week   : {
                        fitHours : true
                    },
                    day   : null,
                    month : null
                },
                coreHours : coreHoursTimes
            });
            t.query('.b-calendar-cell.b-dayview-day-detail', calendar.activeView.element).forEach((dayCell, i) => {
                const bi = getComputedStyle(dayCell).backgroundImage;

                t.is(bi, backgrounds[i]);
            });
        });

        t.it('As a function', async t => {
            calendar = await t.getCalendar({
                date  : new Date(2022, 10, 22),
                modes : {
                    agenda : null,
                    year   : null,
                    week   : {
                        fitHours : true
                    },
                    day   : null,
                    month : null
                },
                coreHours(date) {
                    return coreHours[date.getDay()];
                }
            });
            t.query('.b-calendar-cell.b-dayview-day-detail', calendar.activeView.element).forEach((dayCell, i) => {
                const bi = getComputedStyle(dayCell).backgroundImage;

                t.is(bi, backgrounds[i]);
            });
        });

        t.it('As a function name', async t => {
            calendar = await t.getCalendar({
                date  : new Date(2022, 10, 22),
                modes : {
                    agenda : null,
                    year   : null,
                    week   : {
                        fitHours : true
                    },
                    day   : null,
                    month : null
                },
                coreHours : 'up.getCoreHours',
                getCoreHours(date) {
                    return coreHours[date.getDay()];
                }
            });
            t.query('.b-calendar-cell.b-dayview-day-detail', calendar.activeView.element).forEach((dayCell, i) => {
                const bi = getComputedStyle(dayCell).backgroundImage;

                t.is(bi, backgrounds[i]);
            });
        });
    });

    // https://github.com/bryntum/support/issues/7057
    t.it('CalendarRow cells ', async t => {
        eventStore = t.getEventStore({
            data : [{
                id         : 'event1',
                cls        : 'event1',
                resourceId : 'r1',
                name       : 'Assignment 1',
                color      : 'red',
                startDate  : new Date(2011, 0, 10, 9),
                endDate    : new Date(2011, 0, 10, 10),
                allDay     : true
            }, {
                id         : 'event2',
                cls        : 'event2',
                resourceId : 'r1',
                name       : 'Assignment 2',
                color      : '#f1c114',
                startDate  : new Date(2011, 0, 10, 10),
                endDate    : new Date(2011, 0, 10, 11),
                allDay     : true
            }, {
                id         : 'event3',
                cls        : 'event3',
                resourceId : 'r1',
                name       : 'Assignment 3',
                color      : 'green',
                startDate  : new Date(2011, 0, 10, 11),
                endDate    : new Date(2011, 0, 10, 12),
                allDay     : true
            }, {
                id         : 'event4',
                cls        : 'event4',
                resourceId : 'r1',
                name       : 'Assignment 4',
                color      : 'blue',
                startDate  : new Date(2011, 0, 10, 12),
                endDate    : new Date(2011, 0, 10, 13),
                allDay     : true
            }, {
                id         : 'event5',
                cls        : 'event5',
                resourceId : 'r1',
                name       : 'Assignment 5',
                color      : 'indigo',
                startDate  : new Date(2011, 0, 10, 13),
                endDate    : new Date(2011, 0, 10, 14),
                allDay     : true
            }]
        });

        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Mike',  eventColor : 'red' }
            ]
        });

        calendar = await t.getCalendar({
            eventStore,
            resourceStore,
            sidebar : false,
            width   : 370,
            height  : 750,
            date    : new Date(2011, 0, 10),
            modes   : {
                day    : null,
                month  : null,
                year   : null,
                agenda : null
            }
        });
        const
            weekView     = calendar.activeView,
            allDayEvents = weekView.allDayEvents;

        // The "+ n more" button must not have forced the all day events cell to expand.
        t.isApproxPx(allDayEvents.getCell('2011-01-10').offsetWidth, weekView.getDayElement('2011-01-10').offsetWidth);
    });
});
