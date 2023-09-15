import { Calendar } from '../../build/calendar.module.js';
import shared from '../_shared/shared.module.js';

const calendar = new Calendar({
    // Start life looking at this date
    date : new Date(2020, 9, 12),

    // Features named by the properties are included.
    // An object is used to configure the feature.
    features : {
        timeRanges : {
            // configure timeRanges feature...
            headerWidth : 42
        },

        eventTooltip : {
            // Configuration options are passed on to the tooltip instance
            // We want the tooltip's left edge aligned to the right edge of the event if possible.
            align : 'l-r'
        }
    },

    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        autoLoad  : true,
        transport : {
            load : {
                url : 'data/data.json'
            }
        }
    },

    appendTo : 'container',
    cls      : 'custom-styles',

    tbar : {
        items : {
            derp : {
                type    : 'checkbox',
                text    : 'Custom styles',
                checked : true,
                weight  : 650,
                onChange({ checked }) {
                    calendar.cls = { 'custom-styles' : checked };
                }
            }
        }
    },

    modes : {
        day : {
            dayStartTime : 8,
            dayEndTime   : 22,
            hourHeight   : 70
        },
        week : {
            dayStartTime : 8,
            dayEndTime   : 22,
            hourHeight   : 70
        },
        weekResources : {
            // Type has the final say over which view type is created
            type : 'resource'
        }
    }
});
