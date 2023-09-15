import { CalendarConfig, DateHelper } from '@bryntum/calendar';
import '../lib/RoomSelector';
/**
 * Application config file
 */

export const calendarConfig: Partial<CalendarConfig> = {
    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        eventStore : {
            fields : [
                { name : 'room' },
                { name : 'rsvp' }
            ]
        },
        transport : {
            load : {
                url : 'assets/data/data.json'
            }
        },
        autoLoad : true
    },

    // The utility panel which is at the left by default.
    // There are no calendars to select, so don't include it.
    sidebar : null,

    features : {
    // Features named by the properties are included.
    // An object is used to configure the feature.
        eventTooltip : {
            // Configuration options are passed on to the tooltip instance
            // We want the tooltip's left edge aligned to the right edge of the event if possible.
            align : 'l-r'
        } as any,
        eventEdit : {
            // We like our editor to be modal and centered, not aligned to any event.
            editorConfig : {
                modal    : true,
                centered : true,
                anchor   : null,

                titleRenderer(eventRecord) {
                    // return StringHelper.xss`${DateHelper.format(eventRecord.startDate, 'HH:mm')} - ${DateHelper.format(eventRecord.endDate, 'HH:mm')} ${eventRecord.name}`;
                    return `${DateHelper.format(eventRecord.startDate, 'HH:mm')} - ${DateHelper.format(eventRecord.endDate, 'HH:mm')} ${eventRecord.name}`;
                    // return 'hej';
                }
            },

            // Any items configured on the eventEdit feature are merged into the items
            // definition of the default editor.
            // If a system-supplied name is used as a property, it will reconfigure that existing
            // field.
            // Configuring a system-supplied field as false removes that field.
            // If a new property name is used, it will be added to the editor.
            // Fields are sorted in ascending order of their weight config.
            // System-supplied input fields have weights from 100 to 800.
            // This new item is therefore inserted below the first existing field.
            items : {
                roomSelector : {
                    // The name means that it is bound the 'room' field
                    // of the event being edited.
                    name : 'room',

                    // type  : 'roomSelector',
                    type  : 'textfield',
                    label : 'Room',

                    // This just means no typing.
                    // Always use point and click.
                    // Avoid intrusive keyboard on touch screens where possible.
                    editable : false,

                    // Insert just after event name which is at 100
                    weight : 110
                },

                rsvp : {
                    type   : 'radiogroup',
                    label  : 'Response',
                    name   : 'rsvp',
                    // Insert just before start time which is at 300
                    weight : 290,

                    options : {
                        accept    : 'Accepted',
                        decline   : 'Declined',
                        tentative : 'Tentative'
                    }
                },

                // Don't render the resource (calendar) selection input.
                // We're only ever using the "bryntum" calendar.
                resourceField : null
            }
        }
    },

    // Modes are the views available in the Calendar.
    // An object may be used to configure the view.
    // null means do not include the view.
    modes : {
        agenda : null,
        year   : null,
        week   : null,
        day    : null
    }
};
