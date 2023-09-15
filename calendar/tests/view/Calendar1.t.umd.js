
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

    t.it('Calendar date range change events', async t => {
        const loadDateRangeEvents = [];

        calendar = await getCalendar({
            sidebar   : false,
            mode      : 'day',
            data      : [],
            date      : new Date(2019, 9, 13),
            listeners : {
                dateRangeChange(e) {
                    loadDateRangeEvents.push(e);
                }
            }
        });

        t.chain(
            async() => t.is(calendar.mode, 'day'),

            next => {
                // DayView
                t.isDeeply(loadDateRangeEvents[0].old, {});
                t.isDeeply(loadDateRangeEvents[0].new, {
                    startDate : new Date(2019, 9, 13),
                    endDate   : new Date(2019, 9, 14)
                });
                next();
            },

            { click : 'button[data-ref=weekShowButton]' },

            { waitFor : () => loadDateRangeEvents.length === 2 },

            async() => t.is(calendar.mode, 'week'),

            next => {
                // WeekView
                t.isDeeply(loadDateRangeEvents[1].old, {
                    startDate : new Date(2019, 9, 13),
                    endDate   : new Date(2019, 9, 14)
                });
                t.isDeeply(loadDateRangeEvents[1].new, {
                    startDate : new Date(2019, 9, 13),
                    endDate   : new Date(2019, 9, 20)
                });
                next();
            },

            { click : 'button[data-ref=monthShowButton]' },

            async() => t.is(calendar.mode, 'month'),

            next => {
                // MonthView
                t.isDeeply(loadDateRangeEvents[2].old, {
                    startDate : new Date(2019, 9, 13),
                    endDate   : new Date(2019, 9, 20)
                });
                t.isDeeply(loadDateRangeEvents[2].new, {
                    startDate : new Date(2019, 8, 29),
                    endDate   : new Date(2019, 10, 10)
                });
                next();
            },

            { click : 'button:contains(Year)' },

            async() => t.is(calendar.mode, 'year'),

            next => {
                // YearView
                t.isDeeply(loadDateRangeEvents[3].old, {
                    startDate : new Date(2019, 8, 29),
                    endDate   : new Date(2019, 10, 10)
                });
                t.isDeeply(loadDateRangeEvents[3].new, {
                    startDate : new Date(2018, 11, 30),
                    endDate   : new Date(2020, 0, 12)
                });
                next();
            },

            { click : 'button:contains(Day)' },

            async() => t.is(calendar.mode, 'day'),

            { click : 'button[data-ref="prevButton"]' },

            next => {
                t.isDeeply(loadDateRangeEvents[4].old, {
                    startDate : new Date(2018, 11, 30),
                    endDate   : new Date(2020, 0, 12)
                });
                t.isDeeply(loadDateRangeEvents[4].new, {
                    startDate : new Date(2019, 9, 12),
                    endDate   : new Date(2019, 9, 13)
                });
                next();
            },

            { click : 'button[data-ref="nextButton"]' },

            next => {
                t.isDeeply(loadDateRangeEvents[5].old, {
                    startDate : new Date(2019, 9, 12),
                    endDate   : new Date(2019, 9, 13)
                });
                t.isDeeply(loadDateRangeEvents[5].new, {
                    startDate : new Date(2019, 9, 13),
                    endDate   : new Date(2019, 9, 14)
                });
                next();
            },

            { click : 'button[data-ref=weekShowButton]' },

            async() => t.is(calendar.mode, 'week'),

            { click : 'button[data-ref="prevButton"]' },

            next => {
                t.isDeeply(loadDateRangeEvents[6].old, {
                    startDate : new Date(2019, 9, 13),
                    endDate   : new Date(2019, 9, 14)
                });
                t.isDeeply(loadDateRangeEvents[6].new, {
                    startDate : new Date(2019, 9, 6),
                    endDate   : new Date(2019, 9, 13)
                });
                next();
            },

            { click : 'button[data-ref="nextButton"]' },

            next => {
                t.isDeeply(loadDateRangeEvents[7].old, {
                    startDate : new Date(2019, 9, 6),
                    endDate   : new Date(2019, 9, 13)
                });
                t.isDeeply(loadDateRangeEvents[7].new, {
                    startDate : new Date(2019, 9, 13),
                    endDate   : new Date(2019, 9, 20)
                });
                next();
            },

            { click : 'button[data-ref=monthShowButton]' },

            async() => t.is(calendar.mode, 'month'),

            { click : 'button[data-ref="prevButton"]' },

            next => {
                t.isDeeply(loadDateRangeEvents[8].old, {
                    startDate : new Date(2019, 9, 13),
                    endDate   : new Date(2019, 9, 20)
                });
                t.isDeeply(loadDateRangeEvents[8].new, {
                    startDate : new Date(2019, 8, 1),
                    endDate   : new Date(2019, 9, 13)
                });
                next();
            },

            { click : 'button[data-ref="nextButton"]' },

            next => {
                t.isDeeply(loadDateRangeEvents[9].old, {
                    startDate : new Date(2019, 8, 1),
                    endDate   : new Date(2019, 9, 13)
                });
                t.isDeeply(loadDateRangeEvents[9].new, {
                    startDate : new Date(2019, 8, 29),
                    endDate   : new Date(2019, 10, 10)
                });
                next();
            },

            { click : 'button:contains(Year)' },

            async() => t.is(calendar.mode, 'year'),

            { click : 'button[data-ref="prevButton"]' },

            next => {
                t.isDeeply(loadDateRangeEvents[10].old, {
                    startDate : new Date(2019, 8, 29),
                    endDate   : new Date(2019, 10, 10)
                });
                t.isDeeply(loadDateRangeEvents[10].new, {
                    startDate : new Date(2017, 11, 31),
                    endDate   : new Date(2019, 0, 6)
                });
                next();
            },

            { click : 'button[data-ref="nextButton"]' },

            () => {
                // Exactly the expected number of data requests
                t.is(loadDateRangeEvents.length, 12);

                t.isDeeply(loadDateRangeEvents[11].old, {
                    startDate : new Date(2017, 11, 31),
                    endDate   : new Date(2019, 0, 6)
                });
                t.isDeeply(loadDateRangeEvents[11].new, {
                    startDate : new Date(2018, 11, 30),
                    endDate   : new Date(2020, 0, 12)
                });
            }
        );
    });

    t.it('Inline loading on Calendar date range change events', async t => {
        const
            data          = t.getHackathonData(),
            events        = data.events.rows;

        eventStore    = new EventStore({
            data : []
        });
        resourceStore = new ResourceStore({
            data : data.resources.rows
        });

        let dateRangeChangeCount = 0;

        calendar = await getCalendar({
            sidebar : false,
            mode    : 'month',
            data    : [],
            date    : new Date(2019, 9, 13),
            modes   : {
                resource : true
            },
            listeners : {
                dateRangeChange({
                    source : calendar,
                    new    : {
                        startDate : newStartDate,
                        endDate   : newEndDate
                    }
                }) {
                    dateRangeChangeCount++;

                    const loadedEvents = events.filter(e => {
                        // So we have a parsed date to test
                        e = eventStore.createRecord(e);

                        return DateHelper.intersectSpans(e.startDate, e.endDate, newStartDate, newEndDate);
                    });

                    calendar.project.loadInlineData({
                        eventsData    : loadedEvents,
                        resourcesData : data.resources.rows
                    });
                }
            }
        });

        // The initial refresh must have requested its date range
        t.is(dateRangeChangeCount, 1);

        t.is(eventStore.count, 27);
        eventStore.forEach(e => {
            if (!DateHelper.intersectSpans(e.startDate, e.endDate, calendar.activeView.startDate, calendar.activeView.endDate)) {
                t.fail(`Event ${e.name}, ${DateHelper.format(e.startDate, 'YYYY-MM-DD')}-${DateHelper.format(e.endDate, 'YYYY-MM-DD')} found outside requested time range`);
            }
        });

        // Switch to a week view
        await t.waitForEventOnTrigger(calendar, 'activeItemChange', () =>
            t.click('[data-ref="weekShowButton"]')
        );
        // The request for the week's range
        t.is(dateRangeChangeCount, 2);

        t.is(eventStore.count, 23);
        eventStore.forEach(e => {
            if (!DateHelper.intersectSpans(e.startDate, e.endDate, calendar.activeView.startDate, calendar.activeView.endDate)) {
                t.fail(`Event ${e.name}, ${DateHelper.format(e.startDate, 'YYYY-MM-DD')}-${DateHelper.format(e.endDate, 'YYYY-MM-DD')} found outside requested time range`);
            }
        });

        // Switch to a single day view by clicking a day header
        await t.waitForEventOnTrigger(calendar, 'activeItemChange', () =>
            t.click('.b-cal-cell-header[data-header-date="2019-10-14"]')
        );

        // The request for the day's range
        t.is(dateRangeChangeCount, 3);

        t.is(eventStore.count, 4);
        eventStore.forEach(e => {
            if (!DateHelper.intersectSpans(e.startDate, e.endDate, calendar.activeView.startDate, calendar.activeView.endDate)) {
                t.fail(`Event ${e.name}, ${DateHelper.format(e.startDate, 'YYYY-MM-DD')}-${DateHelper.format(e.endDate, 'YYYY-MM-DD')} found outside requested time range`);
            }
        });

        // Back to the week
        await t.waitForEventOnTrigger(calendar, 'activeItemChange', () =>
            t.click('[data-ref="weekShowButton"]')
        );
        // The request for the week's range
        t.is(dateRangeChangeCount, 4);

        t.is(eventStore.count, 23);
        eventStore.forEach(e => {
            if (!DateHelper.intersectSpans(e.startDate, e.endDate, calendar.activeView.startDate, calendar.activeView.endDate)) {
                t.fail(`Event ${e.name}, ${DateHelper.format(e.startDate, 'YYYY-MM-DD')}-${DateHelper.format(e.endDate, 'YYYY-MM-DD')} found outside requested time range`);
            }
        });

        // After this, when we switch to the day, it must load events for the 15th
        calendar.date = '2019-10-15';

        // Back to the day
        await t.waitForEventOnTrigger(calendar, 'activeItemChange', () =>
            t.click('[data-ref="dayShowButton"]')
        );

        // The request for the 15th
        t.is(dateRangeChangeCount, 5);

        t.is(eventStore.count, 7);
        eventStore.forEach(e => {
            if (!DateHelper.intersectSpans(e.startDate, e.endDate, calendar.activeView.startDate, calendar.activeView.endDate)) {
                t.fail(`Event ${e.name}, ${DateHelper.format(e.startDate, 'YYYY-MM-DD')}-${DateHelper.format(e.endDate, 'YYYY-MM-DD')} found outside requested time range`);
            }
        });

        // To the resource view. It's a week view by default
        await t.waitForEventOnTrigger(calendar, 'activeItemChange', () =>
            t.click('[data-ref="resourceShowButton"]')
        );

        t.is(calendar.activeView.startDate, new Date(2019, 9, 13));
        t.is(calendar.activeView.endDate, new Date(2019, 9, 20));

        // The request for the week Sun 13th to Sat 19th inclusive
        t.is(dateRangeChangeCount, 6);

        t.is(eventStore.count, 23);
        eventStore.forEach(e => {
            if (!DateHelper.intersectSpans(e.startDate, e.endDate, calendar.activeView.startDate, calendar.activeView.endDate)) {
                t.fail(`Event ${e.name}, ${DateHelper.format(e.startDate, 'YYYY-MM-DD')}-${DateHelper.format(e.endDate, 'YYYY-MM-DD')} found outside requested time range`);
            }
        });
    });

    t.it('hiding the active date should move the active date to a visible date', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            // This is a Sunday
            date  : new Date(2019, 9, 13),
            eventStore,
            resourceStore,
            modes : {
                day    : null,
                month  : null,
                year   : null,
                agenda : null
            }
        });

        calendar.activeView.hideNonWorkingDays = true;

        // Because the 13th is now a hidden date.
        t.is(calendar.date, new Date(2019, 9, 14), 'Active date is now Monday 14th');

        calendar.activeView.hideNonWorkingDays = false;

        t.is(calendar.date, new Date(2019, 9, 14), 'No change');

        calendar.date = new Date(2019, 9, 19);

        t.is(calendar.date, new Date(2019, 9, 19), 'Active date is now Saturday 19th');

        calendar.activeView.hideNonWorkingDays = true;

        // Because the 19th is now a hidden date.
        t.is(calendar.date, new Date(2019, 9, 18), 'Active date is now Saturday 18th');
    });

    t.it('Drag-create and drag-resize into a different zone should not throw errors', async t => {
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

        calendar = await getCalendar({
            date  : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            modes : {
                day    : null,
                month  : null,
                year   : null,
                agenda : null
            }
        });

        await t.dragTo('.b-dayview-day-detail.b-calendar-cell[data-date="2019-10-15"]',
            '.b-dayview-allday.b-calendar-cell[data-date="2019-10-15"]', null, null, null, true, ['50%', 20], ['50%', '100%-10']);

        await t.mouseUp(null);

        await t.dragTo('.b-dayview-day-detail.b-calendar-cell[data-date="2019-10-16"] .b-cal-event-wrap',
            '.b-dayview-allday.b-calendar-cell[data-date="2019-10-16"]', null, null, null, true, ['50%', 5], ['50%', '100%-10']);

        t.pass('Drag out of week view worked with no errors');
    });

    t.it('Should be able to modify an occurrence maintaining the original COUNT', async t => {
        harness = t.setupWeekViewDragHarness();

        await harness.init(t, {
            // This is a Sunday
            date     : new Date(2019, 9, 13),
            events   : [],
            features : {
                eventEdit : true
            },
            modes : {
                day    : null,
                month  : null,
                year   : null,
                agenda : null
            }
        });
        calendar = harness.calendar;

        // Drag-create a recurring event that spans three days
        await harness.dayTimeDrag({
            keys : '^',
            from : { date : '2019-10-16', time : '2:00' },
            to   : { date : '2019-10-18', time : '5:00' }
        });

        await t.waitFor(() => calendar.features.eventEdit.editor?.containsFocus);

        await t.type(null, 'Three of these');

        // Edit to ensure that the count is 3
        await t.click('button[data-ref="editRecurrenceButton"]');

        await t.click('[data-ref="stopRecurrenceField"] [data-ref="expand"]');

        await t.click('.b-list-item:contains(After)');

        await t.type('[data-ref="countField"] input', 3, null, null, null, true);

        await t.click('.b-recurrenceeditor button[data-ref="saveButton"]');

        // Save the new recurring event
        await t.click('.b-eventeditor button[data-ref="saveButton"]');

        // There should be three
        t.selectorCountIs('.b-cal-event-wrap', 3, 'Three events in total');

        t.isStrict(harness.newEventRecord.allDay, false, 'Correct allDay');
        t.is(harness.newEventRecord.startDate, new Date(2019, 9, 16, 2), 'Correct startDate');
        t.is(harness.newEventRecord.endDate, new Date(2019, 9, 16, 5), 'Correct endDate');

        t.is(harness.occurrences.length, 3, 'Correct number of occurrences');
        t.is(harness.newEventRecord.recurrence.count, 3, 'Correct recurrence count');
        t.is(harness.newEventRecord.recurrence.frequency, 'DAILY', 'Correct recurrence frequency');
        t.is(harness.newEventRecord.recurrence.interval, 1, 'Correct recurrence interval');

        // There will be 2 occurrences. Modify the first one.
        const eventRecord = harness.newEventRecord.occurrences[0];
        const [el, offset] = await harness.hoverBottom(eventRecord.id);

        t.is(harness.isHovering(el), 'bottom-edge', 'Hovering should be active');

        await harness.drag(el, {
            offset,
            by : [0, 2 * harness.DAY_PX_PER_HOUR + harness.EDGE_OFFSET]
        });

        await harness.drop();

        await t.click('button[data-ref="changeMultipleButton"]');

        t.is(harness.newEventRecord.occurrences.length, 0, 'No occurrences of the original');
        t.is(eventRecord.recurrence.count, 2, 'The new base occurs twice');
        t.is(eventRecord.occurrences.length, 1, 'The new base has 1 occurrence');

        t.selectorCountIs('.b-cal-event-wrap', 3, 'Still three events in total');
    });

    t.it('With EventList', async t => {
        calendar = await getCalendar({
            date    : new Date(2019, 9, 14),
            project : {
                eventsData : [{
                    id           : 1,
                    name         : 'Event 1',
                    duration     : 1,
                    durationUnit : 'hour',
                    startDate    : new Date(2019, 9, 15, 9)
                }],
                resourcesData : [{
                    id   : 'r1',
                    name : 'Resource 1'
                }, {
                    id   : 'r2',
                    name : 'Resource 2'
                }],
                assignmentsData : [{
                    id         : 1,
                    resourceId : 'r1',
                    eventId    : 1
                }, {
                    id         : 2,
                    resourceId : 'r2',
                    eventId    : 1
                }]
            },
            modes : {
                day    : null,
                week   : null,
                month  : null,
                year   : null,
                agenda : null,
                list   : true
            }
        });
        const
            list         = calendar.activeView,
            event        = calendar.eventStore.first,
            { cellEdit } = list.features;

        await t.waitForProjectReady(calendar);

        t.notOk(list.store.sorters.length, 'List not sorted');

        // Click header to sort
        await t.click('.b-grid-header[data-column="name"]');

        t.is(list.store.sorters.length, 1, 'List sorted');

        // Start editing the name
        await t.doubleClick('.b-grid-cell[data-column="name"]');

        await t.waitFor(() => cellEdit.editor.containsFocus);

        await t.type(cellEdit.editorContext.editor.inputField.input, 'New name');

        // Click into editing next column
        await t.click('.b-grid-cell[data-column="startDate"]');

        // Cell editing must have moved on.
        await t.waitFor(() => cellEdit.editor.containsFocus && cellEdit.editorContext.column.text === 'Start');

        // Edit of name was finished.
        t.is(event.name, 'New name');

        const v = cellEdit.editor.inputField.dateField.input.value;

        await t.type(cellEdit.editor.inputField.dateField.input, 'a', null, null, null, true);

        t.is(cellEdit.editor.inputField.dateField.input.value, 'a');

        await t.type(cellEdit.editor.inputField.dateField.input, '[ESCAPE]');

        t.ok(cellEdit.editor.containsFocus, 'Editor still focused');
        t.is(cellEdit.editor.inputField.dateField.input.value, v, 'Value reverted');

        await t.type(cellEdit.editor.inputField.dateField.input, '[ESCAPE]');

        // Kick off an async engine recalculation then destroy.
        // When the engine's timeout fires, the destroyed grid and its features must not react.
        // See override of destroy in EventList. The features must be destroyed along with the grid.
        calendar.eventStore.first.startDate = new Date(2019, 9, 20, 9);
        calendar.destroy();
    });

    // https://github.com/bryntum/support/issues/3585
    t.it('Events which start before the dayStartTime should be rendered at -ve %age top.', async t => {
        calendar = await getCalendar({
            height : 500,
            width  : 700,
            modes  : {
                week : {
                    dayStartTime : 7,
                    dayEndTime   : 18
                }
            },
            date       : '2019-10-15',
            eventStore : {
                data : [{
                    name       : 'Meeting',
                    resourceId : 'bryntum',
                    startDate  : '2019-10-15T12:00:00',
                    endDate    : '2019-10-15T15:00:00'
                }]
            }
        });
        const
            weekView    = calendar.activeView,
            eventRecord = calendar.eventStore.first,
            eventEl     = weekView.getEventElement(eventRecord);

        t.notOk(eventRecord.isInterDay, 'Event does not flag up as interDay');

        // Wait for layout to be correct
        await t.waitForAnimationFrame();

        await t.doubleClick('.b-cal-event-wrap:contains(Meeting)');

        await t.click('[data-ref="startTimeField"] input');

        await t.type(document.activeElement, '06:00', null, null, null, true);

        await t.click('button[data-ref="saveButton"]');

        await t.waitForAnimationFrame();

        // The event starts one hour above the day start, but the
        // layout Math.maxes it with 0, and adds a class to specify that it starts above.
        t.is(eventEl.style.top, '0px');
        t.hasCls(eventEl, 'b-starts-above');

        // This must never scroll. That was part of the bug. Focusing caused this element to scroll.
        // It's now overflow:clip
        t.is(weekView.horizontalScroller.element.scrollTop, 0);
    });

    // https://github.com/bryntum/support/issues/3057
    // This must not throw an error.
    t.it('Event remove after AgendaView activation', async t => {
        eventStore = new EventStore({
            data : []
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            mode : 'agenda'
        });

        await t.click('[data-ref="monthShowButton"]');

        await t.doubleClick('.b-monthview .b-calendar-cell:not(.b-other-month) .b-cal-event-bar-container');

        await t.waitFor(() => calendar.features.eventEdit.editor?.containsFocus);

        await t.click('.b-monthview  .b-cal-event-wrap');

        t.pass('Test passed');
    });

});
