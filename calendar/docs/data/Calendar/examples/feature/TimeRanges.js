const calendar = new Calendar({
    // Features named by the properties are included.
    features : {
        // Enable and optionally configure the timeRanges feature:
        timeRanges : {
            // configuration goes here
        }
    },

    // Start life in day view at this date
    date : '2020-03-03',
    mode : 'day',

    // Modes are the views available in the Calendar.
    // An object is used to configure the view.
    modes : {
        day : {
            dayStartTime : 8
        },
        week : {
            dayStartTime : 8
        },
        agenda : null,
        month  : null,
        year   : null
    },

    // Used to create view titles
    dateFormat         : 'DD MMM YYYY',
    hideNonWorkingDays : true,

    // The utility panel which is at the left by default.
    // Not enough width here, so don't include it.
    sidebar : false,

    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        autoLoad  : true,
        transport : {
            load : {
                url : 'data/Calendar/examples/feature/time-ranges.json'
            }
        }
    },

    appendTo : targetElement,
    height   : 700
});
