
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

    t.it('Arrow navigation should not work in Calendar', async t => {
        eventStore = new EventStore({
            data : [{
                name      : 'test',
                startDate : new Date(2021, 11, 30, 11),
                endDate   : new Date(2021, 11, 30, 12)
            }]
        });

        resourceStore = new ResourceStore({
            data : []
        });

        calendar = await getCalendar({
            date : new Date(2021, 11, 30, 11),
            eventStore,
            resourceStore
        });
        const v = calendar.activeView;

        await t.click('.b-cal-event-wrap');

        await t.waitFor(() => document.activeElement === v.getEventElement(eventStore.first));

        await t.type(null, '[UP]');
        await t.type(null, '[DOWN]');

        // No navigation must take place, no errors must be thrown
        t.is(document.activeElement, v.getEventElement(eventStore.first));
    });

    t.it('Sidebar datepicker override', async t => {
        calendar = await getCalendar({
            date       : new Date(2021, 11, 30, 11),
            eventStore,
            resourceStore,
            // Date picker collapses into its header when collapsible is true
            datePicker : {
                title       : 'Month Navigation',
                collapsible : true
            }
        });

        // Our items setting must have been merged in
        t.selectorCountIs('.b-datepicker.b-panel-collapsible .b-header-title:contains(Month Navigation)', 1);
        t.selectorCountIs('.b-datepicker.b-panel-collapsible button.b-collapsetool', 1);
    });

    t.it('Sidebar items datepicker override', async t => {
        calendar = await getCalendar({
            date    : new Date(2021, 11, 30, 11),
            eventStore,
            resourceStore,
            sidebar : {
                items : {
                    // Date picker collapses into its header when collapsible is true
                    datePicker : {
                        title       : 'Month Navigation',
                        collapsible : true
                    }
                }
            }
        });

        // Our items setting must have been merged in
        t.selectorCountIs('.b-datepicker.b-panel-collapsible .b-header-title:contains(Month Navigation)', 1);
        t.selectorCountIs('.b-datepicker.b-panel-collapsible button.b-collapsetool', 1);
    });

    t.it('ResourceFilter should work after removing a resource', async t => {
        const data = t.getHackathonData();

        eventStore    = new EventStore({
            data : data.events.rows
        });
        resourceStore = new ResourceStore({
            data : data.resources.rows
        });

        calendar = await getCalendar({
            date         : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            modeDefaults : {
                eventRenderer({ renderData, resourceRecord  }) {
                    renderData.dataset.resourceId = resourceRecord.id;
                }
            }
        });

        t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="bryntum"]').length, 6);
        t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="hotel"]').length, 14);
        t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="mats"]').length, 3);

        eventStore.remove(eventStore.query(e => e.resourceId === 'mats'));

        await t.waitFor(() => calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="mats"]').length === 0);

        t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="bryntum"]').length, 6);
        t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="hotel"]').length, 14);
        t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="mats"]').length, 0);

        resourceStore.getById('mats').remove();

        t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="bryntum"]').length, 6);
        t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="hotel"]').length, 14);
        t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="mats"]').length, 0);

        await t.click('[data-ref="resourceFilter"] .b-list-item[data-id="bryntum"]');

        // Bryntum team events gone
        await t.waitFor(() => calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="bryntum"]').length === 0);

        t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="bryntum"]').length, 0);
        t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="hotel"]').length, 14);
        t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="mats"]').length, 0);

        await t.click('[data-ref="resourceFilter"] .b-list-item[data-id="hotel"]');

        // Remaining hotel events gone too
        await t.waitFor(() => calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="hotel"]').length === 0);

        t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="bryntum"]').length, 0);
        t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="hotel"]').length, 0);
        t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="mats"]').length, 0);
    });

    t.it('resource avatars', async t => {
        calendar = await getCalendar({
            date        : new Date(2022, 5, 5),
            crudManager : {
                transport : {
                    load : {
                        url : '../examples/resource-avatars/data/data.json'
                    }
                },
                autoLoad : true
            },
            resourceImagePath : '../examples/_shared/images/users/',
            modeDefaults      : {
                eventHeight         : 35,
                showResourceAvatars : true,

                // In our app, all events are solid blocks.
                eventRenderer({ renderData }) {
                    renderData.solidBar = true;
                }
            },
            mode : 'month'
        });

        await t.dragBy({
            source   : '[data-event-id="1"]',
            delta    : [100, -100],
            dragOnly : true
        });

        // Dragged bar has the avatars
        t.selectorCountIs('.b-cal-event-wrap.b-cal-tentative-event img.b-resource-avatar', 2);

        await t.type(null, '[ESCAPE]');

        await t.dragBy({
            source   : '.b-monthview .b-calendar-cell[data-date="2022-06-01"]',
            delta    : [300, 0],
            dragOnly : true
        });

        // Created bar has the defaultCalendar avatar
        t.selectorCountIs('.b-cal-event-wrap.b-cal-tentative-event img.b-resource-avatar', 1);

        await t.mouseUp();

        // Chip view must contain the default calendar
        await t.waitForSelector(`.b-chip:contains(${calendar.defaultCalendar.name})`);

        t.selectorExists(`.b-cal-event-wrap.b-iscreating .b-resource-avatar[data-btip="${calendar.defaultCalendar.name}"]`);
    });

    // https://github.com/bryntum/support/issues/2006
    t.it('ResourceFilter in Sidebar should be configurable with custom selection', async t => {
        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        calendar = await getCalendar({
            date    : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            sidebar : {
                items : {
                    resourceFilter : {
                        selected : ['hotel']
                    }
                }
            }
        });

        // Only the one we asked for is selected.
        t.selectorCountIs('.b-list-item.b-selected', 1);
        t.selectorExists('.b-list-item.b-selected[data-id="hotel"]');

        // Events for all other resources must be filtered out on startup
        t.isDeeply(ArrayHelper.unique(eventStore.map(e => e.resource.id)), ['hotel']);
    });

    t.it('ResourceFilter in Sidebar should be configurable with custom selection with remote load', async t => {
        t.mockUrl('test-initial-resourcefilter', {
            delay        : 300,
            responseText : JSON.stringify({
                success   : true,
                resources : {
                    rows : t.getHackathonData().resources.rows
                },
                events : {
                    rows : t.getHackathonData().events.rows
                }
            })
        });

        calendar = await getCalendar({
            date        : new Date(2019, 9, 14),
            crudManager : {
                transport : {
                    load : {
                        url : 'test-initial-resourcefilter'
                    }
                },
                autoLoad : true,
                autoSync : false
            },
            sidebar : {
                items : {
                    resourceFilter : {
                        selected : ['hotel']
                    }
                }
            }
        });

        // Only the one we asked for is selected.
        await t.waitForSelectorCount('.b-list-item.b-selected', 1);
        t.selectorExists('.b-list-item.b-selected[data-id="hotel"]');

        // Wait for remote load to happen
        await t.waitForSelector('.b-cal-event-wrap');

        // Events for all other resources must be filtered out on startup
        t.isDeeply(ArrayHelper.unique(eventStore.map(e => e.resource.id)), ['hotel']);
    });

    t.it('ResourceFilter in Sidebar should be configurable with custom selection loadOnDemand', async t => {
        t.mockUrl('test-load-on-demand-resourcefilter', {
            delay        : 300,
            responseText : JSON.stringify({
                success   : true,
                resources : {
                    rows : t.getHackathonData().resources.rows
                },
                events : {
                    rows : t.getHackathonData().events.rows
                }
            })
        });

        calendar = await getCalendar({
            date        : new Date(2019, 9, 14),
            crudManager : {
                transport : {
                    load : {
                        url : 'test-load-on-demand-resourcefilter'
                    }
                },
                autoLoad : false,
                autoSync : false
            },
            features : {
                loadOnDemand : true
            },
            sidebar : {
                items : {
                    resourceFilter : {
                        selected : ['hotel']
                    }
                }
            }
        });

        // Only the one we asked for is selected.
        await t.waitForSelectorCount('.b-list-item.b-selected', 1);
        t.selectorExists('.b-list-item.b-selected[data-id="hotel"]');

        // Wait for remote load to happen
        await t.waitForSelector('.b-cal-event-wrap');

        // Events for all other resources must be filtered out on startup
        t.isDeeply(ArrayHelper.unique(eventStore.map(e => e.resource.id)), ['hotel']);
    });

    // https://github.com/bryntum/support/issues/4597
    t.it('Should autoCreate.startHour accept fractional value', async t => {
        calendar = await getCalendar({
            autoCreate : {
                startHour : 13.5
            },
            listeners : {
                beforeEventEditShow({ eventRecord }) {
                    t.is(DateHelper.format(eventRecord.data.startDate, 'HH:mm:ss'), '13:30:00', 'autoCreate.startHour accept fractional value');
                }
            }
        });

        t.firesOnce(calendar, 'beforeEventEditShow');
        await t.click('[data-ref="monthShowButton"]');
        await t.moveMouseTo([400, 400]);
        await t.doubleClick();
    });

    // https://github.com/bryntum/support/issues/4597
    t.it('Should autoCreate.startHour accept string value', async t => {
        calendar = await getCalendar({
            autoCreate : {
                startHour : '13:30'
            },
            listeners : {
                beforeEventEditShow({ eventRecord }) {
                    t.is(DateHelper.format(eventRecord.data.startDate, 'HH:mm:ss'), '13:30:00', 'autoCreate.startHour accepts string value');
                }
            }
        });

        t.firesOnce(calendar, 'beforeEventEditShow');
        await t.click('[data-ref="monthShowButton"]');
        await t.moveMouseTo([400, 400]);
        await t.doubleClick();
    });

    // https://github.com/bryntum/support/issues/4941
    t.it('Should propagate readOnly value into all views', async t => {
        calendar = await getCalendar({
            date      : '2022-07-11',
            readOnly  : true,
            listeners : {
                eventAutoCreated() {
                    autoCreateCount++;
                }
            }
        });
        let autoCreateCount = 0;

        t.firesOnce(calendar, 'eventAutoCreated');
        await t.moveMouseTo('.b-dayview-day-detail.b-calendar-cell[data-date="2022-07-11"]');
        await t.doubleClick();
        t.is(autoCreateCount, 0);

        calendar.readOnly = false;
        await t.doubleClick();
        t.is(autoCreateCount, 1);
    });

    // Clicking "other month" cells must not navigate to the other month
    // https://github.com/bryntum/support/issues/3554
    t.it('Clicking "other month" cells must not navigate to the other month', async t => {
        eventStore = new EventStore({
            data : []
        });

        resourceStore = new ResourceStore({
            data : []
        });

        calendar = await getCalendar({
            date    : new Date(2021, 11, 30, 11),
            eventStore,
            resourceStore,
            sidebar : false,
            modes   : {
                day    : false,
                week   : false,
                year   : false,
                agenda : false
            }
        });
        t.wontFire(calendar, 'daterangechange');

        await t.click('[data-date="2021-11-30"]');
        await t.click('[data-date="2022-01-01"]');
    });

    // https://github.com/bryntum/support/issues/5156
    t.it('Overflow popup should overlay surrounding elements', async t => {
        eventStore = new EventStore({
            data : [{
                id        : 1,
                name      : 'Event 1',
                startDate : new Date(2021, 11, 27, 9),
                endDate   : new Date(2021, 11, 27, 10)
            }, {
                id        : 2,
                name      : 'Event 2',
                startDate : new Date(2021, 11, 27, 9),
                endDate   : new Date(2021, 11, 27, 10)
            }, {
                id        : 3,
                name      : 'Event 3',
                startDate : new Date(2021, 11, 27, 9),
                endDate   : new Date(2021, 11, 27, 10)
            }]
        });

        resourceStore = new ResourceStore({
            data : []
        });

        calendar = await getCalendar({
            height  : 768 / 2,
            date    : new Date(2021, 11, 30, 11),
            eventStore,
            resourceStore,
            sidebar : false,
            tbar    : false,
            modes   : {
                day    : false,
                week   : false,
                year   : false,
                agenda : false,
                month  : {
                    minRowHeight  : 50,
                    overflowPopup : {
                        align : 't-b'
                    },
                    sixWeeks : false
                }
            }
        });
        new Panel({
            height   : 768 / 2,
            appendTo : document.body
        });
        calendar.viewContainer.scrollable.y = 200;

        await t.click('.b-calendar-cell[data-date="2021-12-27"] .b-cal-cell-overflow');

        // Overflow popup must be topmost
        await t.waitForElementTop(calendar.activeView.overflowPopup.element);
    });

    // https://github.com/bryntum/support/issues/5313
    t.it('Must render events which start before an initial, hidden non working day', async t => {
        eventStore = new EventStore({
            data : [{
                id           : 1,
                name         : 'Event 1',
                startDate    : new Date(2021, 11, 24),
                duration     : '4',
                durationUnit : 'd'
            }]
        });

        resourceStore = new ResourceStore({
            data : []
        });

        calendar = await getCalendar({
            date         : new Date(2021, 11, 27, 11),
            eventStore,
            resourceStore,
            sidebar      : false,
            modeDefaults : {
                hideNonWorkingDays : true
            },
            mode : 'week'
        });

        // The continuation of the event which started on Friday and crossed the hidden,
        // non working days is shown on the Monday
        await t.waitForSelector('.b-calendarrow-cell-container .b-calendar-cell[data-date="2021-12-27"] .b-cal-event-wrap.b-continues-past');

        // It's the only event there. It does not project forward beyond Monday.
        t.selectorCountIs('.b-cal-event-wrap', 1);

        // Now check that the first and last visible dates are always correct
        // WRT non working days being hidden or visible.
        calendar.viewContainer.layout.setActiveItem(calendar.modes.day, undefined, { animation : false });
        t.is(calendar.activeView.firstVisibleDate, new Date(2021, 11, 27));
        t.is(calendar.activeView.lastVisibleDate, new Date(2021, 11, 27));

        calendar.viewContainer.layout.setActiveItem(calendar.modes.week, undefined, { animation : false });
        t.is(calendar.activeView.firstVisibleDate, new Date(2021, 11, 27));
        t.is(calendar.activeView.lastVisibleDate, new Date(2021, 11, 31));

        calendar.viewContainer.layout.setActiveItem(calendar.modes.month, undefined, { animation : false });
        t.is(calendar.activeView.firstVisibleDate, new Date(2021, 10, 29));
        t.is(calendar.activeView.lastVisibleDate, new Date(2022, 0, 7));

        calendar.viewContainer.layout.setActiveItem(calendar.modes.year, undefined, { animation : false });
        t.is(calendar.activeView.firstVisibleDate, new Date(2020, 11, 28));
        t.is(calendar.activeView.lastVisibleDate, new Date(2022, 0, 7));

        // Show all the non working days
        calendar.modeDefaults.hideNonWorkingDays = false;

        calendar.viewContainer.layout.setActiveItem(calendar.modes.day, undefined, { animation : false });
        t.is(calendar.activeView.firstVisibleDate, new Date(2021, 11, 27));
        t.is(calendar.activeView.lastVisibleDate, new Date(2021, 11, 27));

        calendar.viewContainer.layout.setActiveItem(calendar.modes.week, undefined, { animation : false });
        t.is(calendar.activeView.firstVisibleDate, new Date(2021, 11, 26));
        t.is(calendar.activeView.lastVisibleDate, new Date(2022, 0, 1));

        calendar.viewContainer.layout.setActiveItem(calendar.modes.month, undefined, { animation : false });
        t.is(calendar.activeView.firstVisibleDate, new Date(2021, 10, 28));
        t.is(calendar.activeView.lastVisibleDate, new Date(2022, 0, 8));

        calendar.viewContainer.layout.setActiveItem(calendar.modes.year, undefined, { animation : false });
        t.is(calendar.activeView.firstVisibleDate, new Date(2020, 11, 27));
        t.is(calendar.activeView.lastVisibleDate, new Date(2022, 0, 8));

        // Hide non working days again.
        calendar.modeDefaults.hideNonWorkingDays = true;

        calendar.viewContainer.layout.setActiveItem(calendar.modes.day, undefined, { animation : false });
        t.is(calendar.activeView.firstVisibleDate, new Date(2021, 11, 27));
        t.is(calendar.activeView.lastVisibleDate, new Date(2021, 11, 27));

        calendar.viewContainer.layout.setActiveItem(calendar.modes.week, undefined, { animation : false });
        t.is(calendar.activeView.firstVisibleDate, new Date(2021, 11, 27));
        t.is(calendar.activeView.lastVisibleDate, new Date(2021, 11, 31));

        calendar.viewContainer.layout.setActiveItem(calendar.modes.month, undefined, { animation : false });
        t.is(calendar.activeView.firstVisibleDate, new Date(2021, 10, 29));
        t.is(calendar.activeView.lastVisibleDate, new Date(2022, 0, 7));

        calendar.viewContainer.layout.setActiveItem(calendar.modes.year, undefined, { animation : false });
        t.is(calendar.activeView.firstVisibleDate, new Date(2020, 11, 28));
        t.is(calendar.activeView.lastVisibleDate, new Date(2022, 0, 7));
    });

});
