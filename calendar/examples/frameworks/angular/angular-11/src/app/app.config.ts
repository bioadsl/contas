/**
 * Application config file
 */

import { CalendarConfig } from '@bryntum/calendar';

export const calendarConfig : Partial<CalendarConfig> = {
    // Features named by the properties are included.
    // An object is used to configure the feature.
    features : {
        eventTooltip : {
            align : 'l-r'
        }
    },

    date : new Date(2020, 9, 11),

    // Modes are the views available in the Calendar.
    // An object is used to configure the view.
    modes : {
        year : false
    }
};
