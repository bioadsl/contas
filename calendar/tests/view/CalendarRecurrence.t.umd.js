
StartTest(t => {

    let calendar, eventStore, resourceStore, harness;

    async function getCalendar(config) {
        const calendar = await t.getCalendar(config);
        eventStore = calendar.eventStore;
        resourceStore = calendar.resourceStore;
        return calendar;
    }

    t.beforeEach(function() {

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
        calendar?.destroy();

        // Check that none of the floating things are persisting
        if (t.query('.b-overflowpopup,.b-sch-event-tooltip,.b-eventeditor').length > 0) {
            t.selectorNotExists('.b-overflowpopup:visible');
            t.selectorNotExists('.b-sch-event-tooltip');
            t.selectorNotExists('.b-eventeditor');
        }
    });

    t.it('Recurring event start correction', async t => {
        eventStore = new EventStore({
            data : [
                {
                    id             : 1,
                    startDate      : '2020-01-01T10:00',
                    endDate        : '2020-01-01T11:00',
                    name           : 'Twice Weekly scrum',
                    room           : 2,
                    recurrenceRule : 'FREQ=WEEKLY;BYDAY=TU,TH',
                    resourceId     : 'bryntum'
                },
                {
                    id             : 2,
                    startDate      : '2020-01-01T09:00',
                    endDate        : '2020-01-01T12:00',
                    name           : 'Board meeting',
                    room           : 1,
                    recurrenceRule : 'FREQ=MONTHLY;BYDAY=MO;BYSETPOS=1',
                    resourceId     : 'bryntum'
                },
                {
                    id             : 3,
                    startDate      : '2020-01-01T17:30',
                    endDate        : '2020-01-01T18:30',
                    name           : 'Happy hour',
                    room           : 4,
                    recurrenceRule : 'FREQ=WEEKLY;BYDAY=FR',
                    resourceId     : 'bryntum'
                }
            ]
        });

        resourceStore = new ResourceStore({
            data : []
        });

        calendar = await getCalendar({
            date    : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            sidebar : false,
            modes   : {
                agenda : null,
                year   : null,
                week   : null,
                day    : null,
                month  : {
                    date : new Date(2020, 1, 15)
                }
            }
        });

        t.selectorCountIs('.b-cal-event', 20, 'Correct occurrence count');

        // Scrums all there
        t.selectorExists('.b-calendar-cell[data-date="2020-01-28"] :contains(Twice Weekly scrum)');
        t.selectorExists('.b-calendar-cell[data-date="2020-01-30"] :contains(Twice Weekly scrum)');
        t.selectorExists('.b-calendar-cell[data-date="2020-02-04"] :contains(Twice Weekly scrum)');
        t.selectorExists('.b-calendar-cell[data-date="2020-02-06"] :contains(Twice Weekly scrum)');
        t.selectorExists('.b-calendar-cell[data-date="2020-02-11"] :contains(Twice Weekly scrum)');
        t.selectorExists('.b-calendar-cell[data-date="2020-02-13"] :contains(Twice Weekly scrum)');
        t.selectorExists('.b-calendar-cell[data-date="2020-02-18"] :contains(Twice Weekly scrum)');
        t.selectorExists('.b-calendar-cell[data-date="2020-02-20"] :contains(Twice Weekly scrum)');
        t.selectorExists('.b-calendar-cell[data-date="2020-02-25"] :contains(Twice Weekly scrum)');
        t.selectorExists('.b-calendar-cell[data-date="2020-02-27"] :contains(Twice Weekly scrum)');
        t.selectorExists('.b-calendar-cell[data-date="2020-03-03"] :contains(Twice Weekly scrum)');
        t.selectorExists('.b-calendar-cell[data-date="2020-03-05"] :contains(Twice Weekly scrum)');

        // Board meetings all there
        t.selectorExists('.b-calendar-cell[data-date="2020-02-03"] :contains(Board meeting)');
        t.selectorExists('.b-calendar-cell[data-date="2020-03-02"] :contains(Board meeting)');

        // Happy hours all there
        t.selectorExists('.b-calendar-cell[data-date="2020-01-31"] :contains(Happy hour)');
        t.selectorExists('.b-calendar-cell[data-date="2020-02-07"] :contains(Happy hour)');
        t.selectorExists('.b-calendar-cell[data-date="2020-02-14"] :contains(Happy hour)');
        t.selectorExists('.b-calendar-cell[data-date="2020-02-21"] :contains(Happy hour)');
        t.selectorExists('.b-calendar-cell[data-date="2020-02-28"] :contains(Happy hour)');
        t.selectorExists('.b-calendar-cell[data-date="2020-03-06"] :contains(Happy hour)');

        t.click('[data-ref="prevButton"]');

        t.chain(
            { waitForSelector : '.b-calendar-cell[data-date="2020-01-02"] :contains(Twice Weekly scrum)' },

            async() => {
                t.selectorCountIs('.b-cal-event', 19, 'Correct occurrence count');

                // Scrums all there
                t.selectorExists('.b-calendar-cell[data-date="2020-01-02"] :contains(Twice Weekly scrum)');
                t.selectorExists('.b-calendar-cell[data-date="2020-01-07"] :contains(Twice Weekly scrum)');
                t.selectorExists('.b-calendar-cell[data-date="2020-01-09"] :contains(Twice Weekly scrum)');
                t.selectorExists('.b-calendar-cell[data-date="2020-01-14"] :contains(Twice Weekly scrum)');
                t.selectorExists('.b-calendar-cell[data-date="2020-01-16"] :contains(Twice Weekly scrum)');
                t.selectorExists('.b-calendar-cell[data-date="2020-01-21"] :contains(Twice Weekly scrum)');
                t.selectorExists('.b-calendar-cell[data-date="2020-01-23"] :contains(Twice Weekly scrum)');
                t.selectorExists('.b-calendar-cell[data-date="2020-01-28"] :contains(Twice Weekly scrum)');
                t.selectorExists('.b-calendar-cell[data-date="2020-01-30"] :contains(Twice Weekly scrum)');
                t.selectorExists('.b-calendar-cell[data-date="2020-02-04"] :contains(Twice Weekly scrum)');
                t.selectorExists('.b-calendar-cell[data-date="2020-02-06"] :contains(Twice Weekly scrum)');

                // Board meetings all there
                t.selectorExists('.b-calendar-cell[data-date="2020-01-06"] :contains(Board meeting)');
                t.selectorExists('.b-calendar-cell[data-date="2020-02-03"] :contains(Board meeting)');

                // Happy hours all there
                t.selectorExists('.b-calendar-cell[data-date="2020-01-03"] :contains(Happy hour)');
                t.selectorExists('.b-calendar-cell[data-date="2020-01-10"] :contains(Happy hour)');
                t.selectorExists('.b-calendar-cell[data-date="2020-01-17"] :contains(Happy hour)');
                t.selectorExists('.b-calendar-cell[data-date="2020-01-24"] :contains(Happy hour)');
                t.selectorExists('.b-calendar-cell[data-date="2020-01-31"] :contains(Happy hour)');
                t.selectorExists('.b-calendar-cell[data-date="2020-02-07"] :contains(Happy hour)');
            },

            // No error must be thrown is there's no sidebar which there isn't in this test.
            { click : 'button[data-ref="todayButton"]' }
        );
    });

    t.it('Single recurring event', async t => {
        eventStore = new EventStore({
            data : [
                {
                    name           : 'New event',
                    allDay         : 1,
                    startDate      : '2019-10-07T05:00:00.000',
                    endDate        : '2019-10-10T05:00:00.000',
                    durationUnit   : 'd',
                    duration       : 3,
                    recurrenceRule : 'FREQ=WEEKLY;COUNT=3'
                }
            ]
        });

        resourceStore = new ResourceStore({
            data : []
        });

        calendar = await getCalendar({
            date    : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            sidebar : false,
            modes   : {
                agenda : null,
                year   : null,
                week   : null,
                day    : null,
                month  : true
            }
        });
        t.selectorCountIs('.b-calendar-cell .b-cal-event', 12, 'It\'s a 4 day event occurring 3 times');

        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-07"] .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-08"] .b-overflow .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-09"] .b-overflow .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-10"] .b-overflow .b-cal-event', 1);

        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-14"] .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-15"] .b-overflow .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-16"] .b-overflow .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-17"] .b-overflow .b-cal-event', 1);

        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-21"] .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-22"] .b-overflow .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-23"] .b-overflow .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-24"] .b-overflow .b-cal-event', 1);
    });

    t.it('Single recurring event with deletion of all', async t => {
        eventStore = new EventStore({
            data : [
                {
                    name           : 'New event',
                    allDay         : 1,
                    startDate      : '2019-10-07T05:00:00.000',
                    endDate        : '2019-10-10T05:00:00.000',
                    durationUnit   : 'd',
                    duration       : 3,
                    recurrenceRule : 'FREQ=WEEKLY;COUNT=3'
                }
            ]
        });

        resourceStore = new ResourceStore({
            data : []
        });

        calendar = await getCalendar({
            date     : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            sidebar  : false,
            features : {
                eventTooltip : {
                    showOn : 'click'
                }
            },
            modes : {
                agenda : null,
                year   : null,
                week   : null,
                day    : null,
                month  : true
            }
        });
        t.selectorCountIs('.b-calendar-cell .b-cal-event', 12, 'It\'s a 4 day event occurring 3 times');

        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-07"] .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-08"] .b-overflow .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-09"] .b-overflow .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-10"] .b-overflow .b-cal-event', 1);

        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-14"] .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-15"] .b-overflow .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-16"] .b-overflow .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-17"] .b-overflow .b-cal-event', 1);

        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-21"] .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-22"] .b-overflow .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-23"] .b-overflow .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-24"] .b-overflow .b-cal-event', 1);

        t.chain(
            { click : '.b-calendar-cell[data-date="2019-10-07"] .b-cal-event' },

            { click : '.b-tool[data-ref="delete"]' },

            async() => {
                t.selectorCountIs('.b-calendar-cell .b-cal-event', 12, 'Not deleted yet');
            },

            { click : 'button[data-ref="changeMultipleButton"]' },

            { waitForSelectorNotFound : '.b-calendar-cell .b-cal-event' },

            () => {
                t.selectorCountIs('.b-calendar-cell .b-cal-event', 0, 'All deleted');
            }
        );
    });

    t.it('Single recurring event with deletion of one occurrence', async t => {
        eventStore = new EventStore({
            data : [
                {
                    name           : 'New event',
                    allDay         : 1,
                    startDate      : '2019-10-07T05:00:00.000',
                    endDate        : '2019-10-10T05:00:00.000',
                    durationUnit   : 'd',
                    duration       : 3,
                    recurrenceRule : 'FREQ=WEEKLY;COUNT=3'
                }
            ]
        });

        resourceStore = new ResourceStore({
            data : []
        });

        calendar = await getCalendar({
            date     : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            sidebar  : false,
            features : {
                eventTooltip : {
                    showOn : 'click'
                }
            },
            modes : {
                agenda : null,
                year   : null,
                week   : null,
                day    : null,
                month  : true
            }
        });
        t.selectorCountIs('.b-calendar-cell .b-cal-event', 12, 'It\'s a 4 day event occurring 3 times');

        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-07"] .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-08"] .b-overflow .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-09"] .b-overflow .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-10"] .b-overflow .b-cal-event', 1);

        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-14"] .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-15"] .b-overflow .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-16"] .b-overflow .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-17"] .b-overflow .b-cal-event', 1);

        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-21"] .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-22"] .b-overflow .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-23"] .b-overflow .b-cal-event', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-24"] .b-overflow .b-cal-event', 1);

        t.chain(
            { click : '.b-calendar-cell[data-date="2019-10-14"] .b-cal-event' },

            { click : '.b-tool[data-ref="delete"]' },

            async() => {
                t.selectorCountIs('.b-calendar-cell .b-cal-event', 12, 'Not deleted yet');
            },

            { click : 'button[data-ref="changeSingleButton"]' },

            { waitFor : () => calendar.modes.month.element.querySelectorAll('.b-calendar-cell .b-cal-event').length === 8 },

            () => {
                t.selectorCountIs('.b-calendar-cell .b-cal-event', 8, 'One occurrence deleted');
            }
        );
    });

    t.it('Recurring events which have not yet had occurrences calculated should be mutable', async t => {
        eventStore = new EventStore({
            data : [{
                id             : 'twice-weekly',
                name           : 'Recurring Meeting',
                recurrenceRule : 'FREQ=WEEKLY;BYDAY=TU,TH',

                // It started a while back and is still going
                startDate : new Date(2010, 9, 5, 13)
            }]
        });

        resourceStore = new ResourceStore({
            data : []
        });

        // Bug was an error throw.
        t.livesOk(() => {
            eventStore.first.name = 'Changed';
        });
    });

    // https://github.com/bryntum/support/issues/4434
    t.it('Should show delete-recurring popup when deleting using event context menu', async t => {
        eventStore = new EventStore({
            data : [
                {
                    name           : 'New event',
                    allDay         : 1,
                    startDate      : '2019-10-07T05:00:00.000',
                    endDate        : '2019-10-10T05:00:00.000',
                    durationUnit   : 'd',
                    duration       : 3,
                    recurrenceRule : 'FREQ=WEEKLY;COUNT=3'
                }
            ]
        });

        calendar = await getCalendar({
            date     : new Date(2019, 9, 14),
            eventStore,
            sidebar  : false,
            features : {
                eventMenu : true
            },
            modes : {
                agenda : null,
                year   : null,
                week   : null,
                day    : null,
                month  : true
            }
        });

        await t.rightClick('.b-cal-event');
        await t.click('.b-menuitem:contains(Delete)');

        await t.waitForSelector('.b-recurrenceconfirmationpopup .b-header-title:contains(You are deleting an event)');

        await t.click('button:contains(Yes)');

        await t.waitForSelectorNotFound('.b-cal-event');
    });
});
