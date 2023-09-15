/**
 * Application configuration
 */
export const calendarConfig = {
    // Start life looking at this date
    date : new Date(2020, 9, 12),

    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        transport : {
            load : {
                url : 'data/data.json'
            }
        },
        autoLoad : true
    },

    // Modes are the views available in the Calendar.
    // An object may be used to configure the view.
    // null means do not include the view.
    modes : {
        agenda : null,
        month  : null,
        year   : null,
        day    : {
            hourHeight   : 70,
            // These two settings decide what time span is rendered
            dayStartTime : 4,
            dayEndTime   : 22,

            // Scroll to 7am initially
            visibleStartTime : 7
        },
        week : {
            hourHeight   : 70,
            // These two settings decide what time span is rendered
            dayStartTime : 4,
            dayEndTime   : 22,

            // Scroll to 7am initially
            visibleStartTime : 7
        }
    },

    // The Calendar's top toolbar.
    // We can alter its items configuration.
    // In this case, we add a new UI item.
    tbar : {
        items : {
            scrollHour : {
                cls    : 'hourField',
                label  : 'Scroll to hour',
                type   : 'numberfield',
                value  : 7,
                weight : 650,
                min    : 4,
                max    : 21
            }
        }
    }
};
