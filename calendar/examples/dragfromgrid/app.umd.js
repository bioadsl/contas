var {
    Calendar,
    Splitter,
    Grid,
    EventModel,
    StringHelper
} = bryntum.calendar;
const calendar = new Calendar({
    // Start life looking at this date
    date        : new Date(2020, 9, 12),
    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        loadUrl  : 'data/data.json',
        autoLoad : true
    },
    modes : {
        agenda : null
    },
    appendTo : 'calendar-container',
    // Features named by the properties are included.
    // An object is used to configure the feature.
    features : {
        eventTooltip : {
            // Configuration options are passed on to the tooltip instance
            // We want the tooltip's left edge aligned to the right edge of the event if possible.
            align : 'l-r'
        },
        externalEventSource : {
            grid      : 'unscheduled',
            droppable : true
        }
    },
    listeners : {
        dropExternal({
            eventRecord
        }) {
            // Remove from calendar
            calendar.eventStore.remove(eventRecord);
        }
    }
});
new Splitter({
    appendTo : 'calendar-container'
});
const unscheduledGrid = new Grid({
    id          : 'unscheduled',
    appendTo    : 'calendar-container',
    title       : 'Unscheduled Events',
    collapsible : true,
    flex        : '0 0 300px',
    ui          : 'calendar-banner',
    // Calendar's stores are contained by a project, pass it to the grid to allow it to access them
    project     : calendar.project,
    store       : {
        modelClass : EventModel,
        readUrl    : 'data/unplanned.json',
        autoLoad   : true
    },
    features : {
        stripe   : true,
        sort     : 'name',
        cellEdit : false,
        group    : false
    },
    columns : [{
        text       : 'Unassigned tasks',
        flex       : 1,
        field      : 'name',
        htmlEncode : false,
        renderer   : data => StringHelper.xss`<i class="${data.record.iconCls}"></i>${data.record.name}`
    }, {
        text   : 'Duration',
        type   : 'duration',
        width  : 100,
        align  : 'right',
        editor : false
    }],
    rowHeight : 50
});
