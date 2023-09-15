const calendar = new Calendar({
    appendTo : targetElement,
    height   : 560,
    date     : new Date(2020, 8, 1),
    modes    : {
        day    : null,
        week   : null,
        month  : true,
        year   : null,
        agenda : null
    },
    events : [
        { startDate : '2020-09-02T07:00', duration : 5, durationUnit : 'h', name : 'Walk the dog', eventColor : 'yellow' },
        { startDate : '2020-09-10T09:00', duration : 2, durationUnit : 'h', name : 'Buy masks', eventColor : 'orange' },
        { startDate : '2020-09-14T07:00', duration : 1, durationUnit : 'h', name : 'Zoom meeting', eventColor : 'deep-orange' },
        { startDate : '2020-09-25T09:00', duration : 1, durationUnit : 'h', name : 'Get a haircut', eventColor : 'gray' }
    ]
});
