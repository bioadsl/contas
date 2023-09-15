const examples = {

    Features : {
        items : [
            { folder : 'print', title : 'Calendar print feature', since : '4.1.0' },
            { folder : 'shifted', title : 'Display day views that don\'t start at midnight', since : '4.2.0' },
            { folder : 'filtering', title : 'Event filtering' },
            { folder : 'listview', title : 'Events viewed in grid form', since : '4.1.0', updated : '5.3.4' },
            { folder : 'list-range', title : 'Event lists showing arbitrary date ranges', since : '5.3.4' },
            { folder : 'load-on-demand', title : 'Loading only what the UI requires', since : '5.2.5' },
            { folder : 'exporttoics', title : 'Exporting events to ICS format', since : '4.0' },
            { folder : 'fit-hours', title : 'Fit timeline to available space', since : '4.1.1', updated : '4.3.2' },
            { folder : 'multiassign', title : 'Multi assignment' },
            { folder : 'resourceview', title : 'ResourceView', since : '4.3.0', updated : '5.0.2' },
            { folder : 'date-resource', title : 'Date/ResourceView', since : '5.3.2' },
            { folder : 'undoredo', title : 'Undo & redo' },
            { folder : 'event-column', title : 'EventColumn', since : '5.0.1' },
            { folder : 'state', title : 'Storing and restoring state', since : '5.2.0', updated : '5.3.5' },
            { folder : 'timeranges', title : 'Using TimeRanges', since : '5.3.0' },
            { folder : 'timezone', title : 'Time zone support', since : '5.3.0' },
            { folder : 'dual-dayview', title : 'Dual DayView', since : '5.4.2' }
        ]
    },

    Basics : {
        items : [
            { folder : 'basic', title : 'Basic setup' },
            { folder : 'visible-hours', title : 'Configuring visible hours', updated : '4.3.6' },
            { folder : 'recurrence', title : 'Recurring events' },
            { folder : 'day-zoom', title : 'Zooming the DayView timeline', since : '5.1.3' },
            { folder : 'day-time-ticks', title : 'DayView time axis split into six minute ticks', since : '5.3.0' },
            { folder : 'responsive', title : 'Illustrates responsive sizing breakpoints', since : '5.3.7' }
        ]
    },

    Customization : {
        items : [
            { folder : 'customized-resourcefilter', title : 'Alternative resource filtering UI', since : '4.3.5' },
            { folder : 'confirmation-dialogs', title : 'Confirmation dialogs', since : '4.1.4' },
            { folder : 'custom-menus', title : 'Customized context menus', since : '4.0.5' },
            { folder : 'eventedit', title : 'Customized event editor', updated : '5.0' },
            { folder : 'tooltips', title : 'Customized event tooltip' },
            { folder : 'sidebar-customization', title : 'Customized sidebar' },
            { folder : 'custom-rendering', title : 'Custom rendering', updated : '5.0' },
            { folder : 'event-items', title : 'Event items', since : '5.3.7' },
            { folder : 'localization', title : 'Localization' },
            { folder : 'resource-avatars', title : 'Rendering resource avatars in the event bars', since : '4.3.9' },
            { folder : 'docked-editor', title : 'Docked event editor', since : '5.2.9' }
        ]
    },

    'Power demos' : {
        items : [
            { folder : 'bigdataset', title : 'Big data set', updated : '5.3.0' },
            { folder : 'calendar-taskboard', title : 'Calendar + Taskboard integration', since : '5.0.0' },
            { folder : 'dragfromgrid', title : 'Drag events from external grid', since : '4.0.4', updated : '5.4.0' },
            { folder : 'drag-onto-tasks', title : 'Drag equipment from external grid onto tasks', since : '5.5.2' },
            { folder : 'calendar-scheduler', title : 'Scheduler Timeline', since : '4.1.0', updated : '4.2.4' },
            { folder : 'megadataset', title : 'Colossal data set', since : '5.0.2' },
            { folder : 'show-booking', title : 'Show booking and scheduling UI', since : '5.2.0' }
        ]
    },

    Integration : {
        items : [
            { folder : 'esmodule', title : 'Include using EcmaScript module' },
            {
                folder    : 'salesforce',
                title     : 'Integrate with Salesforce Lightning',
                globalUrl : 'https://bryntum-dev-ed.develop.lightning.force.com/lightning/n/BryntumCalendar',
                since     : '4.0',
                updated   : '5.4.1',
                overlay   : 'salesforce'
            },
            { folder : 'scripttag', title : 'Include using script tag' },
            { folder : 'webcomponents', title : 'Use as web component', since : '4.1.0' },
            { folder : 'frameworks/webpack', title : 'Custom build using WebPack', overlay : 'webpack', version : 'WebPack 4', since : '4.2.5', offline : true },
            { folder : 'frameworks/ionic/ionic-4', title : 'Integrate with Ionic', build : true, overlay : 'ionic', version : 'Ionic 4', since : '4.3.0' }
        ]
    },

    'Angular examples' : {
        overlay : 'angular',
        tab     : 'angular',
        build   : true,
        items   : [
            { folder : 'frameworks/angular/angular-11', version : 'Angular 11', title : 'Basic setup using HttpClient', since : '5.3.3' },
            { folder : 'frameworks/angular/basic', version : 'Angular 13', title : 'Basic setup', since : '5.1.0' },
            { folder : 'frameworks/angular/bigdataset', version : 'Angular 13', title : 'Big data set', since : '5.1.0' },
            { folder : 'frameworks/angular/drag-from-grid', version : 'Angular 13', title : 'Drag from external source', since : '5.0.5' },
            { folder : 'frameworks/angular/eventedit', version : 'Angular 13', title : 'Customized event editor', since : '5.1' },
            { folder : 'frameworks/angular/filtering', version : 'Angular 13', title : 'Event filtering', updated : '4.3.4' },
            { folder : 'frameworks/angular/inline-data', version : 'Angular 13', title : 'Inline data', since : '5.0.3' },
            { folder : 'frameworks/angular/undoredo', version : 'Angular 13', title : 'Undo/redo', updated : '5.1' },
            { folder : 'frameworks/angular/visible-hours', version : 'Angular 13', title : 'Configuring visible hours', updated : '5.1' }
        ]
    },

    'React examples' : {
        overlay : 'react',
        tab     : 'react',
        build   : true,
        items   : [
            { folder : 'frameworks/react/javascript/basic', version : 'React 18', title : 'Basic setup', since : '5.1' },
            { folder : 'frameworks/react/javascript/bigdataset', version : 'React 18', title : 'Big data set', since : '5.1' },
            { folder : 'frameworks/react/javascript/eventedit', version : 'React 18', title : 'Customized event editor', since : '5.1' },
            { folder : 'frameworks/react/javascript/filtering', version : 'React 16', title : 'Event filtering' },
            { folder : 'frameworks/react/javascript/inline-data', version : 'React 16', title : 'Inline data', since : '5.0.3' },
            { folder : 'frameworks/react/javascript/undoredo', version : 'React 18', title : 'Undo/redo', since : '5.1' },
            { folder : 'frameworks/react/javascript/visible-hours', version : 'React 17', title : 'Configuring visible hours', since : '4.1' },
            { folder : 'frameworks/react/typescript/basic', version : 'React 17', title : 'Basic setup with TypeScript', since : '5.0.3' }
        ]
    },

    'Vue 3 examples' : {
        overlay : 'vue',
        tab     : 'vue',
        build   : true,
        items   : [
            { folder : 'frameworks/vue-3/javascript/basic', version : 'Vue 3', title : 'Basic setup', since : '4.1', updated : '5.3.0' },
            { folder : 'frameworks/vue-3/javascript/bigdataset', version : 'Vue 3', title : 'Big data set', since : '5.1', updated : '5.3.0' },
            { folder : 'frameworks/vue-3/javascript/calendar-scheduler', version : 'Vue 3', title : 'Scheduler timeline', since : '5.3.2' },
            { folder : 'frameworks/vue-3/javascript/calendar-scheduler-inline', version : 'Vue 3', title : 'Scheduler timeline with inline data', since : '5.3.3' },
            { folder : 'frameworks/vue-3/javascript/eventedit', version : 'Vue 3', title : 'Customized event editor', since : '5.1', updated : '5.3.0' },
            { folder : 'frameworks/vue-3/javascript/inline-data', version : 'Vue 3', title : 'Inline data', since : '5.0.3', updated : '5.3.0' },
            { folder : 'frameworks/vue-3/javascript/undoredo', version : 'Vue 3', title : 'Undo/redo', since : '5.1', updated : '5.3.0' },
            { folder : 'frameworks/vue-3/javascript/visible-hours', version : 'Vue 3', title : 'Configuring visible hours', since : '5.1', updated : '5.3.0' }
        ]
    },

    'Vue 2 examples' : {
        overlay : 'vue',
        tab     : 'vue',
        build   : true,
        items   : [
            { folder : 'frameworks/vue/javascript/filtering', version : 'Vue 2', title : 'Event filtering' }
        ]
    }
};

// Flatten examples tree
window.examples = Object.entries(examples).map(([group, parent]) => parent.items.map(item => Object.assign(item, parent, { group, items : undefined }))).flat();
