
StartTest(t => {

    let calendar, resourceView;

    t.beforeEach(t => calendar?.destroy?.());

    async function setup(config = {}) {
        calendar = await t.getCalendar(ObjectHelper.merge({
            date : new Date(2021, 8, 12),

            resourceImagePath : '../examples/_shared/images/users/',

            modes : {
                day           : null,
                week          : null,
                month         : null,
                year          : null,
                agenda        : null,
                weekResources : {
                    type  : 'resource',
                    title : 'Week resources'
                }
            },

            resources : [
                { id : 1, name : 'Bruce Wayne', image : 'arnold.jpg', eventColor : 'blue', alias : 'Batman' },
                { id : 2, name : 'Clark Kent', image : 'rob.jpg', eventColor : 'orange', alias : 'Superman' }
            ],

            events : [{
                id         : 1,
                name       : 'Redecorate the cave',
                resourceId : 1,
                startDate  : '2021-09-13T10:00',
                endDate    : '2021-09-13T11:00'
            }, {
                id         : 2,
                name       : 'Avoid kryptonite',
                resourceId : 2,
                startDate  : '2021-09-13T10:00',
                endDate    : '2021-09-13T11:00'
            }]
        }, config));

        resourceView = calendar.modes.weekResources;

        await t.waitForAnimations();
    }

    function getAllDayHeights() {
        const allDayRows = resourceView?.items.map(v => v.allDayEvents).filter(v => v);

        return allDayRows.filter(v => v.isVisible).map(v => v.height);
    }

    t.it('should fire schedule Dom events', async t => {
        await setup();

        t.willFireNTimes(calendar, 'scheduleClick', 2);
        t.firesOnce(calendar, 'scheduleDblClick');

        await t.click('.b-resourceview .b-dayview-day-detail:visible[data-date="2021-09-16"]');
        await t.doubleClick('.b-resourceview .b-dayview-day-detail:visible[data-date="2021-09-16"]');
    });

    t.it('Syncing settings which must be shared between all child views', async t => {
        await setup({
            resources     : null,
            resourceStore : {
                data : [
                    { id : 1, name : 'Bruce Wayne', image : 'arnold.jpg', eventColor : 'blue', alias : 'Batman' },
                    { id : 2, name : 'Clark Kent', image : 'rob.jpg', eventColor : 'orange', alias : 'Superman' }
                ]
            }
        });
        const axisCount = DomHelper.scrollBarWidth ? 2 : 1;

        await t.waitForSelector('.b-resourcedayviewtimeaxis');

        // 14 visible days
        t.selectorCountIs('.b-dayview:not(.b-resourcedayviewtimeaxis) .b-dayview-day-detail.b-calendar-cell', 14);

        // 2 visible events, one for each resource
        t.selectorCountIs('.b-cal-event-wrap', 2);

        // The time axis and the scroller (if we show scrollbars) are shown
        t.selectorCountIs('.b-resourcedayviewtimeaxis', axisCount);

        // Filter out Bruce Wayne
        await t.click('[data-ref="resourceFilter"] [data-id="1"]');

        await t.waitFor(() => t.query('.b-dayview:not(.b-resourcedayviewtimeaxis) .b-dayview-day-detail.b-calendar-cell').length === 7);

        t.selectorCountIs('.b-dayview:not(.b-resourcedayviewtimeaxis) .b-dayview-day-detail.b-calendar-cell', 7);

        // 1 visible event, for the sole visible resource
        t.selectorCountIs('.b-cal-event-wrap', 1);

        t.isDeeply([...resourceView.viewCache].map(v => v.minWidth), [0, 0]);

        resourceView.hideNonWorkingDays = true;
        resourceView.resourceWidth = '40em';

        t.selectorCountIs('.b-dayview:not(.b-resourcedayviewtimeaxis) .b-dayview-day-detail.b-calendar-cell', 5);

        resourceView.nonWorkingDays[3] = 1;

        t.selectorCountIs('.b-dayview:not(.b-resourcedayviewtimeaxis) .b-dayview-day-detail.b-calendar-cell', 4);

        // Filter Bruce Wayne back in
        await t.click('[data-ref="resourceFilter"] [data-id="1"]');

        // Scroll positions must be synced upon re-add
        t.is(resourceView.items[2].scrollable.element.scrollTop, resourceView.items[1].scrollable.element.scrollTop);

        await t.waitFor(() => t.query('.b-dayview:not(.b-resourcedayviewtimeaxis) .b-dayview-day-detail.b-calendar-cell').length === 8);

        // 2 visible events, one for each resource
        t.selectorCountIs('.b-cal-event-wrap', 2);

        // All changes made while he was hidden are applied.
        t.selectorCountIs('.b-dayview:not(.b-resourcedayviewtimeaxis) .b-dayview-day-detail.b-calendar-cell', 8);
        t.isDeeply([...resourceView.viewCache].map(v => DomHelper.getStyleValue(v.element, 'minWidth')), ['560px', '560px']);
    });

    t.it('Multi assignment', async t => {
        t.mockUrl('/4173/multi', {
            responseText : JSON.stringify({
                success   : true,
                resources : {
                    rows : [
                        { id : 1, name : 'Resource 1' },
                        { id : 2, name : 'Resource 2' }
                    ]
                },
                assignments : {
                    rows : [
                        { id : 1, eventId : 1, resourceId : 1 },
                        { id : 2, eventId : 1, resourceId : 2 }
                    ]
                },
                events : {
                    rows : [
                        {
                            id        : 1,
                            name      : 'Assigned to both',
                            startDate : '2022-02-10T07:00',
                            endDate   : '2022-02-10T08:00'
                        }
                    ]
                }
            })
        });

        await setup({
            crudManager : {
                autoLoad  : true,
                transport : {
                    load : {
                        url : '/4173/multi'
                    }
                }
            },
            date      : '2022-02-10',
            resources : null,
            events    : null
        });

        // Event is rendered in both child views
        t.selectorCountIs('.b-cal-event:contains(Assigned to both)', 2);

        // Drag into Resource 1.
        // It's already assigned to Resource 1, so this is just deassigning from resource 2
        await t.dragBy({
            source : `#${resourceView.id}-resourceweekview-2 .b-cal-event-wrap[data-event-id="1"]`,
            delta  : [-calendar.activeView.items[1].width, 0]
        });

        // It must be deassigned from 2
        await t.waitFor(() => t.query('.b-cal-event:contains(Assigned to both)').length === 1);

        // And in Resource 1's view
        t.selectorExists(`#${resourceView.id}-resourceweekview-1 .b-cal-event-wrap[data-event-id="1"]`);

        // Drag into Resource 2.
        // This assigns to Resource 2 and deassigned from Resource 1
        await t.dragBy({
            source : `#${resourceView.id}-resourceweekview-1 .b-cal-event-wrap[data-event-id="1"]`,
            delta  : [calendar.activeView.items[1].width, 0]
        });

        // It's reassigned to 2
        await t.waitFor(() => t.query(`#${resourceView.id}-resourceweekview-2 .b-cal-event-wrap[data-event-id="1"]`).length === 1);

        // It's still single assigned
        t.selectorCountIs('.b-cal-event:contains(Assigned to both)', 1);
    });

    t.it('Resource order with stableResourceOrder : true (the default)', async t => {
        await setup({
            resources     : null,
            resourceStore : {
                data : [
                    { id : 1, name : 'Bruce Wayne', image : 'arnold.jpg', eventColor : 'blue', alias : 'Batman' },
                    { id : 2, name : 'Clark Kent', image : 'rob.jpg', eventColor : 'orange', alias : 'Superman' }
                ],
                filters : [{
                    property : 'name',
                    operator : '=',
                    value    : 'Clark Kent'
                }]
            },
            sidebar : {
                items : {
                    resourceFilter : {
                        store : {
                            sorters : []
                        }
                    }
                }
            }
        });
        const
            view                       = calendar.activeView,
            collectViewResourceNames   = () => {
                const result = [];
                view.items.forEach(v => {
                    if (!v.isResourceDayViewTimeAxis && v.isVisible) {
                        result.push(v.resource.name);
                    }
                });
                return result;
            },
            collectResourceFilterNames = () => {
                return [...calendar.sidebar.element.querySelectorAll('.b-resourcefilter .b-list-item')].map(i => i.innerText);
            };

        // Only Clark Kent is represented in the resource filter
        t.isDeeply(collectResourceFilterNames(), ['Clark Kent'], 'Only one resource filterable');

        // Only Clark Kent is represented in the resource view
        t.isDeeply(collectViewResourceNames(), ['Clark Kent'], 'Only one resource visible');

        // Allow Bruce Wayne into the resource store
        calendar.resourceStore.clearFilters();

        // Two filter items now
        t.isDeeply(collectResourceFilterNames(), ['Bruce Wayne', 'Clark Kent'], 'Two resources filterable');

        // Still only Clark Kent is represented in the resource view
        t.isDeeply(collectViewResourceNames(), ['Clark Kent'], 'Only one resource visible');

        // Check Bruce Wayne's item in the ResourceFilter
        await t.click('.b-resourcefilter .b-list-item[data-index="0"]');

        await t.waitForAnimations();

        // Wait for views to be correct
        await t.waitFor(() => ObjectHelper.isEqual(collectViewResourceNames(), ['Bruce Wayne', 'Clark Kent']));

        calendar.resourceStore.insert(0, {
            id   : 0,
            name : 'First'
        });

        await t.waitForAnimationFrame();

        // Three filter items now
        t.isDeeply(collectResourceFilterNames(), ['First', 'Bruce Wayne', 'Clark Kent'], 'Three resources filterable');

        // Still only the two resource views
        t.isDeeply(collectViewResourceNames(), ['Bruce Wayne', 'Clark Kent']);

        // Check First's item in the ResourceFilter
        await t.click('.b-resourcefilter .b-list-item[data-index="0"]');

        await t.waitForAnimations();

        // Wait for views to be correct
        await t.waitFor(() => ObjectHelper.isEqual(collectViewResourceNames(), ['First', 'Bruce Wayne', 'Clark Kent']));

        // Sort into ['Bruce Wayne', 'Clark Kent', 'First'] order
        calendar.resourceStore.sort((l, r) => l.name < r.name ? -1 : l.name > r.name ? 1 : 0);

        // Wait for views to be correct
        await t.waitFor(() => ObjectHelper.isEqual(collectViewResourceNames(), ['Bruce Wayne', 'Clark Kent', 'First']));

        // Filters have changed order too
        t.isDeeply(collectResourceFilterNames(), ['Bruce Wayne', 'Clark Kent', 'First'], 'Three resources filterable');
    });

    t.it('Resource order with stableResourceOrder : false', async t => {
        await setup({
            resources     : null,
            resourceStore : {
                data : [
                    { id : 1, name : 'Bruce Wayne', image : 'arnold.jpg', eventColor : 'blue', alias : 'Batman' },
                    { id : 2, name : 'Clark Kent', image : 'rob.jpg', eventColor : 'orange', alias : 'Superman' }
                ],
                filters : [{
                    property : 'name',
                    operator : '=',
                    value    : 'Clark Kent'
                }]
            },
            sidebar : {
                items : {
                    resourceFilter : {
                        store : {
                            sorters : []
                        }
                    }
                }
            },
            modes : {
                weekResources : {
                    stableResourceOrder : false
                }
            }
        });
        const
            view                       = calendar.activeView,
            collectViewResourceNames   = () => {
                const result = [];
                view.items.forEach(v => {
                    if (!v.isResourceDayViewTimeAxis && v.isVisible) {
                        result.push(v.resource.name);
                    }
                });
                return result;
            },
            collectResourceFilterNames = () => {
                return [...calendar.sidebar.element.querySelectorAll('.b-resourcefilter .b-list-item')].map(i => i.innerText);
            };

        // Only Clark Kent is represented in the resource filter
        t.isDeeply(collectResourceFilterNames(), ['Clark Kent'], 'Only one resource filterable');

        // Only Clark Kent is represented in the resource view
        t.isDeeply(collectViewResourceNames(), ['Clark Kent'], 'Only one resource visible');

        // Allow Bruce Wayne into the resource store
        calendar.resourceStore.clearFilters();

        // Two filter items now
        t.isDeeply(collectResourceFilterNames(), ['Bruce Wayne', 'Clark Kent'], 'Two resources filterable');

        // Still only Clark Kent is represented in the resource view
        t.isDeeply(collectViewResourceNames(), ['Clark Kent'], 'Only one resource visible');

        // Check Bruce Wayne's item in the ResourceFilter
        await t.click('.b-resourcefilter .b-list-item[data-index="0"]');

        await t.waitForAnimations();

        // Wait for views to be correct
        await t.waitFor(() => ObjectHelper.isEqual(collectViewResourceNames(), ['Clark Kent', 'Bruce Wayne']));

        calendar.resourceStore.insert(0, {
            id   : 0,
            name : 'First'
        });

        await t.waitForAnimationFrame();

        // Three filter items now
        t.isDeeply(collectResourceFilterNames(), ['First', 'Bruce Wayne', 'Clark Kent'], 'Three resources filterable');

        // Still only the two resource views
        t.isDeeply(collectViewResourceNames(), ['Clark Kent', 'Bruce Wayne']);

        // Check First's item in the ResourceFilter
        await t.click('.b-resourcefilter .b-list-item[data-index="0"]');

        await t.waitForAnimations();

        // Wait for views to be correct
        await t.waitFor(() => ObjectHelper.isEqual(collectViewResourceNames(), ['Clark Kent', 'Bruce Wayne', 'First']));

        // Sort into ['First', 'Clark Kent', 'Bruce Wayne'] order
        calendar.resourceStore.sort((l, r) => l.name < r.name ? 1 : l.name > r.name ? -1 : 0);

        // Wait for views to be correct
        await t.waitFor(() => ObjectHelper.isEqual(collectViewResourceNames(), ['First', 'Clark Kent', 'Bruce Wayne']));

        // Filters have changed order too
        t.isDeeply(collectResourceFilterNames(), ['First', 'Clark Kent', 'Bruce Wayne'], 'Three resources filterable');

        const noAllDayEventsRowHeights = getAllDayHeights();

        calendar.eventStore.add({
            resourceId : 0,
            name       : 'New Event',
            allDay     : true,
            startDate  : '2021-09-13T10:00',
            endDate    : '2021-09-13T11:00'
        });

        await t.waitForSelector('.b-cal-event-desc:contains(New Event)');

        await t.waitForAnimations();

        // Wait until all have been synced.
        await t.waitFor(() => t.allSame(getAllDayHeights()));

        let allDayHeights = getAllDayHeights();

        // All day rows must be taller than when no all day events
        for (let i = 0, { length } = allDayHeights; i < length; i++) {
            t.isGreater(allDayHeights[i], noAllDayEventsRowHeights[i], `Check item ${i}`);
        }

        // Check First's item in the ResourceFilter
        await t.click('.b-resourcefilter .b-list-item[data-index="0"]');

        await t.waitForSelectorNotFound('.b-cal-event-desc:contains(New Event)');

        await t.waitForAnimations();

        // Wait for views to be correct
        await t.waitFor(() => ObjectHelper.isEqual(collectViewResourceNames(), ['Clark Kent', 'Bruce Wayne']));

        allDayHeights = getAllDayHeights();

        // All day rows must always be same height and must be zero when no all day events
        for (let i = 0, { length } = allDayHeights; i < length; i++) {
            i && t.is(allDayHeights[i - 1], allDayHeights[i]);
            t.is(allDayHeights[i], noAllDayEventsRowHeights[i], `Check item ${i}`);
        }

        // Check First's item in the ResourceFilter.
        // We need to check that all day height are synced when its the last item
        // which dictates the highest all day row.
        await t.click('.b-resourcefilter .b-list-item[data-index="0"]');

        await t.waitForSelector('.b-cal-event-desc:contains(New Event)');

        await t.waitForAnimations();

        // Wait for views to be correct
        await t.waitFor(() => ObjectHelper.isEqual(collectViewResourceNames(), ['Clark Kent', 'Bruce Wayne', 'First']));

        await t.waitForAnimations();

        allDayHeights = getAllDayHeights();

        // All day rows must always be same height and must be greater than when no all day events
        for (let i = 0, { length } = allDayHeights; i < length; i++) {
            i && t.is(allDayHeights[i - 1], allDayHeights[i]);
            t.isGreater(allDayHeights[i], noAllDayEventsRowHeights[i], `Check item ${i}`);
        }

        await t.click('[data-ref="nextButton"]');

        await t.waitForSelectorNotFound('.b-cal-event-desc:contains(New Event)');

        await t.waitForAnimations();

        allDayHeights = getAllDayHeights();

        // All day rows must always be same height and must be zero when no all day events
        for (let i = 0, { length } = allDayHeights; i < length; i++) {
            i && t.is(allDayHeights[i - 1], allDayHeights[i]);
            t.is(allDayHeights[i], noAllDayEventsRowHeights[i], `Check item ${i}`);
        }

        await t.click('[data-ref="prevButton"]');

        await t.waitForSelector('.b-cal-event-desc:contains(New Event)');

        await t.waitForAnimations();

        allDayHeights = getAllDayHeights();

        // All day rows must always be same height and must zbe greater than when no all day events
        for (let i = 0, { length } = allDayHeights; i < length; i++) {
            i && t.is(allDayHeights[i - 1], allDayHeights[i]);
            t.isGreater(allDayHeights[i], noAllDayEventsRowHeights[i], `Check item ${i}`);
        }
    });

    t.it('Resource order with stableResourceOrder : false and resourceStore sort', async t => {
        await setup({
            resources     : null,
            resourceStore : {
                data : [
                    { id : 1, name : 'Bruce Wayne', image : 'arnold.jpg', eventColor : 'blue', alias : 'Batman' },
                    { id : 2, name : 'Clark Kent', image : 'rob.jpg', eventColor : 'orange', alias : 'Superman' }
                ]
            },
            sidebar : false,
            modes   : {
                weekResources : {
                    stableResourceOrder : false
                }
            }
        });
        const axisCount = DomHelper.scrollBarWidth ? 2 : 1;

        await t.waitForSelector('.b-resourcedayviewtimeaxis');

        // The time axis and the scroller (if we show scrollbars) are shown
        t.selectorCountIs('.b-resourcedayviewtimeaxis', axisCount);

        calendar.resourceStore.sort();

        // Response to sort must remove child views, but *not* the time axis and scroller widgets
        t.selectorCountIs('.b-resourcedayviewtimeaxis', axisCount);
    });

    t.it('Resource views should sync all day height on add/remove', async t => {
        await setup({
            resources     : null,
            resourceStore : {
                data : [
                    { id : 1, name : 'Bruce Wayne', image : 'arnold.jpg', eventColor : 'blue', alias : 'Batman' },
                    { id : 2, name : 'Clark Kent', image : 'rob.jpg', eventColor : 'orange', alias : 'Superman' }
                ],
                filters : [{
                    property : 'name',
                    operator : '=',
                    value    : 'Bruce Wayne'
                }]
            },
            events : [{
                id         : 1,
                name       : 'Redecorate the cave',
                resourceId : 1,
                startDate  : '2021-09-13T10:00',
                endDate    : '2021-09-13T11:00'
            }, {
                id         : 2,
                name       : 'Save world',
                allDay     : true,
                resourceId : 2,
                startDate  : '2021-09-13T10:00',
                endDate    : '2021-09-13T11:00'
            }],
            sidebar : false
        });
        const b = calendar.activeView.items[1];

        t.selectorCountIs('.b-weekview', 1);

        t.is(b.allDayEvents.cellContentHeight, 0);

        calendar.resourceStore.clearFilters();

        await t.waitFor(() => document.querySelectorAll('.b-weekview').length === 2);

        await t.waitForAnimations();

        // Should expand to match
        await t.waitFor(() => t.allSame(getAllDayHeights()));

        calendar.resourceStore.filter({
            property : 'name',
            operator : '=',
            value    : 'Bruce Wayne'
        });

        await t.waitFor(() => document.querySelectorAll('.b-weekview').length === 1);

        await t.waitForAnimations();

        // Should shrink back down
        await t.waitFor(() => b.allDayEvents.cellContentHeight === 0);
    });

    t.it('Should render avatars & name by default', async t => {
        let clickedResource, clickedEvent;

        await setup({
            listeners : {
                resourceClick({ resourceRecord, eventRecord }) {
                    clickedResource = resourceRecord;
                    clickedEvent = eventRecord;
                }
            }
        });

        t.selectorExists('img[src="../examples/_shared/images/users/arnold.jpg"]', 'Image found for Bruce');
        t.selectorExists('img[src="../examples/_shared/images/users/rob.jpg"]', 'Image found for Clark');

        t.selectorExists('.b-resource-name:textEquals(Bruce Wayne)', 'Bruce Waynes name found');
        t.selectorExists('.b-resource-name:textEquals(Clark Kent)', 'Clark Kents name found');

        await t.click('[data-btip="Bruce Wayne"]');

        await t.waitForAnimations();

        // resourceClick works
        t.notOk(clickedEvent);
        t.is(clickedResource, calendar.resourceStore.getById(1));
    });

    t.it('Should allow opting out of avatar', async t => {
        await setup({
            modes : {
                weekResources : {
                    showAvatars : false
                }
            }
        });

        t.selectorNotExists('img', 'No image found');

        t.selectorExists('.b-resource-name:textEquals(Bruce Wayne)', 'Bruce Waynes name found');
        t.selectorExists('.b-resource-name:textEquals(Clark Kent)', 'Clark Kents name found');
    });

    t.it('Should allow displaying meta', async t => {
        await setup({
            modes : {
                weekResources : {
                    meta : 'alias'
                }
            }
        });

        t.selectorExists('.b-resource-meta:textEquals(Batman)', 'Batman meta found');
        t.selectorExists('.b-resource-meta:textEquals(Superman)', 'Superman meta found');
    });

    t.it('Should allow displaying meta, function', async t => {
        await setup({
            modes : {
                weekResources : {
                    meta : resource => resource.alias
                }
            }
        });

        t.selectorExists('.b-resource-meta:textEquals(Batman)', 'Batman meta found');
        t.selectorExists('.b-resource-meta:textEquals(Superman)', 'Superman meta found');
    });

    t.it('Should autoCreate event for correct resource', async t => {
        await setup({
            features : {
                eventEdit : false
            }
        });

        const initialCount = calendar.eventStore.count;

        await t.doubleClick('.b-first-resource-view .b-day-name-date');

        await t.waitForProjectReady(calendar);

        t.is(calendar.eventStore.count, initialCount + 1, 'Event added');
        t.is(calendar.eventStore.last.resource.id, 1, 'Event assigned to correct resource');

        await t.doubleClick('.b-last-resource-view .b-day-name-date');

        await t.waitForProjectReady(calendar);

        t.is(calendar.eventStore.count, initialCount + 2, 'Event added');
        t.is(calendar.eventStore.last.resource.id, 2, 'Event assigned to correct resource');
    });

    t.it('Should support hideNonWorkingDays / resourceWidth configs + properties', async t => {
        await setup({
            modes : {
                weekResources : {
                    type               : 'resource',
                    title              : 'Week resources',
                    resourceWidth      : 500,
                    hideNonWorkingDays : true
                }
            }
        });

        t.hasApproxWidth('.b-resourceview-resource', 500, 'resourceWidth config works');
        t.selectorNotExists('.b-resourceview-resource .b-nonworking-day', 'No working days');

        calendar.modes.weekResources.hideNonWorkingDays = false;
        t.selectorExists('.b-resourceview-resource .b-nonworking-day', 'property: No working days');

        calendar.modes.weekResources.resourceWidth = 800;
        t.hasApproxWidth('.b-resourceview-resource', 800, 'resourceWidth property works');
    });

    if (DomHelper.scrollBarWidth) {
        t.it('Should hide and show the docked scroller as needed', async t => {
            await setup({
                modes : {
                    weekResources : {
                        type               : 'resource',
                        title              : 'Week resources',
                        resourceWidth      : 500,
                        hideNonWorkingDays : true,
                        view               : {
                            dayStartTime : 8,
                            dayEndTime   : 20
                        }
                    }
                }
            });
            const { height } = calendar;

            t.notOk(calendar.modes.weekResources.dayViewScroller.isVisible, 'Fake vertical scroller not visible');

            calendar.height = 600;

            await t.waitFor(() => calendar.modes.weekResources.dayViewScroller.isVisible);

            t.pass('Fake vertical scroller shown');

            calendar.height = height;

            await t.waitFor(() => !calendar.modes.weekResources.dayViewScroller.isVisible);

            t.pass('Fake vertical scroller hidden');
        });
    }

    t.it('allDayEvents row heights must always be in sync', async t => {
        await setup({
            sidebar : false,

            modes : {
                weekResources : {
                    type          : 'resource',
                    title         : 'Week resources',
                    resourceWidth : 400
                }
            },
            events : [{
                id         : 11,
                name       : 'Important event 1',
                resourceId : 1,
                startDate  : '2021-09-13',
                endDate    : '2021-09-14'
            }, {
                id         : 12,
                name       : 'Important event 2',
                resourceId : 1,
                startDate  : '2021-09-13',
                endDate    : '2021-09-14'
            }, {
                id         : 13,
                name       : 'Important event 3',
                resourceId : 1,
                startDate  : '2021-09-13',
                endDate    : '2021-09-14'
            }, {
                id         : 14,
                name       : 'Important event 4',
                resourceId : 1,
                startDate  : '2021-09-13',
                endDate    : '2021-09-14'
            }, {
                id         : 21,
                name       : 'Another event 1',
                resourceId : 2,
                startDate  : '2021-09-13',
                endDate    : '2021-09-14'
            }, {
                id         : 22,
                name       : 'Another event 2',
                resourceId : 2,
                startDate  : '2021-09-13',
                endDate    : '2021-09-14'
            }, {
                id         : 23,
                name       : 'Another event 3',
                resourceId : 2,
                startDate  : '2021-09-13',
                endDate    : '2021-09-14'
            }, {
                id         : 24,
                name       : 'Another event 4',
                resourceId : 2,
                startDate  : '2021-09-13',
                endDate    : '2021-09-14'
            }, {
                id         : 25,
                name       : 'Another event 5',
                resourceId : 2,
                startDate  : '2021-09-13',
                endDate    : '2021-09-14'
            }]
        });

        // Wait until all have been synced.
        await t.waitFor(() => t.allSame(getAllDayHeights()));

        let allDayHeights = getAllDayHeights();

        // Capture the height of the all day row in its default, collapsed state
        const collapsedHeight = allDayHeights[0];

        // All day rows must always be same height
        for (let i = 0, { length } = allDayHeights; i < length - 1; i++) {
            t.is(allDayHeights[i], allDayHeights[i + 1], `Compare item ${i} with ${i + 1}`);
        }

        // Expand all day rows
        await t.click('.b-dayview-allday-row-start');

        await t.waitForAnimations();

        await resourceView.items[0].allDayEvents.heightAnimation;

        allDayHeights = getAllDayHeights();

        // Height must have grown to accommodate showing all the "allDay" events
        t.isGreater(allDayHeights[0], collapsedHeight);

        // All day rows must always be same height
        for (let i = 0, { length } = allDayHeights; i < length - 1; i++) {
            t.is(allDayHeights[i], allDayHeights[i + 1], `Check item ${i}`);
        }

        // Collapse all day rows
        await t.click('.b-dayview-allday-row-start');

        await t.waitForAnimations();

        await resourceView.items[0].allDayEvents.heightAnimation;

        allDayHeights = getAllDayHeights();

        // Height must have dropped back to the collapsed height
        t.isApproxPx(allDayHeights[0], collapsedHeight);

        // All day rows must always be same height
        for (let i = 0, { length } = allDayHeights; i < length - 1; i++) {
            t.is(allDayHeights[i], allDayHeights[i + 1], `Check item ${i}`);
        }
    });

    // https://github.com/bryntum/support/issues/3526
    t.it('Should support showing resourceView with list views', async t => {
        await setup({
            date    : new Date(2021, 9, 1),
            sidebar : false,

            events : [{
                id         : 1,
                name       : 'Weekend',
                resourceId : 1,
                startDate  : '2021-10-09',
                endDate    : '2021-10-11'
            },
            {
                id         : 2,
                name       : 'Working',
                resourceId : 1,
                startDate  : '2021-10-11',
                endDate    : '2021-10-12'
            }],

            modes : {
                weekResources : {
                    type               : 'resource',
                    title              : 'Week resources',
                    hideNonWorkingDays : true,
                    resourceWidth      : 400,
                    view               : {
                        type : 'list'
                    }
                }
            }
        });

        await t.waitForSelector('.b-grid-cell:contains(Working)');

    });

    t.it('Should support showing resourceView with agenda views', async t => {
        await setup({
            date    : new Date(2021, 9, 1),
            sidebar : false,

            events : [{
                id         : 1,
                name       : 'Weekend',
                resourceId : 1,
                startDate  : '2021-10-09',
                endDate    : '2021-10-11'
            },
            {
                id         : 2,
                name       : 'Working',
                resourceId : 1,
                startDate  : '2021-10-11',
                endDate    : '2021-10-12'
            }],

            modes : {
                weekResources : {
                    type          : 'resource',
                    title         : 'Week resources',
                    // hideNonWorkingDays : true,
                    resourceWidth : 400,
                    view          : {
                        type : 'agenda'
                    }
                }
            }
        });

        await t.waitForSelector('.b-grid-cell');
        t.elementIsNotVisible('.b-cal-widget-settings-button');
    });

    t.it('Filtered back in views should show correct dates', async t => {
        await setup({
            date : new Date(2021, 9, 11),

            events : [{
                id         : 1,
                name       : 'Weekend',
                resourceId : 1,
                startDate  : '2021-10-10',
                endDate    : '2021-10-11'
            },
            {
                id         : 2,
                name       : 'Working',
                resourceId : 1,
                startDate  : '2021-10-11',
                endDate    : '2021-10-12'
            }],

            modes : {
                weekResources : {
                    type  : 'resource',
                    title : 'Week resources'
                }
            }
        });

        t.selectorCountIs('.b-cal-event-wrap', 2, 'Bruce Wayne\'s events visible');

        await t.click('.b-list-item.b-selected:contains(Bruce Wayne)');

        await t.waitForAnimations();

        await t.waitForSelectorCount('.b-cal-event-wrap', 0);

        await t.click('[data-ref="prevButton"]');

        await t.waitForAnimations();

        await t.click('.b-list-item:not(.b-selected):contains(Bruce Wayne)');

        await t.waitForAnimations();

        t.selectorCountIs('.b-cal-event-wrap', 0, 'Bruce Wayne\'s events not present at the new date');
    });

    t.it('Reloading data should work', async t => {
        await setup({
            date : new Date(2021, 9, 11),

            assignments : [{
                id : 1, eventId : 1, resourceId : 1
            }, {
                id : 2, eventId : 2, resourceId : 2
            }],
            events : [{
                id        : 1,
                name      : 'Weekend',
                startDate : '2021-10-10',
                endDate   : '2021-10-11'
            },
            {
                id        : 2,
                name      : 'Working',
                startDate : '2021-10-11',
                endDate   : '2021-10-12'
            }],
            resources : [{
                id : 1, name : 'Resource 1'
            }, {
                id : 2, name : 'Resource 2'
            }],

            modes : {
                weekResources : {
                    type  : 'resource',
                    title : 'Week resources'
                }
            }
        });

        t.selectorCountIs('.b-weekview .b-cal-event-wrap', 2);

        calendar.setConfig({
            assignments : [{
                id : 1, eventId : 1, resourceId : 1
            }, {
                id : 2, eventId : 2, resourceId : 2
            }],
            events : [{
                id        : 1,
                name      : 'New name 1',
                startDate : '2021-10-10',
                endDate   : '2021-10-11'
            },
            {
                id        : 2,
                name      : 'New name 2',
                startDate : '2021-10-11',
                endDate   : '2021-10-12'
            }],
            resources : [{
                id : 1, name : 'Cal 1'
            }, {
                id : 2, name : 'Cal 2'
            }]
        });

        await t.waitForSelector('.b-resourceview-title:contains("Cal 1")');

        t.selectorCountIs('.b-weekview .b-cal-event-wrap:contains("New name 1")', 1);
        t.selectorCountIs('.b-weekview .b-cal-event-wrap:contains("New name 2")', 1);

        t.selectorCountIs('.b-resourcefilter .b-list-item:contains("Cal 1")', 1);
        t.selectorCountIs('.b-resourcefilter .b-list-item:contains("Cal 2")', 1);

        t.selectorCountIs('.b-resourceview-title:contains("Cal 1")', 1);
        t.selectorCountIs('.b-resourceview-title:contains("Cal 2")', 1);
    });

    t.it('Should config timeFormat work in resourceview', async t => {
        await setup({
            modes : {
                weekResources : {
                    view : {
                        timeFormat : 'HH:mm'
                    }
                }
            }
        });

        t.selectorExists('.b-dayview-timeaxis-time.b-dayview-timeaxis-time-20:contains(20:00)', 'timeFormat works in resourceview');
    });

    // https://github.com/bryntum/support/issues/7107
    t.it('Should be able to drag in/out of all day zone', async t => {
        await setup({
            modes : {
                weekResources : {
                }
            }
        });

        // await t.scrollTo('.b-resourcedayviewtimeaxis.b-resource-dayview-scroller', 0, 0);
        await t.scrollTo('.b-resourceview-resource .b-dayview-day-content', 0, 0);
        await t.dragTo({
            source       : '[data-event-id="2"]',
            target       : '[data-resource-id="2"] [data-header-date="2021-09-13"]',
            targetOffset : ['50%', '100%-5px']
        });

        await t.dragBy({
            source   : '[data-event-id="2"]',
            delta    : [-10, 0],
            dragOnly : true
        });

        await t.waitForSelector('.b-cal-tentative-event');

        const eventEl = t.query('[data-event-id="2"]')[0];
        const eventRect = eventEl.getBoundingClientRect();
        const tentativeEl = t.query('.b-cal-tentative-event')[0];
        const tentativeRect = tentativeEl.getBoundingClientRect();

        t.isLess(Math.abs(eventRect.top - tentativeRect.top), 2);
        await t.mouseUp();
    });

    // https://github.com/bryntum/support/issues/5007
    t.it('Zoom on mousewheel should be synced across views', async t => {
        await setup({
            modes : {
                weekResources : {
                    view : {
                        zoomOnMouseWheel : true
                    }
                }
            }
        });

        const
            view           = calendar.activeView,
            { hourHeight } = view.items[0];

        // hourHeights start synced
        t.ok(view.items.every(v => v.hourHeight === hourHeight));

        // Zoom on the time axis.
        t.query('.b-dayview-timeaxis-time.b-dayview-timeaxis-time-13')[0].style.pointerEvents = 'all';
        await t.wheel('.b-dayview-timeaxis-time.b-dayview-timeaxis-time-13', null, null, {
            deltaY  : -10,
            ctrlKey : true
        });

        const newHourHeight = view.items[0].hourHeight;

        // Wait for them all to have grown
        await t.waitFor(() => view.items.every(v => v.hourHeight > hourHeight && v.hourHeight === newHourHeight));
    });

    // https://github.com/bryntum/support/issues/5165
    t.it('Keyboard-initiated features must work from overflow popups', async t => {
        await setup({
            features : {
                eventTooltip : false
            },
            sidebar : false,
            modes   : {
                weekResources  : false,
                monthResources : {
                    type : 'resourceview',
                    view : {
                        type : 'month'
                    }
                }
            },
            events : [{
                id         : 1,
                name       : 'Event 1',
                resourceId : 1,
                startDate  : '2021-09-13T10:00',
                endDate    : '2021-09-13T11:00'
            }, {
                id         : 2,
                name       : 'Event 2',
                resourceId : 1,
                startDate  : '2021-09-13T11:00',
                endDate    : '2021-09-13T12:00'
            }, {
                id         : 3,
                name       : 'Event 3',
                resourceId : 1,
                startDate  : '2021-09-13T12:00',
                endDate    : '2021-09-13T13:00'
            }, {
                id         : 4,
                name       : 'Event 4',
                resourceId : 1,
                startDate  : '2021-09-13T13:00',
                endDate    : '2021-09-13T14:00'
            }, {
                id         : 5,
                name       : 'Event 5',
                resourceId : 1,
                startDate  : '2021-09-13T14:00',
                endDate    : '2021-09-13T15:00'
            }, {
                id         : 6,
                name       : 'Event 6',
                resourceId : 1,
                startDate  : '2021-09-13T15:00',
                endDate    : '2021-09-13T16:00'
            }]
        });

        await t.click('.b-cal-event-wrap[data-event-id="2"]');
        await t.waitForAnimations();

        await t.type(null, '[TAB]');

        await t.type(null, '[ENTER]');

        await t.waitFor(() => calendar.activeSubView.overflowPopup.containsFocus);

        await t.type(null, '[TAB]');
        await t.type(null, '[TAB]');
        await t.type(null, '[TAB]');
        await t.type(null, '[TAB]');
        await t.type(null, '[TAB]');

        // We keyboard navigated to event 6
        t.is(calendar.activeEvent.id, 6);

        await t.type(null, ' ');

        // SPACE should invoke the event context menu
        await (() => calendar.features.eventMenu.menu.containsFocus);

        // Overflow popup must still be active - the event menu is attached as a descendent
        // upon show.
        t.ok(calendar.activeSubView.overflowPopup.containsFocus);

        await t.type(null, '[ESCAPE]');

        // That hides the menu
        t.notOk(calendar.features.eventMenu.menu.isVisible);

        // OverflowPopup is still there and focused
        t.ok(calendar.activeSubView.overflowPopup.containsFocus);

        await t.type(null, '[ENTER]');

        // Editing has started.
        t.ok(calendar.features.eventEdit.editor.containsFocus);
    });

    // https://github.com/bryntum/support/issues/5536
    t.it('DayView time axes should follow the allDayEvents settings of the DayViews', async t => {
        await setup({
            modes : {
                weekResources : null,
                dayResources  : {
                    type : 'resource',
                    view : {
                        type         : 'dayview',
                        allDayEvents : null
                    }
                }
            }
        });

        // No all day rows exist at all
        t.selectorNotExists('.b-dayview-allday-row');
    });

    t.it('ResourceView should sync configs of filtered-in subviews', async t => {
        await setup({
            modes : {
                weekResources : null,
                dayResources  : {
                    type : 'resource',
                    view : {
                        type         : 'dayview',
                        allDayEvents : null
                    }
                }
            },
            sidebar : {
                items : {
                    resourceFilter : {
                        selected : [2]
                    }
                }
            }
        });
        const
            resourceView = calendar.activeView,
            clarkKent = resourceView.items[1];

        // Only one day view
        t.is(resourceView.items.filter(v => !v.isResourceDayViewTimeAxis).length, 1);

        clarkKent.hourHeight = 100;

        await t.waitForEvent(clarkKent, 'layoutUpdate');

        clarkKent.scrollable.y = 500;

        await t.waitForAnimationFrame();

        // Show Bruce Wain
        await t.click('.b-list-item[data-id="1"]');
        await t.waitFor(() => resourceView.items.filter(v => !v.isResourceDayViewTimeAxis).length === 2);

        const bruceWain = resourceView.items[1];

        // Both views in sync in hourHeight and scroll position
        t.is(bruceWain.hourHeight, clarkKent.hourHeight);
        t.is(bruceWain.scrollable.y, clarkKent.scrollable.y);

        // Hide Clark Kent
        await t.click('.b-list-item[data-id="2"]');
        await t.waitFor(() => resourceView.items.filter(v => !v.isResourceDayViewTimeAxis).length === 1);

        bruceWain.hourHeight = 200;

        await t.waitForEvent(clarkKent, 'layoutUpdate');

        bruceWain.scrollable.y = 1000;

        await t.waitForAnimationFrame();

        // Show Clark Kent
        await t.click('.b-list-item[data-id="2"]');
        await t.waitFor(() => resourceView.items.filter(v => !v.isResourceDayViewTimeAxis).length === 2);

        await t.waitForAnimationFrame();

        // Both views in sync in hourHeight and scroll position
        t.is(bruceWain.hourHeight, clarkKent.hourHeight);
        t.is(bruceWain.scrollable.y, clarkKent.scrollable.y);
    });

    // https://github.com/bryntum/support/issues/6772
    t.it('Event colour with multi assignment', async t => {
        t.mockUrl('/6772/multi', {
            responseText : JSON.stringify({
                success   : true,
                resources : {
                    rows : [
                        { id : 1, name : 'Resource 1', eventColor : 'red' },
                        { id : 2, name : 'Resource 2', eventColor : 'blue' }
                    ]
                },
                assignments : {
                    rows : [
                        { id : 1, eventId : 1, resourceId : 1 },
                        { id : 2, eventId : 1, resourceId : 2 }
                    ]
                },
                events : {
                    rows : [
                        {
                            id        : 1,
                            name      : 'Assigned to both',
                            startDate : '2022-02-10T07:00',
                            endDate   : '2022-02-10T08:00'
                        }
                    ]
                }
            })
        });

        await setup({
            crudManager : {
                autoLoad  : true,
                transport : {
                    load : {
                        url : '/6772/multi'
                    }
                }
            },
            date      : '2022-02-10',
            resources : null,
            events    : null
        });

        const resourceView = calendar.activeView;

        // Event is rendered in both child views
        t.selectorCountIs('.b-cal-event:contains(Assigned to both)', 2);

        // Each event should be rendered in the eventColor of the resource of the view.
        // Not the eventColor of the event's first assigned resource.
        t.hasStyle(resourceView.views[0].element.querySelector('.b-cal-event'), 'background-color', 'rgb(239, 83, 80)');
        t.hasStyle(resourceView.views[1].element.querySelector('.b-cal-event'), 'background-color', 'rgb(66, 165, 245)');
    });

    // https://github.com/bryntum/support/issues/6981
    t.it('Should have same weekStartDay as Calendar instance', async t => {
        await setup({
            date         : '2023-06-26',
            weekStartDay : 1
        });

        t.selectorExists('.b-cal-cell-header:contains(Mon):contains(26):first-child');

        calendar.weekStartDay = 0;

        t.selectorExists('.b-cal-cell-header:contains(Sun):contains(25):first-child');
    });

    // https://github.com/bryntum/support/issues/7002
    t.it('Should support updating dayStartTime / dayEndTime as a string and round the start down and end up', async t => {
        await setup({
            modes : {
                weekResources : {
                    view : {
                        dayStartTime : 7,
                        dayEndTime   : 17
                    }
                }
            }
        });

        const
            dayView1 = calendar.activeView.views[0],
            dayView2 = calendar.activeView.views[1];

        t.is(dayView1.dayStartTime, 7 * 3600 * 1000, 'View starts at 7');
        t.is(dayView1.dayEndTime, 17 * 3600 * 1000, 'View ends at 17');
        t.is(dayView2.dayStartTime, 7 * 3600 * 1000, 'View starts at 7');
        t.is(dayView2.dayEndTime, 17 * 3600 * 1000, 'View ends at 17');

        t.selectorExists('.b-dayview-timeaxis-time:first-child:regex(8\\sAM)', 'first tick shows 8 am');
        t.selectorExists('.b-dayview-timeaxis-time:last-child :last-child:regex(5\\sPM)', 'last tick shows 4 pm');
        t.selectorExists('.b-dayview-timeaxis-time:first-child:regex(8\\sAM)', 'first tick shows 8 am');
        t.selectorExists('.b-dayview-timeaxis-time:last-child :last-child:regex(5\\sPM)', 'last tick shows 4 pm');

        // Will be rounded down to 08:00
        calendar.activeView.view.dayStartTime = '08:30';

        // Will be rounded up to 19:00
        calendar.activeView.view.dayEndTime = '18:30';

        await t.waitForSelector('.b-dayview-timeaxis-time:nth-child(2):regex(9\\sAM)');
        t.selectorExists('.b-dayview-timeaxis-time:last-child :last-child:regex(7\\sPM)', 'last tick shows 6 pm');
        t.selectorExists('.b-dayview-timeaxis-time:nth-child(2):regex(9\\sAM)');
        t.selectorExists('.b-dayview-timeaxis-time:last-child :last-child:regex(7\\sPM)', 'last tick shows 6 pm');

        t.is(dayView1.dayStartTime, 8 * 3600 * 1000, 'View starts at 8');
        t.is(dayView1.dayEndTime, 19 * 3600 * 1000, 'View ends at 19');
        t.is(dayView2.dayStartTime, 8 * 3600 * 1000, 'View starts at 8');
        t.is(dayView2.dayEndTime, 19 * 3600 * 1000, 'View ends at 19');
    });

    // https://github.com/bryntum/support/issues/7007
    t.it('Configs from Calendar should not override configs in views', async t => {
        await setup({
            modes : {
                weekResources : {
                    view : {
                        coreHours : { start : 9, end : 17, overlayDay : true }
                    }
                },
                week : true
            },
            coreHours : { start : 8, end : 18, overlayDay : true },
            date      : '2022-06-05',
            mode      : 'weekResources'
        });

        // Resource mode's view's differing config not have been overwritten by the Calendar
        t.isDeeply(resourceView.views[0].coreHours, { start : 9, end : 17, overlayDay : true, _overlayDay : true });

        t.isDeeply(calendar.modes.week.coreHours, { start : 8, end : 18, overlayDay : true, _overlayDay : true });
    });

    // https://github.com/bryntum/support/issues/7166
    t.it('should correctly maintain b-selected-date class in calendar rows', async t => {
        await setup({
            date         : '2023-06-26',
            weekStartDay : 1
        });

        await t.waitForSelector('.b-selected-date[data-header-date="2023-06-26"]');
        t.selectorCountIs('.b-selected-date[data-header-date="2023-06-26"]', 2, 'All headers are initially correct');
        t.selectorCountIs('.b-selected-date[data-header-date="2023-06-28"]', 0, 'No headers have other date');

        await t.click('.b-calendardatepicker [data-date="2023-06-28"]');

        await t.waitForSelector('.b-selected-date[data-header-date="2023-06-28"]');
        t.selectorCountIs('.b-selected-date[data-header-date="2023-06-28"]', 2, 'All headers update correctly');
        t.selectorCountIs('.b-selected-date[data-header-date="2023-06-26"]', 0, 'No headers have original date');
    });

    // https://github.com/bryntum/support/issues/7179
    t.it('beforeAutoCreate should contain resourceRecord param when drag create', async t => {
        await setup({
            date         : '2023-06-26',
            weekStartDay : 1,
            listeners    : {
                beforeAutoCreate({ resourceRecord }) {
                    t.is(resourceRecord.name, 'Bruce Wayne', 'Correct resourceRecord argument');
                }
            }
        });

        await t.dragBy({
            source : '.b-dayview-day-detail[data-date="2023-06-27"]',
            offset : ['50%', '50%'],
            delta  : [0, 60]
        });
        await t.waitForSelector('.b-eventeditor');
        await t.click('[data-ref="cancelButton"]');
    });

    t.it('beforeAutoCreate should contain resourceRecord param when schedule menu create', async t => {
        await setup({
            date         : '2023-06-26',
            weekStartDay : 1,
            listeners    : {
                beforeAutoCreate({ resourceRecord }) {
                    t.is(resourceRecord.name, 'Bruce Wayne', 'Correct resourceRecord argument');
                }
            }
        });

        await t.rightClick('.b-dayview-day-detail[data-date="2023-06-27"]');
        await t.waitForSelector('.b-menu');
        await t.click('.b-menu .b-menuitem');
        await t.waitForSelector('.b-eventeditor');
        await t.click('[data-ref="cancelButton"]');
    });

    t.it('Should work standalone', async t => {
        calendar = new ResourceView({
            appendTo           : document.body,
            height             : 500,
            date               : new Date(2020, 8, 2),
            dayStartTime       : 6,
            dayEndTime         : 19,
            visibleStartTime   : 6,
            resourceWidth      : '30em',
            hideNonWorkingDays : true,
            resources          : [
                {
                    id         : 1,
                    name       : 'John',
                    eventColor : 'blue'
                },
                {
                    id         : 2,
                    name       : 'Mike',
                    eventColor : 'orange'
                },
                {
                    id         : 3,
                    name       : 'Lisa',
                    eventColor : 'red'
                }
            ],
            events : [
                { startDate : '2020-09-02T10:00', duration : 5, durationUnit : 'h', name : 'Studies', eventColor : 'red', resourceId : 1 },
                { startDate : '2020-09-02T07:00', duration : 5, durationUnit : 'h', name : 'Walk the dog', eventColor : 'yellow', resourceId : 2 },
                { startDate : '2020-09-03T09:00', duration : 2, durationUnit : 'h', name : 'Buy groceries', eventColor : 'orange', resourceId : 2 },
                { startDate : '2020-09-04T07:00', duration : 1, durationUnit : 'h', name : 'Zoom meeting', eventColor : 'deep-orange', resourceId : 1 },
                { startDate : '2020-09-05T09:00', duration : 1, durationUnit : 'h', name : 'Get a haircut', eventColor : 'gray', resourceId : 1 }
            ]
        });
    });
});
