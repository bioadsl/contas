const calendar = new Calendar({
    height   : 600,
    appendTo : targetElement,

    date : '2022-01-01T00:00:00',

    // We have a little less width in our context, so reduce the responsive breakpoints
    responsive : {
        small : {
            when : 480
        },
        medium : {
            when : 640
        }
    },

    resources : [
        {
            id         : 1,
            name       : 'Default Calendar',
            eventColor : 'green'
        }
    ],
    events : [
        {
            id         : 1,
            name       : 'Meeting',
            startDate  : '2022-01-01T10:00:00',
            endDate    : '2022-01-01T11:00:00',
            resourceId : 1
        }
    ]
});
