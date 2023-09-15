var {
    Calendar
} = bryntum.calendar;
const calendar = new Calendar({
    // Start life looking at this date
    date        : new Date(2022, 1, 1),
    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        autoLoad   : true,
        // Our events use hours as their default duration units instead of the default days.
        eventStore : {
            fields : [{
                name         : 'durationUnit',
                defaultValue : 'hour'
            }]
        },
        transport : {
            load : {
                url : 'data/data.json'
            }
        }
    },
    appendTo     : 'container',
    modeDefaults : {
    // Only show the working day.
        dayStartTime   : 9,
        dayEndTime     : 19,
        // Hours start tall enough to see full time granularity
        hourHeight     : 300,
        // Divide the time axis into six minute ticks instead of the default five minute
        sixMinuteTicks : true,
        // Drag snapping snaps to 6 minute boundaries
        increment      : '6 minutes'
    }
});
