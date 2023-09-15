
StartTest(t => {
    let calendar;

    t.beforeEach(() => calendar?.destroy());

    t.it('Should clean up event listeners', async t => {
        t.startEventListenerTracking();

        calendar = await t.getCalendar({
            date       : new Date(2020, 9, 14),
            eventStore : {
                data : [
                    {
                        id         : 1,
                        startDate  : new Date(2020, 9, 14, 8),
                        endDate    : new Date(2020, 9, 14, 14),
                        name       : 'regular 1',
                        resourceId : 'resource1',
                        cls        : 'event-cls'
                    }, {
                        id         : 2,
                        startDate  : new Date(2020, 9, 14),
                        endDate    : new Date(2020, 9, 15),
                        name       : 'allday 1',
                        resourceId : 'resource1'
                    }, {
                        id         : 3,
                        startDate  : new Date(2020, 9, 15, 8),
                        endDate    : new Date(2020, 9, 15, 14),
                        name       : 'regular 2',
                        resourceId : 'resource2'
                    }, {
                        id         : 4,
                        startDate  : new Date(2020, 9, 15),
                        endDate    : new Date(2020, 9, 16),
                        name       : 'allday 2',
                        resourceId : 'resource2'
                    }, {
                        id         : 5,
                        startDate  : new Date(2020, 9, 16, 8),
                        endDate    : new Date(2020, 9, 16, 14),
                        name       : 'regular 3',
                        resourceId : 'resource3'
                    }, {
                        id         : 6,
                        startDate  : new Date(2020, 9, 16),
                        endDate    : new Date(2020, 9, 17),
                        name       : 'allday 3',
                        resourceId : 'resource3'
                    }, {
                        id        : 7,
                        startDate : new Date(2020, 9, 13, 8),
                        endDate   : new Date(2020, 9, 13, 14),
                        name      : 'regular 4'
                    }, {
                        id        : 8,
                        startDate : new Date(2020, 9, 13),
                        endDate   : new Date(2020, 9, 14),
                        name      : 'allday 4'
                    }
                ]
            },
            resourceStore : {
                data : [
                    { id : 'resource1', name : 'Named', eventColor : 'orange' },
                    { id : 'resource2', name : 'Hex', eventColor : '#e90057' },
                    { id : 'resource3', name : 'None', cls : 'resource-cls' }
                ]
            }
        });
        calendar.overlaySidebar = true;

        await t.click('.b-sidebar-toggle');
        await t.click('.b-sidebar-toggle');
        await t.click('.b-cal-event');
        await t.rightClick('.b-cal-event');
        await t.doubleClick('.b-cal-event');
        await t.click('.b-button:contains(Cancel)');

        await t.dragBy('.b-cal-event:contains(regular)', [50, 50]);
        await t.moveCursorTo('.b-cal-event:contains(regular)', null, null, ['50%', '100%-5']);
        await t.dragBy({
            source : '.b-gripper',
            delta  : [0, 60]
        });

        calendar.mode = 'day';
        calendar.mode = 'week';
        calendar.mode = 'month';
        calendar.mode = 'year';
        calendar.mode = 'agenda';
        calendar.constructor.tooltip.destroy();
        calendar.constructor.Ripple.destroy();

        // Let click swallow timer expire for event listener auto-remove
        await t.waitFor(calendar.features.drag.zones.day.dragSwallowClickTime);

        calendar.destroy();
        GlobalEvents.detachEvents();
        ResizeMonitor.removeGlobalListeners();
        t.assertNoActiveEventListeners();
        t.stopEventListenerTracking();
    });
});
