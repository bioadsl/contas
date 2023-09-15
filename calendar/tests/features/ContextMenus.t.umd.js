
StartTest(t => {

    let calendar, eventStore, resourceStore, duplicates, extraCount;

    async function getCalendar(config) {
        const calendar = await t.getCalendar(Objects.merge({
            features : {
                eventMenu : {
                    items : {
                        duplicate : {
                            text : 'Duplicate',
                            icon : 'b-fa b-fa-clone',

                            // Handler found by looking up ownership hierarchy.
                            // Will find an implementation in the Calendar
                            onItem : 'up.duplicateEvent'
                        }
                    }
                },
                scheduleMenu : {
                    items : {
                        extra : {
                            text : 'Extra function',
                            icon : 'b-fa b-fa-anchor',

                            // Handler found by looking up ownership hierarchy.
                            // Will find an implementation in the Calendar
                            onItem : 'up.extraScheduleHandler'
                        }
                    }
                }
            },

            duplicateEvent({ eventRecord }) {
                duplicates.push(eventRecord);
            },

            extraScheduleHandler() {
                extraCount++;
            }
        }, config));
        eventStore = calendar.eventStore;
        resourceStore = calendar.resourceStore;

        duplicates = [];
        extraCount = 0;

        // Wait for the DOM to have layed out so that a turbo mode mousemove triggers a mouseover
        await t.waitForAnimationFrame();

        return calendar;
    }

    t.beforeEach(function() {
        calendar?.destroy();

        // Check that none of the floating things are persisting
        if (t.query('.b-overflowpopup:visible,.b-sch-event-tooltip, .b-eventeditor, .b-menu').length > 0) {
            t.selectorNotExists('.b-overflowpopup:visible');
            t.selectorNotExists('.b-sch-event-tooltip');
            t.selectorNotExists('.b-eventeditor');
            t.selectorNotExists('.b-menu');
        }
    });

    t.it('DayView', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date     : new Date(2019, 9, 14),
            sidebar  : false,
            eventStore,
            resourceStore,
            features : {
                eventTooltip : false
            },
            mode : 'day'
        });

        let newEvent;

        t.chain(
            // Click just after 10:30, should snap to 10:30
            { rightClick : '.b-dayview-day-detail.b-calendar-cell', offset : ['50%', calendar.modes.day.hourHeight * 10.6] },

            { click : '.b-menuitem[data-ref="addEvent"]' },

            { waitFor : () => calendar.features.eventEdit.editor?.containsFocus },

            { type : 'Added event[ENTER]' },

            next => {
                newEvent = eventStore.last;

                t.is(newEvent.name, 'Added event');
                t.is(newEvent.startDate, new Date(2019, 9, 14, 10, 30));
                next();
            },

            { rightClick : '.b-dayview-day-detail.b-calendar-cell', offset : ['50%', calendar.modes.day.hourHeight * 12] },

            { click : '.b-menuitem[data-ref="extra"]' },

            next => {
                t.is(extraCount, 1);
                next();
            },

            { rightClick : '.b-cal-event-wrap:contains(Added event)' },

            { click : '.b-menuitem[data-ref="deleteEvent"]' },

            next => {
                // Event has gone
                t.notOk(eventStore.includes(newEvent));
                next();
            },

            { rightClick : '.b-cal-event-wrap:contains(Check-In in Hotel)' },

            { click : '.b-menuitem[data-ref="duplicate"]' },

            () => {
                // One event duplicated
                t.is(duplicates.length, 1);
            }
        );
    });

    t.it('With processItems', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date     : new Date(2019, 9, 14),
            sidebar  : false,
            eventStore,
            resourceStore,
            features : {
                eventTooltip : false,
                scheduleMenu : {
                    processItems : 'up.testProcessItems'
                }
            },
            mode : 'day',
            testProcessItems({ items, eventRecord }) {
                items.extraItem = {
                    text   : 'Extra item',
                    onItem : 'up.onExtraItemClick'
                };
            },
            onExtraItemClick() {
                passed = true;
            }
        });

        let passed;

        await t.rightClick('.b-dayview-day-detail.b-calendar-cell', null, null, ['50%', calendar.modes.day.hourHeight * 10.6]);

        await t.click('.b-menuitem[data-ref="extraItem"]');

        await t.waitFor(() => passed);
    });

    t.it('DayView using SPACE to invoke', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date     : new Date(2019, 9, 14),
            sidebar  : false,
            eventStore,
            resourceStore,
            features : {
                eventTooltip : false
            },
            mode : 'day'
        });

        let newEvent;

        t.chain(
            // Click just after 10:30, should snap to 10:30
            { rightClick : '.b-dayview-day-detail.b-calendar-cell', offset : ['50%', calendar.modes.day.hourHeight * 10.6] },

            { click : '.b-menuitem[data-ref="addEvent"]' },

            { waitFor : () => calendar.features.eventEdit.editor?.containsFocus },

            { type : 'Added event[ENTER]' },

            next => {
                newEvent = eventStore.last;

                t.is(newEvent.name, 'Added event');
                t.is(newEvent.startDate, new Date(2019, 9, 14, 10, 30));
                next();
            },

            { rightClick : '.b-dayview-day-detail.b-calendar-cell', offset : ['50%', calendar.modes.day.hourHeight * 12] },

            { click : '.b-menuitem[data-ref="extra"]' },

            next => {
                t.is(extraCount, 1);
                next();
            },

            { click : '.b-cal-event-wrap:contains(Added event)' },
            { type : ' ' },

            { click : '.b-menuitem[data-ref="deleteEvent"]' },

            next => {
                // Event has gone
                t.notOk(eventStore.includes(newEvent));
                next();
            },

            { click : '.b-cal-event-wrap:contains(Check-In in Hotel)' },
            { type : ' ' },

            { click : '.b-menuitem[data-ref="duplicate"]' },

            () => {
                // One event duplicated
                t.is(duplicates.length, 1);
            }
        );
    });

    t.it('MonthView', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date     : new Date(2019, 9, 14),
            sidebar  : false,
            eventStore,
            resourceStore,
            features : {
                eventTooltip : false
            },
            mode : 'month'
        });

        // Should use autoCreate's startHour
        await t.rightClick('.b-calendar-cell[data-date="2019-10-09"]');

        await t.click('.b-menuitem[data-ref="addEvent"]');

        await t.waitFor(() => calendar.features.eventEdit.editor?.containsFocus);

        await t.type(null, 'Added event[ENTER]');

        const newEvent = eventStore.last;

        t.is(newEvent.name, 'Added event');
        t.is(newEvent.startDate, new Date(2019, 9, 9, calendar.activeView.autoCreate.startHour));

        await t.rightClick('.b-calendar-cell[data-date="2019-10-10"]');

        await t.click('.b-menuitem[data-ref="extra"]');

        t.is(extraCount, 1);

        await t.rightClick('.b-cal-event-wrap:contains(Added event)');

        await t.click('.b-menuitem[data-ref="deleteEvent"]');

        // Event has gone
        t.notOk(eventStore.includes(newEvent));

        await t.rightClick('.b-cal-event-wrap:contains(Relax and official arrival beer)');

        await t.click('.b-menuitem[data-ref="duplicate"]');

        // One event duplicated
        t.is(duplicates.length, 1);

        await t.click('.b-calendar-cell[data-date="2019-10-14"] button.b-cal-cell-overflow');

        await t.waitFor(() => calendar.activeView._overflowPopup?.containsFocus);

        await t.rightClick('.b-cal-event-wrap[data-event-id="4"]');

        await t.waitFor(() => calendar.features.eventMenu.menu.containsFocus);

        // https://github.com/bryntum/support/issues/4856 : OverflowPopup must not hide
        t.ok(calendar.activeView.overflowPopup.isVisible);
    });

    t.it('MonthView using SPACE to invoke', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date     : new Date(2019, 9, 14),
            sidebar  : false,
            eventStore,
            resourceStore,
            features : {
                eventTooltip : false
            },
            mode : 'month'
        });

        let newEvent;

        t.chain(
            // Should use autoCreate's startHour
            { rightClick : '.b-calendar-cell[data-date="2019-10-09"]' },

            { click : '.b-menuitem[data-ref="addEvent"]' },

            { waitFor : () => calendar.features.eventEdit.editor?.containsFocus },

            { type : 'Added event[ENTER]' },

            next => {
                newEvent = eventStore.last;

                t.is(newEvent.name, 'Added event');
                t.is(newEvent.startDate, new Date(2019, 9, 9, calendar.activeView.autoCreate.startHour));
                next();
            },

            { rightClick : '.b-calendar-cell[data-date="2019-10-10"]' },

            { click : '.b-menuitem[data-ref="extra"]' },

            next => {
                t.is(extraCount, 1);
                next();
            },

            { click : '.b-cal-event-wrap:contains(Added event)' },
            { type : ' ' },

            { click : '.b-menuitem[data-ref="deleteEvent"]' },

            next => {
                // Event has gone
                t.notOk(eventStore.includes(newEvent));
                next();
            },

            { click : '.b-cal-event-wrap:contains(Relax and official arrival beer)' },
            { type : ' ' },

            { click : '.b-menuitem[data-ref="duplicate"]' },

            () => {
                // One event duplicated
                t.is(duplicates.length, 1);
            }
        );
    });

    t.it('YearView', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date     : new Date(2019, 9, 14),
            sidebar  : false,
            eventStore,
            resourceStore,
            features : {
                eventTooltip : false
            },
            mode : 'year'
        });

        let newEvent;

        t.chain(
            // Should use autoCreate's startHour
            { rightClick : '.b-yearview-content .b-calendar-cell[data-date="2019-10-09"]' },

            { click : '.b-menuitem[data-ref="addEvent"]' },

            { waitFor : () => calendar.features.eventEdit.editor?.containsFocus },

            { type : 'Added event[ENTER]' },

            next => {
                newEvent = eventStore.last;

                t.is(newEvent.name, 'Added event');
                t.is(newEvent.startDate, new Date(2019, 9, 9, calendar.activeView.autoCreate.startHour));
                next();
            },

            { click : '[data-ref="yearShowButton"]' },

            { rightClick : '.b-yearview-content .b-calendar-cell[data-date="2019-10-10"]' },

            { click : '.b-menuitem[data-ref="extra"]' },

            () => {
                t.is(extraCount, 1);
            }
        );
    });

    t.it('AgendaView', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date     : new Date(2019, 9, 14),
            sidebar  : false,
            eventStore,
            resourceStore,
            features : {
                eventTooltip : false
            },
            mode : 'agenda'
        });

        let newEvent;

        t.chain(
            // Should use autoCreate's startHour
            { rightClick : '.b-grid-cell[data-date="2019-10-15"]', offset : ['75%', '50%'] },

            { click : '.b-menuitem[data-ref="addEvent"]' },

            { waitFor : () => calendar.features.eventEdit.editor?.containsFocus },

            { type : 'Added event[ENTER]' },

            next => {
                newEvent = eventStore.last;

                t.is(newEvent.name, 'Added event');
                t.is(newEvent.startDate, new Date(2019, 9, 15, calendar.activeView.autoCreate.startHour));
                next();
            },

            { rightClick : '.b-grid-cell[data-date="2019-10-15"]', offset : ['75%', '50%'] },

            { click : '.b-menuitem[data-ref="extra"]' },

            next => {
                t.is(extraCount, 1);
                next();
            },

            { rightClick : '.b-cal-event-wrap:contains(Added event)' },

            { click : '.b-menuitem[data-ref="deleteEvent"]' },

            next => {
                // Event has gone
                t.notOk(eventStore.includes(newEvent));
                next();
            },

            { rightClick : '.b-cal-event-wrap:contains(Relax and official arrival beer)' },

            { click : '.b-menuitem[data-ref="duplicate"]' },

            () => {
                // One event duplicated
                t.is(duplicates.length, 1);
            }
        );
    });

    t.it('Removing items', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date     : new Date(2019, 9, 14),
            sidebar  : false,
            eventStore,
            resourceStore,
            features : {
                eventTooltip : false,
                scheduleMenu : {
                    items : {
                        addEvent : null
                    }
                },
                eventMenu : {
                    items : {
                        editEvent   : null,
                        deleteEvent : null
                    }
                }
            },
            mode : 'day'
        });

        t.chain(
            { rightClick : '.b-dayview-day-detail.b-calendar-cell' },

            next => {
                // The addEvent item must not be there
                t.selectorCountIs('.b-menuitem:not(.b-hidden)', 1);
                t.selectorExists('.b-menuitem:contains(Extra function)');
                next();
            },

            { rightClick : '.b-dayview-day-detail.b-calendar-cell .b-cal-event-wrap' },

            () => {
                // The editEvent and deleteEvent items must not be there
                t.selectorCountIs('.b-menuitem:not(.b-hidden)', 1);
                t.selectorExists('.b-menuitem:contains(Duplicate)');
            }
        );
    });

    t.it('ResourceView', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date     : new Date(2019, 9, 14),
            sidebar  : false,
            eventStore,
            resourceStore,
            features : {
                eventTooltip : false,
                scheduleMenu : {
                    processItems({ resourceRecord }) {
                        t.is(resourceRecord, calendar.resourceStore.last);
                    }
                }
            },
            modes : {
                day           : false,
                week          : false,
                month         : false,
                year          : false,
                agenda        : false,
                weekResources : {
                    type  : 'resource',
                    title : 'Week'
                }
            },
            listeners : {
                scheduleContextMenu : ({ resourceRecord }) => {
                    t.is(resourceRecord, calendar.resourceStore.last);
                }
            }
        });
        t.firesOnce(calendar, 'scheduleContextMenu');

        // Click the last view. Context menu should receive the correct resource
        await t.rightClick('.b-dayview-day-container[data-owner-cmp="b-resourceview-1-resourceweekview-mats"] .b-dayview-day-detail[data-date="2019-10-15"]');
    });

    // https://github.com/bryntum/support/issues/4988
    t.it('ScheduleContextMenu on a Scheduler mode should yield the clicked resourceRecord', async t => {
        eventStore = new EventStore({
            data : []
        });

        resourceStore = new ResourceStore({
            data : [
                {
                    id         : 3,
                    name       : 'Michael Johnson',
                    eventColor : 'deep-orange',
                    image      : 'mike.jpg'
                },
                {
                    id         : 4,
                    name       : 'Dan D McClane',
                    eventColor : '#C16413',
                    image      : 'dan.jpg'
                },
                {
                    id         : 5,
                    name       : 'Lisa G Gennero',
                    eventColor : '#75F44C',
                    image      : 'lisa.jpg'
                },
                {
                    id         : 6,
                    name       : 'Malik F Jackson',
                    eventColor : '#34A0D7',
                    image      : 'malik.jpg'
                },
                {
                    id         : 7,
                    name       : 'George E Miller',
                    eventColor : '#CFA664',
                    image      : 'george.jpg'
                },
                {
                    id         : 8,
                    name       : 'Linda H Brown',
                    eventColor : '#409120',
                    image      : 'linda.jpg'
                },
                {
                    id         : 9,
                    name       : 'Macy I Taylor',
                    eventColor : '#21CAD0',
                    image      : 'macy.jpg'
                },
                {
                    id         : 10,
                    name       : 'Amit Banu',
                    eventColor : '#01F189',
                    image      : 'amit.jpg'
                },
                {
                    id         : 11,
                    name       : 'Hitomi Kitaki',
                    eventColor : '#3E59A3',
                    image      : 'hitomi.jpg'
                },
                {
                    id         : 12,
                    name       : 'Dave B Davis',
                    eventColor : '#FAAD7B',
                    image      : 'dave.jpg'
                },
                {
                    id         : 13,
                    name       : 'Lola C Ewans',
                    eventColor : '#972D8D',
                    image      : 'lola.jpg'
                }
            ]
        });

        calendar = await getCalendar({
            date     : new Date(2019, 9, 14),
            sidebar  : false,
            eventStore,
            resourceStore,
            features : {
                eventTooltip : false,
                scheduleMenu : {
                    processItems({ resourceRecord }) {
                        t.is(resourceRecord, calendar.resourceStore.getAt(9));
                    }
                }
            },
            modes : {
                day      : false,
                week     : false,
                month    : false,
                year     : false,
                agenda   : false,
                timeline : {
                    type : 'scheduler',

                    // Used by the Calendar's mode selector button
                    displayName : 'Timeline',

                    // Used by resourceInfo column to base src for image field:
                    resourceImagePath : '../examples/_shared/images/users/',

                    // Change default event style for Scheduler to better match Calendars look
                    eventStyle : 'calendar',
                    columns    : [
                        { type : 'resourceInfo', field : 'name', text : 'Staff/Resource', width : 175 }
                    ]
                }
            },
            listeners : {
                scheduleContextMenu : ({ resourceRecord }) => {
                    t.is(resourceRecord, calendar.resourceStore.getAt(9));
                }
            }
        });
        t.firesOnce(calendar, 'scheduleContextMenu');

        await t.rightClick('.b-grid-row[data-index="9"] .b-timeaxis-cell');
    });

    // https://github.com/bryntum/support/issues/4769
    t.it('should hide tools which are not available', async t => {
        calendar = await t.getCalendar({
            height   : 600,
            date     : new Date(2019, 9, 14),
            sidebar  : false,
            mode     : 'week',
            features : {
                eventTooltip : true,
                eventEdit    : {
                    disabled : true
                }
            },
            events : [
                {
                    startDate    : new Date(2019, 9, 14),
                    duration     : 1,
                    durationUnit : 'h',
                    name         : 'foo'
                }
            ]
        });
        await t.rightClick('.b-cal-event');

        await t.waitFor(() => calendar.features.eventMenu.menu?.isVisible);

        // Edit menu item hidden when editing not available
        t.selectorNotExists('.b-menuitem[data-ref="editEvent"][aria-disabled=true]');

        // But delete menu item is there
        t.selectorExists('.b-menuitem[data-ref="deleteEvent"]:visible:not([aria-disabled=true])');

        await calendar.features.eventTooltip.tooltip.hide(false);

        calendar.features.eventEdit.disabled = false;

        await t.rightClick('.b-cal-event');

        await t.waitFor(() => calendar.features.eventMenu.menu?.isVisible);

        // Edit menu item now available
        t.selectorExists('.b-menuitem[data-ref="editEvent"]:visible:not([aria-disabled=true])');

        calendar.features.eventTooltip.tooltip.hide(false);

        calendar.eventStore.first.readOnly = true;

        await t.rightClick('.b-cal-event');

        await t.waitFor(() => calendar.features.eventMenu.menu?.isVisible);

        // Edit menu item disabled
        t.selectorExists('.b-menuitem[data-ref="editEvent"]:visible[aria-disabled=true]');

        // And delete menu item disabled
        t.selectorExists('.b-menuitem[data-ref="deleteEvent"]:visible[aria-disabled=true]');

        calendar.readOnly = true;

        await t.rightClick('.b-cal-event');

        // We are waiting for nothing. We are testing that nothing happens
        await t.waitFor(100);

        // Menu has not been shown because all items are hidden
        t.notOk(calendar.features.eventMenu.menu?.isVisible);
    });
});
