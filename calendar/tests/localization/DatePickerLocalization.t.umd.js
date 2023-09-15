
StartTest(t => {
    let calendar, harness;
    const
        locales = Object.keys(window.bryntum.locales),
        themes  = ['classic-light', 'classic-dark', 'material', 'stockholm', 'classic'];

    t.beforeEach(() => t.setupCalendarTest(calendar, harness));

    t.it('Should not popup DatePicker width when month changes for all locales and themes', async t => {

        calendar = await t.getCalendar({
            date      : new Date(2019, 9, 14),
            events    : [],
            resources : [],
            modes     : {
                week   : null,
                month  : null,
                year   : null,
                agenda : null
            }
        });

        const
            dayView          = calendar.activeView,
            testMonthLengths = async(themeName, localeName) => {
                for (let i = 0; i < 12; i++) {
                    const { refreshCount } = datePicker;

                    datePicker.gotoNextMonth();

                    await t.waitFor(() => datePicker.refreshCount > refreshCount);

                    // Active cell may change, but there must always be only one
                    t.is(datePicker.element.querySelectorAll('.b-calendar-cell[role="gridcell"][tabIndex="0"]').length, 1,
                        `Active cell count is 1 for ${DateHelper._monthNames[i]}`);

                    // Must not have changed width
                    if (datePicker.element.offsetWidth !== offsetWidth) {
                        t.fail(`${themeName}, ${localeName}, ${DateHelper._monthNames[datePicker.month.month]} caused resize`);
                    }
                }
            };

        await t.doubleClick('.b-dayview-day-detail.b-calendar-cell', null, null, null, ['50%', dayView.hourHeight * 20]);

        await t.waitFor(() => calendar.features.eventEdit.editor.containsFocus);

        await t.click('.b-fieldtrigger.b-icon-calendar[data-ref="expand"]');

        const datePicker = calendar.features.eventEdit.editor.widgetMap.startDateField.picker;
        datePicker.animateTimeShift = false;

        const { offsetWidth } = datePicker.element;

        // Every month for every locale for every theme must get a refresh.
        // Plus one for the reset back to En at test's end.
        t.willFireNTimes(datePicker, 'refresh', locales.length * themes.length * 13 + 1);

        await t.forEveryThemeAndLocale(testMonthLengths);
    });

    t.it('Should not change popup DatePicker width when month changes for all locales and themes with examples font used', async t => {

        document.body.style.fontFamily = 'Poppins, "Helvetica Neue", Arial, Helvetica, sans-serif';

        calendar = await t.getCalendar({
            date      : new Date(2019, 9, 14),
            events    : [],
            resources : [],
            modes     : {
                week   : null,
                month  : null,
                year   : null,
                agenda : null
            }
        });

        const
            dayView          = calendar.activeView,
            testMonthLengths = async(themeName, localeName) => {
                for (let i = 0; i < 12; i++) {
                    const { refreshCount } = datePicker;

                    datePicker.gotoNextMonth();

                    await t.waitFor(() => datePicker.refreshCount > refreshCount);

                    // Active cell may change, but there must always be only one
                    t.is(datePicker.element.querySelectorAll('.b-calendar-cell[role="gridcell"][tabIndex="0"]').length, 1,
                        `Active cell count is 1 for ${DateHelper._monthNames[i]}`);

                    // Must not have changed width
                    if (datePicker.element.offsetWidth !== offsetWidth) {
                        t.fail(`${themeName}, ${localeName}, ${DateHelper._monthNames[datePicker.month.month]} caused resize`);
                    }
                }
            };

        await t.doubleClick('.b-dayview-day-detail.b-calendar-cell', null, null, null, ['50%', dayView.hourHeight * 20]);

        await t.waitFor(() => calendar.features.eventEdit.editor.containsFocus);

        await t.click('.b-fieldtrigger.b-icon-calendar[data-ref="expand"]');

        const datePicker = calendar.features.eventEdit.editor.widgetMap.startDateField.picker;
        datePicker.animateTimeShift = false;

        const { offsetWidth } = datePicker.element;

        // Every month for every locale for every theme must get a refresh.
        // Plus one for the reset back to En at test's end.
        t.willFireNTimes(datePicker, 'refresh', locales.length * themes.length * 13 + 1);

        await t.forEveryThemeAndLocale(testMonthLengths);
    });

});
