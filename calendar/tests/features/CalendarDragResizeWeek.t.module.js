
StartTest(t => {
    let h, tentativeDates;

    t.beforeEach(() => {
        h?.destroy();
        h = tentativeDates = null;

        t.clearPageScroll();
    });

    t.describe('All Day', t => {
        t.beforeEach(t => {
            h = t.setupWeekViewAllDayDragHarness();
        });

        t.it('Should do nothing if disabled', async t => {
            await h.init(t);

            h.calendar.features.drag.disabled = true;

            let [el] = await h.hoverLeft(h.Event.BeerTime);

            t.is(h.isHovering(el), '', 'Hovering is disabled');

            [el] = await h.hoverRight(h.Event.BeerTime);

            t.is(h.isHovering(el), '', 'Hovering is disabled');
        });

        t.it('Should not allow resize on event that extends to next week', async t => {
            await h.init(t);

            const [el] = await h.hoverRight(h.Event.Hackathon);

            t.is(h.isHovering(el), 'hidden-right-edge', 'Gripper is hidden');
        });

        t.it('Should not allow resize on event that extends to next week', async t => {
            await h.init(t);

            h.calendar.activeView.next();

            await t.waitForAnimationFrame();

            const [el] = await h.hoverLeft(h.Event.Hackathon);

            t.is(h.isHovering(el), 'hidden-left-edge', 'Gripper is hidden');
        });

        t.it('Should allow drag change of startDate back and forward', async t => {
            await h.init(t);

            const eventRecord = h.eventStore.getById(h.Event.Hackathon);
            const [el, offset] = await h.hoverLeft(eventRecord.id);

            t.is(h.isHovering(el), 'left-edge', 'Hovering should be active');

            t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate before drag');

            await h.drag(el, {
                offset,
                by : [-1 * h.WEEK_PX_PER_DAY + h.EDGE_OFFSET, 0]
            });

            const { tentativeEvent } = h;

            t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Same startDate during drag');
            t.is(tentativeEvent.startDate, new Date(2019, 9, 13), 'Correct startDate during drag');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, [
                [new Date(2019, 9, 13), new Date(2019, 9, 20), 'Hackathon 2019']
            ]);

            await h.moveCursorBy(3 * h.WEEK_PX_PER_DAY, 0);

            t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Same startDate during drag');
            t.is(tentativeEvent.startDate, new Date(2019, 9, 16), 'Correct startDate during drag');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, [
                [new Date(2019, 9, 16), new Date(2019, 9, 20), 'Hackathon 2019']
            ]);

            await h.drop();

            t.isStrict(h.focusedEventRecord, eventRecord, 'Same event is focused');

            t.is(h.isHovering(el), '', 'Hovering ended');
            t.is(eventRecord.startDate, new Date(2019, 9, 16), 'Correct startDate after drag');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, []);
        });

        t.it('Should allow drag change of startDate back and forward RTL', async t => {
            await h.init(t, { rtl : true });

            const eventRecord = h.eventStore.getById(h.Event.Hackathon);
            const [el, offset] = await h.hoverRight(eventRecord.id);

            t.is(h.isHovering(el), 'right-edge', 'Hovering should be active');

            t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate before drag');

            await h.drag(el, {
                offset,
                by : [h.WEEK_PX_PER_DAY + h.EDGE_OFFSET, 0]
            });

            const { tentativeEvent } = h;

            t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Same startDate during drag');
            t.is(tentativeEvent.startDate, new Date(2019, 9, 13), 'Correct startDate during drag');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, [
                [new Date(2019, 9, 13), new Date(2019, 9, 20), 'Hackathon 2019']
            ]);

            await h.moveCursorBy(-3 * h.WEEK_PX_PER_DAY, 0);

            t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Same startDate during drag');
            t.is(tentativeEvent.startDate, new Date(2019, 9, 16), 'Correct startDate during drag');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, [
                [new Date(2019, 9, 16), new Date(2019, 9, 20), 'Hackathon 2019']
            ]);

            await h.drop();

            t.isStrict(h.focusedEventRecord, eventRecord, 'Same event is focused');

            t.is(h.isHovering(el), '', 'Hovering ended');
            t.is(eventRecord.startDate, new Date(2019, 9, 16), 'Correct startDate after drag');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, []);
        });

        t.it('Should allow drag change of startDate forward and back', async t => {
            await h.init(t);

            const eventRecord = h.eventStore.getById(h.Event.Hackathon);
            const [el, offset] = await h.hoverLeft(eventRecord.id);

            t.is(h.isHovering(el), 'left-edge', 'Hovering should be active');

            t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate before drag');

            await h.drag(el, {
                offset,
                by : [2 * h.WEEK_PX_PER_DAY + h.EDGE_OFFSET, 0]
            });

            const { tentativeEvent } = h;

            t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Same startDate during drag');
            t.is(tentativeEvent.startDate, new Date(2019, 9, 16), 'Correct startDate during drag');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, [
                [new Date(2019, 9, 16), new Date(2019, 9, 20), 'Hackathon 2019']
            ]);

            await h.moveCursorBy(-3 * h.WEEK_PX_PER_DAY, 0);

            t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Same startDate during drag');
            t.is(tentativeEvent.startDate, new Date(2019, 9, 13), 'Correct startDate during drag');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, [
                [new Date(2019, 9, 13), new Date(2019, 9, 20), 'Hackathon 2019']
            ]);

            await h.drop();

            t.is(h.isHovering(el), '', 'Hovering ended');
            t.is(eventRecord.startDate, new Date(2019, 9, 13), 'Correct startDate after drag');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, []);
        });

        t.it('Should allow drag change of startDate forward and back RTL', async t => {
            await h.init(t, { rtl : true });

            const eventRecord = h.eventStore.getById(h.Event.Hackathon);
            const [el, offset] = await h.hoverRight(eventRecord.id);

            t.is(h.isHovering(el), 'right-edge', 'Hovering should be active');

            t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate before drag');

            await h.drag(el, {
                offset,
                by : [-2 * h.WEEK_PX_PER_DAY - h.EDGE_OFFSET, 0]
            });

            const { tentativeEvent } = h;

            t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Same startDate during drag');
            t.is(tentativeEvent.startDate, new Date(2019, 9, 16), 'Correct startDate during drag');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, [
                [new Date(2019, 9, 16), new Date(2019, 9, 20), 'Hackathon 2019']
            ]);

            await h.moveCursorBy(3 * h.WEEK_PX_PER_DAY, 0);

            t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Same startDate during drag');
            t.is(tentativeEvent.startDate, new Date(2019, 9, 13), 'Correct startDate during drag');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, [
                [new Date(2019, 9, 13), new Date(2019, 9, 20), 'Hackathon 2019']
            ]);

            await h.drop();

            t.is(h.isHovering(el), '', 'Hovering ended');
            t.is(eventRecord.startDate, new Date(2019, 9, 13), 'Correct startDate after drag');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, []);
        });

        t.it('Should restrict drag of startDate to endDate', async t => {
            // This test fails in turbo mode.
            t.simulator.setSpeed('speedRun');

            await h.init(t);

            const eventRecord = h.eventStore.getById(h.Event.BeerTime);
            const [el, offset] = await h.hoverLeft(eventRecord.id);

            t.is(h.isHovering(el), 'left-edge', 'Hovering should be active');

            t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate before drag');

            await h.drag(el, {
                offset,
                by : [-1 * h.WEEK_PX_PER_DAY + h.EDGE_OFFSET, 0]
            });

            const { tentativeEvent } = h;

            t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Same startDate during drag');
            t.is(tentativeEvent.startDate, new Date(2019, 9, 13), 'Correct startDate during drag');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, [
                [new Date(2019, 9, 13), new Date(2019, 9, 15), 'Relax and official arrival beer']
            ]);

            await h.moveCursorBy(3 * h.WEEK_PX_PER_DAY, 0);

            t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Same startDate during drag');
            t.is(tentativeEvent.startDate, new Date(2019, 9, 14), 'Correct startDate during drag');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, [
                [new Date(2019, 9, 14), new Date(2019, 9, 15), 'Relax and official arrival beer']
            ]);

            await h.drop();

            t.is(h.isHovering(el), '', 'Hovering ended');
            t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate after drag');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, []);

            t.simulator.setSpeed('turboMode');
        });

        t.it('Should be able to drag endDate', async t => {
            await h.init(t);

            const eventRecord = h.eventStore.getById(h.Event.BeerTime);
            const [el, offset] = await h.hoverRight(h.Event.BeerTime);

            t.is(h.isHovering(el), 'right-edge', 'Hovering should be active');

            t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate before drag');
            t.is(eventRecord.endDate, new Date(2019, 9, 15), 'Correct startDate before drag');

            await h.drag(el, {
                offset,
                by : [2 * h.WEEK_PX_PER_DAY, 0]
            });

            const { tentativeEvent } = h;

            t.is(eventRecord.endDate, new Date(2019, 9, 15), 'Same endDate during drag');
            t.is(tentativeEvent.endDate, new Date(2019, 9, 17), 'Correct endDate during drag');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, [
                [new Date(2019, 9, 14), new Date(2019, 9, 17), 'Relax and official arrival beer']
            ]);

            await h.drop();

            t.is(h.isHovering(el), '', 'Hovering ended');
            t.is(eventRecord.endDate, new Date(2019, 9, 17), 'Correct endDate after drag');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, []);
        });

        t.it('Should be able to drag endDate RTL', async t => {
            await h.init(t, { rtl : true });

            const eventRecord = h.eventStore.getById(h.Event.BeerTime);
            const [el, offset] = await h.hoverLeft(h.Event.BeerTime);

            t.is(h.isHovering(el), 'left-edge', 'Hovering should be active');

            t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate before drag');
            t.is(eventRecord.endDate, new Date(2019, 9, 15), 'Correct startDate before drag');

            await h.drag(el, {
                offset,
                by : [-2 * h.WEEK_PX_PER_DAY, 0]
            });

            const { tentativeEvent } = h;

            t.is(eventRecord.endDate, new Date(2019, 9, 15), 'Same endDate during drag');
            t.is(tentativeEvent.endDate, new Date(2019, 9, 17), 'Correct endDate during drag');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, [
                [new Date(2019, 9, 14), new Date(2019, 9, 17), 'Relax and official arrival beer']
            ]);

            await h.drop();

            t.is(h.isHovering(el), '', 'Hovering ended');
            t.is(eventRecord.endDate, new Date(2019, 9, 17), 'Correct endDate after drag');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, []);
        });

        t.it('Should restrict drag of endDate to startDate', async t => {
            await h.init(t);

            const eventRecord = h.eventStore.getById(h.Event.BeerTime);
            const [el, offset] = await h.hoverRight(h.Event.BeerTime);

            t.is(h.isHovering(el), 'right-edge', 'Hovering should be active');

            t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate before drag');
            t.is(eventRecord.endDate, new Date(2019, 9, 15), 'Correct startDate before drag');

            await h.drag(el, {
                offset,
                by : [2 * h.WEEK_PX_PER_DAY, 0]
            });

            const { tentativeEvent } = h;

            t.is(eventRecord.endDate, new Date(2019, 9, 15), 'Same endDate during drag');
            t.is(tentativeEvent.endDate, new Date(2019, 9, 17), 'Correct endDate during drag');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, [
                [new Date(2019, 9, 14), new Date(2019, 9, 17), 'Relax and official arrival beer']
            ]);

            await h.moveCursorBy(-4 * h.WEEK_PX_PER_DAY + 3 * h.EDGE_OFFSET, 0);

            t.is(eventRecord.endDate, new Date(2019, 9, 15), 'Same endDate during drag');
            t.is(tentativeEvent.endDate, new Date(2019, 9, 15), 'Correct endDate during drag');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, [
                [new Date(2019, 9, 14), new Date(2019, 9, 15), 'Relax and official arrival beer']
            ]);

            await h.drop();

            t.is(h.isHovering(el), '', 'Hovering ended');

            t.is(eventRecord.endDate, new Date(2019, 9, 15), 'Correct endDate after drag');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, []);
        });

        t.it('Should restrict drag of endDate to startDate RTL', async t => {
            await h.init(t, { rtl : true });

            const eventRecord = h.eventStore.getById(h.Event.BeerTime);
            const [el, offset] = await h.hoverLeft(h.Event.BeerTime);

            t.is(h.isHovering(el), 'left-edge', 'Hovering should be active');

            t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate before drag');
            t.is(eventRecord.endDate, new Date(2019, 9, 15), 'Correct startDate before drag');

            await h.drag(el, {
                offset,
                by : [-2 * h.WEEK_PX_PER_DAY, 0]
            });

            const { tentativeEvent } = h;

            t.is(eventRecord.endDate, new Date(2019, 9, 15), 'Same endDate during drag');
            t.is(tentativeEvent.endDate, new Date(2019, 9, 17), 'Correct endDate during drag');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, [
                [new Date(2019, 9, 14), new Date(2019, 9, 17), 'Relax and official arrival beer']
            ]);

            await h.moveCursorBy(4 * h.WEEK_PX_PER_DAY - 3 * h.EDGE_OFFSET, 0);

            t.is(eventRecord.endDate, new Date(2019, 9, 15), 'Same endDate during drag');
            t.is(tentativeEvent.endDate, new Date(2019, 9, 15), 'Correct endDate during drag');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, [
                [new Date(2019, 9, 14), new Date(2019, 9, 15), 'Relax and official arrival beer']
            ]);

            await h.drop();

            t.is(h.isHovering(el), '', 'Hovering ended');

            t.is(eventRecord.endDate, new Date(2019, 9, 15), 'Correct endDate after drag');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, []);
        });

        t.it('should abort drag operation on ESC keypress', async t => {
            await h.init(t);

            const eventRecord = h.eventStore.getById(h.Event.Hackathon);
            const [el, offset] = await h.hoverLeft(eventRecord.id);

            const { startDate, endDate } = eventRecord;

            await h.drag(el, {
                offset,
                by : [-1 * h.WEEK_PX_PER_DAY + h.EDGE_OFFSET, 0]
            });

            t.ok(t.isDragging(), 'Dragging is active');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, [
                [new Date(2019, 9, 13), new Date(2019, 9, 20), 'Hackathon 2019']
            ]);

            await t.type(null, '[ESC]');
            t.notOk(t.isDragging(), 'Dragging is not active');

            t.is(startDate, eventRecord.startDate, 'Same startDate');
            t.is(endDate, eventRecord.endDate, 'Same endDate');

            tentativeDates = h.getTentativeDates();

            t.isDeeply(tentativeDates, []);
        });

        t.describe('Page scrolled', t => {
            t.beforeEach(() => {
                t.enablePageScroll();
            });

            t.it('should drag when body is scrolled', async t => {
                await h.init(t);

                await h.moveCursorTo([300, 300]);  // move the cursor away so we get the mouse entry

                const eventRecord = h.eventStore.getById(h.Event.Hackathon);
                const [el, offset] = await h.hoverLeft(eventRecord.id);

                await t.waitFor(() => h.isHovering(el) === 'left-edge');

                t.is(h.isHovering(el), 'left-edge', 'Hovering should be active');

                t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate before drag');

                await h.drag(el, {
                    offset,
                    by : [-1 * h.WEEK_PX_PER_DAY + h.EDGE_OFFSET, 0]
                });

                const { tentativeEvent } = h;

                t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Same startDate during drag');
                t.is(tentativeEvent.startDate, new Date(2019, 9, 13), 'Correct startDate during drag');

                tentativeDates = h.getTentativeDates();

                t.isDeeply(tentativeDates, [
                    [new Date(2019, 9, 13), new Date(2019, 9, 20), 'Hackathon 2019']
                ]);

                await h.moveCursorBy(3 * h.WEEK_PX_PER_DAY, 0);

                t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Same startDate during drag');
                t.is(tentativeEvent.startDate, new Date(2019, 9, 16), 'Correct startDate during drag');

                tentativeDates = h.getTentativeDates();

                t.isDeeply(tentativeDates, [
                    [new Date(2019, 9, 16), new Date(2019, 9, 20), 'Hackathon 2019']
                ]);

                await h.drop();

                t.is(h.isHovering(el), '', 'Hovering ended');
                t.is(eventRecord.startDate, new Date(2019, 9, 16), 'Correct startDate after drag');

                tentativeDates = h.getTentativeDates();

                t.isDeeply(tentativeDates, []);
            });
        });
    });

    t.describe('Day Detail', t => {
        // We only test recurrence editing since DayView tested other stuff...
        t.beforeEach(t => {
            h = t.setupWeekViewDragHarness();
        });

        t.it('Should drag recurring event and do nothing if cancelled', async t => {
            await h.init(t, {
                modes : {
                    week : {
                        visibleStartTime : 4
                    }
                }
            });

            const eventRecord = h.eventStore.getById(h.Event.Breakfast);

            t.is(eventRecord.startDate, new Date(2019, 9, 15, 9), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 15, 10), 'Correct endDate');

            const [el, offset] = await h.hoverTop(eventRecord.id);

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
            await h.init(t, {
                modes : {
                    week : {
                        visibleStartTime : 4
                    }
                }
            });

            const eventRecord = h.eventStore.getById(h.Event.Breakfast);

            t.is(eventRecord.startDate, new Date(2019, 9, 15, 9), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 15, 10), 'Correct endDate');

            const [el, offset] = await h.hoverTop(eventRecord.id);

            await h.drag(el, {
                offset,
                by : [0, -h.DAY_PX_PER_HOUR - 6]
            });

            await h.drop();

            const confirm = await t.recurrenceEditConfirmation();

            await confirm.yes();

            t.ok(eventRecord.isModified, 'Record was changed');
            t.is(eventRecord.startDate, new Date(2019, 9, 15, 8), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 15, 10), 'Correct endDate');
        });

        t.it('Should drag occurrence and do nothing if cancelled', async t => {
            await h.init(t, {
                modes : {
                    week : {
                        visibleStartTime : 4
                    }
                }
            });

            let eventRecord = h.eventStore.getById(h.Event.Breakfast);

            eventRecord = eventRecord.occurrences[1];

            t.is(eventRecord.startDate, new Date(2019, 9, 17, 9), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 17, 10), 'Correct endDate');

            const [el, offset] = await h.hoverTop(eventRecord.id);

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
            await h.init(t, {
                modes : {
                    week : {
                        visibleStartTime : 4
                    }
                }
            });

            let eventRecord = h.eventStore.getById(h.Event.Breakfast);

            eventRecord = eventRecord.occurrences[1];

            t.is(eventRecord.startDate, new Date(2019, 9, 17, 9), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 17, 10), 'Correct endDate');

            const [el, offset] = await h.hoverTop(eventRecord.id);

            await h.drag(el, {
                offset,
                by : [0, -h.DAY_PX_PER_HOUR - 6]
            });

            await h.drop();

            const confirm = await t.occurrenceEditConfirmation();

            await confirm.allFutureEvents();

            t.is(eventRecord.startDate, new Date(2019, 9, 17, 8), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 17, 10), 'Correct endDate');
        });

        t.it('Should drag occurrence and modify only that event', async t => {
            await h.init(t, {
                modes : {
                    week : {
                        visibleStartTime : 4
                    }
                }
            });

            let eventRecord = h.eventStore.getById(h.Event.Breakfast);

            eventRecord = eventRecord.occurrences[1];

            t.is(eventRecord.startDate, new Date(2019, 9, 17, 9), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 17, 10), 'Correct endDate');

            const [el, offset] = await h.hoverTop(eventRecord.id);

            await h.drag(el, {
                offset,
                by : [0, -h.DAY_PX_PER_HOUR - 6]
            });

            await h.drop();

            const confirm = await t.occurrenceEditConfirmation();

            await confirm.onlyThisEvent();

            t.is(eventRecord.startDate, new Date(2019, 9, 17, 8), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 17, 10), 'Correct endDate');
        });

        t.it('should not revert focus or change scroll on event click after resize', async t => {
            // https://github.com/bryntum/support/issues/2978
            await h.init(t, { height : 500 });

            h.calendar.modes.week.eventSpacing = 0;

            const scrollable = h.calendar.modes.week.scrollable;

            scrollable.y = scrollable.maxY;

            await t.waitForAnimations();

            const eventRecord = h.eventStore.getById(h.Event.SplitJS);

            t.is(eventRecord.startDate, new Date(2019, 9, 19, 18), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 19, 21), 'Correct endDate');

            const [el, offset] = await h.hoverBottom(eventRecord.id);

            await h.drag(el, {
                offset,
                by : [0, h.DAY_PX_PER_HOUR + 3]
            });

            await h.drop();

            t.is(eventRecord.startDate, new Date(2019, 9, 19, 18), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 19, 22), 'Correct endDate');

            await t.waitForAnimations();
            await t.waitForAnimationFrame();

            scrollable.y = 200;

            await t.waitForAnimations();

            const [breakfastEl] = await t.waitForSelector('.b-cal-event:contains(Breakfast)');

            await t.click(breakfastEl);
            await t.waitForAnimations();

            t.is(scrollable.y, 200, 'No change in scroll');
            t.ok(document.activeElement.contains(breakfastEl), 'Focus stays on clicked event');
        });

        t.it('Should scroll the view when dragging close to the edge', async t => {
            await h.init(t, {
                mode   : 'week',
                date   : new Date(2021, 5, 2),
                events : [
                    { id : 1, startDate : '2021-06-02T08:00:00', endDate : '2021-06-02T10:00:00', name : 'Event 1' }
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

            let [source, sourceOffset] = await h.hoverBottom(1);

            //#region Drag event to the bottom edge

            await t.dragTo({
                source,
                sourceOffset,
                target       : overflowElement,
                targetOffset : ['50%', '100%-30'],
                dragOnly     : true
            });

            // Wait until element is scrolled to the bottom
            await t.waitFor(() => !calendar.scrollManager.isScrolling);

            await t.mouseUp(overflowElement, null, ['50%', `100%-${activeView.hourHeight * 2}`]);

            t.is(event.endDate, new Date(2021, 5, 2, 22), 'End date is ok');

            //#endregion

            await calendar.activeView.scrollTo(6);

            ([source, sourceOffset] = await h.hoverTop(1));

            await t.dragTo({
                source,
                sourceOffset,
                target       : overflowElement,
                targetOffset : ['50%', 30],
                dragOnly     : true
            });

            await t.waitFor(() => !calendar.scrollManager.isScrolling);

            await t.mouseUp(overflowElement, null, ['50%', activeView.hourHeight]);

            t.is(event.startDate, new Date(2021, 5, 2, 1), 'Start date is ok');
        });

        t.it('Should drag start date into previous day', async t => {
            await h.init(t, {
                modes : {
                    week : {
                        visibleStartTime : 4
                    }
                }
            });

            const eventRecord = h.eventStore.getById(h.Event.TeamScrum);

            t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Correct endDate');

            const [el, offset] = await h.hoverTop(eventRecord.id);

            await h.drag(el, {
                offset,
                by : [-h.WEEK_PX_PER_DAY, -h.DAY_PX_PER_HOUR - offset[1]]
            });

            tentativeDates = h.getTentativeDates(false);

            t.isDeeply(tentativeDates, [
                [new Date(2019, 9, 14), new Date(2019, 9, 16), ''],
                [new Date(2019, 9, 14, 9), new Date(2019, 9, 15), '9 AMTeam Scrum'],
                [new Date(2019, 9, 15), new Date(2019, 9, 15, 12), '9 AMTeam Scrum12 PM']
            ]);

            await h.drop();

            t.is(eventRecord.startDate, new Date(2019, 9, 14, 9), 'Correct startDate after drag');
        });

        t.it('Should drag start date into previous day RTL', async t => {
            await h.init(t, {
                rtl   : true,
                modes : {
                    week : {
                        visibleStartTime : 4
                    }
                }
            });

            const eventRecord = h.eventStore.getById(h.Event.TeamScrum);

            t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Correct endDate');

            const [el, offset] = await h.hoverTop(eventRecord.id);

            await h.drag(el, {
                offset,
                by : [h.WEEK_PX_PER_DAY, -h.DAY_PX_PER_HOUR - offset[1]]
            });

            tentativeDates = h.getTentativeDates(false);

            t.isDeeply(tentativeDates, [
                [new Date(2019, 9, 14), new Date(2019, 9, 16), ''],
                [new Date(2019, 9, 14, 9), new Date(2019, 9, 15), '9 AMTeam Scrum'],
                [new Date(2019, 9, 15), new Date(2019, 9, 15, 12), '9 AMTeam Scrum12 PM']
            ]);

            await h.drop();

            t.is(eventRecord.startDate, new Date(2019, 9, 14, 9), 'Correct startDate after drag');
        });

        t.it('Should drag end date into next day', async t => {
            await h.init(t, {
                modes : {
                    week : {
                        visibleStartTime : 4
                    }
                }
            });

            const eventRecord = h.eventStore.getById(h.Event.TeamScrum);

            t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Correct endDate');

            const [el, offset] = await h.hoverBottom(eventRecord.id);

            await h.drag(el, {
                offset,
                by : [h.WEEK_PX_PER_DAY, -(h.DAY_PX_PER_HOUR * 4) + Number(/-(\d)/.exec(offset[1])[1])]
            });

            tentativeDates = h.getTentativeDates(false);

            t.isDeeply(tentativeDates, [
                [new Date(2019, 9, 15), new Date(2019, 9, 17), ''],
                [new Date(2019, 9, 15, 10), new Date(2019, 9, 16), '10 AMTeam Scrum'],
                [new Date(2019, 9, 16), new Date(2019, 9, 16, 8), '10 AMTeam Scrum8 AM']
            ]);

            await h.drop();

            t.is(eventRecord.endDate, new Date(2019, 9, 16, 8), 'Correct startDate after drag');
        });

        t.it('Should drag end date into next day RTL', async t => {
            await h.init(t, {
                rtl   : true,
                modes : {
                    week : {
                        visibleStartTime : 4
                    }
                }
            });

            const eventRecord = h.eventStore.getById(h.Event.TeamScrum);

            t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Correct endDate');

            const [el, offset] = await h.hoverBottom(eventRecord.id);

            await h.drag(el, {
                offset,
                by : [-h.WEEK_PX_PER_DAY, -(h.DAY_PX_PER_HOUR * 4) + Number(/-(\d)/.exec(offset[1])[1])]
            });

            tentativeDates = h.getTentativeDates(false);

            t.isDeeply(tentativeDates, [
                [new Date(2019, 9, 15), new Date(2019, 9, 17), ''],
                [new Date(2019, 9, 15, 10), new Date(2019, 9, 16), '10 AMTeam Scrum'],
                [new Date(2019, 9, 16), new Date(2019, 9, 16, 8), '10 AMTeam Scrum8 AM']
            ]);

            await h.drop();

            t.is(eventRecord.endDate, new Date(2019, 9, 16, 8), 'Correct startDate after drag');
        });
    });

    t.describe('Support tickets', t => {
        let calendar;

        t.beforeEach(() => {
            calendar = calendar?.destroy();
        });

        // https://github.com/bryntum/support/issues/4220
        t.it('should work correctly on DST day', async t => {

            // Technically, the bug only happened on drag create (since move/resize are based on deltas not the absolute
            // date calculated from y-coordinate... but better safe than sorry.

            const [springDSTDate, autumnDSTDate] = t.getDSTDates(2022);

            if (!springDSTDate) {
                t.pass('Current timezone does not have DST');
                return;
            }

            const nextDay = DateHelper.add(autumnDSTDate, 1, 'day');

            calendar = await t.getCalendar({
                date       : autumnDSTDate,
                mode       : 'week',
                eventStore : {
                    data : [{
                        id        : 'derp',
                        name      : 'Derp',
                        startDate : `${DateHelper.format(autumnDSTDate, 'YYYY-MM-DD')} 09:00`,
                        endDate   : `${DateHelper.format(autumnDSTDate, 'YYYY-MM-DD')} 11:00`
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

            // Turbo mode outruns the Calendar in this test
            t.simulator.setSpeed('speedRun');

            const HR = calendar.modes.week.hourHeight;

            t.selectorExists(`.b-weekview [data-event-id="derp"]:regex(9\\sAM)`, 'Correct start on DST day');

            await t.moveCursorTo({
                target : '.b-weekview [data-event-id="derp"]',
                offset : ['50%', '100%-5px']
            });

            await t.dragBy({
                source   : `.b-weekview [data-event-id="derp"] .b-gripper-horz`,
                delta    : [0, HR * 2 + 10],
                dragOnly : true
            });

            t.selectorExists(`.b-weekview .b-cal-tentative-event:regex(9\\sAM)`, 'Correct drag start on DST day');
            t.selectorExists(`.b-weekview .b-cal-tentative-event:regex(1\\sPM)`, 'Correct drag end on DST day');

            await t.mouseUp();

            const derpRect = t.rect('.b-weekview [data-event-id="derp"]');

            t.isApproxPx(derpRect.height, 4 * HR, 'Correct event height after drop end');

            await t.moveCursorTo({
                target : '.b-weekview [data-event-id="derp"]',
                offset : ['50%', '5px']
            });

            await t.dragBy({
                source   : `.b-weekview [data-event-id="derp"] .b-gripper-horz`,
                delta    : [0, -HR - 10],
                dragOnly : true
            });

            t.selectorExists(`.b-weekview .b-cal-tentative-event:regex(8\\sAM)`, 'Correct drag start on DST day');
            t.selectorExists(`.b-weekview .b-cal-tentative-event:regex(1\\sPM)`, 'Correct drag end on DST day');

            await t.mouseUp();

            const derpRect2 = t.rect('.b-weekview [data-event-id="derp"]');

            t.isApprox(derpRect2.height, 5 * HR, 'Correct event height after drop start');

            // Also make sure the day after DST day works as expected:

            t.selectorExists(`.b-weekview [data-event-id="woot"]:regex(8\\sAM)`, 'Correct start on DST day');

            await t.moveCursorTo({
                target : '.b-weekview [data-event-id="woot"]',
                offset : ['50%', '100%-5px']
            });

            await t.dragBy({
                source   : `.b-weekview [data-event-id="woot"] .b-gripper-horz`,
                delta    : [0, HR * 2 + 10],
                dragOnly : true
            });

            t.selectorExists(`.b-weekview .b-cal-tentative-event:regex(8\\sAM)`, 'Correct drag start on DST day');
            t.selectorExists(`.b-weekview .b-cal-tentative-event:regex(12\\sPM)`, 'Correct drag end on DST day');

            await t.mouseUp();

            const wootRect = t.rect('.b-weekview [data-event-id="woot"]');

            t.isApproxPx(wootRect.height, 4 * HR, 'Correct event height after drop');

            await t.moveCursorTo({
                target : '.b-weekview [data-event-id="woot"]',
                offset : ['50%', '5px']
            });

            await t.dragBy({
                source   : `.b-weekview [data-event-id="woot"] .b-gripper-horz`,
                delta    : [0, -HR - 10],
                dragOnly : true
            });

            t.selectorExists(`.b-weekview .b-cal-tentative-event:regex(7\\sAM)`, 'Correct drag start on DST day');
            t.selectorExists(`.b-weekview .b-cal-tentative-event:regex(12\\sPM)`, 'Correct drag end on DST day');

            await t.mouseUp();

            const wootRect2 = t.rect('.b-weekview [data-event-id="woot"]');

            t.isApprox(wootRect2.height, 5 * HR, 'Correct event height after drop');

            t.simulator.setSpeed('turboMode');
        });
    });
});
