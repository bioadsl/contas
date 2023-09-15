StartTest(t => {

    const calendar = bryntum.query('calendar');

    t.it('Sanity', async t => {

        await t.click('[data-ref="timezone"] .b-fieldtrigger');

        let ul = t.query('ul.b-combo-picker')[0];
        ul.scrollTop = 0;
        await t.click('ul.b-combo-picker li[data-index="0"]');

        t.is(calendar.widgetMap.timezone.value, calendar.project.timeZone, 'TimeZone updated');

        await t.click('[data-ref="timezone"] .b-fieldtrigger');
        ul = t.query('ul.b-combo-picker')[0];
        ul.scrollTop = ul.scrollHeight;
        await t.click('ul.b-combo-picker li:last-child');

        t.is(calendar.widgetMap.timezone.value, calendar.project.timeZone, 'TimeZone updated');
    });

    t.it('Should display correct UTC time', async t => {
        await t.waitForSelector('[data-event-id="5"');

        calendar.timeZone = 'America/Chicago';

        t.contentLike('[data-event-id="5"] .b-cal-event-desc div', '09:00 UTC', 'UTC time correctly displayed');

        calendar.timeZone = 'Europe/Helsinki';

        t.contentLike('[data-event-id="5"] .b-cal-event-desc div', '09:00 UTC', 'UTC time correctly displayed');

        calendar.timeZone = 'Pacific/Auckland';

        t.contentLike('[data-event-id="5"] .b-cal-event-desc div', '09:00 UTC', 'UTC time correctly displayed');
    });

    t.it('Should not crash when drag-creating', async t => {
        await t.waitForSelector('[data-event-id="5"');

        await t.dragBy({
            source : [400, 300],
            delta  : [0, 100]
        });

        t.pass('Did not crash');
    });
});
