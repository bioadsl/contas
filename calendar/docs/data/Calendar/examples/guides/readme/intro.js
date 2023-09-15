const calendar = new Calendar({
    appendTo : targetElement,

    // We have a little less width in our context, so reduce the responsive breakpoints
    responsive : {
        small : {
            when : 480
        },
        medium : {
            when : 640
        }
    },

    // Start life looking at this date
    date : '2020-05-14',

    // Used to create view titles
    dateFormat : 'DD MMM YYYY',

    // Load resources (calendars) and events as JSON from this URL
    crudManager : {
        transport : {
            load : {
                url : 'data/Calendar/examples/guides/readme/intro.json'
            }
        },
        autoLoad : true
    },

    // All modes re included by default.
    // Each can be reconfigured from the default by using an object.
    // Each may be omitted by configuring as false
    modes : {
        week : {
            dayStartTime : 8
        },
        day : {
            dayStartTime : 8
        }
    },

    height : 700
});
