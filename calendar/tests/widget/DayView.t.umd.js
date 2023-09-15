
StartTest(t => {
    const
        iconClasses = [
            'b-fa-circle',
            'b-fa-flag',
            'b-fa-clock',
            'b-fa-cloud',
            'b-fa-cog',
            'b-fa-diamond'
        ];

    let calendar, dayView, eventStore, resourceStore;

    function getDateHours(date) {
        return DateHelper.as('hours', date.getMilliseconds(), 'ms') +
            DateHelper.as('hours', date.getSeconds(), 'second') +
            DateHelper.as('hours', date.getMinutes(), 'minute') +
            date.getHours();
    }

    async function getDayView(t, config, checkSanity = true, data = t.getHackathonData()) {
        eventStore = new EventStore({
            data : data.events.rows
        });

        resourceStore = new ResourceStore({
            data : data.resources.rows
        });

        // Default configuration is the hackathon schedule dataset
        const dayView = await t.getDayView(t, Object.assign({
            eventStore,
            resourceStore,
            width        : 1000,
            height       : 700,
            startDate    : '2019-10-14',
            endDate      : '2019-10-22',
            allDayEvents : {
                eventHeight : 20
            }
        }, config));
        eventStore = dayView.eventStore;
        resourceStore = dayView.resourceStore;

        await t.waitForAnimationFrame();

        if (checkSanity) {
            checkEventSanity(t, dayView);
        }

        return dayView;
    }

    function checkEventSanity(t, dayView) {
        const endDate = new Date(dayView.endDate);

        if (dayView.eventHeight !== 'auto') {
            t.is(dayView.eventHeight, 'auto', 'Setting eventHeight is invalid for DayView');
        }

        // lastVisible date is *inclusive* - it references a *day*, not a timestamp which is
        // what the endDate does.
        endDate.setDate(endDate.getDate() - 1);

        if (dayView.lastVisibleDate - endDate !== 0) {
            t.is(dayView.lastVisibleDate, endDate);
        }

        // DayView uses raw events, not the renderedEvents slots
        const events = [...dayView.cellMap.values()].reduce((v, c) => {
            v.push(...c.events);
            return v;
        }, []);

        events.forEach(event => {
            const eventEl = dayView.getEventElement(event);

            if (eventEl) {
                t.isApproxPx(eventEl.offsetTop,
                    dayView.hourHeight * (getDateHours(event.startDate) - dayView.dayStartHour),
                    `Event ${event.name} top correct`);

                // dayEndTime truncates height.

                if (!dayView.dayEndTime) {
                    t.isApproxPx(eventEl.offsetHeight,
                        DateHelper.as('hours', event.endDate - event.startDate, 'ms') * dayView.hourHeight,
                        `Event ${event.name} height correct`);
                }
            }
        });
    }

    async function ready(t) {
        await t.waitForSelector('.b-dayview-timeaxis-time:first-child:regex(1\\sAM)');
    }

    t.beforeEach(t => {
        calendar = calendar?.destroy();

        if (dayView && !dayView.isDestroyed) {
            if (dayView.timeAxisElement.offsetWidth !== dayView.cornerElement.offsetWidth) {
                t.is(dayView.timeAxisElement.offsetWidth, dayView.cornerElement.offsetWidth, 'TimeAxis column widths correctly synced');
            }
            if (dayView.allDayEvents.scrollable.maxX) {
                t.notOk(dayView.allDayEvents.scrollable.maxX, 'All day row correctly not scrollable');
            }
            dayView.destroy();
        }

        // Check that none of the floating things are persisting
        if (t.query('.b-overflowpopup:visible,.b-sch-event-tooltip, .b-eventeditor').length > 0) {
            t.selectorNotExists('.b-overflowpopup:visible');
            t.selectorNotExists('.b-sch-event-tooltip');
            t.selectorNotExists('.b-eventeditor');
        }
    });

    t.it('sanity', async t => {
        dayView = await getDayView(t);

        // Wait for layout to be correct
        await t.waitForAnimationFrame();

        // This should have no effect.
        dayView.dayContainerElement.scrollTop = 100;

        t.isApproxPx(dayView.dayContainerElement.scrollTop, 0, 'Background el sizing correct, causes no scrolling');

        // The day element is exactly the correct number of pixels high.
        t.isApproxPx(dayView.getDayElement(dayView.startDate).offsetHeight, dayView.hourHeight * dayView.getDayLength('hours'));

        dayView.startHour = 2;

        // Wait for layout to be correct
        await t.waitForAnimationFrame();

        // The day element is exactly the correct number of pixels high.
        t.isApproxPx(
            dayView.getDayElement(dayView.startDate).offsetHeight,
            dayView.hourHeight * dayView.getDayLength('hours'));

        checkEventSanity(t, dayView);
    });

    t.it('As sole view', async t => {
        calendar = await t.getCalendar({
            date  : '2022-02-08',
            modes : {
                week   : null,
                month  : null,
                year   : null,
                agenda : null
            }
        });
        t.is(calendar.activeView.duration, 1);
    });

    t.it('Event desc element shrinkwrap height', async t => {
        calendar = await t.getCalendar({
            events : [{
                // Need descenders to extend the visual text box
                // So use y and g
                name      : 'ygygygy ygygygy ygygygy',
                startDate : '2022-02-08T09:00',
                endDate   : '2022-02-08T11:00'
            }],
            date  : '2022-02-08',
            modes : {
                day    : null,
                month  : null,
                year   : null,
                agenda : null
            }
        });
        const
            eventEl     = calendar.activeView.getEventElement(calendar.eventStore.first),
            eventDescEl = eventEl.querySelector('.b-cal-event-desc');

        // FireFox renders text differently
        const threshold = t.bowser.firefox ? 1 : 0;
        // Shrinkwrapping is exactly correct.
        t.isLessOrEqual(eventDescEl.scrollHeight, eventDescEl.clientHeight + threshold, 'scrollHeight matches clientHeight height');
    });

    t.it('hideNonWorkingDays', async t => {
        calendar = await t.getCalendar({
            date           : '2022-02-08',
            nonWorkingDays : { 0 : true, 3 : true, 6 : true },
            modes          : {
                week : {
                    hideNonWorkingDays : true
                }
            },
            mode : 'week'
        });

        // Wait for layout to be correct
        await t.waitForAnimationFrame();

        await t.dragBy({
            source : '.b-dayview-day-detail.b-calendar-cell[data-date="2022-02-08"]',
            offset : ['50%', 100],
            delta  : [160, 0]
        });

        await t.waitFor(() => calendar.features.eventEdit.editor?.containsFocus);

        await t.type(null, 'New Event[ENTER]');

        const
            event   = calendar.eventStore.first,
            eventEl = calendar.activeView.getEventElement(calendar.eventStore.first);

        // It only covers 2 of the 4 cells (8 & 10) because Sunday, Wednesday (9th) and Saturday are all missing
        t.is(parseInt(eventEl.style.width), 2 / 4 * 100, 'width correct');

        // Runs from Tue 8th to Thu 10th
        t.is(DateHelper.floor(event.startDate, '1 day'), new Date(2022, 1, 8));
        t.is(DateHelper.ceil(event.endDate, '1 day'), new Date(2022, 1, 11));
    });

    t.it('Current time line', async t => {
        dayView = await getDayView(t, {
            height : 500,
            width  : 700,
            date   : new Date()
        });

        t.chain(
            // Wait for layout to be correct
            { waitForAnimationFrame : null },

            () => {
                const indicator = document.querySelector('.b-current-time-indicator');

                // Check that its percentage progress through the day is correct
                t.isApproxPx(DateHelper.getTimeOfDay(new Date()) / (1000 * 60 * 60 * 24) * 100, parseInt(indicator.style.top));
            }
        );
    });

    // t.it('finishnolaterthan', async t => {
    //     // This replicates a test in 01_basic.t.ts to avoid transpiling
    //     const project = new SchedulerProProjectMixin({
    //         eventsData : [{
    //             id             : 10,
    //             startDate      : '2020-03-23T09:00',
    //             duration       : 11,
    //             durationUnit   : 'hours',
    //             constraintDate : '2020-03-26T00:00',
    //             constraintType : 'finishnolaterthan'
    //         }]
    //     });
    //
    //     await project.commitAsync();
    //
    //     const eventRec = project.eventStore.first;
    //
    //     eventRec.durationUnit = 'hours';
    //
    //     t.is(eventRec.durationUnit, 'hour');
    //     t.is(eventRec.startDate, new Date(2020, 2, 23, 9));
    //     t.is(eventRec.endDate, new Date(2020, 2, 23, 20));
    // });

    t.it('Interaction', async t => {
        const eventStore = t.getEventStore({
            data : (function() {
                const events = [];
                for (let i = 1; i <= 5; i++) {
                    events.push({
                        id         : i,
                        cls        : 'event' + i,
                        resourceId : 'r' + i,
                        name       : 'Assignment ' + i,
                        startDate  : new Date(2011, 0, 3 + i, 8 + i),
                        endDate    : new Date(2011, 0, 3 + i, 9 + i),
                        iconCls    : iconClasses[i]
                    });
                }

                return events;
            })()
        });

        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Mike',  eventColor : 'red' },
                { id : 'r2', name : 'Linda', eventColor : 'orange' },
                { id : 'r3', name : 'Don',   eventColor : '#f1c114' },
                { id : 'r4', name : 'Karen', eventColor : 'green' },
                { id : 'r5', name : 'Doug',  eventColor : 'blue' },
                { id : 'r6', name : 'Peter', eventColor : 'indigo' }
            ]
        });

        dayView = await getDayView(t, {
            width     : 1000,
            height    : 750,
            startDate : new Date(2011, 0, 4),
            endDate   : new Date(2011, 0, 9),
            eventStore,
            resourceStore
        });

        [
            'daynumbermousedown',
            'daynumbermouseup',
            'daynumberclick',
            'eventmouseover',
            'eventmousedown',
            'eventmouseup',
            'eventclick'
        ].forEach(eventName => t.firesOnce(dayView, eventName));

        t.chain(
            { click : '.b-cal-cell-header' },

            { click : '.b-cal-event' }
        );
    });

    t.it('Click interaction', async t => {
        dayView = await getDayView(t, {
            height : 500,
            width  : 700
        });

        const dayViewEvents = [];

        dayView.on({
            catchAll(e) {
                if (e.type.toLowerCase().endsWith('click') && e.domEvent) {
                    dayViewEvents.push(e);
                }
            }
        });

        t.chain(
            { click : '.b-dayview-day-content .b-calendar-cell[data-date="2019-10-15"]', offset : ['50%', dayView.hourHeight * 7.5] },

            next => {
                t.is(dayViewEvents[0].date, new Date(2019, 9, 15, 7, 30));

                dayView.dayStartTime = 9;
                dayView.dayEndTime = 17;
                next();
            },

            // Click outside of the day
            { click : () => dayView.dayContainerElement, offset : [-10, '99%'] },

            () => {
                // Which should result in no events, and no error thrown
                t.is(dayViewEvents.length, 1, 'Clicking outside of the day didn\'t fire an event');
            }
        );
    });

    t.it('hideNonworkingDays', async t => {
        const eventStore = t.getEventStore({
            data : (function() {
                const events = [];
                for (let i = 1; i <= 6; i++) {
                    events.push({
                        id         : i,
                        cls        : 'event' + i,
                        resourceId : 'r' + i,
                        name       : 'Assignment ' + i,
                        startDate  : new Date(2011, 0, 3 + i, 8 + i),
                        endDate    : new Date(2011, 0, 3 + i, 9 + i),
                        iconCls    : iconClasses[i]
                    });
                }

                return events;
            })()
        });

        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Mike',  eventColor : 'red' },
                { id : 'r2', name : 'Linda', eventColor : 'orange' },
                { id : 'r3', name : 'Don',   eventColor : '#f1c114' },
                { id : 'r4', name : 'Karen', eventColor : 'green' },
                { id : 'r5', name : 'Doug',  eventColor : 'blue' },
                { id : 'r6', name : 'Peter', eventColor : 'indigo' }
            ]
        });

        dayView = await getDayView(t, {
            width     : 1000,
            height    : 750,
            startDate : new Date(2011, 0, 4),
            endDate   : new Date(2011, 0, 10),
            eventStore,
            resourceStore
        });

        t.is(dayView.eventElements.length, 6);
        t.is(dayView.allDayEvents.weekLength, 6);
        t.selectorCountIs(`.b-dayview-day-container .${dayView.dayCellCls}`, 6);

        dayView.hideNonWorkingDays = true;

        t.is(dayView.eventElements.length, 4);
        t.is(dayView.allDayEvents.weekLength, 4);
        t.selectorCountIs(`.b-dayview-day-container .${dayView.dayCellCls}`, 4);

        dayView.hideNonWorkingDays = false;

        t.is(dayView.eventElements.length, 6);
        t.is(dayView.allDayEvents.weekLength, 6);
        t.selectorCountIs(`.b-dayview-day-container .${dayView.dayCellCls}`, 6);
    });

    t.it('hideNonworkingDays with week starting on Sunday', async t => {
        const eventStore = t.getEventStore({
            data : (function() {
                const events = [];
                for (let i = 1; i <= 7; i++) {
                    events.push({
                        id         : i,
                        cls        : 'event' + i,
                        resourceId : 'r' + i,
                        name       : 'Assignment ' + i,
                        startDate  : new Date(2011, 0, 1 + i, 8 + i),
                        endDate    : new Date(2011, 0, 1 + i, 9 + i),
                        iconCls    : iconClasses[i]
                    });
                }

                return events;
            })()
        });

        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Mike',  eventColor : 'red' },
                { id : 'r2', name : 'Linda', eventColor : 'orange' },
                { id : 'r3', name : 'Don',   eventColor : '#f1c114' },
                { id : 'r4', name : 'Karen', eventColor : 'green' },
                { id : 'r5', name : 'Doug',  eventColor : 'blue' },
                { id : 'r6', name : 'Peter', eventColor : 'indigo' }
            ]
        });

        dayView = await getDayView(t, {
            width     : 1000,
            height    : 750,
            startDate : new Date(2011, 0, 2),
            endDate   : new Date(2011, 0, 9),
            eventStore,
            resourceStore
        });

        t.is(dayView.eventElements.length, 7);
        t.is(dayView.allDayEvents.weekLength, 7);
        t.selectorCountIs(`.b-dayview-day-container .${dayView.dayCellCls}`, 7);
        t.hasCls(dayView.dayContainerElement.children[0], 'b-nonworking-day');
        t.hasCls(dayView.dayContainerElement.children[0], 'b-weekend');
        t.hasCls(dayView.dayContainerElement.children[6], 'b-nonworking-day');
        t.hasCls(dayView.dayContainerElement.children[6], 'b-weekend');

        dayView.hideNonWorkingDays = true;

        t.is(dayView.eventElements.length, 5);
        t.is(dayView.allDayEvents.weekLength, 5);
        t.selectorCountIs(`.b-dayview-day-container .${dayView.dayCellCls}`, 5);
        t.selectorNotExists('.b-calendar-cell.b-nonworking-day');
        t.selectorNotExists('.b-calendar-cell.b-weekend');

        dayView.hideNonWorkingDays = false;

        t.is(dayView.eventElements.length, 7);
        t.is(dayView.allDayEvents.weekLength, 7);
        t.selectorCountIs(`.b-dayview-day-container .${dayView.dayCellCls}`, 7);
        t.hasCls(dayView.dayContainerElement.children[0], 'b-nonworking-day');
        t.hasCls(dayView.dayContainerElement.children[0], 'b-weekend');
        t.hasCls(dayView.dayContainerElement.children[6], 'b-nonworking-day');
        t.hasCls(dayView.dayContainerElement.children[6], 'b-weekend');
    });

    t.it('Events at visible limits on DST in US', async t => {
        eventStore = t.getEventStore({
            data : [{
                id         : 'e1',
                cls        : 'cell-0',
                resourceId : 'r1',
                name       : 'Cell 0',
                startDate  : new Date(2010, 10, 1, 9),
                endDate    : new Date(2010, 10, 1, 10)
            }, {
                id         : 'e2',
                cls        : 'cell-35',
                resourceId : 'r1',
                name       : 'Cell 35',
                startDate  : new Date(2010, 10, 7, 9),
                endDate    : new Date(2010, 10, 7, 10)  // Nov 7, 2010 is DST day in US
            }]
        });

        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Mike',  eventColor : 'red' }
            ]
        });

        dayView = await getDayView(t, {
            width     : 1000,
            height    : 750,
            startDate : new Date(2010, 10, 1),
            endDate   : new Date(2010, 10, 8),
            eventStore,
            resourceStore
        });

        const eventElements = dayView.bodyElement.querySelectorAll('.b-cal-event-wrap');

        t.is(eventElements.length, 2, '2 event start elements');

        // We should only have gathered cells for the view's own cells
        t.is(dayView.cellMap.size, 2);
    });

    t.it('Events at visible limits on DST in CET', async t => {
        eventStore = t.getEventStore({
            data : [{
                id         : 'e1',
                cls        : 'cell-0',
                resourceId : 'r1',
                name       : 'Cell 0',
                startDate  : new Date(2010, 9, 25, 9),
                endDate    : new Date(2010, 9, 25, 10)
            }, {
                id         : 'e2',
                cls        : 'cell-35',
                resourceId : 'r1',
                name       : 'Cell 35',
                startDate  : new Date(2010, 9, 31, 9),
                endDate    : new Date(2010, 9, 31, 10)  // Oct 31, 2010 is DST day in CET TZ
            }]
        });
        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Mike',  eventColor : 'red' }
            ]
        });
        dayView = await getDayView(t, {
            width     : 1000,
            height    : 750,
            startDate : new Date(2010, 9, 25),
            endDate   : new Date(2010, 10, 1),
            eventStore,
            resourceStore
        });

        const eventElements = dayView.bodyElement.querySelectorAll('.b-cal-event-wrap');

        t.is(eventElements.length, 2, '2 event start elements');

        // We should only have gathered cells for the view's own cells
        t.is(dayView.cellMap.size, 2);
    });

    t.it('Adding new events', async t => {
        dayView = await getDayView(t, {
            height    : 500,
            width     : 700,
            startHour : 8
        });
        const { allDayEvents } = dayView;

        let allDayHeight, collapsedAllDayHeight;

        t.chain(
            { waitFor : () => dayView.allDayEvents.element.querySelectorAll('.b-cal-event-wrap:not(.b-overflow)').length === 5 },

            async() => {
                allDayHeight = dayView.allDayEvents.height;

                dayView.eventStore.add([
                    { startDate : '2019-10-14', endDate : '2019-10-19', name : 'Work week' },
                    { startDate : '2019-10-19', endDate : '2019-10-21', name : 'The weekend' },
                    { startDate : '2019-10-01', endDate : '2019-10-31', name : 'Very long event' }
                ]);
            },

            { waitForEvent : [dayView, 'refresh'] },

            { waitForAnimations : null },

            // Wait for animated expand.
            { waitFor : () =>  t.samePx(allDayEvents.element.offsetHeight,  allDayEvents.cellContentHeight + allDayEvents.headerCellContainer.offsetHeight) },

            async() => {
                t.selectorCountIs(`#${dayView.allDayEvents.id} .b-cal-event-wrap:not(.b-overflow)`, 2, 'only 2 long running events visible');
                t.selectorCountIs('.b-cal-cell-overflow:contains(+2 more)', 4);
                t.selectorCountIs('.b-cal-cell-overflow:contains(+1 more)', 3);
                t.isGreater(dayView.allDayEvents.height, allDayHeight);
                collapsedAllDayHeight = dayView.allDayEvents.height;
            },

            { click : '.b-expand-allday-button' },

            { waitForAnimations : null },

            // Wait for animated expand.
            { waitFor : () =>  t.samePx(allDayEvents.element.offsetHeight, allDayEvents.cellContentHeight + allDayEvents.headerCellContainer.offsetHeight) },

            async() => {
                t.selectorCountIs(`#${dayView.allDayEvents.id} .b-cal-event-wrap:not(.b-overflow)`, 8, '8 long running events visible');
                t.isGreater(dayView.allDayEvents.height, collapsedAllDayHeight);
            },

            { click : '.b-expand-allday-button' },

            { waitForAnimations : null },

            // We now have something to wait for. We know the height it must drop back to
            { waitFor : () => t.samePx(dayView.allDayEvents.height, collapsedAllDayHeight, 2) }
        );
    });

    t.it('Midnight to midnight events must be in the all day region', async t => {
        const
            firstDayOfMonth = DateHelper.clearTime(new Date()),
            lastDayOfMonth = DateHelper.clearTime(new Date());

        firstDayOfMonth.setDate(1);
        lastDayOfMonth.setDate(DateHelper.getLastDateOfMonth(lastDayOfMonth));

        dayView = await getDayView(t, {
            height     : 500,
            width      : 700,
            eventStore : {
                data : [{
                    name       : 'Midnight to midnight',
                    resourceId : 'bryntum',
                    startDate  : '2019-10-14T00:00:00',
                    endDate    : '2019-10-15T00:00:00'
                }]
            }
        });
        const event = dayView.eventStore.first;

        t.ok(event.isInterDay);

        t.chain(
            // Wait for layout to be correct
            { waitForAnimationFrame : null },

            () => {
                // It's flagged allDay because it's an interDay event
                t.selectorCountIs('.b-calendarrow .b-cal-event-wrap.b-allday:contains(Midnight to midnight)', 1);

                const el = t.query('.b-calendarrow .b-cal-event-wrap.b-allday:contains(Midnight to midnight)')[0];

                // It's 1/8 of the view width. We use an 8 day view for simple arithmetic.
                t.is(el.style.width, '12.5%');
            }
        );
    });

    t.it('Events which end at midnight must not be in the all day region', async t => {
        dayView = await getDayView(t, {
            height     : 500,
            width      : 700,
            eventStore : {
                data : [{
                    name       : 'Late dinner',
                    resourceId : 'bryntum',
                    startDate  : '2019-10-14T21:00:00',
                    endDate    : '2019-10-15T00:00:00'
                }]
            }
        });
        const event = dayView.eventStore.first;

        t.notOk(event.isInterDay, 'Event does not flag up as interDay');

        t.chain(
            // Wait for layout to be correct
            { waitForAnimationFrame : null },

            () => {
                // It's not allDay or interDay
                t.selectorNotExists('.b-calendarrow .b-cal-event-wrap.b-allday:contains(Late dinner)', 'Event is correctly not in all day zone');

                t.selectorCountIs('.b-dayview .b-dayview-day-container .b-cal-event-wrap:contains(Late dinner)', 1, 'Event is in day detail zone');
            }
        );
    });

    t.it('Events which end at midnight must not be in the all day region when dayStartTime/dayEndTime is used', async t => {
        dayView = await getDayView(t, {
            height       : 500,
            width        : 700,
            dayStartTime : 9,
            dayEndTime   : 22,
            eventStore   : {
                data : [{
                    name       : 'Late dinner',
                    resourceId : 'bryntum',
                    startDate  : '2019-10-14T21:00:00',
                    endDate    : '2019-10-15T00:00:00'
                }]
            }
        });
        const event = dayView.eventStore.first;

        t.notOk(event.isInterDay, 'Event does not flag up as interDay');

        t.chain(
            // Wait for layout to be correct
            { waitForAnimationFrame : null },

            () => {
                // It's not allDay or interDay
                t.selectorNotExists('.b-calendarrow .b-cal-event-wrap.b-allday:contains(Late dinner)', 'Event is correctly not in all day zone');

                t.selectorCountIs('.b-dayview .b-dayview-day-container .b-cal-event-wrap:contains(Late dinner)', 1, 'Event is in day detail zone');
            }
        );
    });

    if (DomHelper.scrollBarWidth) {
        t.it('There must be no padding in header if there\'s no scrollbar', async t => {
            const steps = [{ waitForAnimationFrame : null }];

            dayView = await getDayView(t, {
                height     : 768,
                width      : 1024,
                eventStore : {
                    data : []
                },
                hourHeight   : 40,
                dayStartTime : 8,
                dayEndTime   : 15
            });

            let lastDayContainerBackground = DomHelper.getStyleValue(dayView.dayContainerElement, 'backgroundImage');

            // Loop from no scrollbar to showing a scrollbar, ensuring that at each 0.1 pixel point
            // the header padding syncing is correct
            for (let h = (dayView.dayContainerElement.clientHeight / 7) - 1; h <= (dayView.dayContainerElement.clientHeight / 7) + 1; h += 0.1) {
                // Change the scroll height by a tiny amount
                steps.push(next => {
                    dayView.hourHeight = h;
                    next();
                });

                // Wait for the line updating method to have been called
                steps.push({
                    waitFor : () => {
                        const done = DomHelper.getStyleValue(dayView.dayContainerElement, 'backgroundImage') !== lastDayContainerBackground;

                        if (done) {
                            lastDayContainerBackground = DomHelper.getStyleValue(dayView.dayContainerElement, 'backgroundImage');
                            return true;
                        }
                    }
                });

                // We tried waitForAnimationFrame. Firefox still couldn't handle it.
                // Wait for layout to settle before testing for a scrollbar.
                steps.push({ waitFor : 100 });

                // The padding-showing class must only be present if there really is a scrollbar
                steps.push(next => {
                    t[dayView.scrollable.hasOverflow() ? 'hasCls' : 'hasNotCls'](dayView.alldayRowElement, 'b-show-yscroll-padding', 'overflow synced correctly');
                    next();
                });
            }

            t.chain(steps);
        });
    }

    t.it('Background lines must end at EOD', async t => {
        const
            firstDayOfMonth = DateHelper.clearTime(new Date()),
            lastDayOfMonth = DateHelper.clearTime(new Date());

        firstDayOfMonth.setDate(1);
        lastDayOfMonth.setDate(DateHelper.getLastDateOfMonth(lastDayOfMonth));

        dayView = await getDayView(t, {
            height     : 768,
            width      : 1024,
            eventStore : {
                data : []
            },
            hourHeight   : 40,
            dayStartTime : 8,
            dayEndTime   : 15
        });

        t.chain(
            // Wait for layout to be correct
            { waitForAnimationFrame : null },

            () => {
                const
                    dayHeight = dayView.hourHeight * 7,
                    p = DomHelper.getStyleValue(dayView.dayContainerElement, 'clip-path');

                t.is(p, `polygon(0px 0px, 100% 0px, 100% ${dayHeight}px, 0px ${dayHeight}px)`, 'Day container element clipped correctly');
            }
        );
    });

    // https://github.com/bryntum/support/issues/1434
    t.it('Should match TimeAxis time format with time format in event elements by default', async t => {
        dayView = await getDayView(t, {
            height     : 500,
            width      : 700,
            eventStore : {
                data : [{
                    name       : 'Late dinner',
                    resourceId : 'bryntum',
                    startDate  : '2019-10-14T09:00:00',
                    endDate    : '2019-10-14T10:00:00'
                }]
            }
        });

        t.chain(
            // Wait for layout to be correct
            { waitForAnimationFrame : null },

            () => {
                t.selectorExists('.b-dayview .b-dayview-timeaxis-time:regex(9\\sAM)', 'TimeAxis time format is correct');
                t.selectorExists('.b-dayview .b-cal-event .b-event-time:regex(9\\sAM)', 'Event element time format is correct');
            }
        );
    });

    t.it('Should match TimeAxis time format with time format in event elements when timeFormat is specified', async t => {
        dayView = await getDayView(t, {
            height     : 500,
            width      : 700,
            eventStore : {
                data : [{
                    name       : 'Late dinner',
                    resourceId : 'bryntum',
                    startDate  : '2019-10-14T09:00:00',
                    endDate    : '2019-10-14T10:00:00'
                }]
            },
            timeFormat : 'H A'
        });

        t.chain(
            // Wait for layout to be correct
            { waitForAnimationFrame : null },

            () => {
                t.selectorExists('.b-dayview .b-dayview-timeaxis-time:regex(9\\sAM)', 'TimeAxis time format is correct');
                t.selectorExists('.b-dayview .b-cal-event .b-event-time:regex(9\\sAM)', 'Event element time format is correct');
            }
        );
    });

    t.it('Changing event startDate should work', async t => {
        dayView = await getDayView(t, {
            height     : 500,
            width      : 700,
            endDate    : '2019-10-21',
            eventStore : {
                data : [{
                    name       : 'Breakfast',
                    resourceId : 'bryntum',
                    startDate  : '2019-10-15T07:00:00',
                    endDate    : '2019-10-15T08:00:00'
                }, {
                    name       : 'Lunch',
                    resourceId : 'bryntum',
                    startDate  : '2019-10-15T12:00:00',
                    endDate    : '2019-10-15T13:00:00'
                }, {
                    name       : 'Dinner',
                    resourceId : 'bryntum',
                    startDate  : '2019-10-15T19:00:00',
                    endDate    : '2019-10-15T21:00:00'
                }]
            },
            timeFormat : 'H A'
        });
        const
            mondayCell  = dayView.getDayElement('2019-10-14').children[1],
            tuesdayCell = dayView.getDayElement('2019-10-15').children[1],
            breakfast   = dayView.eventStore.first,
            dinner      = dayView.eventStore.last;

        t.chain(
            {
                waitForEvent : [dayView, 'refresh'],
                trigger      : () => {
                    t.selectorCountIs('.b-cal-event-wrap', 3, 'Three events are rendered');

                    // The dinner element is in the correct order. It's the last one.
                    t.is(dayView.getEventElement(dinner), tuesdayCell.children[2]);

                    // Move to start before breakfast
                    dinner.startDate = new Date(2019, 9, 15, 6, 30);
                }
            },

            {
                waitForEvent : [dayView, 'refresh'],
                trigger      : () => {
                    t.selectorCountIs('.b-cal-event-wrap', 3, 'Three events are rendered');

                    // The dinner element is in the correct order. It must now be the first element
                    t.is(dayView.getEventElement(dinner), tuesdayCell.firstElementChild);

                    // The breakfast element is in the correct cell
                    t.is(dayView.getEventElement(breakfast), tuesdayCell.children[1]);

                    // Move to previous day
                    breakfast.startDate = new Date(2019, 9, 14, 7);
                }
            },

            () => {
                t.selectorCountIs('.b-cal-event-wrap', 3, 'Three events are rendered');

                // The breakfast element is in the correct cell
                t.is(dayView.getEventElement(breakfast), mondayCell.firstElementChild);
            }
        );
    });

    t.it('Simple Features on standalone CalendarMixin widget', async t => {
        dayView = await getDayView(t, {
            height   : 500,
            width    : 700,
            features : {
                eventTooltip : true,
                eventEdit    : true,
                drag         : true
            }
        });

        await t.click('.b-cal-event-wrap[data-event-id="5"]');

        await t.waitForSelector('.b-sch-event-tooltip:contains(Breakfast)');

        await t.click('.b-sch-event-tooltip button[data-ref="edit"]');

        await t.waitFor(() => dayView.features.eventEdit.editor?.containsFocus);

        await t.type(null, 'Petit déjeuner', null, null, null, true);

        await t.click('.b-eventeditor [data-ref="saveButton"]');

        await t.click('.b-sch-recurrenceconfirmation button[data-ref="changeMultipleButton"]');

        await t.waitForSelector('.b-cal-event-wrap:contains(Petit déjeuner)');
        t.selectorCountIs('.b-cal-event-wrap:contains(Petit déjeuner)', 6);
    });

    t.it('DayView should intercept scrollTo calls to its allDayEvents', async t => {
        dayView = await getDayView(t, {
            height   : 500,
            width    : 700,
            features : {
                eventTooltip : true,
                eventEdit    : true,
                drag         : true
            }
        });

        await dayView.scrollTo('2019-06-17');
        t.selectorExists('.b-dayview-allday.b-calendar-cell[data-date="2019-06-17"', 'All day has navigated');
        t.selectorExists('.b-dayview-day-detail[data-date="2019-06-17"', 'DayView has navigated');
    });

    // https://github.com/bryntum/support/issues/2780
    t.it('Should support updating dayStartTime / dayEndTime as a string', async t => {
        dayView = await getDayView(t, {
            height       : 500,
            width        : 700,
            dayStartTime : 7,
            dayEndTime   : 17
        });

        t.is(dayView.dayStartTime, 7 * 3600 * 1000, 'View starts at 7');
        t.is(dayView.dayEndTime, 17 * 3600 * 1000, 'View ends at 17');

        t.selectorExists('.b-dayview-timeaxis-time:first-child:regex(8\\sAM)', 'first tick shows 8 am');
        t.selectorExists('.b-dayview-timeaxis-time:last-child :last-child:regex(5\\sPM)', 'last tick shows 4 pm');
        dayView.dayStartTime = '08:00';
        dayView.dayEndTime = '19:00';

        await t.waitForSelector('.b-dayview-timeaxis-time:first-child:regex(9\\sAM)');
        t.selectorExists('.b-dayview-timeaxis-time:last-child :last-child:regex(7\\sPM)', 'last tick shows 6 pm');

        t.is(dayView.dayStartTime, 8 * 3600 * 1000, 'View starts at 8');
        t.is(dayView.dayEndTime, 19 * 3600 * 1000, 'View ends at 19');
    });

    // https://github.com/bryntum/support/issues/7002
    t.it('Should support updating dayStartTime / dayEndTime as a string and round the start down and end up', async t => {
        dayView = await getDayView(t, {
            height       : 500,
            width        : 700,
            dayStartTime : 7,
            dayEndTime   : 17
        });

        t.is(dayView.dayStartTime, 7 * 3600 * 1000, 'View starts at 7');
        t.is(dayView.dayEndTime, 17 * 3600 * 1000, 'View ends at 17');

        t.selectorExists('.b-dayview-timeaxis-time:first-child:regex(8\\sAM)', 'first tick shows 8 am');
        t.selectorExists('.b-dayview-timeaxis-time:last-child :last-child:regex(5\\sPM)', 'last tick shows 4 pm');

        // Will be rounded down to 08:00
        dayView.dayStartTime = '08:30';

        // Will be rounded up to 19:00
        dayView.dayEndTime = '18:30';

        await t.waitForSelector('.b-dayview-timeaxis-time:first-child:regex(9\\sAM)');
        t.selectorExists('.b-dayview-timeaxis-time:last-child :last-child:regex(7\\sPM)', 'last tick shows 6 pm');

        t.is(dayView.dayStartTime, 8 * 3600 * 1000, 'View starts at 8');
        t.is(dayView.dayEndTime, 19 * 3600 * 1000, 'View ends at 19');
    });

    // https://github.com/bryntum/support/issues/2780
    t.it('Should support updating dayStartTime / dayEndTime as a ms time', async t => {
        dayView = await getDayView(t, {
            height       : 500,
            width        : 700,
            dayStartTime : 7,
            dayEndTime   : 17
        });

        t.is(dayView.dayStartTime, 7 * 3600 * 1000, 'View starts at 7');
        t.is(dayView.dayEndTime, 17 * 3600 * 1000, 'View ends at 17');

        t.selectorExists('.b-dayview-timeaxis-time:first-child:regex(8\\sAM)', 'first tick shows 8 am');
        t.selectorExists('.b-dayview-timeaxis-time:last-child :last-child:regex(5\\sPM)', 'last tick shows 4 pm');
        dayView.dayStartTime = 8 * 3600 * 1000;
        dayView.dayEndTime   = 19 * 3600 * 1000;

        await t.waitForSelector('.b-dayview-timeaxis-time:first-child:regex(9\\sAM)');
        t.selectorExists('.b-dayview-timeaxis-time:last-child :last-child:regex(7\\sPM)', 'last tick shows 6 pm');

        t.is(dayView.dayStartTime, 8 * 3600 * 1000, 'View starts at 8');
        t.is(dayView.dayEndTime, 19 * 3600 * 1000, 'View ends at 19');
    });

    // https://github.com/bryntum/support/issues/2780
    t.it('Should support updating dayStartTime / dayEndTime as an hour value', async t => {
        calendar = await t.getCalendar({
            height : 500,

            date   : new Date(2021, 2, 27),
            events : [
                {
                    id        : 1,
                    name      : 'Event',
                    startDate : new Date(2021, 2, 22, 10),
                    endDate   : new Date(2021, 2, 22, 12)
                }
            ],
            modes : {
                week : {
                    dayStartTime : 7,
                    dayEndTime   : 17
                }
            }
        });

        await t.waitForSelector('.b-dayview-timeaxis-time:first-child:regex(8\\sAM)');

        const dayView = calendar.activeView;

        t.is(dayView.dayStartTime, 7 * 3600 * 1000, 'View starts at 7');
        t.is(dayView.dayEndTime, 17 * 3600 * 1000, 'View ends at 17');

        t.selectorExists('.b-dayview-timeaxis-time:first-child:regex(8\\sAM)', 'first tick shows 8 am');
        t.selectorExists('.b-dayview-timeaxis-time:last-child :last-child:regex(5\\sPM)', 'last tick shows 4 pm');
        dayView.dayStartTime = 8;
        dayView.dayEndTime = 19;

        await t.waitForSelector('.b-dayview-timeaxis-time:first-child:regex(9\\sAM)');
        t.selectorExists('.b-dayview-timeaxis-time:last-child :last-child:regex(7\\sPM)', 'last tick shows 6 pm');

        t.is(dayView.dayStartTime, 8 * 3600 * 1000, 'View starts at 8');
        t.is(dayView.dayEndTime, 19 * 3600 * 1000, 'View ends at 19');

        await t.dragBy('.b-cal-event', [100, 0]);

        t.is(calendar.eventStore.first.startDate, new Date(2021, 2, 23, 10), 'Event moved');
    });

    t.it('Should support drag on a standalone DayView instance', async t => {
        dayView = await getDayView(t, {
            height   : 500,
            width    : 700,
            features : {
                eventTooltip : true,
                eventEdit    : true,
                drag         : true
            }
        });

        t.firesOnce(dayView.eventStore, 'update');
        await t.dragBy('.b-cal-event:contains(Scrum)', [100, 0]);
    });

    t.it('DayView should measure its minimumHeight correctly', async t => {
        eventStore = new EventStore({
            // Add a recurring meeting
            data : t.getHackathonData().events.rows.concat([{
                duration       : 1,
                durationUnit   : 'hour',
                id             : 'twice-weekly',
                name           : 'Recurring Meeting',
                recurrenceRule : 'FREQ=WEEKLY;BYDAY=TU,TH',
                startDate      : new Date(2019, 9, 15, 13)
            }])
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await t.getCalendar({
            date : new Date(2019, 9, 14),
            eventStore,
            resourceStore,

            // Docs incorrectly imply that a Boolean value is valid.
            // So we must accept it. This should result in a default Sidebar
            sidebar : true
        });

        const { sidebar } = calendar;

        t.ok(sidebar.isSidebar);
        t.hasStyle(sidebar.contentElement, 'align-items', 'stretch');
        t.hasStyle(sidebar.contentElement, 'flex-direction', 'column');
        t.hasStyle(sidebar.contentElement, 'flex-wrap', 'nowrap');
        t.hasStyle(sidebar.contentElement, 'justify-content', 'flex-start');

        t.chain(
            { click : 'button[data-ref=weekShowButton]' },

            { click : '.b-dayview-day-detail[data-date="2019-10-17"]' },

            { click : 'button:contains(Day)' },

            () => {
                const
                    { allDayEvents } = calendar.modes.day,
                    initialHeight    = allDayEvents.element.offsetHeight;

                t.isApproxPx(initialHeight, allDayEvents.cellContentHeight + allDayEvents.headerCellContainer.offsetHeight, 'The initial height should have been correct');
            }
        );
    });

    t.it('DayView should measure its minimumHeight correctly', async t => {
        eventStore = new EventStore({
            // Add a recurring meeting
            data : t.getHackathonData().events.rows.concat([{
                duration       : 1,
                durationUnit   : 'hour',
                id             : 'twice-weekly',
                name           : 'Recurring Meeting',
                recurrenceRule : 'FREQ=WEEKLY;BYDAY=TU,TH',
                startDate      : new Date(2019, 9, 15, 13)
            }])
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await t.getCalendar({
            date : new Date(2019, 9, 14),
            eventStore,
            resourceStore
        });

        t.chain(
            { click : 'button[data-ref=weekShowButton]' },

            { click : '.b-dayview-day-detail[data-date="2019-10-17"]' },

            { click : 'button:contains(Day)' },

            () => {
                const
                    { allDayEvents } = calendar.modes.day,
                    initialHeight    = allDayEvents.element.offsetHeight;

                t.isApproxPx(initialHeight, allDayEvents.cellContentHeight + allDayEvents.headerCellContainer.offsetHeight, 'The initial height should have been correct');
            }
        );
    });

    t.it('should properly layout complex overlapping events - part 1', async t => {
        // See https://github.com/bryntum/support/issues/2409
        calendar = await t.getCalendar({
            // height : 500,

            date : new Date(2021, 3, 11),
            mode : 'day',

            modes : {
                day : {
                    dayStartTime : 7,
                    dayEndTime   : 13,
                    hourHeight   : 200
                },
                week : {
                    dayStartTime : 7,
                    dayEndTime   : 13,
                    hourHeight   : 200
                }
            },

            crudManager : {
                autoLoad  : true,
                transport : {
                    load : {
                        url : 'data/support-2409.json'
                    }
                }
            }
        });

        await t.waitForSelector('.b-dayview-timeaxis-time:first-child:regex(8\\sAM)');

        const
            dayView  = calendar.activeView,
            dayWidth = dayView.getDayElement(dayView.date).clientWidth;

        const check = async(day, eventCount, minWidth) => {
            calendar.date = new Date(2021, 3, day);

            await t.waitForSelector(`.b-cal-cell-header .b-day-name-date:contains(${day})`);

            await t.waitForSelector('.b-cal-event-wrap');

            const eventEls = dayView.element.querySelectorAll('.b-cal-event-wrap');

            t.is(eventEls.length, eventCount, `Correct number of rendered events for the ${day}th`);

            let i = 1;

            for (const el of eventEls) {
                t.isGreaterOrEqual(el.offsetWidth, minWidth - 1, `Event ${i++} layouts properly on the ${day}th`);
            }
        };

        await check(11, 18, dayWidth - 5);
        await check(12, 28, dayWidth / 2 - 5);
        await check(13, 33, dayWidth / 2 - 5);
        await check(14, 47, dayWidth / 4 - 5);
        await check(15, 56, dayWidth / 4 - 5);
        await check(16, 44, dayWidth / 4 - 5);
    });

    const checkDayLayout = async(t, month, day, minWidth, eventCount) => {
        const dayView = calendar.activeView;

        calendar.date = new Date(2021, month, day);

        if (eventCount == null) {
            eventCount = 0;

            for (const ev of calendar.eventStore) {
                if (!ev.isInterDay && ev.startDate.getDate() === day && ev.startDate.getMonth() === month) {
                    ++eventCount;
                }
            }
        }

        await t.waitForSelector(`.b-calendarrow-header .b-day-name-date:contains(${day})`);

        // wait for the events to render:
        await t.waitForSelector('.b-cal-event-wrap');

        const
            eventEls = dayView.dayContentElement.querySelectorAll('.b-cal-event-wrap'),
            space = Rectangle.from(dayView.dayContainerElement);

        // This is harder to get right than it seems (across tz's the above loop does not always get the right number)
        // t.is(eventEls.length, eventCount, `Correct number of rendered events for the ${day}th`);

        let i = 1,
            box;

        for (const el of eventEls) {
            box = Rectangle.from(el);

            if (box.x < space.x) {  // for test run perf due to many, many assertions
                t.isGreaterOrEqual(
                    box.x, space.x,
                    `Event ${i} on the ${day}th has invalid x (${box.x}) for container (${space.x})`);
            }

            if (box.y < space.y) {
                t.isGreaterOrEqual(
                    box.y, space.y,
                    `Event ${i} on the ${day}th has invalid y (${box.y}) for container (${space.y})`);
            }

            if (box.right > space.right) {
                t.isLessOrEqual(
                    box.right, space.right,
                    `Event ${i} on the ${day}th has invalid right (${box.right}) for container (${space.right})`);
            }

            if (box.bottom > space.bottom) {
                t.isLessOrEqual(
                    box.bottom, space.bottom,
                    `Event ${i} on the ${day}th has invalid bottom (${box.bottom}) for container (${space.bottom})`);
            }

            if (minWidth && el.offsetWidth < minWidth) {
                t.isGreaterOrEqual(el.offsetWidth, minWidth, `Event ${i} on the ${day}th has valid width`);
            }

            ++i;
        }
    };

    t.it('should properly layout complex overlapping events - part 2', async t => {
        // See https://github.com/bryntum/support/issues/3140
        calendar = await t.getCalendar({
            // height : 500,

            date    : new Date(2021, 5, 27),
            mode    : 'day',
            sidebar : null,

            modes : {
                day : {
                    // dayStartTime : 7,
                    // dayEndTime   : 13,
                    hourHeight : 200
                },
                week : {
                    // dayStartTime : 7,
                    // dayEndTime   : 13,
                    hourHeight : 200
                }
            },

            crudManager : {
                autoLoad  : true,
                transport : {
                    load : {
                        url : 'data/support-3140-a.json'
                    }
                },
                validateResponse : false
            }
        });

        await t.waitForSelector('.b-dayview-timeaxis-time:first-child:regex(1\\sAM)');

        await checkDayLayout(t, 5, 27, 350);
        await checkDayLayout(t, 5, 28);
        await checkDayLayout(t, 5, 29);
        await checkDayLayout(t, 5, 30);
        await checkDayLayout(t, 6, 1);
        await checkDayLayout(t, 6, 2);
        await checkDayLayout(t, 6, 3);
    });

    t.it('should properly layout complex overlapping events - part 3', async t => {
        // See https://github.com/bryntum/support/issues/3140
        calendar = await t.getCalendar({
            // height : 500,

            date    : new Date(2021, 6, 4),
            mode    : 'day',
            sidebar : null,

            modes : {
                day : {
                    // dayStartTime : 7,
                    // dayEndTime   : 13,
                    hourHeight : 200
                },
                week : {
                    // dayStartTime : 7,
                    // dayEndTime   : 13,
                    hourHeight : 200
                }
            },

            crudManager : {
                autoLoad  : true,
                transport : {
                    load : {
                        url : 'data/support-3140-b.json'
                    }
                },
                validateResponse : false
            }
        });

        await t.waitForSelector('.b-dayview-timeaxis-time:first-child:regex(1\\sAM)');

        await checkDayLayout(t, 6, 4, 350);
        await checkDayLayout(t, 6, 5);
        await checkDayLayout(t, 6, 6);
        await checkDayLayout(t, 6, 7);
        await checkDayLayout(t, 6, 8);
        await checkDayLayout(t, 6, 9);
        await checkDayLayout(t, 6, 10);
    });

    // https://github.com/bryntum/support/issues/2613
    t.it('Should apply eventSpacing to create gap between events', async t => {
        dayView = await getDayView(t, {
            eventSpacing : 10
        });

        t.hasApproxHeight('[data-event-id="5"] .b-cal-event', 32, 'Correct event height with `eventSpacing: 10`');

        dayView.eventSpacing = 0;

        t.hasApproxHeight('[data-event-id="5"] .b-cal-event', 42, 'Correct event height with `eventSpacing: 0`');
    });

    // https://github.com/bryntum/support/issues/3269
    t.it('Should apply min-height for 0 duration events', async t => {
        dayView = await getDayView(t, {
            events : [
                {
                    id        : 1,
                    startDate : new Date(2019, 9, 14, 10),
                    duration  : 0
                }
            ]
        });

        await t.waitForSelector('.b-cal-event');
        t.isGreater(t.rect('[data-event-id="1"]').height, 5, 'Element has some height');
    });

    t.it('visibleStartTime < dayStartTime', async t => {
        // Test pathological case.
        // Requested visibleStartTime cannot be reached.
        dayView = await getDayView(t, {
            height           : 500,
            dayStartTime     : 9,
            visibleStartTime : 7
        });

        // Wait any scroll to have been layed out
        await t.waitForAnimationFrame();

        // DayView.getPositionFromTime did not handle the case where visibleStartTime < dayStartTime
        t.is(dayView.scrollable.y, 0, 'Scroll position is correct');
    });

    t.it('visibleStartTime < dayStartTime', async t => {
        // Test case where visibleStartTime *can* be reached because the day is shifted.
        dayView = await getDayView(t, {
            height           : 500,
            dayStartShift    : 10,
            visibleStartTime : 1
        }, false);

        // Wait any scroll to have been layed out
        await t.waitForAnimationFrame();

        // DayView.getPositionFromTime did not handle the case where visibleStartTime < dayStartTime
        t.is(dayView.scrollable.y, dayView.hourHeight * 15, 'Scroll position is correct');
    });

    t.it('showAllDayHeader : false', async t => {
        dayView = await getDayView(t, {
            showAllDayHeader : false,
            startDate        : '2021-12-12',
            endDate          : '2021-12-19'
        }, true, {
            resources : {
                rows : [{
                    id   : 'Nige',
                    name : 'Nige'
                }]
            },
            events : {
                rows : [{
                    id         : 1,
                    resourceId : 1,
                    name       : 'All Monday',
                    startDate  : '2021-12-13',
                    endDate    : '2021-12-14'
                }, {
                    id         : 2,
                    resourceId : 1,
                    name       : '5AM Tue-5AM Thu',
                    startDate  : '2021-12-14T05:00',
                    endDate    : '2021-12-16T05:00'
                }, {
                    id         : 3,
                    resourceId : 1,
                    name       : 'allDay Fri',
                    startDate  : '2021-12-17',
                    endDate    : '2021-12-17',
                    allDay     : true
                }, {
                    id         : 4,
                    resourceId : 1,
                    name       : 'Within Sunday',
                    startDate  : '2021-12-18T05:00',
                    endDate    : '2021-12-18T07:00'
                }]
            }
        });

        // Wait for layout to be correct
        await ready(t);

        let eventEl, height, rect, space;

        const getEl = (...args) => {
            eventEl = dayView.getEventElement(...args);
            rect = Rectangle.from(eventEl, eventEl.parentElement);
            space = eventEl.parentElement.getBoundingClientRect();
            height = rect.height / space.height * 100;
        };

        getEl(1);

        t.is(rect.top, 0);
        t.isApprox(height, 100, 0.01);
        t.hasNotCls(eventEl, 'b-starts-above');
        t.hasNotCls(eventEl, 'b-ends-below');

        getEl(2, '2021-12-14');
        t.isApprox(rect.top, 210, 1);
        t.isApprox(height, 79.17, 0.01);
        t.hasNotCls(eventEl, 'b-starts-above');
        t.hasCls(eventEl, 'b-ends-below');

        getEl(2, '2021-12-15');
        t.is(rect.top, 0);
        t.isApprox(height, 100, 0.01);
        t.hasCls(eventEl, 'b-starts-above');
        t.hasCls(eventEl, 'b-ends-below');

        getEl(2, '2021-12-16');
        t.is(rect.top, 0);
        t.isApprox(height, 20.83, 0.01);
        t.hasCls(eventEl, 'b-starts-above');
        t.hasNotCls(eventEl, 'b-ends-below');

        getEl(3);
        t.is(rect.top, 0);
        t.isApprox(height, 100, 0.01);
        t.hasNotCls(eventEl, 'b-starts-above');
        t.hasNotCls(eventEl, 'b-ends-below');

        getEl(4);
        t.isApprox(rect.top, 210, 1);
        t.isApprox(height, 8.33, 0.01);
        t.hasNotCls(eventEl, 'b-starts-above');
        t.hasNotCls(eventEl, 'b-ends-below');
    });

    // Disable Safari testing until all versions, locally and test servers yield
    // correct backgroundImage string.
    t[BrowserHelper.isSafari ? 'xit' : 'it']('coreHours', async t => {
        calendar = await t.getCalendar({
            modeDefaults : {
                coreHours : [{
                    start : 9,
                    end   : 12
                }, {
                    start : 14,
                    end   : 17
                }]
            },
            modes : {
                week   : false,
                month  : false,
                year   : false,
                agenda : false
            }
        });

        await t.waitForAnimationFrame();

        const
            v = calendar.activeView,
            {
                timeAxisElement,
                dayContainerElement
            } = v,
            expectedBackgroundImage = BrowserHelper.isSafari
                ? 'linear-gradient(rgba(135, 135, 135, 0.1) 0%, rgba(135, 135, 135, 0.1) 37.5%, transparent 37.5%, transparent 50%, rgba(135, 135, 135, 0.1) 50%, rgba(135, 135, 135, 0.1) 58.33%, transparent 58.33%, transparent 70.83%, rgba(135, 135, 135, 0.1) 70.83%, rgba(135, 135, 135, 0.1) 100%)'
                : 'linear-gradient(rgba(135, 135, 135, 0.1) 0%, rgba(135, 135, 135, 0.1) 37.5%, rgba(0, 0, 0, 0) 37.5%, rgba(0, 0, 0, 0) 50%, rgba(135, 135, 135, 0.1) 50%, rgba(135, 135, 135, 0.1) 58.33%, rgba(0, 0, 0, 0) 58.33%, rgba(0, 0, 0, 0) 70.83%, rgba(135, 135, 135, 0.1) 70.83%, rgba(135, 135, 135, 0.1) 100%)';

        t.is(getComputedStyle(timeAxisElement.firstChild).getPropertyValue('background-image'), expectedBackgroundImage);
        t.is(getComputedStyle(dayContainerElement.firstChild).getPropertyValue('background-image'), 'none');

        v.coreHours.overlayDay = true;

        await t.waitForAnimationFrame();

        t.is(getComputedStyle(timeAxisElement.firstChild).getPropertyValue('background-image'), expectedBackgroundImage);
        t.is(getComputedStyle(dayContainerElement.firstChild).getPropertyValue('background-image'), expectedBackgroundImage);
    });

    // https://github.com/bryntum/support/issues/4106
    t.it('Short events', async t => {
        calendar = await t.getCalendar({
            height : 500,

            date   : new Date(2021, 2, 27),
            events : [
                {
                    id        : 1,
                    name      : 'Event',
                    startDate : new Date(2021, 2, 22, 10),
                    endDate   : new Date(2021, 2, 22, 10, 15)
                }
            ],
            modes : {
                week : {
                    dayStartTime : 7,
                    dayEndTime   : 17
                }
            }
        });

        // Must get the short event class
        await t.waitForSelector('.b-cal-event-wrap.b-short-event:contains(Event)');
    });

    t.it('Should use correct reconfigured shortEventDuration initially', async t => {
        calendar = await t.getCalendar({
            height : 500,

            date   : new Date(2021, 2, 27),
            events : [
                {
                    id        : 1,
                    name      : 'Event',
                    startDate : new Date(2021, 2, 22, 10),
                    endDate   : new Date(2021, 2, 22, 11)
                }
            ],
            modes : {
                week : {
                    dayStartTime       : 7,
                    dayEndTime         : 17,
                    shortEventDuration : '1 hour'
                }
            }
        });

        // Must get the short event class
        await t.waitForSelector('.b-cal-event-wrap.b-short-event:contains(Event)');
    });

    // https://github.com/bryntum/support/issues/5024
    t.it('Icon style', async t => {
        calendar = await t.getCalendar({
            height : 500,
            date   : new Date(2021, 2, 27),
            events : [
                {
                    id        : 1,
                    name      : 'Event',
                    startDate : new Date(2021, 2, 22, 10),
                    endDate   : new Date(2021, 2, 22, 11)
                }
            ],
            modes : {
                week : {
                    eventRenderer : ({ renderData }) => {
                        renderData.iconCls['b-fa b-fa-user-friends'] = 1;
                        renderData.iconStyle.color = 'red';
                    }
                }
            }
        });

        // Renderer was able to override the icon colour
        t.hasStyle('.b-cal-event-icon', 'color', 'rgb(255, 0, 0)');
    });

    t.it('Removing icon element', async t => {
        calendar = await t.getCalendar({
            height : 500,
            date   : new Date(2021, 2, 27),
            events : [
                {
                    id        : 1,
                    name      : 'Event',
                    startDate : new Date(2021, 2, 22, 10),
                    endDate   : new Date(2021, 2, 22, 11),
                    iconCls   : 'b-fa b-fa-user-friends'
                }
            ],
            modes : {
                week : {
                    eventRenderer : ({ renderData }) => {
                        renderData.iconCls = null;
                    }
                }
            }
        });

        // Renderer prevented icon rendering
        t.selectorNotExists('.b-cal-event-icon');
    });

    // https://github.com/bryntum/support/issues/5111
    t.it('Should fire all event mouse over/out events', async t => {
        calendar = await t.getCalendar({
            height : 500,
            date   : new Date(2021, 2, 22),
            events : [
                {
                    id        : 1,
                    name      : 'Event 1',
                    startDate : new Date(2021, 2, 22, 7),
                    endDate   : new Date(2021, 2, 22, 8, 15)
                },
                {
                    id        : 2,
                    name      : 'Event 2',
                    startDate : new Date(2021, 2, 22, 8),
                    endDate   : new Date(2021, 2, 22, 9, 15)
                },
                {
                    id        : 3,
                    name      : 'Event 3',
                    startDate : new Date(2021, 2, 22, 9),
                    endDate   : new Date(2021, 2, 22, 10, 15)
                },
                {
                    id        : 4,
                    name      : 'Event 4',
                    startDate : new Date(2021, 2, 22, 10),
                    endDate   : new Date(2021, 2, 22, 11, 15)
                },
                {
                    id        : 5,
                    name      : 'Event 5',
                    startDate : new Date(2021, 2, 22, 11),
                    endDate   : new Date(2021, 2, 22, 12, 15)
                },
                {
                    id        : 6,
                    name      : 'Event 6',
                    startDate : new Date(2021, 2, 22, 12),
                    endDate   : new Date(2021, 2, 22, 13, 15)
                },
                {
                    id        : 7,
                    name      : 'Event 7',
                    startDate : new Date(2021, 2, 22, 13),
                    endDate   : new Date(2021, 2, 22, 14, 15)
                },
                {
                    id        : 8,
                    name      : 'Event 8',
                    startDate : new Date(2021, 2, 22, 14),
                    endDate   : new Date(2021, 2, 22, 15, 15)
                }
            ],
            modes : {
                week   : false,
                month  : false,
                year   : false,
                agenda : false
            }
        });

        const
            expectedEvents = [
                'Mouseover Event 1',
                'Mouseout Event 1',
                'Mouseover Event 2',
                'Mouseout Event 2',
                'Mouseover Event 3',
                'Mouseout Event 3',
                'Mouseover Event 4',
                'Mouseout Event 4',
                'Mouseover Event 5',
                'Mouseout Event 5',
                'Mouseover Event 6',
                'Mouseout Event 6',
                'Mouseover Event 7',
                'Mouseout Event 7',
                'Mouseover Event 8',
                'Mouseout Event 8'
            ],
            firedEvents = [];

        calendar.on({
            eventMouseOver({ eventRecord }) {
                firedEvents.push(`Mouseover ${eventRecord.name}`);
            },
            eventMouseOut({ eventRecord }) {
                firedEvents.push(`Mouseout ${eventRecord.name}`);
            }
        });

        // We are explicitly testing multiple fired mouse events along a track
        t.simulator.setSpeed('speedRun');

        await t.moveMouseTo('.b-cal-event-wrap[data-event-id="1"]');
        await t.moveMouseTo('.b-cal-event-wrap[data-event-id="8"]');
        await t.moveMouseTo('.b-cal-event-wrap[data-event-id="8"]', null, null, [-10, '50%']);

        t.simulator.setSpeed('turboMode');

        // All over/out events must have been fired in order
        t.isDeeply(firedEvents, expectedEvents);
    });

    // https://github.com/bryntum/support/issues/2742
    t.it('Should show hour subticks when zooming in', async t => {
        const tickChanges = [];

        calendar = await t.getCalendar({
            height : 500,
            date   : new Date(2021, 2, 22),
            modes  : {
                week   : false,
                month  : false,
                year   : false,
                agenda : false
            },
            listeners : {
                tickChange(event) {
                    tickChanges.push({
                        type : event.type,
                        old  : event.old,
                        new  : event.new
                    });
                }
            }
        });
        const
            { activeView }      = calendar,
            expectedTickChanges = [
                {
                    type : 'tickchange',
                    old  : {
                        level : 0,
                        step  : '1 hour'
                    },
                    new : {
                        level : 0,
                        step  : '1 hour'
                    }
                },
                {
                    type : 'tickchange',
                    old  : {
                        level : 0,
                        step  : '1 hour'
                    },
                    new : {
                        level : 1,
                        step  : '30 minutes'
                    }
                },
                {
                    type : 'tickchange',
                    old  : {
                        level : 1,
                        step  : '30 minutes'
                    },
                    new : {
                        level : 2,
                        step  : '15 minutes'
                    }
                },
                {
                    type : 'tickchange',
                    old  : {
                        level : 2,
                        step  : '15 minutes'
                    },
                    new : {
                        level : 3,
                        step  : '10 minutes'
                    }
                },
                {
                    type : 'tickchange',
                    old  : {
                        level : 3,
                        step  : '10 minutes'
                    },
                    new : {
                        level : 4,
                        step  : '5 minutes'
                    }
                }
            ];

        function getVisibleMinorTicks() {
            return t.query('.b-dayview-tick-level-4').filter(e => DomHelper.getStyleValue(e, 'opacity') == 1);
        }

        t.is(getVisibleMinorTicks().length, 0);

        activeView.hourHeight = activeView.hourHeightBreakpoints[0];

        // The half hour ticks are visible
        await t.waitFor(() => getVisibleMinorTicks().length === 24 * 1);

        activeView.hourHeight = activeView.hourHeightBreakpoints[1];

        // The fifteen minute ticks are visible
        await t.waitFor(() => getVisibleMinorTicks().length === 24 * 3);

        activeView.hourHeight = activeView.hourHeightBreakpoints[2];

        // The ten minute ticks are visible
        await t.waitFor(() => getVisibleMinorTicks().length === 24 * 5);

        activeView.hourHeight = activeView.hourHeightBreakpoints[3];

        // The five minute ticks are visible
        await t.waitFor(() => getVisibleMinorTicks().length === 24 * 11);

        t.isDeeply(tickChanges, expectedTickChanges);
    });

    t.it('Single day view non-working day must render content', async t => {
        calendar = await t.getCalendar({
            date  : '2022-11-06', // A Sunday
            modes : {
                week   : false,
                month  : false,
                year   : false,
                agenda : false
            },
            events : [{
                startDate : '2022-11-06T08:00',
                endDate   : '2022-11-06T09:00',
                name      : 'On Sunday'
            }],
            modeDefaults : {
                hideNonWorkingDays : true
            }
        });

        // Must have rendered. Hiding non working days is only valid for multi day views
        t.selectorCountIs('.b-cal-event-wrap:visible:contains(On Sunday)', 1);
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

    // https://github.com/bryntum/support/issues/1948
    t.it('Zero length events', async t => {
        calendar = await t.getCalendar({
            modes : {
                week   : false,
                month  : false,
                year   : false,
                agenda : false
            },
            date   : '2020-10-12',
            events : [{
                name      : 'Milestone event',
                startDate : '2020-10-12T11:00',
                endDate   : '2020-10-12T11:00',
                duration  : 0
            }]
        });

        const
            { first } = calendar.eventStore,
            eventEl   = calendar.getElementFromEventRecord(first);

        // Even though it's zero duration, it has 1em height.
        // It's got the CSS class which makes it compact
        t.isGreaterOrEqual(eventEl.offsetHeight, 12);
        t.hasCls(eventEl, 'b-short-event');

        await t.click(eventEl);

        await t.waitFor(() => calendar.features.eventTooltip._tooltip.isVisible);

        // Only one row because there's no duration to show
        t.is(calendar.features.eventTooltip.tooltip.contentElement.children.length, 1);

        first.set({
            startDate : '2020-10-12T10:55',
            endDate   : '2020-10-12T11:05'
        });

        // Zoom in on the event until it switches to normal rendition.
        while (eventEl.classList.contains('b-short-event')) {
            await t.wheel(eventEl, null, null, {
                deltaY  : -10,
                ctrlKey : true
            });
            await t.waitFor(110);
        }

        // Zoom in out the event until it switches to compact rendition.
        while (!eventEl.classList.contains('b-short-event')) {
            await t.wheel(eventEl, null, null, {
                deltaY  : 10,
                ctrlKey : true
            });
            await t.waitFor(110);
        }
    });

    // https://github.com/bryntum/support/issues/4972
    t.it('default current time indicator', async t => {
        calendar = await t.getCalendar({
            date  : new Date(),
            modes : {
                week   : false,
                month  : false,
                year   : false,
                agenda : false
            }
        });
        await t.waitForSelector(`.b-dayview-day-detail[data-date="${DateHelper.makeKey(new Date())}"] .b-current-time-indicator:contains()`);
    });

    t.it('currentTimeIndicatorRenderer as a function', async t => {
        calendar = await t.getCalendar({
            date  : new Date(),
            modes : {
                day : {
                    currentTimeIndicatorRenderer : () => {
                        return {
                            className : 'my-today-indicator',
                            text      : 'NOW'
                        };
                    }
                },
                week   : false,
                month  : false,
                year   : false,
                agenda : false
            }
        });
        await t.waitForSelector(`.b-dayview-day-detail[data-date="${DateHelper.makeKey(new Date())}"] .my-today-indicator:contains(NOW)`);
    });

    t.it('currentTimeIndicatorRenderer as a string', async t => {
        calendar = await t.getCalendar({
            date  : new Date(),
            modes : {
                day : {
                    currentTimeIndicatorRenderer : 'up.getCurrentTimeDomStruct'
                },
                week   : false,
                month  : false,
                year   : false,
                agenda : false

            },
            getCurrentTimeDomStruct() {
                return {
                    className : 'my-today-indicator',
                    text      : 'NOW'
                };
            }
        });
        await t.waitForSelector(`.b-dayview-day-detail[data-date="${DateHelper.makeKey(new Date())}"] .my-today-indicator:contains(NOW)`);
    });

    // https://github.com/bryntum/support/issues/5645
    t.it('sixMinuteTicks', async t => {
        calendar = await t.getCalendar({
            modes : {
                day : {
                    hourHeight     : 300,
                    sixMinuteTicks : true
                },
                week   : false,
                month  : false,
                year   : false,
                agenda : false

            }
        });
        const dayView = calendar.activeView;

        // At 6 minute granularity there must be 240 ticks in the day
        t.selectorCountIs('.b-dayview-timeaxis-time .b-dayview-timeaxis-tick', dayView.contentElement, 240);

        dayView.sixMinuteTicks = false;

        // At 5 minute granularity there must be 288 ticks in the day
        await t.waitForSelectorCount('.b-dayview-timeaxis-time .b-dayview-timeaxis-tick', dayView.contentElement, 288);

        dayView.sixMinuteTicks = true;

        // At 6 minute granularity there must be 240 ticks in the day
        await t.waitForSelectorCount('.b-dayview-timeaxis-time .b-dayview-timeaxis-tick', dayView.contentElement, 240);
    });

    t.it('autoCreate validation', async t => {
        calendar = await t.getCalendar({
            // ScheduleMenu base class disables addEvent if there's no resource
            resources : [{
                id   : 1,
                name : 'Resource 1'
            }],
            modes : {
                week   : false,
                month  : false,
                year   : false,
                agenda : false

            },
            listeners : {
                // Disallow autoCreate of events starting before 10am
                beforeAutoCreate({ date }) {
                    if (DateHelper.getTimeOfDay(date, 'h') < 10) {
                        return false;
                    };
                }
            },
            features : {
                scheduleMenu : true
            }
        });
        const hourPx = calendar.modes.day.hourHeight;

        //
        // dblclick autoCreate
        //
        await t.doubleClick('.b-calendar-cell.b-dayview-day-detail', null, null, null, ['50%', 8 * hourPx]);

        // Wait for erroneous event auto create to occur
        await t.waitFor(100);

        // It should have been vetoed
        t.selectorNotExists('.b-eventeditor');

        await t.doubleClick('.b-calendar-cell.b-dayview-day-detail', null, null, null, ['50%', 10 * hourPx]);

        // This was a valid auto create
        await t.waitForSelector('.b-eventeditor');

        await t.type(null, '[ESCAPE]');

        // Event editor should be gone
        await t.waitForSelectorNotFound('.b-eventeditor');

        //
        // Drag autoCreate
        //
        await t.dragBy({
            source : '.b-calendar-cell.b-dayview-day-detail',
            offset : ['50%', 8 * hourPx],
            delta  : [0, 2 * hourPx]
        });

        // Wait for erroneous event auto create to occur
        await t.waitFor(100);

        // It should have been vetoed
        t.selectorNotExists('.b-eventeditor');

        await t.dragBy({
            source : '.b-calendar-cell.b-dayview-day-detail',
            offset : ['50%', 10 * hourPx],
            delta  : [0, 2 * hourPx]
        });

        // This was a valid auto create
        await t.waitForSelector('.b-eventeditor');

        //
        // Context menu autoCreate
        //
        await t.rightClick('.b-calendar-cell.b-dayview-day-detail', null, null, null, ['50%', 8 * hourPx]);

        await t.click('.b-menuitem:contains(Add event)');

        // Wait for erroneous event auto create to occur
        await t.waitFor(100);

        // It should have been vetoed
        t.selectorNotExists('.b-eventeditor');

        await t.rightClick('.b-calendar-cell.b-dayview-day-detail', null, null, null, ['50%', 10 * hourPx]);

        await t.click('.b-menuitem:contains(Add event)');

        // This was a valid auto create
        await t.waitForSelector('.b-eventeditor');

        await t.type(null, '[ESCAPE]');

        // Event editor should be gone
        t.selectorNotExists('.b-eventeditor');
    });

    // https://github.com/bryntum/support/issues/6622
    t.it('should change date on date header click', async t => {
        calendar = await t.getCalendar({
            date  : new Date(2023, 3, 16),
            modes : {
                week   : false,
                month  : false,
                year   : false,
                agenda : false

            }
        });
        t.is(calendar.date, new Date(2023, 3, 16));

        await t.click('.b-calendarrow-header-container .b-cal-cell-header[data-header-date="2023-04-21"]');

        // Date must change
        t.is(calendar.date, new Date(2023, 3, 21));
    });

    // https://github.com/bryntum/support/issues/6627
    t.it('should show a zero duration all day event as one day long', async t => {
        calendar = await t.getCalendar({
            hideNonWorkingDays : true,

            events : [{
                name      : 'Zero duration',
                startDate : new Date(2023, 3, 18),
                endDate   : new Date(2023, 3, 18),
                allDay    : true
            }],
            date  : new Date(2023, 3, 18),
            modes : {
                month  : false,
                year   : false,
                agenda : false

            }
        });
        const w = calendar.activeView;

        // One bar. It does not continue into the future
        t.selectorCountIs('.b-cal-event-wrap:not(.b-continues-future):contains(Zero duration)', 1);

        // It should be exactly one day wide
        t.is(w.getEventElement(w.eventStore.first).style.width, '20%');
    });

    // https://github.com/bryntum/support/issues/6651
    t.it('should not scroll on drag-create after zoom', async t => {
        calendar = await t.getCalendar({
            hideNonWorkingDays : true,
            events             : [],
            date               : new Date(2023, 3, 18),
            modes              : {
                week   : false,
                month  : false,
                year   : false,
                agenda : false
            }
        });
        const d = calendar.activeView;

        d.zoomTo(500);

        // Element layout has to catch up
        await t.waitFor(100);

        // A non-change triggered the bug
        d.zoomTo(500);

        // Element layout has to catch up
        await t.waitFor(100);

        // Cache Y position. It should not change
        d.scrollable.y = d.hourHeight - 100;

        // Wait for scroll event to have passed
        await t.waitForAnimationFrame();

        // No more scroll events from here.
        t.wontFire(d.scrollable, 'scroll');

        await t.dragBy({
            source : '.b-dayview-day-detail',
            offset : ['50%', d.hourHeight],
            delta  : [0, 20]
        });

        await t.waitFor(() => calendar.features.eventEdit.editor?.containsFocus);

        // View has not scrolled.
        t.is(d.scrollable.y, d.hourHeight - 100);
    });

    t.it('allDayEvents autoCreate : false should work', async t => {
        calendar = await t.getCalendar({
            date  : '2020-10-17',
            modes : {
                day : {
                    allDayEvents : {
                        autoCreate : false
                    }
                },
                week   : false,
                month  : false,
                year   : false,
                agenda : false

            }
        });
        await t.doubleClick('[data-header-date="2020-10-17"]');

        // Nothing is supposed to happen, so we just wait for some bug.
        await t.waitFor(300);

        t.selectorNotExists('.b-eventeditor');
    });

    // https://github.com/bryntum/support/issues/6690
    t.it('bodyColor should work', async t => {
        calendar = await t.getCalendar({
            modes : {
                day : {
                    eventRenderer({ eventRecord, renderData }) {
                        renderData.bodyColor = '#ff9f9f';
                    }
                },
                week   : false,
                month  : false,
                year   : false,
                agenda : false
            },
            date   : '2020-10-12',
            events : [{
                name      : 'Milestone event',
                startDate : '2020-10-12T11:00',
                endDate   : '2020-10-12T13:00'
            }]
        });

        const [body] = await t.waitForSelector('.b-cal-event-body');

        // Body background-color correct
        t.hasStyle(body, 'background-color', 'rgb(255, 159, 159)');
    });

    // https://github.com/bryntum/support/issues/6714
    t.it('DaySelector needs padding if used with a DayView', async t => {
        calendar = await t.getCalendar({
            events : [],
            date   : new Date(2023, 3, 18),
            modes  : {
                day : {
                    daySelector : true
                },
                week   : false,
                month  : false,
                year   : false,
                agenda : false
            }
        });
        const d = calendar.activeView;

        // The DaySelector must be same width as the day content element
        t.isApproxPx(d.daySelector.width, d.dayContentElement.offsetWidth);

        // No bottom border needed when there are no all day events spo that the bottom border
        // doesn't collide with the top border ot the .b-dayview-day-content
        t.hasStyle(d.daySelector.headerCellContainer, 'borderBottomWidth', '0px');

        d.eventStore.add({
            startDate : new Date(2023, 3, 18),
            endDate   : new Date(2023, 3, 18),
            allDay    : true
        });

        await t.waitForAnimationFrame();

        t.hasStyle(d.daySelector.headerCellContainer, 'borderBottomWidth', '1px');
    });

    // https://github.com/bryntum/support/issues/6744
    t.it('allDayEvents should be able to be started expanded and should expand up to configured maxAllDayHeight', async t => {
        const targetDate = new Date(2023, 5, 17);

        calendar = await t.getCalendar({
            events : (() => {
                const result = [];

                for (let i = 0; i < 100; i++) {
                    result.push({
                        name      : `Event ${i + 1}`,
                        startDate : targetDate,
                        endDate   : targetDate,
                        allDay    : true
                    });
                }

                return result;
            })(),
            date  : targetDate,
            modes : {
                day : {
                    maxAllDayHeight : '80%',
                    allDayEvents    : {
                        expanded : true
                    }
                },
                week   : false,
                month  : false,
                year   : false,
                agenda : false
            }
        });
        const
            d = calendar.activeView,
            a = d.allDayEvents;

        // All day events expanded up to 80% of the DayView's height
        t.isApproxPx(a.height, d.height * 0.8);
    });
    t.it('allDayEvents should be able to be started expanded and should expand up to its own maxHeight', async t => {
        const targetDate = new Date(2023, 5, 17);

        calendar = await t.getCalendar({
            events : (() => {
                const result = [];

                for (let i = 0; i < 100; i++) {
                    result.push({
                        name      : `Event ${i + 1}`,
                        startDate : targetDate,
                        endDate   : targetDate,
                        allDay    : true
                    });
                }

                return result;
            })(),
            date  : targetDate,
            modes : {
                day : {
                    allDayEvents : {
                        maxHeight : '80%',
                        expanded  : true
                    }
                },
                week   : false,
                month  : false,
                year   : false,
                agenda : false
            }
        });
        const
            d = calendar.activeView,
            a = d.allDayEvents;

        // All day events expanded up to 80% of the DayView's height
        t.isApproxPx(a.height, d.height * 0.8);
    });

    t.it('autoCreate start point snapping : round, floor or ceil', async t => {
        calendar = await t.getCalendar({
            date  : new Date(2020, 5, 17),
            modes : {
                day : {
                    // For easy test calculation
                    hourHeight : 60
                },
                week   : false,
                month  : false,
                year   : false,
                agenda : false

            },
            listeners : {
                // Disallow autoCreate of events starting before 10am
                beforeAutoCreate({ date }) {
                    dates.push(date);
                    return false;
                }
            }
        });
        const
            dayView = calendar.activeView,
            dates   = [],
            hourPx  = calendar.modes.day.hourHeight;

        //
        // dblclick autoCreate
        //
        for (let minutes = 2; minutes < 60; minutes += 15) {
            await t.doubleClick('.b-calendar-cell.b-dayview-day-detail', null, null, null, ['50%', 8 * hourPx + minutes]);
        }

        // Rounded to closest from 2, 17, 32, 47
        t.isDeeply(dates, [
            new Date(2020, 5, 17, 8),
            new Date(2020, 5, 17, 8, 15),
            new Date(2020, 5, 17, 8, 30),
            new Date(2020, 5, 17, 8, 45)
        ]);

        dates.length = 0;
        dayView.autoCreate.snapType = 'ceil';

        for (let minutes = 2; minutes < 60; minutes += 15) {
            await t.doubleClick('.b-calendar-cell.b-dayview-day-detail', null, null, null, ['50%', 8 * hourPx + minutes]);
        }

        // Rounded up from 2, 17, 32, 47
        t.isDeeply(dates, [
            new Date(2020, 5, 17, 8, 15),
            new Date(2020, 5, 17, 8, 30),
            new Date(2020, 5, 17, 8, 45),
            new Date(2020, 5, 17, 9)
        ]);

        dates.length = 0;
        dayView.autoCreate.snapType = 'floor';

        for (let minutes = 12; minutes < 60; minutes += 15) {
            await t.doubleClick('.b-calendar-cell.b-dayview-day-detail', null, null, null, ['50%', 8 * hourPx + minutes]);
        }

        // Rounded down from 12, 27, 42, 57
        t.isDeeply(dates, [
            new Date(2020, 5, 17, 8),
            new Date(2020, 5, 17, 8, 15),
            new Date(2020, 5, 17, 8, 30),
            new Date(2020, 5, 17, 8, 45)
        ]);
    });

    t.it('Zoom operations need to be async so that post zoomed state my be waited for', async t => {
        calendar = await t.getCalendar({
            events : t.getHackathonData().events.rows,
            date   : new Date(2019, 9, 14),
            modes  : {
                week   : false,
                month  : false,
                year   : false,
                agenda : false
            }
        });
        const
            d      = calendar.activeView,
            events = d.eventStore.getEvents({
                startDate : d.startDate,
                endDate   : d.endDate,
                filter    : e => !e.isInterDay
            }),
            [start, end] = events.reduce((r, e) => {
                // Round times to nearest half hour
                const
                    startHour = DateHelper.getTimeOfDay(DateHelper.floor(e.startDate, '0.5h'), 'h'),
                    endHour   = DateHelper.getTimeOfDay(DateHelper.ceil(e.endDate, '0.5h'), 'h');

                return [(startHour < r[0]) ? startHour : r[0], (endHour > r[1]) ? endHour : r[1]];
            }, [24, 0]);

        await d.zoomTo(Math.floor(d.scrollable.clientHeight / (end - start)));

        // Zoomed such that the two events for this day can just fit.
        t.isApproxPx(d.hourHeight, 79);

        await d.scrollTo(start);

        // Should have scrolled 2pm - the start of the first event to the top of the view
        t.isApproxPx(d.scrollable.y, 1106);
    });
});
