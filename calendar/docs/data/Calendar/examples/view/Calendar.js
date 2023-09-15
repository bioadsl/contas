const
    calendar        = new Calendar({
        appendTo : targetElement,
        height   : 700,

        tbar : {
            items : {
                todayButton : null
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

        // A block of configs which is applied to all modes.
        modeDefaults : {
            // Save some width
            hideNonWorkingDays : true
        },

        // Start life looking at this date
        date : '2020-10-11',

        // Used to create view titles
        dateFormat : 'DD MMM YYYY',

        // CrudManager arranges loading and syncing of data in JSON form from/to a web service
        crudManager : {
            transport : {
                load : {
                    url : 'data/Calendar/examples/view/data.json'
                }
            },
            autoLoad : true
        },

        // Modes are the views available in the Calendar.
        // An object is used to configure the view.
        modes : {
            // Let's not show single day view
            day  : null,
            week : {
                dayStartTime : 8
            }
        }
    });
