
StartTest(t => {
    let calendar, resourceStore, harness;

    const getCalendar = async config => {
        const calendar = await t.getCalendar(config);
        resourceStore = calendar.resourceStore;
        return calendar;
    };

    t.beforeEach(() => {
        t.setupCalendarTest(calendar, harness);
    });

    t.it('As a string value', async t => {
        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        let emptyDate;

        calendar = await getCalendar({
            resourceStore,
            date         : new Date(2019, 9, 14),
            events       : [],
            modeDefaults : {
                emptyCellRenderer : 'No events'
            },
            mode      : 'month',
            listeners : {
                emptyCellClick({ date }) {
                    emptyDate = date;
                }
            }
        });

        t.selectorCountIs('.b-cal-cell-no-content:contains(No events)', 42);
        await t.click('.b-monthview-content .b-calendar-cell[data-date="2019-10-15"] .b-cal-cell-no-content');

        // Listener fired correctly
        t.is(emptyDate, new Date(2019, 9, 15));

        // Now check the all day row in the week view
        await t.click('[data-ref="weekShowButton"]');

        await t.waitForAnimations();

        await t.dragBy({
            source : '[data-header-date="2019-10-15"]',
            offset : ['1%', '50%'],
            delta  : [90, 0]
        });

        await t.waitFor(() => calendar.features.eventEdit._editor?.containsFocus);

        await t.type(null, 'Test new[ENTER]');

        t.selectorCountIs('.b-dayview-allday.b-calendar-cell .b-cal-cell-no-content:contains(No events)', 6);

        await t.click('.b-dayview-allday.b-calendar-cell[data-date="2019-10-16"] .b-cal-cell-no-content');

        // Listener fired correctly
        t.is(emptyDate, new Date(2019, 9, 16));
    });

    t.it('As an object', async t => {
        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        let emptyDate;

        calendar = await getCalendar({
            resourceStore,
            date         : new Date(2019, 9, 14),
            events       : [],
            modeDefaults : {
                emptyCellRenderer : { text : 'No events' }
            },
            mode      : 'month',
            listeners : {
                emptyCellClick({ date }) {
                    emptyDate = date;
                }
            }
        });

        t.selectorCountIs('.b-cal-cell-no-content:contains(No events)', 42);
        await t.click('.b-monthview-content .b-calendar-cell[data-date="2019-10-15"] .b-cal-cell-no-content');

        // Listener fired correctly
        t.is(emptyDate, new Date(2019, 9, 15));

        // Now check the all day row in the week view
        await t.click('[data-ref="weekShowButton"]');

        await t.waitForAnimations();

        await t.dragBy({
            source : '[data-header-date="2019-10-15"]',
            offset : ['1%', '50%'],
            delta  : [90, 0]
        });

        await t.waitFor(() => calendar.features.eventEdit._editor?.containsFocus);

        await t.type(null, 'Test new[ENTER]');

        t.selectorCountIs('.b-dayview-allday.b-calendar-cell .b-cal-cell-no-content:contains(No events)', 6);

        await t.click('.b-dayview-allday.b-calendar-cell[data-date="2019-10-16"] .b-cal-cell-no-content');

        // Listener fired correctly
        t.is(emptyDate, new Date(2019, 9, 16));
    });

    t.it('As a function name', async t => {
        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        let emptyDate;

        calendar = await getCalendar({
            resourceStore,
            date         : new Date(2019, 9, 14),
            events       : [],
            modeDefaults : {
                emptyCellRenderer : 'up.calendarEmptyCellRenderer'
            },
            mode      : 'month',
            listeners : {
                emptyCellClick({ date }) {
                    emptyDate = date;
                }
            },
            calendarEmptyCellRenderer() {
                return 'No events';
            }
        });

        t.selectorCountIs('.b-cal-cell-no-content:contains(No events)', 42);
        await t.click('.b-monthview-content .b-calendar-cell[data-date="2019-10-15"] .b-cal-cell-no-content');

        // Listener fired correctly
        t.is(emptyDate, new Date(2019, 9, 15));

        // Now check the all day row in the week view
        await t.click('[data-ref="weekShowButton"]');

        await t.waitForAnimations();

        await t.dragBy({
            source : '[data-header-date="2019-10-15"]',
            offset : ['1%', '50%'],
            delta  : [90, 0]
        });

        await t.waitFor(() => calendar.features.eventEdit._editor?.containsFocus);

        await t.type(null, 'Test new[ENTER]');

        t.selectorCountIs('.b-dayview-allday.b-calendar-cell .b-cal-cell-no-content:contains(No events)', 6);

        await t.click('.b-dayview-allday.b-calendar-cell[data-date="2019-10-16"] .b-cal-cell-no-content');

        // Listener fired correctly
        t.is(emptyDate, new Date(2019, 9, 16));
    });

    t.it('As a function', async t => {
        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        let emptyDate;

        calendar = await getCalendar({
            resourceStore,
            date         : new Date(2019, 9, 14),
            events       : [],
            modeDefaults : {
                emptyCellRenderer : () => 'No events'
            },
            mode      : 'month',
            listeners : {
                emptyCellClick({ date }) {
                    emptyDate = date;
                }
            }
        });

        t.selectorCountIs('.b-cal-cell-no-content:contains(No events)', 42);
        await t.click('.b-monthview-content .b-calendar-cell[data-date="2019-10-15"] .b-cal-cell-no-content');

        // Listener fired correctly
        t.is(emptyDate, new Date(2019, 9, 15));

        // Now check the all day row in the week view
        await t.click('[data-ref="weekShowButton"]');

        await t.waitForAnimations();

        await t.dragBy({
            source : '[data-header-date="2019-10-15"]',
            offset : ['1%', '50%'],
            delta  : [90, 0]
        });

        await t.waitFor(() => calendar.features.eventEdit._editor?.containsFocus);

        await t.type(null, 'Test new[ENTER]');

        t.selectorCountIs('.b-dayview-allday.b-calendar-cell .b-cal-cell-no-content:contains(No events)', 6);

        await t.click('.b-dayview-allday.b-calendar-cell[data-date="2019-10-16"] .b-cal-cell-no-content');

        // Listener fired correctly
        t.is(emptyDate, new Date(2019, 9, 16));
    });

});
