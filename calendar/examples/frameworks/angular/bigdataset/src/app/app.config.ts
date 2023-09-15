import { CalendarConfig } from '@bryntum/calendar';

/**
 * Application config file
 */

export const calendarConfig: Partial<CalendarConfig> = {
    // Start life looking at this date
    date : new Date(2020, 9, 12),

    features : {
        weekExpander : true,

        // In our event editor, we'd like to match-any resource names
        // not just match from start.
        eventEdit : {
            items : {
                resourceField : {
                    primaryFilter : {
                        operator : '*'
                    }
                }
            }
        }
    },

    // A block of configs which is applied to all modes.
    modeDefaults : {
        // Allows us to see details in a crowded day
        zoomOnMouseWheel : true
    },

    // List isn't included by default.
    // Include it using its default configuration.
    modes : {
        list : true
    },

    // Add a new item to the top toolbar.
    // Weight controls the order it is inserted at.
    tbar : {
        items : {
            autoRowHeight : {
                type     : 'checkbox',
                label    : 'Auto row height',
                weight   : 600,
                disabled : true
            }
        }
    },

    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        transport : {
            load : {
                url : 'assets/data/data.json'
            }
        },
        autoLoad : true
    },

    sidebar : {
        items : {
            // This is the "ref" of the new field
            resourceFilterFilter : {
                // Inserts just before the resourceFilter List
                weight : 190,

                // Shows a clear trigger
                clearable : true,

                label                : 'Filter resources',
                placeholder          : 'Filter resources',
                labelPosition        : 'above',
                type                 : 'textfield',
                keyStrokeChangeDelay : 100
            }
        }
    }
};
