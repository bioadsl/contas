

StartTest(t => {
    const
        GUTTER = 5,
        INSET = 40,
        DAY_WIDTH = 188,  // approx
        HR_HEIGHT = 45;

    let calendar, eventStore, eventEl, eventRect, timeRangeEl, timeRangeRect;
    let timeRangeHeaderEl, timeRangeHeaderRect, timeRangeBodyEl, timeRangeBodyRect;

    t.beforeEach(() => {
        calendar?.destroy();
    });

    const setup = async(t, config) => {
        eventStore = t.getEventStore({
            data : [{
                id        : 'event1',
                cls       : 'event1',
                name      : 'Assignment 1',
                color     : 'red',
                startDate : new Date(2011, 0, 10, 9),
                endDate   : new Date(2011, 0, 10, 10)
            }, {
                id        : 'event2',
                cls       : 'event2',
                name      : 'Assignment 2',
                color     : '#f1c114',
                startDate : new Date(2011, 0, 10, 11),
                endDate   : new Date(2011, 0, 10, 13)
            }, {
                id        : 'event3',
                cls       : 'event3',
                name      : 'Assignment 3',
                color     : 'green',
                startDate : new Date(2011, 0, 11, 10),
                endDate   : new Date(2011, 0, 11, 14)
            }, {
                id        : 'event4',
                cls       : 'event4',
                name      : 'Assignment 4',
                color     : 'blue',
                startDate : new Date(2011, 0, 12, 10),
                endDate   : new Date(2011, 0, 12, 12)
            }, {
                id        : 'event5',
                cls       : 'event5',
                name      : 'Assignment 5',
                color     : 'indigo',
                startDate : new Date(2011, 0, 12, 13),
                endDate   : new Date(2011, 0, 12, 15)
            }, {
                id        : 'event6',
                cls       : 'event6',
                name      : 'Assignment 6',
                color     : 'orange',
                startDate : new Date(2011, 0, 13, 13),
                endDate   : new Date(2011, 0, 13, 15)
            }]
        });

        calendar = await t.getCalendar(ObjectHelper.merge({
            eventStore,
            timeRangeStore : {
                data : [
                    {
                        id        : 1,
                        name      : 'Arrival / Pre-conference',
                        startDate : '2011-01-10 09:30',
                        endDate   : '2011-01-10 17:00',
                        // Use blue as s colour literal rather than a color name from which a class is created
                        color     : '#00b',
                        iconCls   : 'b-icon b-fa-plane'
                    },
                    {
                        id        : 2,
                        name      : 'Backwards',
                        alignment : 'end',
                        color     : 'red',
                        startDate : '2011-01-11 11:00',
                        endDate   : '2011-01-11 16:00'
                    },
                    {
                        id        : 3,
                        name      : 'Before',
                        color     : 'yellow',
                        startDate : '2011-01-12 07:00',
                        endDate   : '2011-01-12 09:00'
                    },
                    {
                        id        : 4,
                        name      : 'After',
                        alignment : 'end',
                        color     : 'purple',
                        startDate : '2011-01-12 16:00',
                        endDate   : '2011-01-12 18:00'
                    },
                    {
                        id        : 5,
                        name      : 'Line',
                        color     : 'deep-orange',
                        startDate : '2011-01-13 12:30'
                    },
                    {
                        id        : 6,
                        name      : 'Alone',
                        color     : 'orange',
                        startDate : '2011-01-14 12:30',
                        endDate   : '2011-01-14 15:30'
                    }
                ]
            },
            sidebar            : false,
            hideNonWorkingDays : true,
            width              : 1000,
            height             : 750,
            date               : new Date(2011, 0, 10),
            features           : {
                timeRanges : {}
            },
            mode  : 'week',
            modes : {
                day : {
                    dayStartTime : 6,
                    dayEndTime   : 19,
                    hourHeight   : HR_HEIGHT
                },
                week : {
                    dayStartTime : 6,
                    dayEndTime   : 19,
                    hourHeight   : HR_HEIGHT
                }
            }
        }, config));

        // If we're using the default time range set, check the rendering.
        if (!config?.timeRangeStore) {
            // Check first time range's color has been set inline correctly
            const timeRange1 = document.querySelector('.b-cal-timerange[data-timerange-id="1"]');

            // CSS var set locally on the element
            t.is(t.global.getComputedStyle(timeRange1, '::after').getPropertyValue('--timerange-color'), '#00b');

            // Actual background colour is correct
            t.is(t.global.getComputedStyle(timeRange1, '::after').getPropertyValue('background-color'), 'rgb(0, 0, 187)');
        }
    };

    const getEventRect = () => {
        eventRect = Rectangle.from(eventEl, eventEl.parentElement.parentElement);
    };

    const getEventInfoBySelector = sel => {
        eventEl = calendar.activeView.element.querySelector(sel);
        getEventRect();
        return eventEl;
    };

    const getEventInfo = id => {
        eventEl = calendar.activeView.getEventElement(id);
        getEventRect();
        return eventEl;
    };

    const getTimeRangeInfo = id => {
        timeRangeEl = calendar.activeView.element.querySelector(`.b-cal-timerange[data-timerange-id="${id}"]`);
        timeRangeHeaderEl = timeRangeEl.querySelector('.b-cal-timerange-header');
        timeRangeBodyEl = timeRangeEl.querySelector('.b-cal-timerange-body');

        timeRangeRect = Rectangle.from(timeRangeEl, timeRangeEl.parentElement.parentElement);
        timeRangeHeaderRect = Rectangle.from(timeRangeHeaderEl, timeRangeEl);
        timeRangeBodyRect = Rectangle.from(timeRangeBodyEl, timeRangeEl);

        if (timeRangeBodyEl) {
            // We remove 1px for aesthetic reasons, so add it back to make our numbers round and predictable:
            if (timeRangeRect) {
                timeRangeRect._height += 1;
            }

            if (timeRangeHeaderRect) {
                timeRangeHeaderRect._height += 1;
            }

            if (timeRangeBodyRect) {
                timeRangeBodyRect._height += 1;
            }
        }
    };

    t.it('should render time ranges of various types', async t => {
        await setup(t);

        getEventInfo('event1');
        t.isRectApproxEqual(eventRect,
            new Rectangle(INSET, 3 * HR_HEIGHT, DAY_WIDTH - INSET - GUTTER, HR_HEIGHT));

        getEventInfo('event2');
        t.isRectApproxEqual(eventRect,
            new Rectangle(INSET, 5 * HR_HEIGHT, DAY_WIDTH - INSET - GUTTER, 2 * HR_HEIGHT));

        getEventInfo('event3');
        t.isRectApproxEqual(eventRect,
            new Rectangle(0, 4 * HR_HEIGHT, DAY_WIDTH - INSET - GUTTER, 4 * HR_HEIGHT));

        getEventInfo('event4');
        t.isRectApproxEqual(eventRect,
            new Rectangle(INSET, 4 * HR_HEIGHT, DAY_WIDTH - 2 * INSET - GUTTER, 2 * HR_HEIGHT));

        getEventInfo('event5');
        t.isRectApproxEqual(eventRect,
            new Rectangle(INSET, 7 * HR_HEIGHT, DAY_WIDTH - 2 * INSET - GUTTER, 2 * HR_HEIGHT));

        getEventInfo('event6');
        t.isRectApproxEqual(eventRect,
            new Rectangle(0, 7 * HR_HEIGHT, DAY_WIDTH - GUTTER, 2 * HR_HEIGHT));

        getTimeRangeInfo(1);
        t.isRectApproxEqual(timeRangeRect,
            new Rectangle(0, 3.5 * HR_HEIGHT, DAY_WIDTH - GUTTER, 7.5 * HR_HEIGHT), 'TimeRange 1 rect');
        t.isRectApproxEqual(timeRangeHeaderRect,
            new Rectangle(0, 0, INSET, 7.5 * HR_HEIGHT), 'TimeRange 1 header rect');
        t.isRectApproxEqual(timeRangeBodyRect,
            new Rectangle(INSET, 0, DAY_WIDTH - INSET - GUTTER, 7.5 * HR_HEIGHT), 'TimeRange 1 body rect');

        getTimeRangeInfo(2);
        t.isRectApproxEqual(timeRangeRect,
            new Rectangle(0, 5 * HR_HEIGHT, DAY_WIDTH - GUTTER, 5 * HR_HEIGHT), 'TimeRange 2 rect');
        t.isRectApproxEqual(timeRangeHeaderRect,
            new Rectangle(DAY_WIDTH - INSET - GUTTER, 0, INSET, 5 * HR_HEIGHT), 'TimeRange 2 header rect');
        t.isRectApproxEqual(timeRangeBodyRect,
            new Rectangle(0, 0, DAY_WIDTH - INSET - GUTTER, 5 * HR_HEIGHT), 'TimeRange 2 body rect');

        getTimeRangeInfo(3);
        t.isRectApproxEqual(timeRangeRect,
            new Rectangle(0, HR_HEIGHT, DAY_WIDTH - GUTTER, 2 * HR_HEIGHT), 'TimeRange 3 rect');
        t.isRectApproxEqual(timeRangeHeaderRect,
            new Rectangle(0, 0, INSET, 2 * HR_HEIGHT), 'TimeRange 3 header rect');
        t.isRectApproxEqual(timeRangeBodyRect,
            new Rectangle(INSET, 0, DAY_WIDTH - 2 * INSET - GUTTER, 2 * HR_HEIGHT), 'TimeRange 3 body rect');

        getTimeRangeInfo(4);
        t.isRectApproxEqual(timeRangeRect,
            new Rectangle(0, 10 * HR_HEIGHT, DAY_WIDTH - GUTTER, 2 * HR_HEIGHT), 'TimeRange 4 rect');
        t.isRectApproxEqual(timeRangeHeaderRect,
            new Rectangle(DAY_WIDTH - INSET - GUTTER, 0, INSET, 2 * HR_HEIGHT), 'TimeRange 4 header rect');
        t.isRectApproxEqual(timeRangeBodyRect,
            new Rectangle(INSET, 0, DAY_WIDTH - 2 * INSET - GUTTER, 2 * HR_HEIGHT), 'TimeRange 4 body rect');

        getTimeRangeInfo(5);
        t.isRectApproxEqual(timeRangeRect,
            new Rectangle(0, 6.5 * HR_HEIGHT, DAY_WIDTH, 2), 'TimeRange 5 rect');
        t.notOk(timeRangeHeaderRect, 'TimeRange 5 has no header rect');
        t.notOk(timeRangeBodyRect, 'TimeRange 5 has no body rect');

        getTimeRangeInfo(6);
        t.isRectApproxEqual(timeRangeRect,
            new Rectangle(0, 6.5 * HR_HEIGHT, DAY_WIDTH - GUTTER, 3 * HR_HEIGHT), 'TimeRange 6 rect');
        t.isRectApproxEqual(timeRangeHeaderRect,
            new Rectangle(0, 0, INSET, 3 * HR_HEIGHT), 'TimeRange 6 header rect');
        t.isRectApproxEqual(timeRangeBodyRect,
            new Rectangle(INSET, 0, DAY_WIDTH - INSET - GUTTER, 3 * HR_HEIGHT), 'TimeRange 6 body rect');
    });

    t.it('should correctly drag create events', async t => {
        await setup(t);

        await t.dragBy({
            source   : '[data-date="2011-01-12"]',
            offset   : ['99%', 4 * HR_HEIGHT],
            delta    : [0, -2 * HR_HEIGHT],
            dragOnly : true
        });

        await t.waitForSelector('.b-cal-tentative-event');

        getEventInfoBySelector('.b-cal-tentative-event');
        t.isRectApproxEqual(eventRect,
            new Rectangle(INSET, 2 * HR_HEIGHT, DAY_WIDTH - 2 * INSET - GUTTER, 2 * HR_HEIGHT));

        await t.mouseUp();

        await t.type('input[name="name"]', 'Derp');
        await t.click('[data-ref="saveButton"]');

        eventEl = calendar.activeView.element.querySelector(
            '[data-date="2011-01-12"] .b-dayview-event-container').firstChild;
        getEventRect();
        t.isRectApproxEqual(eventRect,
            new Rectangle(INSET, 2 * HR_HEIGHT, DAY_WIDTH - 2 * INSET - GUTTER, 2 * HR_HEIGHT));
    });

    t.it('should correctly drag move events', async t => {
        await setup(t);

        // await t.moveCursorTo('[data-event-id="event4"]');
        await t.dragBy({
            source   : '[data-event-id="event4"]',
            delta    : [10, 0],
            dragOnly : true
        });
        await t.waitForSelector('.b-cal-tentative-event');

        getEventInfoBySelector('.b-cal-tentative-event');

        t.isRectApproxEqual(eventRect,
            new Rectangle(INSET, 4 * HR_HEIGHT, DAY_WIDTH - 2 * INSET - GUTTER, 2 * HR_HEIGHT));

        await t.moveCursorBy([0, -2 * HR_HEIGHT]);

        getEventInfoBySelector('.b-cal-tentative-event');
        t.isRectApproxEqual(eventRect,
            new Rectangle(INSET, 2 * HR_HEIGHT, DAY_WIDTH - 2 * INSET - GUTTER, 2 * HR_HEIGHT));

        await t.mouseUp();

        getEventInfo('event4');
        t.isRectApproxEqual(eventRect,
            new Rectangle(INSET, 2 * HR_HEIGHT, DAY_WIDTH - 2 * INSET - GUTTER, 2 * HR_HEIGHT));
    });

    t.it('should correctly drag resize events', async t => {
        await setup(t);

        await t.moveCursorTo('[data-event-id="event4"]', null, null, ['50%', 5]);
        await t.waitForSelector('[data-event-id="event4"] .b-gripper');
        await t.dragBy({
            source   : '[data-event-id="event4"]',
            offset   : ['50%', 5],
            delta    : [10, 0],
            dragOnly : true
        });

        getEventInfo('dragResize-event-event4');
        t.isRectApproxEqual(eventRect,
            new Rectangle(INSET, 4 * HR_HEIGHT, DAY_WIDTH - 2 * INSET - GUTTER, 2 * HR_HEIGHT));

        await t.moveCursorBy([0, -2 * HR_HEIGHT]);

        getEventInfo('dragResize-event-event4');
        t.isRectApproxEqual(eventRect,
            new Rectangle(INSET, 2 * HR_HEIGHT, DAY_WIDTH - 2 * INSET - GUTTER, 4 * HR_HEIGHT));

        await t.mouseUp();

        getEventInfo('event4');
        t.isRectApproxEqual(eventRect,
            new Rectangle(INSET, 2 * HR_HEIGHT, DAY_WIDTH - 2 * INSET - GUTTER, 4 * HR_HEIGHT));
    });

    t.it('ResourceTimeRanges', async t => {
        const eventStore = t.getEventStore({
            data : []
        });

        await setup(t, {
            hideNonWorkingDays : false,
            eventStore,
            resources          : [
                {
                    id         : 'bryntum',
                    name       : 'Bryntum team',
                    eventColor : 'yellow'
                },
                {
                    id         : 'hotel',
                    name       : 'Hotel Park',
                    eventColor : 'orange'
                }
            ],
            resourceTimeRanges : [
                {
                    id         : 1,
                    resourceId : 'bryntum',
                    name       : 'Hackathon Reception',
                    alignment  : 'start',
                    startDate  : '2020-10-11 09:00',
                    endDate    : '2020-10-11 17:00',
                    iconCls    : 'b-icon b-fa-glass-cheers'
                },
                {
                    id         : 2,
                    resourceId : 'hotel',
                    name       : 'Bryntum function room booking',
                    alignment  : 'start',
                    startDate  : '2020-10-11 09:00',
                    endDate    : '2020-10-11 17:00',
                    iconCls    : 'b-icon b-fa-toolbox'
                }
            ],
            timeRangeStore : {
                data : [{
                    id        : 4,
                    name      : 'After',
                    alignment : 'end',
                    color     : 'purple',
                    startDate : '2020-10-12 16:00',
                    endDate   : '2020-10-12 18:00'
                }]
            },
            date  : new Date(2020, 9, 12),
            modes : {
                day           : null,
                week          : null,
                month         : null,
                year          : null,
                agenda        : null,
                weekResources : {
                    // Type has the final say over which view type is created
                    type : 'resource'
                }
            }
        });

        await t.waitForSelector('.b-cal-timerange');

        // Ensure both are there rendered each in their separate views
        t.selectorCountIs('.b-cal-timerange', calendar.activeView.element, calendar.resourceTimeRangeStore.count);
        t.selectorCountIs('.b-cal-timerange:contains(Hackathon Reception)', calendar.activeView.views[0].element, 1);
        t.selectorCountIs('.b-cal-timerange:contains(Bryntum function room booking)', calendar.activeView.views[1].element, 1);

        calendar.activeView.includeTimeRanges = true;

        // Resource time ranges, plus the single time range in each view
        t.selectorCountIs('.b-cal-timerange', calendar.activeView.element, calendar.resourceTimeRangeStore.count + calendar.timeRangeStore.count * 2);
        t.selectorCountIs('.b-cal-timerange:contains(Hackathon Reception)', calendar.activeView.views[0].element, 1);
        t.selectorCountIs('.b-cal-timerange:contains(Bryntum function room booking)', calendar.activeView.views[1].element, 1);

        // The time ranges
        t.selectorCountIs('.b-cal-timerange:contains(After)', calendar.activeView.views[0].element, 1);
        t.selectorCountIs('.b-cal-timerange:contains(After)', calendar.activeView.views[1].element, 1);

        calendar.activeView.includeTimeRanges = false;

        // Just the two resource time views visible again
        t.selectorCountIs('.b-cal-timerange', calendar.activeView.element, calendar.resourceTimeRangeStore.count);
        t.selectorCountIs('.b-cal-timerange:contains(Hackathon Reception)', calendar.activeView.views[0].element, 1);
        t.selectorCountIs('.b-cal-timerange:contains(Bryntum function room booking)', calendar.activeView.views[1].element, 1);
    });
});
