
StartTest(async t => {
    let calendar;

    // The events must have been normalized by the engine for the mockUrl
    // "server" to filter them using correct startDate and endDate
    const serverCalendar = await getCalendar({
        date       : new Date(2019, 9, 14),
        eventStore : {
            data : t.getHackathonData().events.rows
        },
        resourceStore : {
            data : t.getHackathonData().resources.rows
        },
        style : {
            position : 'absolute',
            top      : '-10000px'
        },
        modes : {
            day    : null,
            week   : null,
            month  : true,
            year   : null,
            agenda : null
        }
    });

    const
        response     = await fetch('./data/ResourceViewData.json'),
        resourceData = await response.json();

    const sourceRecords  = serverCalendar.eventStore.records.slice();
    serverCalendar.destroy();

    async function getCalendar(config) {
        const calendar = await t.getCalendar(config);

        return calendar;
    }

    async function clickCalendarElement(t, element) {
        await t.waitFor(() => !calendar.crudManager.activeRequests.load);
        await t.click(element);
    }

    t.beforeEach(function() {
        calendar?.destroy();
        MessageDialog.isVisible && MessageDialog.hide();
    });

    t.it('Should trigger load after changing date range', async t => {
        t.mockUrl('events', {
            delay        : 100,
            responseText : JSON.stringify({
                success : true,
                events  : {
                    rows : [
                        {
                            id           : 1,
                            duration     : 1,
                            durationUnit : 'hour',
                            name         : 'Meeting',
                            startDate    : new Date(2019, 9, 15, 13)
                        }
                    ]
                },
                resources : {
                    rows : []
                }
            })
        });

        calendar = await t.getCalendar({
            date     : new Date(2019, 9, 14),
            sidebar  : false,
            mode     : 'week',
            features : {
                loadOnDemand : {
                    beforeRequest : 'up.onBeforeRequest'
                }
            },
            crudManager : {
                transport : {
                    load : {
                        url    : 'events',
                        params : {
                            credentials : 'user/password'
                        }
                    }
                }
            },
            onBeforeRequest(options) {
                options.request.params.dynamicallyAddedExtraParam = 'extraParamValue';
            }
        });

        await t.waitForSelector('.b-cal-event');

        t.firesOnce(calendar.crudManager, 'beforeSend');
        t.firesOnce(calendar.crudManager, 'load');

        calendar.crudManager.on('beforeSend', ({ params }) => {
            t.is(params.credentials, 'user/password');
            t.is(params.startDate, '2019-10-20');
            t.is(params.endDate, '2019-10-27');
            t.is(params.dynamicallyAddedExtraParam, 'extraParamValue');
        });

        await t.waitForEventOnTrigger(calendar.crudManager, 'load', () => {
            calendar.shiftNext();
        });
    });

    // https://github.com/bryntum/support/issues/3162
    t.it('Should support disabling feature', async t => {
        t.mockUrl('events', {
            delay        : 100,
            responseText : JSON.stringify({
                success : true,
                events  : {
                    rows : [
                        {
                            id           : 1,
                            duration     : 1,
                            durationUnit : 'hour',
                            name         : 'Meeting',
                            startDate    : new Date(2019, 9, 15, 13)
                        }
                    ]
                },
                resources : {
                    rows : []
                }
            })
        });

        calendar = await t.getCalendar({
            id       : 'Should-support-disabling-feature',
            date     : new Date(2019, 9, 14),
            sidebar  : false,
            mode     : 'week',
            features : {
                loadOnDemand : true
            },
            crudManager : {
                transport : {
                    load : {
                        url : 'events'
                    }
                }
            }
        });

        calendar.features.loadOnDemand.disabled = true;

        await t.waitForSelector('.b-cal-event');

        const spy = t.spyOn(calendar.crudManager, 'load');
        calendar.shiftNext();

        t.expect(spy).not.toHaveBeenCalled();
    });

    t.it('Dynamically loaded events', async t => {
        t.mockUrl('test-dynamic-load', (url, urlParams, { queryParams }) => {
            const
                resources = t.getHackathonData().resources.rows,
                startDate = DateHelper.parseKey(queryParams.startDate),
                endDate   = DateHelper.parseKey(queryParams.endDate),
                events    = startDate && endDate ? sourceRecords.filter(e => {
                    return DateHelper.intersectSpans(e.startDate, e.endDate, startDate, endDate);
                }).map(r => r.data) : [];

            return {
                delay        : 100,
                responseText : JSON.stringify({
                    success   : true,
                    resources : {
                        rows : resources
                    },
                    events : {
                        rows : events
                    }
                })
            };
        });

        calendar = await getCalendar({
            id          : 'Dynamically-loaded-events',
            sidebar     : false,
            crudManager : {
                transport : {
                    load : {
                        url : 'test-dynamic-load'
                    }
                },
                autoLoad : false,
                autoSync : false
            },
            date     : new Date(2019, 9, 14),
            mode     : 'day',
            features : {
                loadOnDemand : {
                    alwaysLoadNewRange : true
                }
            }
        });

        let lastRefreshCount;

        await t.waitFor(() => !calendar.crudManager.activeRequests.load);
        await t.waitFor(() => calendar.eventStore.count === 4 && document.querySelectorAll('.b-calendarrow .b-cal-event-wrap').length === 2);

        // 14/10/2019 has four events in total
        t.selectorCountIs('.b-calendarrow .b-cal-event-wrap', 2);
        t.selectorCountIs('.b-dayview-day-container .b-cal-event-wrap', 2);

        lastRefreshCount = calendar.activeView.refreshCount;

        // Go to previous day. There are no events.
        // There must be TWO refreshes. One when the initial refresh is triggered
        // which triggers the server data request, and then one when the data arrives
        await clickCalendarElement(t, calendar.widgetMap.prevButton.element);
        await t.waitFor(() => calendar.activeView.refreshCount === lastRefreshCount + 2);

        t.is(calendar.eventStore.count, 0);
        t.selectorCountIs('.b-cal-event-wrap', 0);
        lastRefreshCount = calendar.activeView.refreshCount;

        // Return to the 14th
        await clickCalendarElement(t, calendar.widgetMap.nextButton.element);
        await t.waitFor(() => calendar.activeView.refreshCount === lastRefreshCount + 2);

        // Back at 14/10/2019 which has four events in total
        t.is(calendar.eventStore.count, 4);
        t.selectorCountIs('.b-calendarrow .b-cal-event-wrap', 2);
        t.selectorCountIs('.b-dayview-day-container .b-cal-event-wrap', 2);
        lastRefreshCount = calendar.activeView.refreshCount;

        // Go to the 15th
        await clickCalendarElement(t, calendar.widgetMap.nextButton.element);
        await t.waitFor(() => calendar.activeView.refreshCount === lastRefreshCount + 2);

        // Now at 15/10/2019 which has seven events in total
        t.is(calendar.eventStore.count, 7);
        t.selectorCountIs('.b-calendarrow .b-cal-event-wrap', 1);
        t.selectorCountIs('.b-dayview-day-container .b-cal-event-wrap', 6);
        lastRefreshCount = calendar.activeView.refreshCount;

        // Go back to the 14th
        // There must be TWO refreshes. One when the initial refresh is triggered
        // which triggers the server data request, and then one when the data arrives
        await clickCalendarElement(t, calendar.widgetMap.prevButton.element);
        await t.waitFor(() => calendar.activeView.refreshCount === lastRefreshCount + 2);

        // Back at 14/10/2019 which has four events in total
        t.is(calendar.eventStore.count, 4);
        t.selectorCountIs('.b-calendarrow .b-cal-event-wrap', 2);
        t.selectorCountIs('.b-dayview-day-container .b-cal-event-wrap', 2);
        lastRefreshCount = calendar.modes.week.refreshCount || 0;

        // Go to Week 42, October 2019
        await t.waitFor(() => !calendar.crudManager.activeRequests.load);
        await t.waitForEventOnTrigger(calendar, 'activeItemChange', () => {
            clickCalendarElement(t, calendar.widgetMap.weekShowButton.element);
        });
        await t.waitFor(() => calendar.activeView.refreshCount === lastRefreshCount + 3);

        // Now at Week 42, October 2019 which has 23 events in total
        t.is(calendar.eventStore.count, 23);
        t.selectorCountIs('.b-calendarrow .b-cal-event-wrap', calendar.activeView.element, 9);

        // Note: event count and element count both being 23 is a coincidence.
        // There are 4 all day events which won't be in the day-container
        // But there are 4 occurrences which makes the element count 23.
        t.selectorCountIs('.b-dayview-day-container .b-cal-event-wrap', calendar.activeView.element, 23);
        lastRefreshCount = calendar.activeView.refreshCount || 0;

        // Go to previous week. There are no events.
        // There must be TWO refreshes. One when the initial refresh is triggered
        // which triggers the server data request, and then one when the data arrives
        await clickCalendarElement(t, calendar.widgetMap.prevButton.element);
        await t.waitFor(() => calendar.activeView.refreshCount === lastRefreshCount + 2);

        t.is(calendar.eventStore.count, 0);
        t.selectorCountIs('.b-cal-event-wrap', calendar.activeView.element, 0);
        lastRefreshCount = calendar.activeView.refreshCount;

        // Go back to Week 42, October 2019
        await clickCalendarElement(t, calendar.widgetMap.nextButton.element);
        await t.waitFor(() => calendar.activeView.refreshCount === lastRefreshCount + 2);

        // Now at Week 42, October 2019 which has 23 events in total
        t.is(calendar.eventStore.count, 23);
        t.selectorCountIs('.b-calendarrow .b-cal-event-wrap', calendar.activeView.element, 9);

        // Note: event count and element count both being 23 is a coincidence.
        // There are 4 all day events which won't be in the day-container
        // But there are 4 occurrences which makes the element count 23.
        t.selectorCountIs('.b-dayview-day-container .b-cal-event-wrap', calendar.activeView.element, 23);
        lastRefreshCount = calendar.modes.month.refreshCount || 0;

        // Go to October 2019
        await t.waitForEventOnTrigger(calendar, 'activeItemChange', () => {
            clickCalendarElement(t, calendar.widgetMap.monthShowButton.element);
        });
        await t.waitFor(() => calendar.activeView.refreshCount === lastRefreshCount + 2);

        await t.waitForAnimations();

        // Now at October 2019 which has 27 events in total
        t.is(calendar.eventStore.count, 27);
        t.selectorCountIs('.b-cal-event-wrap', calendar.activeView.element, 16);
        t.selectorCountIs('.b-cal-cell-overflow', calendar.activeView.element, 7);
        lastRefreshCount = calendar.activeView.refreshCount || 0;

        // Go to previous month. There are no events.
        // There must be TWO refreshes. One when the initial refresh is triggered
        // which triggers the server data request, and then one when the data arrives
        await clickCalendarElement(t, calendar.widgetMap.prevButton.element);
        await t.waitFor(() => calendar.activeView.refreshCount === lastRefreshCount + 2);

        t.is(calendar.eventStore.count, 0);
        t.selectorCountIs('.b-cal-event-wrap', calendar.activeView.element, 0);
        t.selectorCountIs('.b-cal-cell-overflow', calendar.activeView.element, 0);
        lastRefreshCount = calendar.activeView.refreshCount;

        // Go back to October 2019
        await clickCalendarElement(t, calendar.widgetMap.nextButton.element);
        await t.waitFor(() => calendar.activeView.refreshCount === lastRefreshCount + 2);

        // Now back at October 2019 which has 27 events in total
        t.is(calendar.eventStore.count, 27);
        t.selectorCountIs('.b-cal-event-wrap', calendar.activeView.element, 16);
        t.selectorCountIs('.b-cal-cell-overflow', calendar.activeView.element, 7);
        lastRefreshCount = calendar.modes.year.refreshCount || 0;

        calendar.clearLog();

        // Go to 2019
        await t.waitForEventOnTrigger(calendar, 'activeItemChange', () => {
            clickCalendarElement(t, calendar.widgetMap.yearShowButton.element);
        });
        await t.waitFor(() => calendar.activeView.refreshCount === lastRefreshCount + 3);

        // Now at 2019 which has 27 events and 8 event-bearing days in total
        t.is(calendar.eventStore.count, 27);
        t.selectorCountIs('.b-cal-cell-overflow', calendar.activeView.element, 8);
        t.selectorCountIs('.b-datepicker-1-to-3-events', calendar.activeView.element, 1);
        t.selectorCountIs('.b-datepicker-4-to-6-events', calendar.activeView.element, 5);
        t.selectorCountIs('.b-calendar-7-or-more-events', calendar.activeView.element, 2);
        lastRefreshCount = calendar.activeView.refreshCount || 0;

        // Go to previous year. There are no events.
        // There must be TWO refreshes. One when the initial refresh is triggered
        // which triggers the server data request, and then one when the data arrives
        await clickCalendarElement(t, calendar.widgetMap.prevButton.element);
        await t.waitFor(() => calendar.activeView.refreshCount === lastRefreshCount + 2);

        t.is(calendar.eventStore.count, 0);
        t.selectorCountIs('.b-cal-cell-overflow', calendar.activeView.element, 0);
        t.selectorCountIs('.b-datepicker-1-to-3-events', calendar.activeView.element, 0);
        t.selectorCountIs('.b-datepicker-4-to-6-events', calendar.activeView.element, 0);
        t.selectorCountIs('.b-calendar-7-or-more-events', calendar.activeView.element, 0);
        lastRefreshCount = calendar.activeView.refreshCount || 0;

        // Go back to 2019
        await clickCalendarElement(t, calendar.widgetMap.nextButton.element);
        await t.waitFor(() => calendar.activeView.refreshCount === lastRefreshCount + 2);

        // Now back at 2019 which has 27 events and 8 event-bearing days in total
        t.is(calendar.eventStore.count, 27);
        t.selectorCountIs('.b-cal-cell-overflow', calendar.activeView.element, 8);
        t.selectorCountIs('.b-datepicker-1-to-3-events', calendar.activeView.element, 1);
        t.selectorCountIs('.b-datepicker-4-to-6-events', calendar.activeView.element, 5);
        t.selectorCountIs('.b-calendar-7-or-more-events', calendar.activeView.element, 2);
        lastRefreshCount = calendar.modes.day.refreshCount || 0;

        await t.waitForEventOnTrigger(calendar, 'activeItemChange', () => {
            clickCalendarElement(t, calendar.widgetMap.dayShowButton.element);
        });
        await t.waitFor(() => calendar.activeView.refreshCount === lastRefreshCount + 2);

        // Now at 14/10/2019 which has 4 events in total
        t.is(calendar.eventStore.count, 4);
        t.selectorCountIs('.b-calendarrow .b-cal-event-wrap', calendar.activeView.element, 2);
        t.selectorCountIs('.b-dayview-day-container .b-cal-event-wrap', calendar.activeView.element, 2);

        lastRefreshCount = calendar.modes.agenda.refreshCount || 0;
        await t.waitForEventOnTrigger(calendar, 'activeItemChange', () => {
            clickCalendarElement(t, calendar.widgetMap.agendaShowButton.element);
        });
        await t.waitFor(() => calendar.activeView.refreshCount === lastRefreshCount + 2);

        // Now in Agenda View
        t.is(calendar.eventStore.count, 27);
        t.selectorCountIs('.b-cal-event-wrap', calendar.activeView.element, 39);
        t.selectorCountIs('.b-calendar-cell', calendar.activeView.element, 8);
    }, 1600000);
    // Test takes around seven seconds on a modern machine.
    // May timeout on loaded/old machines such as TC tests.

    // https://github.com/bryntum/support/issues/4063
    t.it('autoRowHeight in MonthView', async t => {
        t.mockUrl('test-date-range-recursion', (url, urlParams, { queryParams }) => {
            const
                resources = t.getHackathonData().resources.rows,
                startDate = DateHelper.parseKey(queryParams.startDate),
                endDate   = DateHelper.parseKey(queryParams.endDate),
                events    = startDate && endDate ? sourceRecords.filter(e => {
                    return DateHelper.intersectSpans(e.startDate, e.endDate, startDate, endDate);
                }).map(r => r.data) : [];

            return {
                delay        : 100,
                responseText : JSON.stringify({
                    success   : true,
                    resources : {
                        rows : resources
                    },
                    events : {
                        rows : events
                    }
                })
            };
        });

        calendar = await getCalendar({
            id          : 'autoRowHeight-in-MonthView',
            sidebar     : false,
            crudManager : {
                transport : {
                    load : {
                        url : 'test-date-range-recursion'
                    }
                },
                autoLoad : false,
                autoSync : false
            },
            date     : new Date(2019, 9, 14),
            mode     : 'month',
            features : {
                loadOnDemand : true
            },
            modes : {
                day   : null,
                month : {
                    autoRowHeight : true,
                    minRowHeight  : '4ev'
                }
            }
        });

        let dateRangeChangeCount = 0;

        calendar.on({
            dateRangeChange() {
                if (++dateRangeChangeCount > 1) {
                    if (dateRangeChangeCount === 2) {
                        t.fail('dateRangeChange loop entered.');
                    }
                    calendar.modes.month._cellMap = calendar.modes.week.cellMap;
                    return false;
                }
            },
            prio : 100000
        });

        await clickCalendarElement(t, 'button[data-ref="weekShowButton"]');

        // Wait for a successful load of the week's data, then also for the recursion bug to manifest.
        await t.waitFor(1000);
    });

    // https://github.com/bryntum/support/issues/3469
    t.it('With a Scheduler as a mode with alwaysLoadNewRange : false', async t => {
        const datesRequested = [];

        let loadCount = 0;

        t.mockUrl('test-scheduler-as-a-mode', (url, urlParams, { queryParams }) => {
            const
                resources = t.getHackathonData().resources.rows,
                startDate = DateHelper.parseKey(queryParams.startDate),
                endDate   = DateHelper.parseKey(queryParams.endDate),
                events    = startDate && endDate ? sourceRecords.filter(e => {
                    return DateHelper.intersectSpans(e.startDate, e.endDate, startDate, endDate);
                }).map(r => r.data) : [];

            datesRequested.push([queryParams.startDate, queryParams.endDate]);

            return {
                delay        : 100,
                responseText : JSON.stringify({
                    success   : true,
                    resources : {
                        rows : resources
                    },
                    events : {
                        rows : events
                    }
                })
            };
        });

        calendar = await getCalendar({
            sidebar     : false,
            crudManager : {
                transport : {
                    load : {
                        url : 'test-scheduler-as-a-mode'
                    }
                },
                autoLoad  : true,
                autoSync  : false,
                listeners : {
                    load() {
                        loadCount++;
                    }
                }
            },
            date     : new Date(2019, 9, 14),
            features : {
                loadOnDemand : true
            },
            modes : {
                timeline : {
                    type        : 'scheduler',
                    displayName : 'Timeline',
                    features    : {
                        dependencies : true
                    }
                }
            },
            mode : 'timeline'
        });

        // The initial autoLoad will happen with no information about date range required
        // Then when the UI updates, it will attempt to access a date range and that will
        // cause a load with a date range attached.
        await t.waitFor(() => loadCount === 2);

        // The autoLoad is from the data layer which has no clue what the UI is going to be asking for
        t.isDeeply(datesRequested[0], [undefined, undefined]);

        // The week encapsulating the calendar's configured date has been requested
        t.isDeeply(datesRequested[1], ['2019-10-13', '2019-10-20']);

        await clickCalendarElement(t, '[data-ref="weekShowButton"]');

        // Wait for load to have been done so the loads triggered ny view changing do not collide
        await t.waitForSelectorCount(`#${calendar.activeView.id} .${calendar.activeView.eventCls}`, 23);

        // The Timeline view requested a week. The week view makes no new data requests because
        // its dataset is already present.
        t.is(datesRequested.length, 2);

        await clickCalendarElement(t, '[data-ref="monthShowButton"]');

        await t.waitForAnimations();

        // The month encapsulating the calendar's configured date has been requested
        t.isDeeply(datesRequested[2], ['2019-09-29', '2019-11-10']);

        await clickCalendarElement(t, '[data-ref="timelineShowButton"]');

        await t.waitForAnimations();

        // The week is contained within the month that we just visited sop no further requests made
        t.is(datesRequested.length, 3);

        await clickCalendarElement(t, '[data-ref="agendaShowButton"]');

        await t.waitForAnimations();

        // The year encapsulating the calendar's configured date has been requested
        t.isDeeply(datesRequested[3], ['2019-01-01', '2020-01-01']);

        // Wait for the https://github.com/bryntum/support/issues/3469 bug to happen : spurious data loads
        await t.waitFor(500);

        // There must have been no more load requests than the ones tested
        t.is(datesRequested.length, 4);
    });

    t.it('With a Scheduler as a mode and alwaysLoadNewRange : true', async t => {
        const datesRequested = [];

        t.mockUrl('test-scheduler-as-a-mode', (url, urlParams, { queryParams }) => {
            const
                resources = t.getHackathonData().resources.rows,
                startDate = DateHelper.parseKey(queryParams.startDate),
                endDate   = DateHelper.parseKey(queryParams.endDate),
                events    = startDate && endDate ? sourceRecords.filter(e => {
                    return DateHelper.intersectSpans(e.startDate, e.endDate, startDate, endDate);
                }).map(r => r.data) : [];

            datesRequested.push([queryParams.startDate, queryParams.endDate]);

            return {
                delay        : 100,
                responseText : JSON.stringify({
                    success   : true,
                    resources : {
                        rows : resources
                    },
                    events : {
                        rows : events
                    }
                })
            };
        });

        calendar = await getCalendar({
            sidebar     : false,
            crudManager : {
                transport : {
                    load : {
                        url : 'test-scheduler-as-a-mode'
                    }
                },
                autoLoad : true,
                autoSync : false
            },
            date     : new Date(2019, 9, 14),
            features : {
                loadOnDemand : {
                    alwaysLoadNewRange : true
                }
            },
            modes : {
                timeline : {
                    type        : 'scheduler',
                    displayName : 'Timeline',
                    features    : {
                        dependencies : true
                    }
                }
            },
            mode : 'timeline'
        });

        await t.waitForEvent(calendar.crudManager, 'load');

        // Wait for the autoload to have loaded with no date params which "primes" the UI to try to render
        // for its configured date range, which THEN performs a load directed at that date range.
        // TWO load attempts must pass before the data is in the correct state.
        await t.waitFor(() => datesRequested.length === 2);

        // The autoLoad is from the data layer which has no clue what the UI is going to be asking for
        t.isDeeply(datesRequested[0], [undefined, undefined]);

        // The week encapsulating the calendar's configured date has been requested
        t.isDeeply(datesRequested[1], ['2019-10-13', '2019-10-20']);

        await clickCalendarElement(t, '[data-ref="weekShowButton"]');

        // Wait for load to have been done so the loads triggered ny view changing do not collide
        await t.waitForSelectorCount(`#${calendar.activeView.id} .${calendar.activeView.eventCls}`, 23);

        // The Timeline view requested a week. The week view makes no new data requests because
        // its dataset is already present.
        t.is(datesRequested.length, 2);

        await clickCalendarElement(t, '[data-ref="monthShowButton"]');

        await t.waitForAnimations();

        // The month encapsulating the calendar's configured date has been requested
        t.isDeeply(datesRequested[2], ['2019-09-29', '2019-11-10']);

        await clickCalendarElement(t, '[data-ref="timelineShowButton"]');

        await t.waitForAnimations();

        // The week encapsulating the calendar's configured date has been requested
        t.isDeeply(datesRequested[3], ['2019-10-13', '2019-10-20']);

        await clickCalendarElement(t, '[data-ref="agendaShowButton"]');

        await t.waitForAnimations();

        // The year encapsulating the calendar's configured date has been requested
        t.isDeeply(datesRequested[4], ['2019-01-01', '2020-01-01']);

        // Wait for the https://github.com/bryntum/support/issues/3469 bug to happen : spurious data loads
        await t.waitFor(500);

        // There must have been no more load requests than the ones tested
        t.is(datesRequested.length, 5);
    });

    // https://github.com/bryntum/support/issues/4530
    t.it('Should work with a DatePicker which shows events', async t => {
        t.mockUrl('events', {
            delay        : 100,
            responseText : JSON.stringify({
                success : true,
                events  : {
                    rows : [
                        {
                            id           : 1,
                            duration     : 1,
                            durationUnit : 'hour',
                            name         : 'Meeting',
                            startDate    : new Date(2019, 9, 15, 13)
                        }
                    ]
                },
                resources : {
                    rows : []
                }
            })
        });

        calendar = await t.getCalendar({
            date       : new Date(2019, 9, 14),
            datePicker : {
                showEvents : true
            },
            mode     : 'week',
            features : {
                loadOnDemand : true
            },
            crudManager : {
                transport : {
                    load : {
                        url : 'events'
                    }
                }
            }
        });

        await t.waitForSelector('.b-cal-event');

        // The DatePicker asks for its events.
        // No requests are sent because we then have the whole month
        t.wontFire(calendar.crudManager, 'beforeSend');

        calendar.shiftNext();

        // LoadMask shows up
        await t.waitForAnimations();

        calendar.shiftNext();

        // LoadMask shows up
        await t.waitForAnimations();
    });

    t.it('Should work with resourceView with datePicker showEvents : true', async t => {
        t.mockUrl('resourceview-events', {
            delay        : 100,
            responseText : JSON.stringify(resourceData)
        });

        calendar = await t.getCalendar({
            date       : new Date(2021, 9, 12),
            datePicker : {
                showEvents : true
            },
            modes : {
                // Let's not show the default views
                day    : null,
                week   : null,
                month  : null,
                year   : null,
                agenda : null,

                // Mode name can be anything if it contains a "type" property.
                weekResources : {
                    // Type has the final say over which view type is created
                    type          : 'resource',
                    title         : 'Week',
                    // Specify how wide each resource panel should be
                    resourceWidth : '12em',
                    titleTemplate : resource => resource.name
                }
            },
            features : {
                loadOnDemand : true
            },
            crudManager : {
                transport : {
                    load : {
                        url : 'resourceview-events'
                    }
                }
            }
        });
        const resourceView = calendar.activeView;

        // All expected views and events render
        await t.waitForSelectorCount('.b-weekview', 4);
        await t.waitForSelectorCount(`#${resourceView.id} .b-cal-event-wrap`, 33);
    });

    t.it('Should work with resourceView', async t => {
        t.mockUrl('resourceview-events', {
            delay        : 100,
            responseText : JSON.stringify(resourceData)
        });

        calendar = await t.getCalendar({
            date  : new Date(2021, 9, 12),
            modes : {
                // Let's not show the default views
                day    : null,
                week   : null,
                month  : null,
                year   : null,
                agenda : null,

                // Mode name can be anything if it contains a "type" property.
                weekResources : {
                    // Type has the final say over which view type is created
                    type          : 'resource',
                    title         : 'Week',
                    // Specify how wide each resource panel should be
                    resourceWidth : '12em',
                    titleTemplate : resource => resource.name
                }
            },
            features : {
                loadOnDemand : true
            },
            crudManager : {
                transport : {
                    load : {
                        url : 'resourceview-events'
                    }
                }
            }
        });

        const resourceView = calendar.activeView;

        // All expected views and events render
        await t.waitForSelectorCount('.b-weekview', 4);
        await t.waitForSelectorCount(`#${resourceView.id} .b-cal-event-wrap`, 33);

        // Will request a new, smaller date range. Must not throw
        resourceView.views[0].hideNonWorkingDays = true;

        // Wait for any load on demand request
        await t.waitForAnimationFrame();

        resourceView.views[1].hideNonWorkingDays = true;

        await t.waitForAnimationFrame();

        resourceView.views[0].hideNonWorkingDays = false;

        await t.waitForAnimationFrame();
    });

    t.it('Should show an error UI if a range load was unsuccessful at the data level', async t => {
        t.mockUrl('events-query-failed-1', {
            delay        : 100,
            responseText : JSON.stringify({
                success : false,
                message : 'The server encountered a problem'
            })
        });

        let loadOnDemandFailFired = false;
        calendar = await t.getCalendar({
            id       : 'Should-support-disabling-feature',
            date     : new Date(2019, 9, 14),
            sidebar  : false,
            mode     : 'week',
            features : {
                loadOnDemand : true
            },
            crudManager : {
                transport : {
                    load : {
                        url : 'events-query-failed-1'
                    }
                }
            },
            listeners : {
                loadOnDemandFail() {
                    loadOnDemandFailFired = true;
                }
            }
        });

        // Wait for the event. We cannot use Siesta because of timing
        await t.waitFor(() => loadOnDemandFailFired);

        // Must show error dialog
        await t.waitFor(() => MessageDialog.isVisible);
    });

    t.it('Should show an error UI if a range load was unsuccessful at the network level', async t => {
        t.mockUrl('events-query-failed-2', {
            delay  : 100,
            status : 404
        });

        let loadOnDemandFailFired = false;
        calendar = await t.getCalendar({
            id       : 'Should-support-disabling-feature',
            date     : new Date(2019, 9, 14),
            sidebar  : false,
            mode     : 'week',
            features : {
                loadOnDemand : true
            },
            crudManager : {
                transport : {
                    load : {
                        url : 'events-query-failed-2'
                    }
                }
            },
            listeners : {
                loadOnDemandFail() {
                    loadOnDemandFailFired = true;
                }
            }
        });

        // Wait for the event. We cannot use Siesta because of timing
        await t.waitFor(() => loadOnDemandFailFired);

        // Must show error dialog
        await t.waitFor(() => MessageDialog.isVisible);
    });

    t.it('Should not show an error UI if a range load was unsuccessful and a loadOnDemandFail returns false', async t => {
        t.mockUrl('events-query-failed-3', {
            delay  : 100,
            status : 404
        });

        let loadOnDemandFailFired = false;
        calendar = await t.getCalendar({
            id       : 'Should-support-disabling-feature',
            date     : new Date(2019, 9, 14),
            sidebar  : false,
            mode     : 'week',
            features : {
                loadOnDemand : true
            },
            crudManager : {
                transport : {
                    load : {
                        url : 'events-query-failed-3'
                    }
                }
            },
            listeners : {
                loadOnDemandFail() {
                    loadOnDemandFailFired = true;
                    return false;
                }
            }
        });

        // Wait for the event. We cannot use Siesta because the feature's handler
        // gets in first and returns false.
        await t.waitFor(() => loadOnDemandFailFired);

        await t.waitForAnimationFrame();

        // The default error UI was not shown
        t.notOk(MessageDialog.isVisible);
    });

    // https://github.com/bryntum/support/issues/5763
    t.it('Should reload current range', async t => {
        t.mockUrl('events-reload-test', {
            delay        : 100,
            responseText : JSON.stringify({
                success : true,
                events  : {
                    rows : [
                        {
                            id           : 1,
                            duration     : 1,
                            durationUnit : 'hour',
                            name         : 'Meeting',
                            startDate    : new Date(2019, 9, 15, 13)
                        }
                    ]
                },
                resources : {
                    rows : []
                }
            })
        });

        calendar = await t.getCalendar({
            date     : new Date(2019, 9, 14),
            mode     : 'week',
            features : {
                loadOnDemand : true
            },
            crudManager : {
                transport : {
                    load : {
                        url : 'events-reload-test'
                    }
                }
            }
        });
        const { loadOnDemand } = calendar.features;

        await t.waitForSelector('.b-cal-event');

        const { lastRangeLoaded } = loadOnDemand;

        calendar.crudManager.on({
            beforeSend({ params }) {
                t.is(params.startDate, DateHelper.makeKey(lastRangeLoaded.startDate));
                t.is(params.endDate, DateHelper.makeKey(lastRangeLoaded.endDate));
            }
        });

        await t.waitForEventOnTrigger(calendar.crudManager, 'requestDone', () => {
            loadOnDemand.refresh();
        });
    });
});
