const calendar = new Calendar({
    // Where to render to, accepts an element or an element id
    appendTo : targetElement,

    // Normally sizing would be handled by CSS, but for simplicity
    // we use fixed height for the tutorial
    height : 800,

    // Date that the calendar will center round initially
    date : '2023-06-16',

    // Configure Calendar features
    features : {
        // Reconfigure the EventTooltip feature to show the tip on hover
        // The default is to show it on click.
        eventTooltip : {
            showOn : 'hover'
        }
    },

    // CrudManager handles data loading (and syncing, but not in this example)
    crudManager : {
        loadUrl   : 'data/Calendar/examples/guides/tutorial/data.json',
        autoLoad  : true,
        listeners : {
            // Listener for the `hasChanges` event, triggered when any store handled
            // by the crud manager has changes
            hasChanges() {
                Toast.show({
                    html    : JSON.stringify(calendar.crudManager.changes, true, 4).replaceAll('\n', '<br>').replaceAll(/\s/g, '\xa0'),
                    timeout : 5000
                });
            }
        }
    },

    // Declarative listener
    listeners : {
        eventClick : 'handleEventClick'
    },

    handleEventClick({ eventRecord }) {
        Toast.show(`Clicked ${eventRecord.name}`);
    }
});

// Programmatic listener
calendar.on('beforeEventEdit', ({ eventRecord }) => {
    Toast.show(`Editing ${eventRecord.name}`);
});
