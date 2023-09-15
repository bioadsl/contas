const calendar = new Calendar({
    // Where to render to, accepts an element or an element id
    appendTo : targetElement,

    // Normally sizing would be handled by CSS, but for simplicity
    // we use fixed height for the tutorial
    height : 800,

    // Date that the calendar will center round initially
    date : '2023-06-16',

    // CrudManager handles data loading (and syncing, but not in this example)
    crudManager : {
        loadUrl  : 'data/Calendar/examples/guides/tutorial/data.json',
        autoLoad : true
    }
});
