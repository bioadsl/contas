const dayView = new ResourceView({
    appendTo           : targetElement,
    height             : 500,
    date               : new Date(2020, 8, 2),
    dayStartTime       : 6,
    dayEndTime         : 19,
    visibleStartTime   : 6,
    resourceWidth      : '30em',
    hideNonWorkingDays : true,
    resources          : [
        {
            id         : 1,
            name       : 'John',
            eventColor : 'blue'
        },
        {
            id         : 2,
            name       : 'Mike',
            eventColor : 'orange'
        },
        {
            id         : 3,
            name       : 'Lisa',
            eventColor : 'red'
        }
    ],
    events : [
        { startDate : '2020-09-02T10:00', duration : 5, durationUnit : 'h', name : 'Studies', eventColor : 'red', resourceId : 1 },
        { startDate : '2020-09-02T07:00', duration : 5, durationUnit : 'h', name : 'Walk the dog', eventColor : 'yellow', resourceId : 2 },
        { startDate : '2020-09-03T09:00', duration : 2, durationUnit : 'h', name : 'Buy groceries', eventColor : 'orange', resourceId : 2 },
        { startDate : '2020-09-04T07:00', duration : 1, durationUnit : 'h', name : 'Zoom meeting', eventColor : 'deep-orange', resourceId : 1 },
        { startDate : '2020-09-05T09:00', duration : 1, durationUnit : 'h', name : 'Get a haircut', eventColor : 'gray', resourceId : 1 }
    ]
});
