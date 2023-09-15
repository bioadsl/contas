
StartTest(t => {
    let calendar;

    t.beforeEach(() => calendar?.destroy());

    t.it('Sanity', async t => {
        calendar = await t.getCalendar({
            date : new Date()
        });

        // set up locale map to check
        const
            locales = ['Nl', 'Ru', 'SvSE', 'En'],
            localeMap = [
                { path : 'todayButton', locale : 'Calendar.Today' },
                { path : 'viewDescription', locale : () => calendar.activeView.description },
                { path : 'todayButton', locale : 'Calendar.Today' }
            ],
            sharedMap = {
                'WeekView.Week' : 'Object.Week'
            };

        for (const mode in calendar.modes) {
            const
                name = StringHelper.capitalize(mode),
                locale = `${name}View.${name}`;

            localeMap.push({ path : `${mode}ShowButton`, locale : sharedMap[locale] || locale });
        }

        // this syntax allows to add await to validate change visually
        for (let i = 0; i < locales.length; i++) {
            const locale = locales[i];

            t.applyLocale(locale);

            // Wait for viewDescription to be updated
            await t.waitForAnimationFrame();

            t.subTest(`Checking ${locale} locale`, t => {
                localeMap.forEach(item => {
                    let expected;

                    if (typeof item.locale === 'function') {
                        expected = item.locale();
                    }
                    else {
                        expected = ObjectHelper.getPath(LocaleHelper.locale, item.locale);
                    }

                    t.is(calendar.widgetMap[item.path].element.textContent, expected);
                });

                const cells = Array.from(calendar.activeView.allDayEvents.element.querySelectorAll('.b-cal-cell-header'));

                cells.forEach(el => {
                    const
                        date     = DateHelper.parse(el.dataset.headerDate),
                        expected = new RegExp(DateHelper.getDayShortName(date.getDay())),
                        got      = el.querySelector('.b-day-name-day').textContent;

                    t.expect(got).toMatch(expected);
                });
            });
        }
    });
});
