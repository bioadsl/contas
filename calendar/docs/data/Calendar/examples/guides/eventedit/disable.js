const scheduler = new Calendar({
    appendTo : targetElement,
    height   : 600,

    features : {
        eventEdit : {
            disabled : true
        }
    },

    // We have a little less width in our context, so reduce the responsive breakpoints
    responsive : {
        small : {
            when : 480
        },
        medium : {
            when : 640
        }
    },

    // Add an extra button which toggles availability of event editing
    tbar : {
        items : {
            toggleEditable : {
                text        : 'Disable editor',
                toggleable  : true,
                pressed     : true,
                icon        : 'b-fa b-fa-square',
                pressedIcon : 'b-fa b-fa-check-square',
                color       : 'b-blue b-raised',
                onToggle({ pressed }) {
                    scheduler.features.eventEdit.disabled = pressed;
                }
            }
        }
    },

    // Hardcoded inline data - use for POC only.
    // Use CrudManager in implementation.
    resources : [
        { id : 1, name : 'Mr Boss' }
    ],
    events : [
        { resourceId : 1, startDate : '2020-08-31T09:00:00', duration : 3, durationUnit : 'h', name : 'Important meeting' }
    ],

    // Start life looking at this date
    date : '2020-08-31',

    visibleStartTime : 7
});
