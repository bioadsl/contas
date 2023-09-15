const scheduler = new Calendar({
    appendTo : targetElement,
    height   : 600,

    // We have a little less width in our context, so reduce the responsive breakpoints
    responsive : {
        small : {
            when : 480
        },
        medium : {
            when : 640
        }
    },

    // Not enough space in this context for all modes
    modes : {
        agenda : null
    },

    // Hardcoded inline data - use for POC only.
    // Use CrudManager in implementation.
    resources : [
        { id : 1, name : 'Mr Boss' }
    ],
    events : [
        { resourceId : 1, startDate : '2020-08-31T09:00:00', duration : 3, durationUnit : 'h', name : 'Important meeting' }
    ],

    visibleStartTime : 7,

    // Start life looking at this date
    date : '2020-08-31',

    features : {
        // So as not to interfere with the editor
        eventTooltip : null
    }
});
