
StartTest(t => {
    t.beforeEach(() => SchedulerPro.destroy(...SchedulerPro.queryAll(w => !w.parent)));

    t.it('Calendar + SchedulerPro with thin bundle sanity', async t => {
        const project = new ProjectModel({
            events      : [{ id : 1, name : 'Event 1', startDate : '2022-02-11T8', duration : 2, durationUnit : 'h' }],
            resources   : [{ id : 1, name : 'Resource 1' }],
            assignments : [{ id : 1, eventId : 1, resourceId : 1 }]
        });

        new SchedulerPro({
            appendTo   : document.body,
            width      : 1000,
            height     : 350,
            startDate  : new Date(2022, 1, 11),
            endDate    : new Date(2022, 1, 12),
            viewPreset : 'hourAndDay',
            columns    : [
                { field : 'name', text : 'Resource', width : 100 }
            ],
            project
        });

        new Calendar({
            appendTo : document.body,
            width    : 1000 + DomHelper.scrollBarWidth,
            height   : 350,
            date     : new Date(2022, 1, 11),
            sidebar  : null,
            project
        });

        await t.waitForSelector('.b-cal-event');
        await t.waitForSelector('.b-sch-event');

        // Ensure something rendered
        t.selectorExists('.b-sch-event', 'Pro event rendered');
        t.selectorExists('.b-cal-event', 'Calendar event rendered');

        // Ensure css worked
        const
            eventRect = t.rect('.b-cal-event'),
            ctRect = t.rect('.b-dayview-day-container:visible'),
            dayWidth = ctRect.width / 7,
            eventLeft = eventRect.left - ctRect.left;

        t.isApproxPx(t.rect('.b-sch-event').left, 667, 2, 'Pro event has correct x');
        t.hasApproxWidth('.b-sch-event', 139, 2, 'Pro event has correct width');
        t.hasApproxWidth('.b-cal-event', 128, 2, 'Calendar event has correct width');
        t.isApproxPx(eventLeft, dayWidth * 5, 2, 'Calendar event has correct x');
        t.isApproxPx(dayWidth, 135, 2, 'Day width is reasonable');

        await t.doubleClick('.b-cal-event');

        await t.click('[data-ref=nameField] input');

        await t.type({
            text          : 'Testing[ENTER]',
            clearExisting : true
        });

        await t.waitForSelector('.b-sch-event:textEquals(Testing)');
        await t.waitForSelector('.b-cal-event-desc:textEquals(Testing)');

        t.pass('Editing worked');
    });
});
