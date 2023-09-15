const dragSource = document.createElement('div');

dragSource.id = 'event-source';
dragSource.className = 'draggable-event-container';
dragSource.innerHTML = `
    <legend>Currently outstanding tasks</legend>
    <div class="draggable-event">Do This</div>
    <div class="draggable-event">Do That</div>
    <div class="draggable-event">Do The other</div>
`;
targetElement.appendChild(dragSource);

const calendar = new Calendar({
    // Where to render to, accepts an element or an element id
    appendTo : targetElement,

    // Normally sizing would be handled by CSS, but for simplicity
    // we use fixed height for the tutorial
    height : 800,

    // Date that the calendar will show initially
    date : '2023-06-16',

    // Configure Calendar features
    features : {
        // Turn on the drag from external UI feature
        externalEventSource : {
            // The id of the element to drag from.
            dragRootElement : 'event-source',

            // Selector which, when dragged yields the textContent
            // as the new event name to be dragged into the Calendar
            dragItemSelector : '.draggable-event'
        },

        // Configure away the EventEdit feature by specifying it as null
        eventEdit : null
    },

    // CrudManager handles data loading (and syncing, but not in this example)
    crudManager : {
        loadUrl  : 'data/Calendar/examples/guides/tutorial/data.json',
        autoLoad : true
    }
});
