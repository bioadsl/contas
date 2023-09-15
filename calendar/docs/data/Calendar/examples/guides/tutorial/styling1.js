const calendar = new Calendar({
    // Where to render to, accepts an element or an element id
    appendTo : targetElement,

    // Normally sizing would be handled by CSS, but for simplicity
    // we use fixed height for the tutorial
    height : 800,

    // Date that the calendar will center round initially
    date : '2020-09-01',

    // Configure Calendar features
    features : {
        // Reconfigure the EventTooltip feature to show the tip on hover
        // The default is to show it on click.
        eventTooltip : {
            showOn : 'hover'
        },

        // Configure away the EventEdit feature by specifying it as null
        eventEdit : null
    },

    // Events contain their own colour definitions
    events : [
        { startDate : '2020-08-30T07:00', duration : 2, durationUnit : 'h', name : 'red', eventColor : 'red' },
        { startDate : '2020-08-30T09:00', duration : 2, durationUnit : 'h', name : 'pink', eventColor : 'pink' },
        { startDate : '2020-08-31T07:00', duration : 2, durationUnit : 'h', name : 'purple', eventColor : 'purple' },
        { startDate : '2020-08-31T09:00', duration : 2, durationUnit : 'h', name : 'violet', eventColor : 'violet' },
        { startDate : '2020-09-01T07:00', duration : 2, durationUnit : 'h', name : 'indigo', eventColor : 'indigo' },
        { startDate : '2020-09-01T09:00', duration : 2, durationUnit : 'h', name : 'blue', eventColor : 'blue' },
        { startDate : '2020-09-02T07:00', duration : 2, durationUnit : 'h', name : 'cyan', eventColor : 'cyan' },
        { startDate : '2020-09-02T09:00', duration : 2, durationUnit : 'h', name : 'teal', eventColor : 'teal' },
        { startDate : '2020-09-03T07:00', duration : 2, durationUnit : 'h', name : 'green', eventColor : 'green' },
        { startDate : '2020-09-03T09:00', duration : 2, durationUnit : 'h', name : 'lime', eventColor : 'lime' },
        { startDate : '2020-09-04T07:00', duration : 2, durationUnit : 'h', name : 'yellow', eventColor : 'yellow' },
        { startDate : '2020-09-04T09:00', duration : 2, durationUnit : 'h', name : 'orange', eventColor : 'orange' },
        { startDate : '2020-09-05T07:00', duration : 2, durationUnit : 'h', name : 'deep-orange', eventColor : 'deep-orange' },
        { startDate : '2020-09-05T09:00', duration : 2, durationUnit : 'h', name : 'gray', eventColor : 'gray' }
    ]
});
