
StartTest(t => {
    let calendar, eventStore, resourceStore, harness;

    const getCalendar = async config => {
        const calendar = await t.getCalendar(config);
        eventStore = calendar.eventStore;
        resourceStore = calendar.resourceStore;
        return calendar;
    };

    t.beforeEach(() => {
        t.setupCalendarTest(calendar, harness);
    });

    t.it('fitHours in DayView with devicePixelRatio = 1', async t => {
        Object.defineProperty(window, 'devicePixelRatio', { value : 1 });

        const date = new Date(2019, 9, 15, 9);

        eventStore = new EventStore({
            data : ArrayHelper.populate(45, i => {
                const id = String(i + 1);

                return {
                    duration     : 1,
                    durationUnit : 'day',
                    id,
                    name         : `Event ${id}`,
                    resourceId   : 'r1',
                    startDate    : date,
                    allDay       : true
                };
            })
        });

        resourceStore = new ResourceStore({
            data : [{
                id   : 'r1',
                name : 'Resource 1'
            }, {
                id   : 'r2',
                name : 'Resource 2'
            }]
        });

        calendar = await getCalendar({
            date  : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            modes : {
                week : {
                    fitHours : {
                        // We want it to shrink so we can check it using dayView.scrollable.clientHeight / 24
                        minHeight : 1
                    }
                },
                day    : false,
                month  : false,
                year   : false,
                agenda : false
            }
        });
        const
            { scrollBarWidth } = DomHelper,
            dayView = calendar.activeView,
            {
                allDayEvents,
                dayContainerElement
            }       = dayView,
            {
                bodyElement,
                cellContainer
            }       = allDayEvents;

        await t.waitForProjectReady(calendar.modes.month);

        // All day events changes height using animation
        await t.waitForAnimations();

        // The day section must adjust itself to not overflow
        await t.waitFor(() => dayView.scrollable.scrollHeight <= dayView.scrollable.clientHeight);

        const initialDayViewHourHeight = dayView.hourHeight;

        // No overflow with fitHours - hidden where scrollbars are visible, doesn't matter where not.
        t.is(bodyElement.style.overflowY, scrollBarWidth ? 'hidden' : 'auto');

        // Widths must be synced.
        t.isApprox(Rectangle.client(dayContainerElement).width, Rectangle.client(cellContainer).width);

        let { refreshCount } = dayView;

        // Expand the all day events to show all the all day events.
        // This should result in there being events overflowing
        await t.click(dayView.cornerElement);

        await dayView.allDayEvents.heightAnimation;

        // That must have caused a refresh. In fact, because of the animation of the
        // height change of the all day row, there will be many more.
        // Hour height changes must cause a refresh because of the application of b-short-event
        // to change the rendition of short events below a certain height.
        t.isGreater(dayView.refreshCount, refreshCount);

        // Hours must get smaller
        await t.waitFor(() => dayView.hourHeight < initialDayViewHourHeight);

        // Scrollable overflow in expanded mode because all day row now has overflow.
        await t.waitFor(() => bodyElement.style.overflowY === 'auto');

        // Widths must still be synced.
        t.isApprox(Rectangle.client(dayContainerElement).width, Rectangle.client(cellContainer).width);

        // The day section must always fit and never be scrollable
        t.isLessOrEqual(dayView.scrollable.scrollHeight, dayView.scrollable.clientHeight);

        refreshCount = dayView.refreshCount;

        // Collapse the all day events so that there's a [+n more] pill to show overflowing events
        await t.click(dayView.cornerElement);

        await dayView.allDayEvents.heightAnimation;

        // That must have caused a refresh. In fact, because of the animation of the
        // height change of the all day row, there will be many more.
        // Hour height changes must cause a refresh because of the application of b-short-event
        // to change the rendition of short events below a certain height.
        t.isGreater(dayView.refreshCount, refreshCount);

        // Hour height grows back again after all day row is collapsed.
        await t.waitFor(() => Math.abs(dayView.hourHeight - initialDayViewHourHeight) < 1);

        // No overflow with fitHours - hidden where scrollbars are visible, doesn't matter where not.
        await t.waitFor(() => bodyElement.style.overflowY === scrollBarWidth ? 'hidden' : 'auto');

        // We must never acquire scroll in the day section
        t.isLessOrEqual(dayView.scrollable.scrollHeight, dayView.scrollable.clientHeight);

        // Widths must still be synced.
        t.isApprox(Rectangle.client(dayContainerElement).width, Rectangle.client(cellContainer).width);

        refreshCount = dayView.refreshCount;

        calendar.height = 500;

        await t.click('button.b-cal-cell-overflow');

        const
            { overflowPopup } = allDayEvents,
            {
                constrainTo,
                lastAlignSpec,
                anchorSize,
                align
            }                 = overflowPopup;

        // Overflow must be within available space inside the constrainPadding margins.
        t.isApproxPx(overflowPopup.y, lastAlignSpec.target.getBoundingClientRect().bottom + anchorSize[1], 'Correct popup position');
        t.isApproxPx(overflowPopup.height, Rectangle.from(constrainTo).height - overflowPopup.y - align.constrainPadding, 'Correct popup height');

        // Resizing must also fix the hour height
        t.isApproxPx(dayView.hourHeight, dayView.scrollable.clientHeight / 24);

        // The height change must have caused a refresh. Hour height changes must cause a refresh
        // because of the application of b-short-event to change the rendition of
        // short events below a certain height.
        t.isGreater(dayView.refreshCount, refreshCount);

        delete window.devicePixelRatio;
    });

    t.it('fitHours in DayView', async t => {
        const date = new Date(2019, 9, 15, 9);

        eventStore = new EventStore({
            data : ArrayHelper.populate(45, i => {
                const id = String(i + 1);

                return {
                    duration     : 1,
                    durationUnit : 'day',
                    id,
                    name         : `Event ${id}`,
                    resourceId   : 'r1',
                    startDate    : date,
                    allDay       : true
                };
            })
        });

        resourceStore = new ResourceStore({
            data : [{
                id   : 'r1',
                name : 'Resource 1'
            }, {
                id   : 'r2',
                name : 'Resource 2'
            }]
        });

        calendar = await getCalendar({
            date  : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            modes : {
                week : {
                    fitHours : {
                        // We want it to shrink so we can check it using dayView.scrollable.clientHeight / 24
                        minHeight : 1
                    }
                },
                day    : false,
                month  : false,
                year   : false,
                agenda : false
            }
        });
        const
            { scrollBarWidth } = DomHelper,
            dayView = calendar.activeView,
            {
                allDayEvents,
                dayContainerElement
            }       = dayView,
            {
                bodyElement,
                cellContainer
            }       = allDayEvents;

        await t.waitForProjectReady(calendar.modes.month);

        // All day events changes height using animation
        await t.waitForAnimations();

        // The day section must adjust itself to not overflow
        await t.waitFor(() => dayView.scrollable.scrollHeight <= dayView.scrollable.clientHeight);

        const initialDayViewHourHeight = dayView.hourHeight;

        // No overflow with fitHours - hidden where scrollbars are visible, doesn't matter where not.
        t.is(bodyElement.style.overflowY, scrollBarWidth ? 'hidden' : 'auto');

        // Widths must be synced.
        t.isApprox(Rectangle.client(dayContainerElement).width, Rectangle.client(cellContainer).width);

        let { refreshCount } = dayView;

        // Expand the all day events to show all the all day events.
        // This should result in there being events overflowing
        await t.click(dayView.cornerElement);

        await dayView.allDayEvents.heightAnimation;

        // That must have caused a refresh. In fact, because of the animation of the
        // height change of the all day row, there will be many more.
        // Hour height changes must cause a refresh because of the application of b-short-event
        // to change the rendition of short events below a certain height.
        t.isGreater(dayView.refreshCount, refreshCount);

        // Hours must get smaller
        await t.waitFor(() => dayView.hourHeight < initialDayViewHourHeight);

        // Scrollable overflow in expanded mode because all day row now has overflow.
        await t.waitFor(() => bodyElement.style.overflowY === 'auto');

        // Widths must still be synced.
        t.isApprox(Rectangle.client(dayContainerElement).width, Rectangle.client(cellContainer).width);

        // The day section must always fit nd never be scrollable
        t.isLessOrEqual(dayView.scrollable.scrollHeight, dayView.scrollable.clientHeight);

        refreshCount = dayView.refreshCount;

        // Collapse the all day events so that there's a [+n more] pill to show overflowing events
        await t.click(dayView.cornerElement);

        await dayView.allDayEvents.heightAnimation;

        // That must have caused a refresh. In fact, because of the animation of the
        // height change of the all day row, there will be many more.
        // Hour height changes must cause a refresh because of the application of b-short-event
        // to change the rendition of short events below a certain height.
        t.isGreater(dayView.refreshCount, refreshCount);

        // Hour height grows back again after all day row is collapsed.
        await t.waitFor(() => Math.abs(dayView.hourHeight - initialDayViewHourHeight) < 1);

        // No overflow with fitHours - hidden where scrollbars are visible, doesn't matter where not.
        await t.waitFor(() => bodyElement.style.overflowY === scrollBarWidth ? 'hidden' : 'auto');

        // We must never acquire scroll in the day section
        t.isLessOrEqual(dayView.scrollable.scrollHeight, dayView.scrollable.clientHeight);

        // Widths must still be synced.
        t.isApprox(Rectangle.client(dayContainerElement).width, Rectangle.client(cellContainer).width);

        refreshCount = dayView.refreshCount;

        calendar.height = 500;

        await t.click('button.b-cal-cell-overflow');

        const
            { overflowPopup } = allDayEvents,
            {
                constrainTo,
                lastAlignSpec,
                anchorSize,
                align
            }                 = overflowPopup;

        // Overflow must be within available space inside the constrainPadding margins.
        t.isApproxPx(overflowPopup.y, lastAlignSpec.target.getBoundingClientRect().bottom + anchorSize[1], 'Correct popup position');
        t.isApproxPx(overflowPopup.height, Rectangle.from(constrainTo).height - overflowPopup.y - align.constrainPadding, 'Correct popup height');

        // Resizing must also fix the hour height
        t.isApproxPx(dayView.hourHeight, dayView.scrollable.clientHeight / 24);

        // The height change must have caused a refresh. Hour height changes must cause a refresh
        // because of the application of b-short-event to change the rendition of
        // short events below a certain height.
        t.isGreater(dayView.refreshCount, refreshCount);
    });

    t.it('fitHours in DayView with minimum hour height', async t => {
        const
            date = new Date(2019, 9, 15, 9),
            { scrollBarWidth } = DomHelper;

        eventStore = new EventStore({
            data : ArrayHelper.populate(45, i => {
                const id = String(i + 1);

                return {
                    duration     : 1,
                    durationUnit : 'day',
                    id,
                    name         : `Event ${id}`,
                    resourceId   : 'r1',
                    startDate    : date,
                    allDay       : true
                };
            })
        });

        resourceStore = new ResourceStore({
            data : [{
                id   : 'r1',
                name : 'Resource 1'
            }, {
                id   : 'r2',
                name : 'Resource 2'
            }]
        });

        calendar = await getCalendar({
            date  : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            modes : {
                week : {
                    fitHours : {
                        minHeight : 20
                    }
                },
                day    : false,
                month  : false,
                year   : false,
                agenda : false
            }
        });
        const
            dayView = calendar.activeView,
            {
                allDayEvents,
                dayContainerElement
            }       = dayView,
            {
                bodyElement,
                cellContainer
            }       = allDayEvents;

        await t.waitForProjectReady(calendar.modes.month);

        // All day events changes height using animation
        await t.waitForAnimations();

        // The day section must adjust itself to not overflow
        await t.waitFor(() => dayView.scrollable.scrollHeight <= dayView.scrollable.clientHeight);

        // No overflow with fitHours - hidden where scrollbars are visible, doesn't matter where not.
        t.is(bodyElement.style.overflowY, scrollBarWidth ? 'hidden' : 'auto');

        // Widths must be synced.
        t.isApprox(Rectangle.client(dayContainerElement).width, Rectangle.client(cellContainer).width);

        calendar.height = 500;

        // Resizing must not go below 20, even though fit height would be about 11
        t.isApproxPx(dayView.hourHeight, 20);

        // Widths must be synced.
        t.isApprox(Rectangle.client(dayContainerElement).width, Rectangle.client(cellContainer).width);
    });

    t.it('WeekView should be able to work without an all day row', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date  : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            modes : {
                week : {
                    allDayEvents  : null,
                    dayStartShift : 9
                },
                day    : null,
                month  : null,
                year   : null,
                agenda : null
            }
        });
        const
            dayView          = calendar.activeView,
            { allDayEvents } = dayView;

        await t.waitForProjectReady(calendar.modes.week);

        t.notOk(allDayEvents);

        // Must not throw on allDayEvents being null
        dayView.dayStartShift = 7;

        // Must not throw on allDayEvents being null
        dayView.hourHeight = 20;

        // Must not throw on allDayEvents being null
        calendar.height = 500;
    });

    t.it('WeekView should be able to be forced to be empty using eventFilter as a function', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date  : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            modes : {
                week : {
                    allDayEvents : {
                        eventFilter : () => false
                    },
                    dayStartShift : 9
                },
                day    : null,
                month  : null,
                year   : null,
                agenda : null
            }
        });
        const
            dayView          = calendar.activeView,
            { allDayEvents } = dayView;

        await t.waitForProjectReady(calendar.modes.week);

        t.ok(allDayEvents);

        // No events, and no event height
        t.is(Math.max(0, ...[...allDayEvents._cellMap.values()].map(c => c.events.length)), 0);
        t.is(allDayEvents.eventContainerHeight, 1);

        // Must not throw on allDayEvents being null
        dayView.dayStartShift = 7;

        // Must not throw on allDayEvents being null
        dayView.hourHeight = 20;

        // Must not throw on allDayEvents being null
        calendar.height = 500;
    });

    t.it('WeekView should be able to be forced to be empty using eventFilter as a string', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date  : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            modes : {
                week : {
                    allDayEvents : {
                        eventFilter : 'up.weekEventFilter'
                    },
                    dayStartShift : 9
                },
                day    : null,
                month  : null,
                year   : null,
                agenda : null
            },
            weekEventFilter : () => false
        });
        const
            dayView          = calendar.activeView,
            { allDayEvents } = dayView;

        await t.waitForProjectReady(calendar.modes.week);

        t.ok(allDayEvents);

        // No events, and no event height
        t.is(Math.max(0, ...[...allDayEvents._cellMap.values()].map(c => c.events.length)), 0);
        t.is(allDayEvents.eventContainerHeight, 1);

        // Must not throw on allDayEvents being null
        dayView.dayStartShift = 7;

        // Must not throw on allDayEvents being null
        dayView.hourHeight = 20;

        // Must not throw on allDayEvents being null
        calendar.height = 500;
    });

    t.it('should not change date when clicking inside an overflow popup for an "other month" date', async t => {
        eventStore = new EventStore({
            data : [{
                startDate : '2020-11-05',
                endDate   : '2020-11-06',
                name      : 'Event 1'
            }, {
                startDate : '2020-11-05',
                endDate   : '2020-11-06',
                name      : 'Event 2'
            }, {
                startDate : '2020-11-05',
                endDate   : '2020-11-06',
                name      : 'Event 3'
            }, {
                startDate : '2020-11-05',
                endDate   : '2020-11-06',
                name      : 'Event 4'
            }, {
                startDate : '2020-11-05',
                endDate   : '2020-11-06',
                name      : 'Event 5'
            }, {
                startDate : '2020-11-05',
                endDate   : '2020-11-06',
                name      : 'Event 6'
            }, {
                startDate : '2020-11-05',
                endDate   : '2020-11-06',
                name      : 'Event 7'
            }, {
                startDate : '2020-11-05',
                endDate   : '2020-11-06',
                name      : 'Event 8'
            }, {
                startDate : '2020-11-05',
                endDate   : '2020-11-06',
                name      : 'Event 9'
            }, {
                startDate : '2020-11-05',
                endDate   : '2020-11-06',
                name      : 'Event 10'
            }]
        });

        resourceStore = new ResourceStore({
            data : []
        });

        const calDate = new Date(2020, 9, 1);

        calendar = await getCalendar({
            date  : calDate,
            eventStore,
            resourceStore,
            modes : {
                day    : false,
                week   : false,
                agenda : false
            },
            listeners : {
                dayNumberClick(e) {
                    fromOverflowPopup = e.fromOverflowPopup;
                }
            }
        });
        let fromOverflowPopup = false;

        await t.click('.b-cal-cell-overflow');

        await t.waitFor(() => calendar.activeView.overflowPopup.containsFocus);

        // Should not navigate to the cell's month even though it's in next month
        // because the user is interacting with the cell and the UI is anchored there.
        t.is(calendar.date, calDate);

        // This will cause a dayNumberClick but must not navigate
        await t.click('.b-overflowpopup header');

        // Event happened and did not navigate
        t.ok(fromOverflowPopup);
        t.ok(calendar.activeView.overflowPopup.isVisible);

        await t.click('.b-cal-event-wrap:contains(Event 10)');

        await t.waitFor(() => calendar.features.eventTooltip.tooltip.isVisible);

        // Should not navigate to the cell's month even though it's in next month
        // because the user is interacting with the cell and the UI is anchored there.
        t.is(calendar.date, calDate);

        await t.click(calendar.features.eventTooltip.tooltip.tools.edit.element);

        // Should not navigate to the cell's month even though it's in next month
        // because the user is interacting with the cell and the UI is anchored there.
        t.is(calendar.date, calDate);

        await t.waitFor(() => calendar.features.eventEdit.editor.containsFocus);

        // Should not navigate to the cell's month even though it's in next month
        // because the user is interacting with the cell and the UI is anchored there.
        t.is(calendar.date, calDate);

        await t.click(calendar.features.eventEdit.editor.tools.close.element);

        await t.waitFor(() => calendar.activeView.overflowPopup.containsFocus);

        t.is(calendar.date, calDate);

        await t.click(calendar.activeView.overflowPopup.headerElement);

        // That must not change the date
        t.is(calendar.date, calDate);
    });

    t.it('should not change date when clicking on an event bar in an "other month" date', async t => {
        eventStore = new EventStore({
            data : [{
                startDate : '2020-11-05',
                endDate   : '2020-11-06',
                name      : 'Event 1'
            }]
        });

        resourceStore = new ResourceStore({
            data : []
        });

        const calDate = new Date(2020, 9, 1);

        calendar = await getCalendar({
            date  : calDate,
            eventStore,
            resourceStore,
            modes : {
                day    : false,
                week   : false,
                agenda : false
            }
        });

        await t.click('.b-cal-event-wrap:contains(Event 1)');

        await t.waitFor(() => calendar.features.eventTooltip.tooltip.isVisible);

        // Should not navigate to the cell's month even though it's in next month
        // because the user is interacting with the event bar and the UI is anchored there.
        t.is(calendar.date, calDate);
    });

    t.it('should navigate to the day view on click of the overflow popup header', async t => {
        eventStore = new EventStore({
            data : [{
                startDate : '2020-11-05',
                endDate   : '2020-11-06',
                name      : 'Event 1'
            }, {
                startDate : '2020-11-05',
                endDate   : '2020-11-06',
                name      : 'Event 2'
            }, {
                startDate : '2020-11-05',
                endDate   : '2020-11-06',
                name      : 'Event 3'
            }, {
                startDate : '2020-11-05',
                endDate   : '2020-11-06',
                name      : 'Event 4'
            }, {
                startDate : '2020-11-05',
                endDate   : '2020-11-06',
                name      : 'Event 5'
            }, {
                startDate : '2020-11-05',
                endDate   : '2020-11-06',
                name      : 'Event 6'
            }, {
                startDate : '2020-11-05',
                endDate   : '2020-11-06',
                name      : 'Event 7'
            }, {
                startDate : '2020-11-05',
                endDate   : '2020-11-06',
                name      : 'Event 8'
            }, {
                startDate : '2020-11-05',
                endDate   : '2020-11-06',
                name      : 'Event 9'
            }, {
                startDate : '2020-11-05',
                endDate   : '2020-11-06',
                name      : 'Event 10'
            }]
        });

        resourceStore = new ResourceStore({
            data : []
        });

        calendar = await getCalendar({
            date  : new Date(2020, 10, 1),
            eventStore,
            resourceStore,
            mode  : 'month',
            modes : {
                week   : false,
                agenda : false
            }
        });

        await t.click('.b-cal-cell-overflow');

        // In contrast to the previous test, clicking the *header* should navigate away.
        await t.click(calendar.activeView.overflowPopup.headerElement);

        await t.waitFor(300);

        t.is(calendar.mode, 'day');

        // That must change not the date
        t.is(calendar.date, new Date(2020, 10, 5));
    });

    t.it('Should honour minDate and maxDate', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date    : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            minDate : new Date(2018, 11, 30),
            maxDate : new Date(2020, 0, 12),
            mode    : 'year'
        });

        // test minDate
        t.is(calendar.activeView.year, 2019);

        await t.click('button[data-ref="prevButton"]');

        t.is(calendar.activeView.year, 2019);

        await t.click('.b-yearview-month-name:contains(January)');

        await t.waitForAnimations();

        await t.waitFor(() => calendar.activeView.month.month === 0);

        await t.click('button[data-ref="prevButton"]');

        t.is(calendar.activeView.month.month, 0);

        await t.click('.b-cal-cell-header .b-week-num:contains(1)');

        await t.waitForAnimations();

        await t.waitFor(() => ObjectHelper.isEqual(calendar.activeView.week, [2019, 1]));

        await t.click('button[data-ref="prevButton"]');

        t.isDeeply(calendar.activeView.week, [2019, 1]);

        await t.click('.b-cal-cell-header .b-day-name-date:contains(30)');

        await t.waitForAnimations();

        await t.waitFor(() => ObjectHelper.isEqual(calendar.activeView.date, new Date(2018, 11, 30)));

        await t.click('button[data-ref="prevButton"]');

        t.is(calendar.activeView.date, new Date(2018, 11, 30));

        // Now for maxDate

        await t.click('button[data-ref="yearShowButton"]');

        await t.waitForAnimations();

        t.is(calendar.activeView.year, 2019);

        await t.click('button[data-ref="nextButton"]');

        t.is(calendar.activeView.year, 2019);

        await t.click('.b-yearview-month-name:contains(December)');

        await t.waitForAnimations();

        await t.waitFor(() => calendar.activeView.month.month === 11);

        await t.click('button[data-ref="nextButton"]');

        t.is(calendar.activeView.month.month, 11);

        await t.click('.b-calendar-cell[data-date="2020-01-05"] .b-week-num:contains(2)');

        await t.waitForAnimations();

        await t.waitFor(() => ObjectHelper.isEqual(calendar.activeView.week, [2019, 49]));

        await t.click('button[data-ref="nextButton"]');

        t.isDeeply(calendar.activeView.week, [2019, 50]);

        await t.click('.b-cal-cell-header .b-day-name-date:contains(11)');

        await t.waitForAnimations();

        await t.waitFor(() => ObjectHelper.isEqual(calendar.activeView.date, new Date(2019, 11, 11)));

        await t.click('button[data-ref="nextButton"]');

        t.is(calendar.activeView.date, new Date(2019, 11, 12));
    });

    t.it('beforeDateChange event', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date      : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            mode      : 'year',
            listeners : {
                beforeDateChange() {
                    return false;
                }
            }
        });

        t.is(calendar.activeView.year, 2019);

        await t.click('button[data-ref="prevButton"]');

        t.is(calendar.activeView.year, 2019);

        await t.click('button[data-ref="nextButton"]');

        t.is(calendar.activeView.year, 2019);

        await t.click('.b-yearview-month-name:contains(January)');

        await t.waitForAnimations();

        // Date was set to October 14th, so the month view is stuck in October
        await t.waitFor(() => calendar.activeView.month.month === 9);

        await t.click('button[data-ref="prevButton"]');

        t.is(calendar.activeView.month.month, 9);

        await t.click('button[data-ref="nextButton"]');

        t.is(calendar.activeView.month.month, 9);

        await t.click('.b-cal-cell-header .b-week-num:contains(45)');

        await t.waitForAnimations();

        // Date is Oct 14th, so forced to week 42
        await t.waitFor(() => ObjectHelper.isEqual(calendar.activeView.week, [2019, 42]));

        await t.click('button[data-ref="prevButton"]');

        t.isDeeply(calendar.activeView.week, [2019, 42]);

        await t.click('button[data-ref="nextButton"]');

        t.isDeeply(calendar.activeView.week, [2019, 42]);

        await t.click('.b-cal-cell-header .b-day-name-date:contains(13)');

        await t.waitForAnimations();

        // Date is locked to Oct 14th.
        await t.waitFor(() => ObjectHelper.isEqual(calendar.activeView.date, new Date(2019, 9, 14)));

        await t.click('button[data-ref="prevButton"]');

        t.is(calendar.activeView.date, new Date(2019, 9, 14));

        await t.click('button[data-ref="nextButton"]');

        t.is(calendar.activeView.date, new Date(2019, 9, 14));
    });

});
