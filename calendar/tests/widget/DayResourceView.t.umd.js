
StartTest(t => {

    let calendar, calElement, dayResourceView;

    t.beforeEach(t => calendar?.destroy?.());

    function checkDayResourceViewSanity() {
        const
            dayHeaders  = Array.from(calElement.querySelectorAll('.b-cal-cell-header')),
            allDayCells = Array.from(calElement.querySelectorAll('.b-dayresourcecalendarrow-column')),
            dayCells    = Array.from(calElement.querySelectorAll('.b-dayresourceview-column'));

        // Days all same width
        t.elementsEqual(dayHeaders.map(e => e.getBoundingClientRect().width), allDayCells.map(e => e.getBoundingClientRect().width), 0.5);
        t.elementsEqual(dayHeaders.map(e => e.getBoundingClientRect().width), dayCells.map(e => e.getBoundingClientRect().width), 0.5);

        const
            resourceHeaders = Array.from(calElement.querySelectorAll('.b-dayresourcecalendarrow-resource-header')),
            allDayResourceCells = Array.from(calElement.querySelectorAll('.b-resourcecalendarrow-column-resource-cell')),
            dayViewResourceCells = Array.from(calElement.querySelectorAll('.b-dayview-day-detail'));

        // Resources all same width
        t.elementsEqual(resourceHeaders.map(e => Rectangle.inner(e).width), allDayResourceCells.map(e => Rectangle.inner(e).width), 1);
        t.elementsEqual(allDayResourceCells.map(e => Rectangle.inner(e).width), dayViewResourceCells.map(e => Rectangle.inner(e).width), 0.5);
    }

    async function setup(config = {}) {
        calendar = await t.getCalendar(ObjectHelper.merge({
            date : new Date(2019, 9, 14),

            resourceImagePath : '../examples/_shared/images/users/',

            modes : {
                day         : null,
                week        : null,
                month       : null,
                year        : null,
                agenda      : null,
                dayresource : {
                    range : '1w'
                }
            },

            resources : t.getHackathonData().resources.rows,
            events    : t.getHackathonData().events.rows
        }, config));

        calElement = calendar.element;
        dayResourceView = calendar.modes.dayresource;

        await t.waitForAnimations();

        checkDayResourceViewSanity();

        if (!dayResourceView.minResourceWidth) {
            t.selectorCountIs('.b-dayresourcecalendarrow-resource-header .b-resource-avatar:visible', 0);
        }
    }

    t.it('sanity', async t => {
        await setup();

        calendar.activeView.minResourceWidth = 100;

        checkDayResourceViewSanity();

        await t.waitForAnimationFrame();

        t.selectorCountIs('.b-dayresourcecalendarrow-resource-header .b-resource-avatar:visible', 21);
    });

    t.it('Interaction', async t => {
        await setup({
            modeDefaults : {
                minResourceWidth : 100
            }
        });

        const nextDate = new Date(calendar.date);
        nextDate.setDate(15);

        await t.click('.b-dayresource-allday.b-cal-cell-header[data-header-date="2019-10-15"] .b-day-name-date');

        // Clicking the day header should set the date of interest
        t.is(calendar.date, nextDate);

        await t.click('.b-resourcefilter .b-list-item[data-id="bryntum"]');

        await t.waitForAnimationFrame();

        t.selectorCountIs('.b-dayresourcecalendarrow-resource-header .b-resource-avatar:visible', 14);

        await t.click('.b-resourcefilter .b-list-item[data-id="hotel"]');

        await t.waitForAnimationFrame();

        t.selectorCountIs('.b-dayresourcecalendarrow-resource-header .b-resource-avatar:visible', 7);

        await t.click('.b-resourcefilter .b-list-item[data-id="mats"]');

        await t.waitForAnimationFrame();

        t.selectorCountIs('.b-dayresourcecalendarrow-resource-header .b-resource-avatar:visible', 0);

        // With no cells, day height must be maintained.
        t.is(dayResourceView.dayContainerElement.offsetHeight, dayResourceView.hourHeight * 24);

        // Drag must have no effect with no resource for the drag defined.
        let listenerRemover = calendar.features.drag.on('dragStart', () => t.fail('Should not start drag if no resources available'));
        await t.dragBy({
            source : '.b-dayresourceview-column[data-date="2019-10-14"]',
            offset : ['50%', dayResourceView.hourHeight * 9],
            delta  : [0, dayResourceView.hourHeight * 2]
        });
        listenerRemover();

        // Dblclick must have no effect with no resource for the drag defined.
        listenerRemover = dayResourceView.on('beforeAutoCreate', () => t.fail('Should not autoCreate if no resources available'));
        await t.doubleClick('.b-dayresourceview-column[data-date="2019-10-14"]', null, null, null, ['50%', dayResourceView.hourHeight * 9]);
        listenerRemover();

        await t.click('.b-resourcefilter .b-list-item[data-id="bryntum"]');
        await t.click('.b-resourcefilter .b-list-item[data-id="hotel"]');
        await t.click('.b-resourcefilter .b-list-item[data-id="mats"]');

        await t.waitForAnimationFrame();

        t.selectorCountIs('.b-dayresourcecalendarrow-resource-header .b-resource-avatar:visible', 21);

        dayResourceView.hideNonWorkingDays = true;

        await t.waitForAnimationFrame();

        t.selectorCountIs('.b-dayresourcecalendarrow-resource-header .b-resource-avatar:visible', 15);

        // Hackathon goes on all week, just for bryntum
        t.selectorCountIs('.b-cal-event-wrap.b-allday[data-event-id="1"]', 5);

        // These are for one day only
        t.selectorCountIs('.b-cal-event-wrap.b-allday[data-event-id="3"]', 1);
        t.selectorCountIs('.b-cal-event-wrap.b-allday[data-event-id="23"]', 1);

        await t.dragBy({
            source : '.b-dayview-day-detail[data-resource-id="bryntum"]',
            offset : ['50%', dayResourceView.hourHeight * 9],
            delta  : [0, dayResourceView.hourHeight * 2]
        });

        await t.waitFor(() => calendar.features.eventEdit.editor?.containsFocus);
        await t.type(null, 'New for Bryntum Team[ENTER]');
        const newTeamEvent = calendar.eventStore.last;
        t.is(newTeamEvent.name, 'New for Bryntum Team');
        t.is(newTeamEvent.startDate, new Date(2019, 9, 14, 9));
        t.is(newTeamEvent.endDate, new Date(2019, 9, 14, 11));
        t.is(newTeamEvent.resource.name, 'Bryntum team');

        await t.dragBy({
            source : '.b-dayview-day-detail[data-resource-id="hotel"]',
            offset : ['50%', dayResourceView.hourHeight * 9],
            delta  : [0, dayResourceView.hourHeight * 2]
        });

        await t.waitFor(() => calendar.features.eventEdit.editor?.containsFocus);
        await t.type(null, 'New for Hotel[ENTER]');
        const newHotelEvent = calendar.eventStore.last;
        t.is(newHotelEvent.name, 'New for Hotel');
        t.is(newHotelEvent.startDate, new Date(2019, 9, 14, 9));
        t.is(newHotelEvent.endDate, new Date(2019, 9, 14, 11));
        t.is(newHotelEvent.resource.name, 'Hotel Park');

        await t.dragBy({
            source : '.b-dayview-day-detail[data-resource-id="mats"]',
            offset : ['50%', dayResourceView.hourHeight * 9],
            delta  : [0, dayResourceView.hourHeight * 2]
        });

        await t.waitFor(() => calendar.features.eventEdit.editor?.containsFocus);
        await t.type(null, 'New for Mats[ENTER]');
        const newMatsEvent = calendar.eventStore.last;
        t.is(newMatsEvent.name, 'New for Mats');
        t.is(newMatsEvent.startDate, new Date(2019, 9, 14, 9));
        t.is(newMatsEvent.endDate, new Date(2019, 9, 14, 11));
        t.is(newMatsEvent.resource.name, 'Mats Bryntse');

        await t.dragBy({
            source : `.b-cal-event-wrap[data-event-id="${newTeamEvent.id}"]`,
            offset : ['50%', '100%-5'],
            delta  : [300, dayResourceView.hourHeight * 0.5 + 5]
        });
        // Resource unchanged
        t.is(newTeamEvent.resource.name, 'Bryntum team');
        t.is(newTeamEvent.endDate, new Date(2019, 9, 14, 11, 30));

        await t.dragBy({
            source : `.b-cal-event-wrap[data-event-id="${newMatsEvent.id}"]`,
            delta  : [dayResourceView.minResourceWidth, dayResourceView.hourHeight * -1]
        });
        // Resource changed
        t.is(newMatsEvent.resource.name, 'Bryntum team');
        // Date changed
        t.is(newMatsEvent.endDate, new Date(2019, 9, 15, 10));

        const hackathon = calendar.eventStore.getById(1);
        await t.dragBy({
            source : '.b-cal-event-wrap.b-allday[data-event-id="1"]',
            delta  : [dayResourceView.minResourceWidth, 0]
        });
        // Date unchanged
        t.is(hackathon.startDate, new Date(2019, 9, 14));
        // Move resource
        t.is(hackathon.resource.name, 'Hotel Park');

        const relax = calendar.eventStore.getById(3);
        await t.dragBy({
            source : '.b-cal-event-wrap.b-allday[data-event-id="3"]',
            delta  : [dayResourceView.minResourceWidth, 0]
        });
        // Date changed
        t.is(relax.startDate, new Date(2019, 9, 15));
        // Move resource
        t.is(relax.resource.name, 'Bryntum team');

        // Drag so that start date of the rendered range is out of view should not throw.
        await t.dragBy({
            source : '.b-calendar-cell[data-date="2019-10-15"] .b-cal-event-wrap[data-event-id="1"]',
            delta  : [-dayResourceView.minResourceWidth * 4, 0]
        });
        // Start date is out of the visible range
        t.is(dayResourceView.eventStore.getById(1).startDate, new Date(2019, 9, 13));
    });

    t.it('Should use Calendar`s weekStartDay', async t => {
        await setup({
            weekStartDay : 1
        });

        t.selectorCountIs('[data-header-date="2019-10-14"]:first-child:contains(Mon):contains(14)', 1);

        calendar.weekStartDay = 0;

        t.selectorCountIs('[data-header-date="2019-10-13"]:first-child:contains(Sun):contains(13)', 1);

    });

    // https://github.com/bryntum/support/issues/7179
    t.it('beforeAutoCreate should contain resourceRecord param when drag create', async t => {
        await setup({
            date         : '2023-06-26',
            weekStartDay : 1,
            listeners    : {
                beforeAutoCreate({ resourceRecord }) {
                    t.is(resourceRecord.name, 'Hotel Park', 'Correct resourceRecord argument');
                }
            }
        });

        await t.dragBy({
            source : '.b-dayview-day-detail[data-resource-id="hotel"]',
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
                    t.is(resourceRecord.name, 'Hotel Park', 'Correct resourceRecord argument');
                }
            }
        });

        await t.rightClick('.b-dayview-day-detail[data-resource-id="hotel"]');
        await t.waitForSelector('.b-menu');
        await t.click('.b-menu .b-menuitem');
        await t.waitForSelector('.b-eventeditor');
        await t.click('[data-ref="cancelButton"]');
    });
});
