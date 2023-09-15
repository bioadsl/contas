/**
 * Application config file
 */
import { EventModel, CalendarConfig, GridConfig, ProjectModelConfig, StringHelper } from '@bryntum/calendar';
import { unplannedData, events, resources } from './app.data';

export const projectConfig : Partial<ProjectModelConfig> = {
    events,
    resources
};

export const calendarConfig : Partial<CalendarConfig> = {
    // Features named by the properties are included.
    // An object is used to configure the feature.
    features : {
        eventTooltip : {
            align : 'l-r'
        },
        externalEventSource : {
            grid : 'unscheduled'
        }
    },

    date : new Date(2020, 9, 11),

    // Modes are the views available in the Calendar.
    // An object is used to configure the view.
    modes : {
        agenda : null
    }
};

export const gridConfig : Partial<GridConfig> = {
    id          : 'unscheduled',
    title       : 'Unscheduled Events',
    collapsible : true,
    flex        : '0 0 300px',
    ui          : 'calendar-banner',
    store       : {
        modelClass : EventModel,
        data       : unplannedData
    },
    features : {
        stripe   : true,
        sort     : 'name',
        cellEdit : false,
        group    : false
    },
    columns : [
        {
            text       : 'Unassigned tasks',
            flex       : 1,
            field      : 'name',
            htmlEncode : false,
            renderer   : ({ record } : { record:EventModel }) =>
                StringHelper.xss`<i class="${record.iconCls}"></i>${record.name}`
        },
        {
            text     : 'Duration',
            width    : 100,
            align    : 'right',
            editor   : false,
            field    : 'duration',
            renderer : ({ record } : { record:EventModel }) =>
                `${record.duration} ${record.durationUnit}`
        }
    ],

    rowHeight : 50
};
