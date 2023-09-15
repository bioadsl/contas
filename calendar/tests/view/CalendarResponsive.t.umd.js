

StartTest(t => {
    const TOL = 3;  // fonts influence our sizes, so we have to be somewhat generous
    const SIDEBAR_TOL = 6;  // esp wrt the sidebar whose width is content based

    let calendar, harness;

    async function getCalendar(config) {
        config = ObjectHelper.merge(config, {
            // Avoid the bother of scrollbar width
            modeDefaults : {
                dayStartTime : 7,
                dayEndTime   : 18
            }
        });
        const calendar = await t.getCalendar(config);
        return calendar;
    }

    t.beforeEach(() => {
        // Set doc styling to default values
        document.body.style.paddingTop = 0;
        document.scrollingElement.scrollTop = 0;

        if (calendar && !calendar.isDestroyed) {
            const eventEls = calendar.element.querySelectorAll('.b-calendar-cell.b-dayview-day-detail .b-cal-event-wrap');

            // Check that no events ever get placed outside the visible bounds
            // https://github.com/bryntum/support/issues/3585
            for (let i = 0, { length } = eventEls; i < length; i++) {
                if (parseFloat(eventEls[i].style.top) > 100) {
                    t.fail(`Event ${eventEls[i].dataset.eventId} element is rendered out of bounds`);
                }
            }
        }

        harness = harness?.destroy();
        calendar = calendar?.destroy();

        // Check that none of the floating things are persisting
        if (t.query('.b-overflowpopup,.b-sch-event-tooltip,.b-eventeditor').length > 0) {
            t.selectorNotExists('.b-overflowpopup:visible');
            t.selectorNotExists('.b-sch-event-tooltip');
            t.selectorNotExists('.b-eventeditor');
        }
    });

    const calendarWidth = (width, tol = 5) => () => {
        rect = t.rect('.b-dayview-day-container:visible');
        return Math.abs(rect.width - width) < 1 + tol;
    };

    const dayColumns = count => () => {
        const el = t.query('.b-dayview-day-detail[data-date=2020-10-28]')[0];

        rect = el?.getBoundingClientRect();

        const parentRect = el?.parentElement?.getBoundingClientRect();
        const percent = (rect.width / parentRect.width) * 100;
        const space = el?.closest('.b-calendar')?.getBoundingClientRect();
        const sidebar = t.rect('.b-sidebar');
        const content = el?.closest('.b-dayview-day-content')?.getBoundingClientRect();

        if (sidebar) {
            space.width -= sidebar.width;
        }

        return Math.abs(space?.width - content?.width) < TOL && Math.abs(percent - 100 / count) < TOL;
    };

    const newCalendar = async config => {
        await document.fonts.ready;

        calendar = await getCalendar(ObjectHelper.merge({
            date                  : '2020-10-28',
            includeWeekendsButton : true,
            events                : [{
                name         : 'Important meeting',
                resourceId   : 1,
                startDate    : '2020-10-28T09:00:00',
                duration     : 3,
                durationUnit : 'h'
            }]
        }, config));
    };

    const percentRect = selector => {
        const el = t.query(selector)[0];
        const r = el.getBoundingClientRect();
        const pr = el.closest('.b-dayview-day-container').getBoundingClientRect();

        const ret = {
            left   : (r.left   - pr.left) / pr.width * 100,
            right  : (r.right  - pr.left) / pr.width * 100,
            top    : (r.top    - pr.top)  / pr.height * 100,
            bottom : (r.bottom - pr.top)  / pr.height * 100,
            height : r.height / pr.height * 100,
            width  : r.width  / pr.width  * 100
        };

        ret.x = ret.left;
        ret.y = ret.top;

        return ret;
    };

    let rect;

    t.it('Should be responsive to resize', async t => {
        await newCalendar();

        //------------------------------------------------------------------------------------
        // width = 1024

        await t.waitForSelector('.b-calendar.b-responsive-large');
        await t.waitForSelector('.b-dayview-day-detail[data-date=2020-10-31]');
        await t.waitFor(calendarWidth(726));
        await t.waitFor(dayColumns(7));
        await t.waitForSelector('button.b-pressed.b-calendar-fullweek-button');
        await t.waitForSelector('button.b-pressed:contains(Week)');

        t.is(calendar.mode, 'week', 'Desktop starts in week view');

        rect = t.rect('.b-sidebar');
        t.isApproxPx(rect.width, 245, SIDEBAR_TOL, 'Sidebar has correct width');
        t.notOk(calendar.overlaySidebar, 'Sidebar is not in overlay');

        rect = percentRect('.b-cal-event-wrap');
        t.isApproxPx(rect.width, (1 / 7) * 100 - 1, TOL, 'Event has correct width');

        t.notOk(calendar.sidebar.collapsed, 'Sidebar is not collapsed');

        //-----

        calendar.hideNonWorkingDays = true;

        await t.waitFor(dayColumns(5));

        await t.waitForSelectorNotFound('button.b-pressed.b-calendar-fullweek-button');
        t.selectorExists('button.b-pressed:contains(Week)');

        calendar.hideNonWorkingDays = false;

        await t.waitFor(dayColumns(7));
        await t.waitForSelector('button.b-pressed.b-calendar-fullweek-button');

        //------------------------------------------------------------------------------------

        calendar.width = 800;

        await t.waitForSelector('.b-calendar.b-responsive-medium');

        await t.waitFor(calendarWidth(744));
        await t.waitFor(dayColumns(7));

        // await t.waitForSelectorNotFound('.b-sidebar:visible');
        await t.waitFor(() => t.rect('.b-sidebar').width === 0);
        t.ok(calendar.overlaySidebar, 'Sidebar is in overlay');

        t.ok(calendar.sidebar.collapsed, 'Sidebar is collapsed');

        await t.click('.b-calendar-mode-button');
        await t.waitForSelector('.b-menuitem.b-checked:visible:contains(Include weekends)');

        //-----

        calendar.hideNonWorkingDays = true;

        await t.waitFor(dayColumns(5));

        await t.waitForSelector('.b-menuitem:not(.b-checked):visible:contains(Include weekends)');

        calendar.hideNonWorkingDays = false;

        await t.waitForSelector('.b-menuitem.b-checked:visible:contains(Include weekends)');
        await t.waitFor(dayColumns(7));

        //------------------------------------------------------------------------------------
        calendar.width = 600;

        await t.waitForSelector('.b-calendar.b-responsive-small');
        await t.waitFor(calendarWidth(544));
        await t.waitFor(dayColumns(7));

        // await t.waitForSelectorNotFound('.b-sidebar:visible');
        await t.waitFor(() => t.rect('.b-sidebar').width === 0);
        t.ok(calendar.overlaySidebar, 'Sidebar is in overlay');

        t.ok(calendar.sidebar.collapsed, 'Sidebar is collapsed');

        await t.waitForSelector('.b-menuitem.b-checked:visible:contains(Include weekends)');

        rect = t.rect('.b-cal-event-wrap');
        t.isApproxPx(rect.width, 71, TOL, 'Event has correct width');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-25]');
        t.isApproxPx(rect.width, 77, TOL, 'Days have correct width');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-26]');
        t.isApproxPx(rect.width, 77, TOL, 'Days have correct width');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-27]');
        t.isApproxPx(rect.width, 77, TOL, 'Days have correct width');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-28]');
        t.isApproxPx(rect.width, 77, TOL, 'Days have correct width');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-29]');
        t.isApproxPx(rect.width, 77, TOL, 'Days have correct width');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-30]');
        t.isApproxPx(rect.width, 77, TOL, 'Days have correct width');

        //-----
        calendar.hideNonWorkingDays = true;

        await t.waitFor(dayColumns(5));

        await t.waitForSelector('.b-menuitem:not(.b-checked):visible:contains(Include weekends)');

        calendar.hideNonWorkingDays = false;

        await t.waitForSelector('.b-menuitem.b-checked:visible:contains(Include weekends)');
        await t.waitFor(dayColumns(7));

        //------------------------------------------------------------------------------------
        calendar.width = 375;  // iPhone portrait

        await t.waitFor(calendarWidth(319));
        await t.waitFor(dayColumns(7));

        // await t.waitForSelectorNotFound('.b-sidebar:visible');
        await t.waitFor(() => t.rect('.b-sidebar').width === 0);
        t.ok(calendar.overlaySidebar, 'Sidebar is in overlay');

        t.ok(calendar.sidebar.collapsed, 'Sidebar is collapsed');

        rect = t.rect('.b-cal-event-wrap');
        t.isApproxPx(rect.width, 38, TOL, 'Event has correct width');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-25]');
        t.isApproxPx(rect.width, 44, TOL, 'Days have correct width');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-26]');
        t.isApproxPx(rect.width, 44, TOL, 'Days have correct width');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-27]');
        t.isApproxPx(rect.width, 44, TOL, 'Days have correct width');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-28]');
        t.isApproxPx(rect.width, 44, TOL, 'Days have correct width');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-29]');
        t.isApproxPx(rect.width, 44, TOL, 'Days have correct width');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-30]');
        t.isApproxPx(rect.width, 44, TOL, 'Days have correct width');

        //-----
        calendar.hideNonWorkingDays = true;

        await t.waitFor(dayColumns(5));

        await t.waitForSelector('.b-menuitem:not(.b-checked):visible:contains(Include weekends)');

        calendar.hideNonWorkingDays = false;

        await t.waitForSelector('.b-menuitem.b-checked:visible:contains(Include weekends)');
        await t.waitFor(dayColumns(7));

        await t.click('.b-calendar-mode-button');
        calendar.hideNonWorkingDays = true;
        await t.waitFor(dayColumns(5));

        //------------------------------------------------------------------------------------
        calendar.width = 1024;

        await t.waitFor(calendarWidth(968));  // sidebar is collapsed now
        await t.waitFor(dayColumns(5));
        await t.waitForSelectorNotFound('button.b-pressed.b-calendar-fullweek-button');

        // Since it only collapsed due to being thrown into overlay mode by
        // shrinking, moving back to non-overlayed mode should expand it again.
        t.notOk(calendar.sidebar.collapsed, 'Sidebar is collapsed');

        t.selectorExists('button:not(.b-pressed).b-calendar-fullweek-button');
        t.selectorExists('button.b-pressed:contains(Week)');
    });

    t.it('Should layout well at desktop size', async t => {
        await newCalendar();

        // width = 1024

        await t.waitForSelector('.b-calendar.b-responsive-large');
        await t.waitForSelector('.b-dayview-day-detail[data-date=2020-10-31]');
        t.selectorExists('.b-calendar-view-desc:contains(October 2020)');
        t.selectorExists('.b-calendar-view-desc:contains(Week 44)');
        t.selectorExists('.b-modeselector > .b-button.b-has-menu:not(:visible)');
        t.selectorExists('.b-modeselector > .b-buttongroup:visible');

        await t.waitFor(dayColumns(7));

        rect = t.rect('.b-sidebar');
        t.isApproxPx(rect.width, 245, SIDEBAR_TOL, 'Sidebar has correct width');
        t.notOk(calendar.overlaySidebar, 'Sidebar is not in overlay');

        rect = t.rect('.b-cal-event-wrap');
        t.isApproxPx(rect.width, 99, TOL, 'Event has correct width');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-25]');
        t.isApproxPx(rect.width, 105, TOL, 'Days have correct width');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-26]');
        t.isApproxPx(rect.width, 105, TOL, 'Days have correct width');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-27]');
        t.isApproxPx(rect.width, 105, TOL, 'Days have correct width');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-28]');
        t.isApproxPx(rect.width, 105, TOL, 'Days have correct width');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-29]');
        t.isApproxPx(rect.width, 105, TOL, 'Days have correct width');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-30]');
        t.isApproxPx(rect.width, 105, TOL, 'Days have correct width');
    });

    t.it('Should layout well at tablet size', async t => {
        await newCalendar({
            width : 800
        });

        await t.waitForSelector('.b-calendar.b-responsive-medium');
        t.selectorExists('.b-calendar-view-desc:contains(October 2020)');
        t.selectorNotExists('.b-calendar-view-desc:contains(Week 44)');
        t.selectorExists('.b-modeselector > .b-button.b-has-menu:visible');
        t.selectorExists('.b-modeselector > .b-buttongroup:not(:visible)');

        await t.waitFor(dayColumns(7));

        // await t.waitForSelectorNotFound('.b-sidebar:visible');
        await t.waitFor(() => t.rect('.b-sidebar').width === 0);
        t.ok(calendar.overlaySidebar, 'Sidebar is in overlay');

        rect = t.rect('.b-cal-event-wrap');
        t.isApproxPx(rect.width, 100, TOL, 'Event has correct width');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-25]');
        t.isApproxPx(rect.width, 106, TOL, 'Days have correct width');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-26]');
        t.isApproxPx(rect.width, 106, TOL, 'Days have correct width');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-27]');
        t.isApproxPx(rect.width, 106, TOL, 'Days have correct width');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-28]');
        t.isApproxPx(rect.width, 106, TOL, 'Days have correct width');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-29]');
        t.isApproxPx(rect.width, 106, TOL, 'Days have correct width');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-30]');
        t.isApproxPx(rect.width, 106, TOL, 'Days have correct width');
    });

    t.it('Should layout well at phone size', async t => {
        await newCalendar({
            width : 600
        });

        await t.waitForSelector('.b-calendar.b-responsive-small');
        t.selectorExists('.b-calendar-view-desc:contains(October 2020)');
        t.selectorNotExists('.b-calendar-view-desc:contains(Week 44)');
        t.selectorExists('.b-modeselector > .b-button.b-has-menu:visible');
        t.selectorExists('.b-modeselector > .b-buttongroup:not(:visible)');

        // This part is duplicated below (we want different line numbers should a 2nd check fail)
        await t.waitFor(dayColumns(1));

        t.notOk(calendar.hideNonWorkingDays, 'Shows full week');
        t.is(calendar.mode, 'day', 'Phone starts in day view');

        rect = t.rect('.b-cal-event-wrap');
        t.isApproxPx(rect.width, 538, TOL, 'Event has correct width');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-28]');
        t.isApproxPx(rect.width, 543, TOL, 'Days have correct width');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-25]');
        t.isApproxPx(rect.width, 77, TOL, 'Day headers have correct width');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-26]');
        t.isApproxPx(rect.width, 77, TOL, 'Day headers have correct width');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-27]');
        t.isApproxPx(rect.width, 77, TOL, 'Day headers have correct width');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-28]');
        t.isApproxPx(rect.width, 77, TOL, 'Day headers have correct width');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-29]');
        t.isApproxPx(rect.width, 77, TOL, 'Day headers have correct width');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-30]');
        t.isApproxPx(rect.width, 77, TOL, 'Day headers have correct width');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-31]');
        t.isApproxPx(rect.width, 77, TOL, 'Day headers have correct width');

        // Toggle Full week off and check, then toggle back on to re-check
        await t.click('.b-calendar-mode-button');
        await t.waitForSelector('.b-menuitem.b-checked:contains(Include weekends)');
        await t.click('.b-menuitem:contains(Include weekends)');
        await t.waitForSelector('.b-menuitem:not(.b-checked):contains(Include weekends)');

        t.ok(calendar.hideNonWorkingDays, 'Shows work week');

        t.selectorNotExists('.b-cal-cell-header[data-header-date=2020-10-25]');
        t.selectorNotExists('.b-cal-cell-header[data-header-date=2020-10-31]');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-26]');
        t.isApproxPx(rect.width, 107, TOL, 'Day headers have correct width');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-27]');
        t.isApproxPx(rect.width, 107, TOL, 'Day headers have correct width');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-28]');
        t.isApproxPx(rect.width, 107, TOL, 'Day headers have correct width');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-29]');
        t.isApproxPx(rect.width, 107, TOL, 'Day headers have correct width');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-30]');
        t.isApproxPx(rect.width, 107, TOL, 'Day headers have correct width');

        rect = t.rect('.b-cal-event-wrap');
        t.isApproxPx(rect.width, 538, TOL, 'Event has correct width');

        await t.click('.b-menuitem:contains(Include weekends)');
        await t.waitForSelector('.b-menuitem.b-checked:contains(Include weekends)');

        // This is the duplicated part; check again after restoring Full week mode
        await t.waitFor(dayColumns(1));

        t.notOk(calendar.hideNonWorkingDays, 'Shows full week');
        t.is(calendar.mode, 'day', 'Phone starts in day view again');

        rect = t.rect('.b-cal-event-wrap');
        t.isApproxPx(rect.width, 538, TOL, 'Event has correct width again');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-28]');
        t.isApproxPx(rect.width, 543, TOL, 'Days have correct width again');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-25]');
        t.isApproxPx(rect.width, 77, TOL, 'Day headers have correct width again');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-26]');
        t.isApproxPx(rect.width, 77, TOL, 'Day headers have correct width again');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-27]');
        t.isApproxPx(rect.width, 77, TOL, 'Day headers have correct width again');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-28]');
        t.isApproxPx(rect.width, 77, TOL, 'Day headers have correct width again');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-29]');
        t.isApproxPx(rect.width, 77, TOL, 'Day headers have correct width again');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-30]');
        t.isApproxPx(rect.width, 77, TOL, 'Day headers have correct width again');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-31]');
        t.isApproxPx(rect.width, 77, TOL, 'Day headers have correct width again');
    });

    t.it('Should layout well at small phone size', async t => {
        await newCalendar({
            width : 375
        });

        await t.waitForSelector('.b-calendar.b-responsive-small');
        t.selectorExists('.b-calendar-view-desc:contains(October 2020)');
        t.selectorNotExists('.b-calendar-view-desc:contains(Week 44)');
        t.selectorExists('.b-modeselector > .b-button.b-has-menu:visible');
        t.selectorExists('.b-modeselector > .b-buttongroup:not(:visible)');

        // This part is duplicated below (we want different line numbers should a 2nd check fail)
        await t.waitFor(dayColumns(1));

        t.notOk(calendar.hideNonWorkingDays, 'Shows full week');
        t.is(calendar.mode, 'day', 'Phone starts in day view');

        rect = t.rect('.b-cal-event-wrap');
        t.isApproxPx(rect.width, 313, TOL, 'Event has correct width');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-28]');
        t.isApproxPx(rect.width, 318, TOL, 'Days have correct width');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-25]');
        t.isApproxPx(rect.width, 45, TOL, 'Day headers have correct width');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-26]');
        t.isApproxPx(rect.width, 45, TOL, 'Day headers have correct width');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-27]');
        t.isApproxPx(rect.width, 45, TOL, 'Day headers have correct width');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-28]');
        t.isApproxPx(rect.width, 45, TOL, 'Day headers have correct width');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-29]');
        t.isApproxPx(rect.width, 45, TOL, 'Day headers have correct width');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-30]');
        t.isApproxPx(rect.width, 45, TOL, 'Day headers have correct width');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-31]');
        t.isApproxPx(rect.width, 45, TOL, 'Day headers have correct width');

        // Toggle Full week off and check, then toggle back on to re-check
        await t.click('.b-calendar-mode-button');
        await t.waitForSelector('.b-menuitem.b-checked:contains(Include weekends)');
        await t.click('.b-menuitem:contains(Include weekends)');
        await t.waitForSelector('.b-menuitem:not(.b-checked):contains(Include weekends)');

        t.ok(calendar.hideNonWorkingDays, 'Shows work week');

        t.selectorNotExists('.b-cal-cell-header[data-header-date=2020-10-25]');
        t.selectorNotExists('.b-cal-cell-header[data-header-date=2020-10-31]');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-26]');
        t.isApproxPx(rect.width, 63, TOL, 'Day headers have correct width');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-27]');
        t.isApproxPx(rect.width, 63, TOL, 'Day headers have correct width');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-28]');
        t.isApproxPx(rect.width, 63, TOL, 'Day headers have correct width');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-29]');
        t.isApproxPx(rect.width, 63, TOL, 'Day headers have correct width');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-30]');
        t.isApproxPx(rect.width, 63, TOL, 'Day headers have correct width');

        rect = t.rect('.b-cal-event-wrap');
        t.isApproxPx(rect.width, 313, TOL, 'Event has correct width');

        await t.click('.b-menuitem:contains(Include weekends)');
        await t.waitForSelector('.b-menuitem.b-checked:contains(Include weekends)');

        // This is the duplicated part; check again after restoring Full week mode
        await t.waitFor(dayColumns(1));

        t.notOk(calendar.hideNonWorkingDays, 'Shows full week');
        t.is(calendar.mode, 'day', 'Phone starts in day view again');

        rect = t.rect('.b-cal-event-wrap');
        t.isApproxPx(rect.width, 313, TOL, 'Event has correct width again');

        rect = t.rect('.b-dayview-day-detail[data-date=2020-10-28]');
        t.isApproxPx(rect.width, 318, TOL, 'Days have correct width again');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-25]');
        t.isApproxPx(rect.width, 45, TOL, 'Day headers have correct width again');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-26]');
        t.isApproxPx(rect.width, 45, TOL, 'Day headers have correct width again');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-27]');
        t.isApproxPx(rect.width, 45, TOL, 'Day headers have correct width again');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-28]');
        t.isApproxPx(rect.width, 45, TOL, 'Day headers have correct width again');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-29]');
        t.isApproxPx(rect.width, 45, TOL, 'Day headers have correct width again');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-30]');
        t.isApproxPx(rect.width, 45, TOL, 'Day headers have correct width again');

        rect = t.rect('.b-cal-cell-header[data-header-date=2020-10-31]');
        t.isApproxPx(rect.width, 45, TOL, 'Day headers have correct width again');

    });

    t.it('AgendaView should adapt to being small', async t => {
        await newCalendar({
            mode   : 'agenda',
            date   : '2019-01-01',
            events : t.getHackathonData().events.rows
        });
        const agendaView = calendar.activeView;

        // Date block is sticky in normal size
        t.hasStyle('.b-cal-agenda-date', 'position', 'sticky');

        // Check row measuring
        t.isApproxPx(agendaView.rowManager.rows[0].height, 166);

        await calendar.sidebar.collapse();

        calendar.width = 400;

        await t.waitForSelector('.b-calendar.b-responsive-small');

        // Check row measuring
        t.isApproxPx(agendaView.rowManager.rows[0].height, 215);

        calendar.width = null;

        await t.waitForSelector('.b-calendar.b-responsive-large');

        await calendar.sidebar.expand();

        // Date block is sticky in normal size
        t.hasStyle('.b-cal-agenda-date', 'position', 'sticky');

        // Check row measuring
        t.isApproxPx(agendaView.rowManager.rows[0].height, 166);
    });
});
