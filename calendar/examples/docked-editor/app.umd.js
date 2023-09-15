var {
    Calendar,
    DateHelper,
    StringHelper
} = bryntum.calendar;
const calendar = new Calendar({
    // Start life looking at this date
    date        : new Date(2020, 9, 12),
    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        transport : {
            load : {
                url : 'data/data.json'
            }
        },
        autoLoad : true
    },
    appendTo : 'container',
    // Features named by the properties are included.
    // An object is used to configure the feature.
    features : {
        eventEdit : {
            // We want our editor to be static, *not* floating
            // This converts it to a docked, slide-in overlay
            editorConfig : {
                appendTo      : document.body,
                // 'up.' means method is on a parent Widget. It will find the Calendar
                titleRenderer : 'up.makeEditorTitle'
            }
        }
    },
    modeDefaults : {
        dayStartTime : 6
    },
    // Referenced by the editorConfig of the eventEdit Feature
    makeEditorTitle(eventRecord) {
        return StringHelper.xss`${DateHelper.format(eventRecord.startDate, 'HH:mm')} - ${DateHelper.format(eventRecord.endDate, 'HH:mm')} ${eventRecord.name}`;
    }
});
