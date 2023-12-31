
StartTest(t => {
    let el, h, eventRecord, offset, tentativeDates;

    const checkTouchInFirefox = !t.browser.firefox || new Date() > new Date(2021, 1, 1);

    t.beforeEach(t => {
        h?.destroy();
        el = h = null;

        t.clearPageScroll();
    });

    t.describe('All Day', t => {
        t.beforeEach(t => {
            h = t.setupWeekViewAllDayDragHarness();
        });

        t.it('Should do nothing if disabled', async t => {
            await h.init(t);

            h.calendar.features.drag.disabled = true;

            [el, offset] = await h.hoverEvent(h.Event.BeerTime);

            await h.drag(el, {
                offset,
                by : [100, 0]
            });

            t.notOk(t.isDragging(), 'Drag is not active');

            await h.drop();
        });

        t.it('Should do nothing if drag ends at original location', async t => {
            await h.init(t);

            eventRecord = h.eventStore.getById(h.Event.GanttReview);

            t.is(eventRecord.startDate, new Date(2019, 9, 18), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 19), 'Correct endDate');
            t.ok(eventRecord.allDay, 'Correct allDay');

            [el, offset] = await h.hoverEvent(eventRecord.id);

            await h.drag(el, {
                offset,
                by : [-2 * h.WEEK_PX_PER_DAY, 0]
            });

            t.ok(t.isDragging(), 'Drag is active');

            await h.moveCursorBy(2 * h.WEEK_PX_PER_DAY, 0);

            await h.drop();

            t.notOk(t.isDragging(), 'Drag is done');

            t.notOk(eventRecord.isModified, 'Record was not modified');
        });

        t.it('Should drag a one day event left', async t => {
            await h.init(t);

            eventRecord = h.eventStore.getById(h.Event.GanttReview);

            t.is(eventRecord.startDate, new Date(2019, 9, 18), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 19), 'Correct endDate');
            t.ok(eventRecord.allDay, 'Correct allDay');

            [el, offset] = await h.hoverEvent(eventRecord.id);

            await h.drag(el, {
                offset,
                by : [-2 * h.WEEK_PX_PER_DAY, 0]
            });

            t.ok(t.isDragging(), 'Drag is active');

            const activeBefore = document.activeElement;

            t.ok(el === activeBefore, 'Correct element focus');

            tentativeDates = h.getTentativeDates();

            t.expect(tentativeDates).toEqual([
                [new Date(2019, 9, 16), new Date(2019, 9, 17), h.Text.GanttReview]
            ]);

            await h.drop();

            await t.waitFor(() => document.activeElement !== activeBefore);
            t.pass('Different focused element');

            await t.waitFor(() => h.focusedEventRecord === eventRecord);
            t.pass('Same event is focused');

            t.notOk(t.isDragging(), 'Drag is done');

            t.is(eventRecord.startDate, new Date(2019, 9, 16), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 17), 'Correct endDate');
            t.ok(eventRecord.allDay, 'Correct allDay');
        });

        t.it('Should drag a one day event right RTL', async t => {
            await h.init(t, { rtl : true });

            eventRecord = h.eventStore.getById(h.Event.GanttReview);

            t.is(eventRecord.startDate, new Date(2019, 9, 18), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 19), 'Correct endDate');
            t.ok(eventRecord.allDay, 'Correct allDay');

            [el, offset] = await h.hoverEvent(eventRecord.id);

            await h.drag(el, {
                offset,
                by : [2 * h.WEEK_PX_PER_DAY, 0]
            });

            t.ok(t.isDragging(), 'Drag is active');

            const activeBefore = document.activeElement;

            t.ok(el === activeBefore, 'Correct element focus');

            tentativeDates = h.getTentativeDates();

            t.expect(tentativeDates).toEqual([
                [new Date(2019, 9, 16), new Date(2019, 9, 17), h.Text.GanttReview]
            ]);

            await h.drop();

            await t.waitFor(() => document.activeElement !== activeBefore);
            t.pass('Different focused element');

            await t.waitFor(() => h.focusedEventRecord === eventRecord);
            t.pass('Same event is focused');

            t.notOk(t.isDragging(), 'Drag is done');

            t.is(eventRecord.startDate, new Date(2019, 9, 16), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 17), 'Correct endDate');
            t.ok(eventRecord.allDay, 'Correct allDay');
        });

        t.it('Should drag a one day event left even if over day details', async t => {
            await h.init(t);

            eventRecord = h.eventStore.getById(h.Event.GanttReview);

            t.is(eventRecord.startDate, new Date(2019, 9, 18), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 19), 'Correct endDate');
            t.ok(eventRecord.allDay, 'Correct allDay');

            [el, offset] = await h.hoverEvent(eventRecord.id);

            await t.mouseDown();
            await t.moveCursorBy([-3 * h.WEEK_PX_PER_DAY, 50]);

            t.ok(t.isDragging(), 'Drag is active');

            tentativeDates = h.getTentativeDates();

            t.expect(tentativeDates).toEqual([
                [new Date(2019, 9, 15, 7, 45), new Date(2019, 9, 15, 8, 45), '7:45 AM' + h.Text.GanttReview + '8:45 AM']
            ]);

            await h.drop();

            t.notOk(t.isDragging(), 'Drag is done');

            t.is(eventRecord.startDate, new Date(2019, 9, 15, 7, 45), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 15, 8, 45), 'Correct endDate');
            t.notOk(eventRecord.allDay, 'Correct allDay');
        });

        t.it('Should drag a one day event right even if over day details RTL', async t => {
            await h.init(t, { rtl : true });

            eventRecord = h.eventStore.getById(h.Event.GanttReview);

            t.is(eventRecord.startDate, new Date(2019, 9, 18), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 19), 'Correct endDate');
            t.ok(eventRecord.allDay, 'Correct allDay');

            [el, offset] = await h.hoverEvent(eventRecord.id);

            await t.mouseDown();
            await t.moveCursorBy([3 * h.WEEK_PX_PER_DAY, 50]);

            t.ok(t.isDragging(), 'Drag is active');

            tentativeDates = h.getTentativeDates();

            t.expect(tentativeDates).toEqual([
                [new Date(2019, 9, 15, 7, 45), new Date(2019, 9, 15, 8, 45), '7:45 AM' + h.Text.GanttReview + '8:45 AM']
            ]);

            await h.drop();

            t.notOk(t.isDragging(), 'Drag is done');

            t.is(eventRecord.startDate, new Date(2019, 9, 15, 7, 45), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 15, 8, 45), 'Correct endDate');
            t.notOk(eventRecord.allDay, 'Correct allDay');
        });

        t.it('Should drag a eight day event left by one day', async t => {
            await h.init(t);

            eventRecord = h.eventStore.getById(h.Event.Hackathon);

            t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 22), 'Correct endDate');
            t.ok(eventRecord.allDay, 'Correct allDay');

            [el, offset] = await h.hoverEvent(eventRecord.id);

            const dayWidth = t.rect('.b-dayview-day-detail').width;

            await h.drag(el, {
                offset : [dayWidth * 2.5, '50%'],
                by     : [-dayWidth, 0]
            });

            t.ok(t.isDragging(), 'Drag is active');

            tentativeDates = h.getTentativeDates();

            t.expect(tentativeDates).toEqual([
                [new Date(2019, 9, 13), new Date(2019, 9, 20), 'Hackathon 2019']
            ]);

            await h.drop();

            t.notOk(t.isDragging(), 'Drag is done');

            t.is(eventRecord.startDate, new Date(2019, 9, 13), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 21), 'Correct endDate');
            t.ok(eventRecord.allDay, 'Correct allDay');
        });

        t.it('Should drag event right', async t => {
            await h.init(t);

            eventRecord = h.eventStore.getById(h.Event.BeerTime);

            t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 15), 'Correct endDate');
            t.ok(eventRecord.allDay, 'Correct allDay');

            [el, offset] = await h.hoverEvent(eventRecord.id);

            await h.drag(el, {
                offset,
                by : [2 * h.WEEK_PX_PER_DAY, 0]
            });

            t.ok(t.isDragging(), 'Drag is active');

            tentativeDates = h.getTentativeDates();

            t.expect(tentativeDates).toEqual([
                [new Date(2019, 9, 16), new Date(2019, 9, 17), h.Text.BeerTime]
            ]);

            await h.drop();

            t.notOk(t.isDragging(), 'Drag is done');

            t.is(eventRecord.startDate, new Date(2019, 9, 16), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 17), 'Correct endDate');
            t.ok(eventRecord.allDay, 'Correct allDay');
        });

        t.it('should abort drag operation on ESC keypress', async t => {
            await h.init(t);

            [el, offset, eventRecord] = await h.hoverEvent(h.Event.BeerTime);

            const { startDate, endDate } = eventRecord;

            await h.drag(el, {
                offset,
                by : [2 * h.WEEK_PX_PER_DAY, 0]
            });
            t.ok(t.isDragging(), 'Dragging is active');

            let tentativeDates = h.getTentativeDates();

            t.expect(tentativeDates).toEqual([
                [new Date(2019, 9, 16), new Date(2019, 9, 17), h.Text.BeerTime]
            ]);

            await t.type(null, '[ESC]');
            t.notOk(t.isDragging(), 'Dragging is not active');

            t.is(startDate, eventRecord.startDate, 'Same startDate');
            t.is(endDate, eventRecord.endDate, 'Same endDate');

            tentativeDates = h.getTentativeDates();

            t.expect(tentativeDates).toEqual([]);
        });

        t.it('Should drag event right even if over day details', async t => {
            await h.init(t);

            eventRecord = h.eventStore.getById(h.Event.BeerTime);

            t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 15), 'Correct endDate');
            t.ok(eventRecord.allDay, 'Correct allDay');

            [el, offset] = await h.hoverEvent(eventRecord.id);

            await h.drag(el, {
                offset,
                by : [2 * h.WEEK_PX_PER_DAY, 50]
            });

            t.ok(t.isDragging(), 'Drag is active');

            tentativeDates = h.getTentativeDates();

            t.expect(tentativeDates).toEqual([
                [new Date(2019, 9, 16, 7, 45), new Date(2019, 9, 16, 8, 45), '7:45 AM' + h.Text.BeerTime + '8:45 AM']
            ]);

            await h.drop();

            t.notOk(t.isDragging(), 'Drag is done');

            t.is(eventRecord.startDate, new Date(2019, 9, 16, 7, 45), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 16, 8, 45), 'Correct endDate');
            t.notOk(eventRecord.allDay, 'Correct allDay');
        });

        t.it('Should drag multi-day event correctly even if crossing in/out of day details', async t => {
            await h.init(t, {
                modes : {
                    week : {
                        dayStartTime : 8
                    }
                }
            });

            eventRecord = h.eventStore.getById(h.Event.Hackathon);

            t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 22), 'Correct endDate');
            t.ok(eventRecord.allDay, 'Correct allDay');

            [el, offset] = await h.hoverEvent(eventRecord.id, { offset : [h.WEEK_PX_PER_DAY * 2.5, '50%'] });

            await h.drag(el, {
                offset,
                by : [0, 100]
            });

            t.ok(t.isDragging(), 'Drag is active');

            tentativeDates = h.getTentativeDates();

            t.expect(tentativeDates).toEqual([
                [new Date(2019, 9, 16, 9, 15), new Date(2019, 9, 16, 10, 15), '9:15 AM' + h.Text.Hackathon + '10:15 AM']
            ]);

            await t.moveCursorBy([-h.WEEK_PX_PER_DAY, 0]);

            tentativeDates = h.getTentativeDates();

            t.expect(tentativeDates).toEqual([
                [new Date(2019, 9, 15, 9, 15), new Date(2019, 9, 15, 10, 15), '9:15 AM' + h.Text.Hackathon + '10:15 AM']
            ]);

            await t.moveCursorBy([0, -100]);

            tentativeDates = h.getTentativeDates();

            t.expect(tentativeDates).toEqual([
                [new Date(2019, 9, 13), new Date(2019, 9, 20), h.Text.Hackathon]
            ]);

            await h.drop();

            t.notOk(t.isDragging(), 'Drag is done');

            t.is(eventRecord.startDate, new Date(2019, 9, 13), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 21), 'Correct endDate');
            t.ok(eventRecord.allDay, 'Correct allDay');
        });

        // https://github.com/bryntum/support/issues/2619
        t.it('Dragging non-allDay event', async t => {
            await h.init(t);

            const
                newEvent = h.eventStore.add({
                    name      : 'Test',
                    startDate : new Date(2019, 9, 13, 12),
                    endDate   : new Date(2019, 9, 14, 12)
                })[0],
                eventEl = h.calendar.activeView.getEventElement(newEvent);

            [el, offset] = await h.hoverEvent(newEvent.id, { offset : ['25%', '50%'] });

            await h.drag(eventEl, {
                offset,
                by : [2 * h.WEEK_PX_PER_DAY, 0]
            });

            tentativeDates = h.getTentativeDates();
            t.expect(tentativeDates).toEqual([
                [new Date(2019, 9, 15), new Date(2019, 9, 17), newEvent.name]
            ]);

            await h.drop();

            t.notOk(t.isDragging(), 'Drag is done');

            t.is(newEvent.startDate, new Date(2019, 9, 15, 12), 'Correct startDate');
            t.is(newEvent.endDate, new Date(2019, 9, 16, 12), 'Correct endDate');
            t.notOk(newEvent.allDay, 'Correct allDay');
        });

        // https://github.com/bryntum/support/issues/4920
        t.it('Should drag event from overflow popup', async t => {
            const calendar = await h.init(t, {
                events : [...t.getHackathonData().events.rows, {
                    id         : 900,
                    startDate  : new Date(2019, 9, 14),
                    endDate    : new Date(2019, 9, 15),
                    name       : 'Extra event 1',
                    allDay     : true,
                    resourceId : 'bryntum'
                }, {
                    id         : 901,
                    startDate  : new Date(2019, 9, 14),
                    endDate    : new Date(2019, 9, 15),
                    name       : 'Extra event 2',
                    allDay     : true,
                    resourceId : 'bryntum'
                }, {
                    id         : 902,
                    startDate  : new Date(2019, 9, 14),
                    endDate    : new Date(2019, 9, 15),
                    name       : 'Extra event 3',
                    allDay     : true,
                    resourceId : 'bryntum'
                }]
            });

            eventRecord = h.eventStore.getById(902);

            await t.click('.b-dayview-allday.b-calendar-cell[data-date="2019-10-14"] .b-cal-cell-overflow');

            await t.waitFor(() => calendar.activeView.allDayEvents._overflowPopup.isVisible);

            [el, offset] = await h.hoverEvent(eventRecord.id);

            await h.drag(el, {
                offset,
                by : [2 * h.WEEK_PX_PER_DAY, 50]
            });

            t.ok(t.isDragging(), 'Drag is active');

            tentativeDates = h.getTentativeDates();

            t.expect(tentativeDates).toEqual([
                [new Date(2019, 9, 16), new Date(2019, 9, 17), 'Extra event 3']
            ]);

            await h.drop();

            t.notOk(t.isDragging(), 'Drag is done');

            t.is(eventRecord.startDate, new Date(2019, 9, 16), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 17), 'Correct endDate');
            t.ok(eventRecord.allDay, 'Correct allDay');
        });

        t.describe('Hidden nonworking days', t => {
            t.it('Should move event to end of week', async t => {
                await h.init(t, {
                    modes : {
                        week : {
                            hideNonWorkingDays : true
                        }
                    }
                });

                const
                    eventRecord = h.eventStore.getById(h.Event.BeerTime),
                    cellWidth   = h.calendar.activeView.element.querySelector('.b-calendar-cell:not(.b-nonworking-day)').getBoundingClientRect().width;

                t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 15), 'Correct endDate');

                [el, offset] = await h.hoverEvent(eventRecord.id);

                await h.drag(el, {
                    by : [cellWidth * 4, 0]
                });

                t.ok(t.isDragging(), 'Drag is active');

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 18), new Date(2019, 9, 19), h.Text.BeerTime]
                ]);

                await h.drop();

                t.ok(eventRecord.isModified, 'Record was moved');
                t.is(eventRecord.startDate, new Date(2019, 9, 18), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 19), 'Correct endDate');
            });
        });

        t.describe('Page scrolled', t => {
            t.beforeEach(() => {
                t.enablePageScroll();
            });

            t.it('should drag when body is scrolled', async t => {
                await h.init(t);

                await h.moveCursorTo([300, 300]);  // move the cursor away so we get the mouse entry

                eventRecord = h.eventStore.getById(h.Event.GanttReview);

                t.is(eventRecord.startDate, new Date(2019, 9, 18), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 19), 'Correct endDate');
                t.ok(eventRecord.allDay, 'Correct allDay');

                [el, offset] = await h.hoverEvent(eventRecord.id);

                await h.drag(el, {
                    offset,
                    by : [-2 * h.WEEK_PX_PER_DAY, 0]
                });

                t.ok(t.isDragging(), 'Drag is active');

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 16), new Date(2019, 9, 17), h.Text.GanttReview]
                ]);

                await h.drop();

                t.notOk(t.isDragging(), 'Drag is done');

                t.is(eventRecord.startDate, new Date(2019, 9, 16), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 17), 'Correct endDate');
                t.ok(eventRecord.allDay, 'Correct allDay');
            });
        });
    });

    t.describe('Day Detail', t => {
        t.beforeEach(t => {
            h = t.setupWeekViewDragHarness();
        });

        t.it('Should do nothing if disabled', async t => {
            await h.init(t);

            h.calendar.features.drag.disabled = true;

            eventRecord = h.eventStore.getById(h.Event.TeamScrum);

            t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Correct endDate');

            [el, offset] = await h.hoverEvent(eventRecord.id);

            await h.drag(el, {
                offset,
                by : [0, h.DAY_PX_PER_HOUR]
            });

            t.notOk(t.isDragging(), 'Drag is inactive');

            tentativeDates = h.getTentativeDates();

            t.expect(tentativeDates).toEqual([]);

            await h.drop();

            t.notOk(t.isDragging(), 'Drag is inactive');

            t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Same startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Same endDate');
        });

        t.it('should preserve event width during drag', async t => {
            await h.init(t);

            [el, offset, eventRecord] = await h.hoverEvent(h.Event.TeamScrum);

            const eventWidth = el.offsetWidth;

            await h.drag(el, {
                offset,
                by : [-h.WEEK_PX_PER_DAY, h.DAY_PX_PER_HOUR]
            });

            t.ok(t.isDragging(), 'Dragging is active');

            const tentativeEl = document.querySelector('.b-cal-tentative-event');

            t.is(tentativeEl.offsetWidth, eventWidth, 'Correct width during drag');

            await t.type(null, '[ESC]');
        });

        t.it('should abort drag operation on ESC keypress', async t => {
            await h.init(t);

            [el, offset, eventRecord] = await h.hoverEvent(h.Event.TeamScrum);

            const { startDate, endDate } = eventRecord;

            await h.drag(el, {
                offset,
                by : [-h.WEEK_PX_PER_DAY, h.DAY_PX_PER_HOUR]
            });
            t.ok(t.isDragging(), 'Dragging is active');

            let tentativeDates = h.getTentativeDates();

            t.expect(tentativeDates).toEqual([
                [new Date(2019, 9, 14, 11), new Date(2019, 9, 14, 13), `11 AM${h.Text.TeamScrum}1 PM`]
            ]);

            await t.type(null, '[ESC]');
            t.notOk(t.isDragging(), 'Dragging is not active');

            t.is(startDate, eventRecord.startDate, 'Same startDate');
            t.is(endDate, eventRecord.endDate, 'Same endDate');

            tentativeDates = h.getTentativeDates();

            t.expect(tentativeDates).toEqual([]);
        });

        t.it('Should scroll the view when dragging close to the edge', async t => {
            await h.init(t, {
                mode   : 'week',
                date   : new Date(2021, 5, 2),
                events : [
                    { startDate : '2021-06-02T08:00:00', endDate : '2021-06-02T10:00:00', name : 'Event 1' }
                ],
                modes : {
                    week : {
                        visibleStartTime : 0
                    }
                }
            });

            const
                { calendar }        = h,
                { activeView }      = calendar,
                { overflowElement } = activeView,
                event               = calendar.eventStore.last;

            //#region Drag event to the bottom edge

            await t.dragTo({
                source       : '.b-cal-event',
                target       : overflowElement,
                targetOffset : ['50%', '100%-30'],
                dragOnly     : true
            });

            // Wait until element is scrolled to the bottom
            await t.waitFor(() => !calendar.scrollManager.isScrolling);

            await t.mouseUp(overflowElement, null, ['50%', `100%-${activeView.hourHeight * 2}`]);

            t.is(event.startDate, new Date(2021, 5, 2, 21), 'Start date is ok');
            t.is(event.endDate, new Date(2021, 5, 2, 23), 'End date is ok');

            //#endregion

            //region Drag event to the top edge

            await t.dragTo({
                source       : '.b-cal-event',
                target       : overflowElement,
                targetOffset : ['50%', 30],
                dragOnly     : true
            });

            // Wait until element is scrolled to the bottom
            await t.waitFor(() => !calendar.scrollManager.isScrolling);

            await t.mouseUp(overflowElement, null, ['50%', activeView.hourHeight * 2]);

            t.is(event.startDate, new Date(2021, 5, 2, 1), 'Start date is ok');
            t.is(event.endDate, new Date(2021, 5, 2, 3), 'End date is ok');

            //endregion
        });

        t.describe('One axis drag', t => {
            t.it('Should support drag event down by 1 hour', async t => {
                await h.init(t);

                eventRecord = h.eventStore.getById(h.Event.TeamScrum);

                t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Correct endDate');

                [el, offset] = await h.hoverEvent(eventRecord.id);

                await h.drag(el, {
                    offset,
                    by : [0, h.DAY_PX_PER_HOUR]
                });

                t.ok(t.isDragging(), 'Drag is active');

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 15, 11), new Date(2019, 9, 15, 13), `11 AM${h.Text.TeamScrum}1 PM`]
                ]);

                await h.drop();

                t.notOk(t.isDragging(), 'Drag is done');

                t.is(eventRecord.startDate, new Date(2019, 9, 15, 11), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 15, 13), 'Correct endDate');
            });

            t.it('Should support drag event left by 1 day', async t => {
                await h.init(t);

                eventRecord = h.eventStore.getById(h.Event.TeamScrum);
                const elementCount = h.calendar.modes.week.element.querySelectorAll('.b-cal-event-wrap').length;

                t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Correct endDate');

                [el, offset] = await h.hoverEvent(eventRecord.id);

                await h.drag(el, {
                    offset,
                    by : [-h.WEEK_PX_PER_DAY, 0]
                });

                t.ok(t.isDragging(), 'Drag started');

                const activeBefore = document.activeElement;

                await t.waitFor(() => activeBefore === el);
                t.pass('Correct element focus');

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 14, 10), new Date(2019, 9, 14, 12), h.TimeText.TeamScrum]
                ]);

                await h.drop();

                const activeAfter = document.activeElement;

                await t.waitFor(() => activeAfter !== activeBefore);
                t.pass('Different focused element');

                await t.waitFor(() => h.focusedEventRecord === eventRecord);
                t.pass('Same event is focused');

                t.notOk(t.isDragging(), 'Drag is done');

                t.is(eventRecord.startDate, new Date(2019, 9, 14, 10), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 14, 12), 'Correct endDate');

                const afterElementCount = h.calendar.modes.week.element.querySelectorAll('.b-cal-event-wrap').length;

                t.is(elementCount, afterElementCount, 'No elements lost');
            });

            t.it('Should support drag event right by 1 day RTL', async t => {
                await h.init(t, { rtl : true });

                eventRecord = h.eventStore.getById(h.Event.TeamScrum);
                const elementCount = h.calendar.modes.week.element.querySelectorAll('.b-cal-event-wrap').length;

                t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Correct endDate');

                [el, offset] = await h.hoverEvent(eventRecord.id);

                await h.drag(el, {
                    offset,
                    by : [h.WEEK_PX_PER_DAY, 0]
                });

                t.ok(t.isDragging(), 'Drag started');

                const activeBefore = document.activeElement;

                await t.waitFor(() => activeBefore === el);
                t.pass('Correct element focus');

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 14, 10), new Date(2019, 9, 14, 12), h.TimeText.TeamScrum]
                ]);

                await h.drop();

                const activeAfter = document.activeElement;

                await t.waitFor(() => activeAfter !== activeBefore);
                t.pass('Different focused element');

                await t.waitFor(() => h.focusedEventRecord === eventRecord);
                t.pass('Same event is focused');

                t.notOk(t.isDragging(), 'Drag is done');

                t.is(eventRecord.startDate, new Date(2019, 9, 14, 10), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 14, 12), 'Correct endDate');

                const afterElementCount = h.calendar.modes.week.element.querySelectorAll('.b-cal-event-wrap').length;

                t.is(elementCount, afterElementCount, 'No elements lost');
            });

            t.it('Should support drag event up by 2 hours', async t => {
                await h.init(t);

                eventRecord = h.eventStore.getById(h.Event.TeamScrum);

                t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Correct endDate');

                [el, offset] = await h.hoverEvent(eventRecord.id);

                await h.drag(el, {
                    offset,
                    by : [0, -2 * h.DAY_PX_PER_HOUR]
                });

                t.ok(t.isDragging(), 'Drag started');

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 15, 8), new Date(2019, 9, 15, 10), `8 AM${h.Text.TeamScrum}10 AM`]
                ]);

                await h.drop();

                t.notOk(t.isDragging(), 'Drag is done');

                t.is(eventRecord.startDate, new Date(2019, 9, 15, 8), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 15, 10), 'Correct endDate');
            });

            t.it('Should support drag event right by 3 days', async t => {
                await h.init(t);

                eventRecord = h.eventStore.getById(h.Event.TeamScrum);

                t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Correct endDate');

                [el, offset] = await h.hoverEvent(eventRecord.id);

                await h.drag(el, {
                    offset,
                    by : [3 * h.WEEK_PX_PER_DAY, 0]
                });

                t.ok(t.isDragging(), 'Drag started');

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 18, 10), new Date(2019, 9, 18, 12), h.TimeText.TeamScrum]
                ]);

                await h.drop();

                t.notOk(t.isDragging(), 'Drag is done');

                t.is(eventRecord.startDate, new Date(2019, 9, 18, 10), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 18, 12), 'Correct endDate');
            });

            t.it('Should support drag event left by 3 days RTL', async t => {
                await h.init(t, { rtl : true });

                eventRecord = h.eventStore.getById(h.Event.TeamScrum);

                t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Correct endDate');

                [el, offset] = await h.hoverEvent(eventRecord.id);

                await h.drag(el, {
                    offset,
                    by : [-3 * h.WEEK_PX_PER_DAY, 0]
                });

                t.ok(t.isDragging(), 'Drag started');

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 18, 10), new Date(2019, 9, 18, 12), h.TimeText.TeamScrum]
                ]);

                await h.drop();

                t.notOk(t.isDragging(), 'Drag is done');

                t.is(eventRecord.startDate, new Date(2019, 9, 18, 10), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 18, 12), 'Correct endDate');
            });

            t.it('Should support async finalizing with async beforeDragMoveEnd listener', async t => {
                await h.init(t);

                eventRecord = h.eventStore.getById(h.Event.TeamScrum);

                [el, offset] = await h.hoverEvent(eventRecord.id);

                [el, offset] = await h.hoverEvent(eventRecord.id);

                h.calendar.on({
                    beforeDragMoveEnd : async({ context }) => {
                        const result = await MessageDialog.confirm({
                            title   : 'Please confirm',
                            message : 'Is this what you want, what you really really want?'
                        });

                        // Return true to accept the drop or false to reject it
                        return result === MessageDialog.yesButton;
                    }
                });

                t.firesOnce(h.calendar, 'beforeDragMoveEnd');
                t.firesOnce(h.calendar, 'dragMoveEnd');
                t.firesOnce(h.calendar.eventStore, 'update');

                await h.drag(el, {
                    offset,
                    by : [0, h.DAY_PX_PER_HOUR]
                });

                await h.drop();

                await t.click('button:contains(OK)');
            });

            t.it('Should not finalize the operation if an async beforeDragMoveEnd listener returns false', async t => {
                await h.init(t);

                eventRecord = h.eventStore.getById(h.Event.TeamScrum);

                [el, offset] = await h.hoverEvent(eventRecord.id);

                [el, offset] = await h.hoverEvent(eventRecord.id);

                h.calendar.on({
                    beforeDragMoveEnd : async({ context }) => {
                        const result = await MessageDialog.confirm({
                            title   : 'Please confirm',
                            message : 'Is this what you want, what you really really want?'
                        });

                        // Return true to accept the drop or false to reject it
                        return result === MessageDialog.yesButton;
                    }
                });

                t.firesOnce(h.calendar, 'beforeDragMoveEnd');
                t.wontFire(h.calendar, 'dragMoveEnd');
                t.wontFire(h.calendar.eventStore, 'update');

                await h.drag(el, {
                    offset,
                    by : [0, h.DAY_PX_PER_HOUR]
                });

                await h.drop();

                await t.click('button:contains(Cancel)');
            });
        });

        t.describe('showAllDayHeader: false', t => {
            const smallProject = t => {
                const date = t.dateShifter(0, 0);

                return {
                    eventStore : new t.global.EventStore({
                        data : [
                            {
                                id         : 5,
                                startDate  : date(2019, 10, 17, 9),
                                endDate    : date(2019, 10, 17, 10),
                                name       : 'Breakfast',
                                resourceId : 'hotel'
                            },
                            {
                                id         : 18,
                                startDate  : date(2019, 10, 17, 10),
                                endDate    : date(2019, 10, 19, 16),
                                name       : 'Excursion',
                                resourceId : 'mats'
                            },
                            {
                                id         : 19,
                                startDate  : date(2019, 10, 17, 18),
                                endDate    : date(2019, 10, 17, 22),
                                name       : 'Team Building',
                                resourceId : 'mats'
                            },
                            {
                                id         : 29,
                                startDate  : date(2019, 10, 20, 14),
                                endDate    : date(2019, 10, 20, 15),
                                name       : 'Lunch',
                                resourceId : 'hotel'
                            },
                            {
                                id         : 30,
                                startDate  : date(2019, 10, 20, 19),
                                endDate    : date(2019, 10, 20, 20),
                                name       : 'Dinner',
                                resourceId : 'hotel'
                            }
                        ],

                        // Auto-created and DD created events get this as a default Calendar
                        defaultCalendarId : 'mats'
                    }),

                    resourceStore : new t.global.ResourceStore({
                        data : [
                            {
                                id         : 'bryntum',
                                name       : 'Bryntum team',
                                eventColor : '#249fbc'
                            },
                            {
                                id         : 'hotel',
                                name       : 'Hotel Park',
                                eventColor : '#ffc107'
                            },
                            {
                                id         : 'mats',
                                name       : 'Mats Bryntse',
                                eventColor : '#e44959'
                            }
                        ]
                    })
                };
            };

            const init = async t => {
                const project = smallProject(t);

                await h.init(t, {
                    crudManager : project,

                    modes : {
                        week : {
                            showAllDayHeader : false
                        }
                    }
                });
            };

            t.it('Should support drag move for an interday event', async t => {
                await init(t);

                // We had a bug due to sorting interDay events above other events. That order makes sense for Month
                // and Agenda views but not for Day/Week views when these events are rendered together.
                const teamBuildingSelector = `[data-event-id="${h.Event.TeamBuilding}"]`;

                await t.waitForSelector(teamBuildingSelector);

                const
                    eventEl = document.querySelector(teamBuildingSelector),
                    columnEl = eventEl.closest('.b-dayview-day-detail'),
                    box = Rectangle.from(eventEl, columnEl);

                t.ok(box.x >= 10 && box.x <= 12,
                    `Layout is incorrect for minor overlap of interday event: ${box.x} not in range [10,12]`);

                eventRecord = h.eventStore.getById(h.Event.Excursion);

                // Nudge the mouse 10px on x-axis to engage drag/drop but not actually change date of event:
                await t.dragBy({
                    source   : '.b-dayview-day-container [data-date="2019-10-18"] .b-cal-event-wrap',
                    delta    : [10, 0],
                    dragOnly : true
                });

                t.ok(t.isDragging(), 'Drag started');

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 17, 10), new Date(2019, 9, 18, 0), `10 AM${h.Text.Excursion}`],
                    [new Date(2019, 9, 18, 0), new Date(2019, 9, 19, 0), `10 AM${h.Text.Excursion}`],
                    [new Date(2019, 9, 19, 0), new Date(2019, 9, 19, 16), `10 AM${h.Text.Excursion}4 PM`]
                ]);

                // Move one day right to clip endDate:
                await t.moveCursorBy([1 * h.WEEK_PX_PER_DAY, 0]);

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 18, 10), new Date(2019, 9, 19, 0), `10 AM${h.Text.Excursion}`],
                    [new Date(2019, 9, 19, 0), new Date(2019, 9, 20, 0), `10 AM${h.Text.Excursion}4 PM`]
                ]);

                // Move 3 days left to fully render the event and also move down a couple hours:
                await t.moveCursorBy([-3 * h.WEEK_PX_PER_DAY, 2 * h.DAY_PX_PER_HOUR]);

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 15, 12), new Date(2019, 9, 16, 0), `12 PM${h.Text.Excursion}`],
                    [new Date(2019, 9, 16, 0), new Date(2019, 9, 17, 0), `12 PM${h.Text.Excursion}`],
                    [new Date(2019, 9, 17, 0), new Date(2019, 9, 17, 18), `12 PM${h.Text.Excursion}6 PM`]
                ]);

                // Move 3 more days left to clip the startDate off:
                await t.moveCursorBy([-3 * h.WEEK_PX_PER_DAY, 0]);

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 13, 0), new Date(2019, 9, 14, 0), `12 PM${h.Text.Excursion}`],
                    [new Date(2019, 9, 14, 0), new Date(2019, 9, 14, 18), `12 PM${h.Text.Excursion}6 PM`]
                ]);

                // Move back to where we just were to again fully render the event:
                await t.moveCursorBy([3 * h.WEEK_PX_PER_DAY, 0]);

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 15, 12), new Date(2019, 9, 16, 0), `12 PM${h.Text.Excursion}`],
                    [new Date(2019, 9, 16, 0), new Date(2019, 9, 17, 0), `12 PM${h.Text.Excursion}`],
                    [new Date(2019, 9, 17, 0), new Date(2019, 9, 17, 18), `12 PM${h.Text.Excursion}6 PM`]
                ]);

                // Now drop and see what we've got:
                await t.mouseUp();

                t.notOk(t.isDragging(), 'Drag is done');

                t.is(eventRecord.startDate, new Date(2019, 9, 15, 12), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 17, 18), 'Correct endDate');
            });

            t.it('Should support drag resize on the bottom for an interday event', async t => {
                await init(t);

                eventRecord = h.eventStore.getById(h.Event.Excursion);

                await h.hoverBottom(h.Event.Excursion);
                await t.mouseDown();

                // Nudge the mouse 10px on x-axis to engage drag/drop but not actually change date of event:
                await t.moveCursorBy([10, 5]);

                t.ok(t.isDragging(), 'Drag started');

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 17, 10), new Date(2019, 9, 18, 0), `10 AM${h.Text.Excursion}`],
                    [new Date(2019, 9, 18, 0), new Date(2019, 9, 19, 0), `10 AM${h.Text.Excursion}`],
                    [new Date(2019, 9, 19, 0), new Date(2019, 9, 19, 16), `10 AM${h.Text.Excursion}4 PM`]
                ]);

                await t.moveCursorBy([-1 * h.WEEK_PX_PER_DAY, -2 * h.DAY_PX_PER_HOUR]);

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 17, 10), new Date(2019, 9, 18, 0), `10 AM${h.Text.Excursion}`],
                    [new Date(2019, 9, 18, 0), new Date(2019, 9, 18, 14), `10 AM${h.Text.Excursion}2 PM`]
                ]);

                await t.moveCursorBy([-1 * h.WEEK_PX_PER_DAY, -2 * h.DAY_PX_PER_HOUR]);

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 17, 10), new Date(2019, 9, 17, 12), `10 AM${h.Text.Excursion}12 PM`]
                ]);

                // Now drop and see what we've got:
                await t.mouseUp();

                t.notOk(t.isDragging(), 'Drag is done');

                t.is(eventRecord.startDate, new Date(2019, 9, 17, 10), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 17, 12), 'Correct endDate');
            });

            t.it('Should support drag resize on the top for an interday event', async t => {
                await init(t);

                eventRecord = h.eventStore.getById(h.Event.Excursion);

                await h.hoverTop(h.Event.Excursion);
                await t.mouseDown();

                // Nudge the mouse 10px on x-axis to engage drag/drop but not actually change date of event:
                await t.moveCursorBy([10, -5]);

                t.ok(t.isDragging(), 'Drag started');

                await t.moveCursorBy([-2 * h.WEEK_PX_PER_DAY, 2 * h.DAY_PX_PER_HOUR]);

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 15, 12), new Date(2019, 9, 16, 0), `12 PM${h.Text.Excursion}`],
                    [new Date(2019, 9, 16, 0), new Date(2019, 9, 17, 0), `12 PM${h.Text.Excursion}`],
                    [new Date(2019, 9, 17, 0), new Date(2019, 9, 18, 0), `12 PM${h.Text.Excursion}`],
                    [new Date(2019, 9, 18, 0), new Date(2019, 9, 19, 0), `12 PM${h.Text.Excursion}`],
                    [new Date(2019, 9, 19, 0), new Date(2019, 9, 19, 16), `12 PM${h.Text.Excursion}4 PM`]
                ]);

                await t.moveCursorBy([3 * h.WEEK_PX_PER_DAY, 1 * h.DAY_PX_PER_HOUR]);

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 18, 13), new Date(2019, 9, 19, 0), `1 PM${h.Text.Excursion}`],
                    [new Date(2019, 9, 19, 0), new Date(2019, 9, 19, 16), `1 PM${h.Text.Excursion}4 PM`]
                ]);

                await t.moveCursorBy([1 * h.WEEK_PX_PER_DAY, 1 * h.DAY_PX_PER_HOUR]);

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 19, 14), new Date(2019, 9, 19, 16), `2 PM${h.Text.Excursion}4 PM`]
                ]);

                await t.moveCursorBy([-1 * h.WEEK_PX_PER_DAY, -3 * h.DAY_PX_PER_HOUR]);

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 18, 11), new Date(2019, 9, 19, 0), `11 AM${h.Text.Excursion}`],
                    [new Date(2019, 9, 19, 0), new Date(2019, 9, 19, 16), `11 AM${h.Text.Excursion}4 PM`]
                ]);

                // Now drop and see what we've got:
                await t.mouseUp();

                t.notOk(t.isDragging(), 'Drag is done');

                t.is(eventRecord.startDate, new Date(2019, 9, 18, 11), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 19, 16), 'Correct endDate');
            });
        });

        t.describe('Hidden nonworking days', t => {
            t.it('Should move single-day event up one week', async t => {
                await h.init(t, {
                    modes : {
                        week : {
                            hideNonWorkingDays : true
                        }
                    }
                });

                const
                    eventRecord = h.eventStore.getById(h.Event.CheckInHotel),
                    cellWidth   = h.calendar.activeView.element.querySelector('.b-calendar-cell:not(.b-nonworking-day)').getBoundingClientRect().width;

                t.is(eventRecord.startDate, new Date(2019, 9, 14, 14), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 14, 18), 'Correct endDate');

                [el, offset] = await h.hoverEvent(eventRecord.id);

                await h.drag(el, {
                    by : [cellWidth * 4, 0]
                });

                t.ok(t.isDragging(), 'Drag is active');

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 18, 14), new Date(2019, 9, 18, 18), `2 PM${h.Text.CheckInHotel}6 PM`]
                ]);

                await h.drop();

                t.ok(eventRecord.isModified, 'Record was moved');
                t.is(eventRecord.startDate, new Date(2019, 9, 18, 14), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 18, 18), 'Correct endDate');
            });

            t.it('Should be able to convert short event to an allDay event', async t => {
                await h.init(t, {
                    modes : {
                        week : {
                            hideNonWorkingDays : true
                        }
                    }
                });

                [el, offset] = await h.hoverEvent(h.Event.CheckInHotel);

                await h.drag(el, {
                    offset : ['50%', 20],
                    by     : [0, -h.DAY_PX_PER_HOUR * 8]
                });

                t.ok(t.isDragging(), 'Drag is active');

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 14), new Date(2019, 9, 15), h.Text.CheckInHotel]
                ]);

                await h.drop();

                await h.waitForSelector(
                    '.b-dayview .b-calendarrow .b-cal-event-wrap:contains(Check-In in Hotel)',
                    'Correctly dragged into all day zone');
            });
        });

        t.describe('Hidden nonworking days', t => {
            t.it('Should move single-day event up one week', async t => {
                await h.init(t, {
                    modes : {
                        week : {
                            hideNonWorkingDays : true
                        }
                    }
                });

                const
                    eventRecord = h.eventStore.getById(h.Event.CheckInHotel),
                    cellWidth   = h.calendar.activeView.element.querySelector('.b-calendar-cell:not(.b-nonworking-day)').getBoundingClientRect().width;

                t.is(eventRecord.startDate, new Date(2019, 9, 14, 14), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 14, 18), 'Correct endDate');

                [el, offset] = await h.hoverEvent(eventRecord.id);

                await h.drag(el, {
                    by : [cellWidth * 4, 0]
                });

                t.ok(t.isDragging(), 'Drag is active');

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 18, 14), new Date(2019, 9, 18, 18), `2 PM${h.Text.CheckInHotel}6 PM`]
                ]);

                await h.drop();

                t.ok(eventRecord.isModified, 'Record was moved');
                t.is(eventRecord.startDate, new Date(2019, 9, 18, 14), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 18, 18), 'Correct endDate');
            });

            t.it('Should be able to convert short event to an allDay event', async t => {
                await h.init(t, {
                    modes : {
                        week : {
                            hideNonWorkingDays : true
                        }
                    }
                });

                [el, offset] = await h.hoverEvent(h.Event.CheckInHotel);

                await h.drag(el, {
                    offset : ['50%', 20],
                    by     : [0, -h.DAY_PX_PER_HOUR * 8]
                });

                t.ok(t.isDragging(), 'Drag is active');

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 14), new Date(2019, 9, 15), h.Text.CheckInHotel]
                ]);

                await h.drop();

                await h.waitForSelector(
                    '.b-dayview .b-calendarrow .b-cal-event-wrap:contains(Check-In in Hotel)',
                    'Correctly dragged into all day zone');
            });
        });

        t.describe('Two axis drag', t => {
            t.it('Should support drag event down by 1 hour and left 1 day', async t => {
                await h.init(t);

                eventRecord = h.eventStore.getById(h.Event.TeamScrum);

                t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Correct endDate');

                [el, offset] = await h.hoverEvent(eventRecord.id);

                await h.drag(el, {
                    offset,
                    by : [-h.WEEK_PX_PER_DAY, h.DAY_PX_PER_HOUR]
                });

                t.ok(t.isDragging(), 'Drag started');

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 14, 11), new Date(2019, 9, 14, 13), `11 AM${h.Text.TeamScrum}1 PM`]
                ]);

                await h.drop();

                t.notOk(t.isDragging(), 'Drag is done');

                t.is(eventRecord.startDate, new Date(2019, 9, 14, 11), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 14, 13), 'Correct endDate');
            });

            t.it('Should support drag event down by 1 hour and right 1 day RTL', async t => {
                await h.init(t, { rtl : true });

                eventRecord = h.eventStore.getById(h.Event.TeamScrum);

                t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Correct endDate');

                [el, offset] = await h.hoverEvent(eventRecord.id);

                await h.drag(el, {
                    offset,
                    by : [h.WEEK_PX_PER_DAY, h.DAY_PX_PER_HOUR]
                });

                t.ok(t.isDragging(), 'Drag started');

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 14, 11), new Date(2019, 9, 14, 13), `11 AM${h.Text.TeamScrum}1 PM`]
                ]);

                await h.drop();

                t.notOk(t.isDragging(), 'Drag is done');

                t.is(eventRecord.startDate, new Date(2019, 9, 14, 11), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 14, 13), 'Correct endDate');
            });

            t.it('Should support drag event up by 2 hours and left by 1 day', async t => {
                await h.init(t);

                eventRecord = h.eventStore.getById(h.Event.TeamScrum);

                t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Correct endDate');

                [el, offset] = await h.hoverEvent(eventRecord.id);

                await h.drag(el, {
                    offset,
                    by : [-h.WEEK_PX_PER_DAY, -2 * h.DAY_PX_PER_HOUR]
                });

                t.ok(t.isDragging(), 'Drag started');

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 14, 8), new Date(2019, 9, 14, 10), `8 AM${h.Text.TeamScrum}10 AM`]
                ]);

                await h.drop();

                t.notOk(t.isDragging(), 'Drag is done');

                t.is(eventRecord.startDate, new Date(2019, 9, 14, 8), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 14, 10), 'Correct endDate');
            });

            t.it('Should support drag event down by 1 hour and right by 3 days', async t => {
                await h.init(t);

                eventRecord = h.eventStore.getById(h.Event.TeamScrum);

                t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Correct endDate');

                [el, offset] = await h.hoverEvent(eventRecord.id);

                await h.drag(el, {
                    offset,
                    by : [3 * h.WEEK_PX_PER_DAY, h.DAY_PX_PER_HOUR]
                });

                t.ok(t.isDragging(), 'Drag started');

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 18, 11), new Date(2019, 9, 18, 13), `11 AM${h.Text.TeamScrum}1 PM`]
                ]);

                await h.drop();

                t.notOk(t.isDragging(), 'Drag is done');

                t.is(eventRecord.startDate, new Date(2019, 9, 18, 11), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 18, 13), 'Correct endDate');
            });

            t.it('Should support drag event up by 2 hours and right by 3 days', async t => {
                await h.init(t);

                eventRecord = h.eventStore.getById(h.Event.TeamScrum);

                t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Correct endDate');

                [el, offset] = await h.hoverEvent(eventRecord.id);

                await h.drag(el, {
                    offset,
                    by : [3 * h.WEEK_PX_PER_DAY, -2 * h.DAY_PX_PER_HOUR]
                });

                t.ok(t.isDragging(), 'Drag started');

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 18, 8), new Date(2019, 9, 18, 10), `8 AM${h.Text.TeamScrum}10 AM`]
                ]);

                await h.drop();

                t.notOk(t.isDragging(), 'Drag is done');

                t.is(eventRecord.startDate, new Date(2019, 9, 18, 8), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 18, 10), 'Correct endDate');
            });
        });

        t.describe('Recurrence', t => {
            t.it('Should drag recurring event and do nothing if cancelled', async t => {
                await h.init(t);

                eventRecord = h.eventStore.getById(h.Event.Breakfast);

                t.is(eventRecord.startDate, new Date(2019, 9, 15, 9), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 15, 10), 'Correct endDate');

                [el, offset] = await h.hoverEvent(eventRecord.id);

                await h.drag(el, {
                    offset,
                    by : [0, -h.DAY_PX_PER_HOUR]
                });

                await h.drop();

                const confirm = await t.recurrenceEditConfirmation();

                await confirm.cancel();

                t.notOk(eventRecord.isModified, 'Record was not changed');
            });

            t.it('Should drag recurring event and modify all occurrences', async t => {
                await h.init(t);

                eventRecord = h.eventStore.getById(h.Event.Breakfast);

                t.is(eventRecord.startDate, new Date(2019, 9, 15, 9), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 15, 10), 'Correct endDate');

                [el, offset] = await h.hoverEvent(eventRecord.id);

                await h.drag(el, {
                    offset,
                    by : [0, -h.DAY_PX_PER_HOUR]
                });

                await h.drop();

                const confirm = await t.recurrenceEditConfirmation();

                await confirm.yes();

                t.ok(eventRecord.isModified, 'Record was changed');
                t.is(eventRecord.startDate, new Date(2019, 9, 15, 8), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 15, 9), 'Correct endDate');
            });

            t.it('Should drag occurrence and do nothing if cancelled', async t => {
                await h.init(t);

                let eventRecord = h.eventStore.getById(h.Event.Breakfast);

                eventRecord = eventRecord.occurrences[1];

                t.is(eventRecord.startDate, new Date(2019, 9, 17, 9), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 17, 10), 'Correct endDate');

                [el, offset] = await h.hoverEvent(eventRecord.id);

                await h.drag(el, {
                    offset,
                    by : [0, -h.DAY_PX_PER_HOUR]
                });

                await h.drop();

                const confirm = await t.occurrenceEditConfirmation();

                await confirm.cancel();

                t.notOk(eventRecord.isModified, 'No changes');
            });

            t.it('Should drag occurrence and modify all following event', async t => {
                await h.init(t);

                let eventRecord = h.eventStore.getById(h.Event.Breakfast);

                eventRecord = eventRecord.occurrences[1];

                t.is(eventRecord.startDate, new Date(2019, 9, 17, 9), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 17, 10), 'Correct endDate');

                [el, offset] = await h.hoverEvent(eventRecord.id);

                await h.drag(el, {
                    offset,
                    by : [0, -h.DAY_PX_PER_HOUR]
                });

                await h.drop();

                const confirm = await t.occurrenceEditConfirmation();

                await confirm.allFutureEvents();

                t.is(eventRecord.startDate, new Date(2019, 9, 17, 8), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 17, 9), 'Correct endDate');
            });

            t.it('Should drag occurrence and modify only that event', async t => {
                await h.init(t);

                let eventRecord = h.eventStore.getById(h.Event.Breakfast);

                eventRecord = eventRecord.occurrences[1];

                t.is(eventRecord.startDate, new Date(2019, 9, 17, 9), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 17, 10), 'Correct endDate');

                [el, offset] = await h.hoverEvent(eventRecord.id);

                await h.drag(el, {
                    offset,
                    by : [0, -h.DAY_PX_PER_HOUR]
                });

                await h.drop();

                const confirm = await t.occurrenceEditConfirmation();

                await confirm.onlyThisEvent();

                t.is(eventRecord.startDate, new Date(2019, 9, 17, 8), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 17, 9), 'Correct endDate');
            });
        });

        t.describe('Page scrolled', t => {
            t.beforeEach(() => {
                t.enablePageScroll();
            });

            t.it('should drag when body is scrolled', async t => {
                await h.init(t);

                await h.moveCursorTo([300, 300]);  // move the cursor away so we get the mouse entry

                eventRecord = h.eventStore.getById(h.Event.TeamScrum);

                t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Correct endDate');

                [el, offset] = await h.hoverEvent(eventRecord.id);

                await h.drag(el, {
                    offset,
                    by : [0, h.DAY_PX_PER_HOUR]
                });

                t.ok(t.isDragging(), 'Drag is active');

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 15, 11), new Date(2019, 9, 15, 13), `11 AM${h.Text.TeamScrum}1 PM`]
                ]);

                await h.drop();

                t.notOk(t.isDragging(), 'Drag is done');

                t.is(eventRecord.startDate, new Date(2019, 9, 15, 11), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 15, 13), 'Correct endDate');
            });
        });

        // https://github.com/bryntum/support/issues/3585
        t.it('Events which start before the dayStartTime should be rendered at 0% top.', async t => {
            await h.init(t, {
                sidebar : false,
                height  : 768,
                width   : 700,
                modes   : {
                    week : {
                        dayStartTime : 7,
                        dayEndTime   : 18
                    }
                },
                date    : '2019-10-15',
                project : new ProjectModel({
                    eventStore : {
                        data : [{
                            name       : 'Meeting',
                            resourceId : 'bryntum',
                            startDate  : '2019-10-15T12:00:00',
                            endDate    : '2019-10-15T15:00:00'
                        }],

                        // Auto-created and DD created events get this as a default Calendar
                        defaultCalendarId : 'mats'
                    },

                    resourceStore : {
                        data : t.getHackathonData().resources.rows
                    }
                })
            });
            const
                weekView    = h.calendar.activeView,
                eventRecord = h.calendar.eventStore.first,
                eventEl     = weekView.getEventElement(eventRecord);

            t.notOk(eventRecord.isInterDay, 'Event does not flag up as interDay');

            // Wait for layout to be correct
            await t.waitForAnimationFrame();

            [el, offset] = await h.hoverEvent(eventRecord.id, { offset : ['50%', '90%'] });

            await h.drag(eventEl, {
                offset,
                by : [0, -6 * h.DAY_PX_PER_HOUR]
            });

            await h.drop();

            await t.waitForAnimationFrame();

            // The event starts one hour above the day start, but the
            // layout Math.maxes it with 0, and adds a class to specify that it starts above.
            t.is(eventEl.style.top, '0px', 'Correct event top');
            t.hasCls(eventEl, 'b-starts-above');

            // This must never scroll. That was part of the bug. Focusing caused this element to scroll.
            // It's now overflow:clip
            t.is(weekView.horizontalScroller.element.scrollTop, 0);
        });
    }, 120000);

    checkTouchInFirefox && t.describe('TOUCH: Day Detail w/Touch', t => {
        t.beforeEach(t => {
            h = t.setupWeekViewDragHarness();
        });

        t.it('TOUCH: Should support drag drop on a touch device', async t => {
            await h.init(t);

            eventRecord = h.eventStore.getById(h.Event.TeamScrum);

            t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Correct endDate');

            [el, offset] = await h.hoverEvent(eventRecord.id);

            await h.touchDragBy(el, 0, -2.5 * h.DAY_PX_PER_HOUR);

            t.is(eventRecord.startDate, new Date(2019, 9, 15, 7, 30), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 15, 9, 30), 'Correct endDate');
        });

        t.describe('TOUCH: Page scrolled', t => {
            t.beforeEach(() => {
                t.enablePageScroll();
            });

            t.it('TOUCH: should drag when body is scrolled', async t => {
                await h.init(t);

                await h.moveCursorTo([300, 300]);  // move the cursor away so we get the mouse entry

                eventRecord = h.eventStore.getById(h.Event.TeamScrum);

                t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Correct endDate');

                [el, offset] = await h.hoverEvent(eventRecord.id);

                await h.touchDragBy(el, 0, -2.5 * h.DAY_PX_PER_HOUR);

                t.is(eventRecord.startDate, new Date(2019, 9, 15, 7, 30), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 15, 9, 30), 'Correct endDate');
            });
        });
    });

    t.describe('Support tickets', t => {
        let calendar;

        t.beforeEach(() => {
            calendar = calendar?.destroy();
        });

        // https://github.com/bryntum/support/issues/4220
        t.it('should work correctly on DST day', async t => {
            if (!DateHelper.isDSTEnabled) {
                t.pass('Test is not valid for TimeZone with disabled DST');
                return;
            }

            // Technically, the bug only happened on drag create (since move/resize are based on deltas not the absolute
            // date calculated from y-coordinate... but better safe than sorry.

            // DST day differs around the world, so find it:
            const dstDate = new Date(2022, 10, 30);

            while (!DateHelper.isDST(dstDate)) {
                dstDate.setDate(dstDate.getDate() - 1);
            }

            const nextDay = new Date(dstDate);

            nextDay.setDate(nextDay.getDate() + 1);

            calendar = await t.getCalendar({
                date       : dstDate,
                mode       : 'week',
                eventStore : {
                    data : [{
                        id        : 'derp',
                        name      : 'Derp',
                        startDate : `${DateHelper.format(dstDate, 'YYYY-MM-DD')} 09:00`,
                        endDate   : `${DateHelper.format(dstDate, 'YYYY-MM-DD')} 11:00`
                    }, {
                        id        : 'woot',
                        name      : 'Woot',
                        startDate : `${DateHelper.format(nextDay, 'YYYY-MM-DD')} 08:00`,
                        endDate   : `${DateHelper.format(nextDay, 'YYYY-MM-DD')} 10:00`
                    }]
                },

                modes : {
                    week : {
                        dayStartTime : 6,
                        dayEndTime   : 20
                    }
                }
            });

            const HR = calendar.modes.week.hourHeight;

            t.selectorExists(`.b-weekview [data-event-id="derp"]:regex(9\\sAM)`, 'Correct start on DST day');

            await t.dragBy({
                source   : `.b-weekview [data-event-id="derp"]`,
                delta    : [0, HR * 2],
                dragOnly : true
            });

            t.selectorExists(`.b-weekview .b-cal-tentative-event:regex(11\\sAM)`, 'Correct drag start on DST day');
            t.selectorExists(`.b-weekview .b-cal-tentative-event:regex(1\\sPM)`, 'Correct drag end on DST day');

            await t.mouseUp();

            t.selectorExists(`.b-weekview [data-event-id="derp"]:regex(11\\sAM)`, 'Correct drop start on DST day');

            // Also make sure the day after DST day works as expected:

            t.selectorExists(`.b-weekview [data-event-id="woot"]:regex(8\\sAM)`, 'Correct start on DST day');

            await t.dragBy({
                source   : `.b-weekview [data-event-id="woot"]`,
                delta    : [0, HR * 2],
                dragOnly : true
            });

            t.selectorExists(`.b-weekview .b-cal-tentative-event:regex(10\\sAM)`, 'Correct drag start on DST day');
            t.selectorExists(`.b-weekview .b-cal-tentative-event:regex(12\\sPM)`, 'Correct drag end on DST day');

            await t.mouseUp();

            t.selectorExists(`.b-weekview [data-event-id="woot"]:regex(10\\sAM)`, 'Correct drop start on DST day');
        });

        // https://github.com/bryntum/support/issues/4857
        t.it('Dragging item from overflowpopup should not have any proxy element', async t => {
            const calendar = h = await t.getCalendar({
                date   : new Date(2022, 9, 9),
                mode   : 'week',
                events : [
                    {
                        id         : 1,
                        startDate  : new Date(2022, 9, 10),
                        endDate    : new Date(2022, 9, 11),
                        name       : 'Hackathon 2020',
                        allDay     : true,
                        eventColor : 'green'
                    },
                    {
                        id        : 2,
                        startDate : new Date(2022, 9, 10),
                        endDate   : new Date(2022, 9, 11),
                        name      : 'Check-In in Hotel'
                    },
                    {
                        id        : 3,
                        startDate : new Date(2022, 9, 10),
                        endDate   : new Date(2022, 9, 11),
                        name      : 'Relax and official arrival beer',
                        allDay    : true
                    },
                    {
                        id        : 4,
                        startDate : new Date(2022, 9, 10),
                        endDate   : new Date(2022, 9, 11),
                        name      : 'Dinner'
                    },
                    {
                        id        : 5,
                        startDate : new Date(2022, 9, 10),
                        endDate   : new Date(2022, 9, 11),
                        name      : 'Breakfast'
                    }
                ]
            });
            await t.click('.b-weekview .b-cal-cell-overflow');
            await t.waitForSelector('.b-overflowpopup');
            await t.dragTo({
                source       : '.b-overflowpopup .b-cal-event-bar-container',
                target       : calendar.viewContainer.element,
                targetOffset : ['70%', '80%'],
                dragOnly     : true
            });
            t.selectorNotExists('.b-weekview .b-content-element .b-cal-drag-proxy', 'It does not have any proxy element');
            await t.mouseUp();
        });

        // https://github.com/bryntum/support/issues/3433
        t.it('Should work with minDayWidth causing overflow', async t => {
            h = t.setupWeekViewDragHarness();

            await h.init(t, {
                modes : {
                    week : {
                        minDayWidth : 150
                    }
                }
            });
            const
                { calendar }  = h,
                { activeView } = calendar;

            eventRecord = h.eventStore.getById(h.Event.TeamScrum);

            t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Correct endDate');
            activeView.horizontalScroller.x = 250;

            [el, offset] = await h.hoverEvent(eventRecord.id);

            await h.drag(el, {
                offset,
                by : [150 * 3, 0]
            });

            t.ok(t.isDragging(), 'Drag started');

            tentativeDates = h.getTentativeDates();

            t.expect(tentativeDates).toEqual([
                [new Date(2019, 9, 18, 10), new Date(2019, 9, 18, 12), h.TimeText.TeamScrum]
            ]);

            await h.drop();

            t.notOk(t.isDragging(), 'Drag is done');

            t.is(eventRecord.startDate, new Date(2019, 9, 18, 10), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 18, 12), 'Correct endDate');
        });

        // https://github.com/bryntum/support/issues/5533
        t.it('Should work with RTL', async t => {
            h = t.setupWeekViewDragHarness();

            await h.init(t, {
                rtl   : true,
                modes : {
                    day    : false,
                    month  : false,
                    year   : false,
                    agenda : false
                }
            });
            const
                { calendar }  = h,
                { activeView } = calendar;

            eventRecord = h.eventStore.getById(h.Event.TeamScrum);

            t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Correct endDate');
            activeView.horizontalScroller.x = 250;

            [el, offset] = await h.hoverEvent(eventRecord.id);

            await h.drag(el, {
                offset,
                by : [h.WEEK_PX_PER_DAY * -3, 0]
            });

            t.ok(t.isDragging(), 'Drag started');

            tentativeDates = h.getTentativeDates();

            t.expect(tentativeDates).toEqual([
                [new Date(2019, 9, 18, 10), new Date(2019, 9, 18, 12), h.TimeText.TeamScrum]
            ]);

            await h.drop();

            t.notOk(t.isDragging(), 'Drag is done');

            t.is(eventRecord.startDate, new Date(2019, 9, 18, 10), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 18, 12), 'Correct endDate');
        });
    });

    // https://github.com/bryntum/support/issues/5685
    t.it('Dragging item from overflowpopup should be vetoed if draggable is false', async t => {
        const calendar = await t.getCalendar({
            date   : new Date(2022, 9, 10),
            mode   : 'week',
            events : [
                {
                    id         : 1,
                    startDate  : new Date(2022, 9, 10),
                    endDate    : new Date(2022, 9, 11),
                    name       : 'Hackathon 2020',
                    allDay     : true,
                    eventColor : 'green'
                },
                {
                    id        : 2,
                    startDate : new Date(2022, 9, 10),
                    endDate   : new Date(2022, 9, 11),
                    name      : 'Check-In in Hotel'
                },
                {
                    id        : 3,
                    startDate : new Date(2022, 9, 10),
                    endDate   : new Date(2022, 9, 11),
                    name      : 'Draggable',
                    allDay    : true
                },
                {
                    id        : 4,
                    startDate : new Date(2022, 9, 10),
                    endDate   : new Date(2022, 9, 11),
                    name      : 'Not draggable',
                    draggable : false
                },
                {
                    id        : 5,
                    startDate : new Date(2022, 9, 10),
                    endDate   : new Date(2022, 9, 11),
                    name      : 'Not draggable too',
                    readOnly  : true
                }
            ]
        });
        await t.waitForSelector('.b-cal-event');

        await t.click('.b-dayview .b-cal-cell-overflow');
        await t.dragBy({
            source   : '.b-overflowpopup .b-cal-event-bar-container .b-cal-event-wrap[data-event-id="3"]',
            target   : calendar.viewContainer.element,
            delta    : [200, 0],
            dragOnly : true
        });

        t.selectorExists('.b-cal-tentative-event', 'Dragging not vetoed');
        t.ok(calendar.features.drag.zones.week.allDayZone?.overflow?.dragging, 'Drag zone created');

        await t.mouseUp();

        t.selectorNotExists('.b-cal-tentative-event', 'Dragging is finished');
        t.notOk(calendar.features.drag.zones.week.allDayZone?.overflow?.dragging, 'Drag zone removed');
        await t.waitForSelector('.b-dayview-allday.b-calendar-cell[data-date="2022-10-12"] .b-cal-event-wrap[data-event-id="3"]');

        await t.click('.b-dayview .b-cal-cell-overflow');
        await t.dragBy({
            source   : '.b-overflowpopup .b-cal-event-bar-container .b-cal-event-wrap[data-event-id="4"]',
            target   : calendar.viewContainer.element,
            delta    : [200, 0],
            dragOnly : true
        });

        t.selectorNotExists('.b-cal-tentative-event', 'Dragging is vetoed');
        t.notOk(calendar.features.drag.zones.week.allDayZone?.overflow?.dragging, 'No drag zone created');

        await t.dragBy({
            source   : '.b-overflowpopup .b-cal-event-bar-container .b-cal-event-wrap[data-event-id="5"]',
            target   : calendar.viewContainer.element,
            delta    : [200, 0],
            dragOnly : true
        });

        t.selectorNotExists('.b-cal-tentative-event', 'Dragging is vetoed');
        t.notOk(calendar.features.drag.zones.week.allDayZone?.overflow?.dragging, 'No drag zone created');
    });
});
