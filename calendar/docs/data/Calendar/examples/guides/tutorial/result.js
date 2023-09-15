CSSHelper.insertRule('.result .b-cal-event { border-radius : 25px; }');

const calendar = new Calendar({
    // Where to render to, accepts an element or an element id
    appendTo : targetElement,

    // Only used to allow scoping the custom CSS rule added above
    cls : 'result',

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

    // Start with month view visible so that event style can be seen
    mode : 'month',

    // CrudManager handles data loading (and syncing, but not in this example)
    crudManager : {
        loadUrl  : 'data/Calendar/examples/guides/tutorial/data.json',
        autoLoad : true
    }
});
