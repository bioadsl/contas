# Tutorial

Follow the steps in this tutorial to get this app up and running:

<div class="external-example" data-file="Calendar/guides/tutorial/result.js"></div>

## 1. Minimal html page

In this first step we are going to create a basic index.html file with what we need to get started. Please add the
following:

```html
<html>

<head>
    <title>Tutorial</title>
    <!-- Include a theme -->
    <link rel="stylesheet" href="build/calendar.material.css" data-bryntum-theme>
</head>

<body>
    <!-- Include the tutorial app -->
    <script type="module" src="app.js"></script>
</body>

</html>
```

Make sure that the path to the stylesheet is correct for your local setup.

## 2. Minimal Calendar

Now we are going to add a minimal Calendar to the `app.js` file:

```javascript
import { Calendar, Toast } from 'calendar.module.js';

const calendar = new Calendar({
    // Where to render to, accepts an element or an element id
    appendTo : document.body,
    
    // Normally sizing would be handled by CSS, but for simplicity
    // we use fixed height for the tutorial 
    height : 800,

    // Date that the calendar will center round initially
    date : '2023-06-16',
});
```

The page should now show something similar to this:

<div class="external-example" data-file="Calendar/guides/tutorial/minimal.js"></div>

## 3. Load data

The calendar above is very empty, lets populate it with some data.

Calendar accepts inline data, or it can use a `CrudManager` to load remote data. Depending on your setup you will
want to pick one or the other.

If you for example have multiple widgets on your page displaying the same data, you might already have it available on
the client - supplying it as inline data can then be cheaper than remotely loading it also for Calendar. But for most
cases loading it remotely will be the best fit.

To load data remotely, configure `crudManager` with an url to load from. Modify the previous snippet, adding the 
following:

```javascript
const calendar = new Calendar({
    
    // Code from the previous step omitted for brevity
    // ...

    // CrudManager handles data loading (and syncing, but not in this example)
    crudManager : {
        loadUrl  : 'data/data.json',
        autoLoad : true
    }
});
```

The response is expected in a specific format
(see [this guide](#Calendar/guides/data/crud_manager.md#load-response-structure)). The data used for this tutorial is
available here: [data.json](data/Calendar/examples/guides/tutorial/data.json). An excerpt from that file:

```json
{
  "success" : true,
  "events" : {
    "rows" : [
      { 
        "id"         : 1, 
        "resourceId" : 1, 
        "startDate"  : "2023-04-17", 
        "duration"   : 7, 
        "name"       : "Project Kickoff"
      },
      {
        "..." : "..."
      }
    ]
  }
}
```

Note that although not shown above, the response also contains a `resources` section. Resources may be assigned
to events.
The `events` section is used as the event source. Also note that while events are defined with a 
`startDate` and a `duration`, you can also instead supply a `startDate` and an `endDate`.

Make sure the url points to where you placed your data. With the correct load url now in place, you should be seeing the
following:

<div class="external-example" data-file="Calendar/guides/tutorial/load.js"></div>

## 4. Saving changes

As for loading data, you have multiple options for saving changes. You can use the `CrudManager` to sync changes 
automatically to the backend (by configuring it with a `syncUrl` and `autoSync`), which requires your backend to follow
the CrudManager protocol. Or you can listen for changes and send them to your backend manually, trading ease of use on
the client for flexibility on the server.

In this step we will use the latter approach. We will listen for changes, but since we have no backend in place we will
just show the changes in a toast. Modify the previous snippet, adding the following:

```javascript
const calendar = new Calendar({
    // Code from the previous step omitted for brevity
    // ...

    crudManager : {
        loadUrl  : 'data/data.json',
        autoLoad : true,
        // New code ↓
        listeners : {
            // Listener for the `hasChanges` event, triggered when any store
            // handled by the crud manager has changes
            hasChanges() {
                Toast.show({
                    html    : JSON.stringify(calendar.crudManager.changes, true, 4).replaceAll('\n', '<br>').replaceAll(/\s/g, '\xa0'),
                    timeout : 5000
                });


                // In a real app you would send the changes to the server here.
                // Then you would call `calendar.crudManager.acceptChanges()` to 
                // clear local changes.
            }
        }
    }
});
```

Try it out here by dragging events to a new time slot:

<div class="external-example" data-file="Calendar/guides/tutorial/save.js"></div>

## 5. Enabling features

Calendar ships with a set of features that can be enabled/disabled and configured to affect the functionality of the
component (see the [Calendar features](#Calendar/guides/basics/features.md) guide). We are going to enable
the `ExternalEventSource` feature which allows new events to be dragged into the calendar from a specified DOM
element.

Alter your Calendar config, add:

```javascript
const calendar = new Calendar({
    // Code from the previous steps omitted for brevity
    // ...

    // Configure Calendar features
    features : {
        // Turn on the drag from external UI feature
        externalEventSource : {
            // Selector which, when dragged yields the textContent
            // as the new event name to be dragged into the Calendar
            dragItemSelector : '.draggable-event'
        }
    }
});
```

That change yields the following app:

<div class="external-example" data-file="Calendar/guides/tutorial/features.js"></div>

## 6. Reacting to events

Calendar, its features and data stores fire a number of events that you can listen to, for example Calendar fires 
`eventClick` when clicking an event, the `resourceStore` fires `add` when a new resources is added, etc. See the API 
docs for each class for all events (Calendar's events are for example [listed here](#Calendar/view/Calendar#events)).

To catch an event, you can either specify declarative `listeners` in the config, or add them programmatically using the 
`on` method. In this step we will add a declarative listener for the `eventClick` event, and a programmatic listener for
the `beforeEventEdit` event.

```javascript
const calendar = new Calendar({
    // Code from the previous steps omitted for brevity
    // ...

    // Declarative listener
    listeners : {
        eventClick({ eventRecord }) {
            Toast.show(`Clicked ${eventRecord.name}`);
        }
    }
});

// Programmatic listener
calendar.on('beforeEventEdit', ({ eventRecord }) => {
    Toast.show(`Editing ${eventRecord.name}`);
});
```

<div class="external-example" data-file="Calendar/guides/tutorial/events.js"></div>

## 7. Adding some style and color

For the last step of this tutorial we are going to apply some color and styling to the Calendar. For more info on the
topic, see the [Styling](#Calendar/guides/customization/styling.md) guide.

An event's color is derived from two sources: the resource and the event itself.

An event's look is determined in a similar way, by using a resource's `eventStyle` field or the event's own `style` field.

In this example, the event data is loaded inline.

```javascript
const calendar = new Calendar({

    // Code from the previous steps omitted for brevity
    // ...

      // Events contain their own colour definitions
    events : [
        { startDate : '2020-08-30T07:00', duration : 2, durationUnit : 'h', name : 'red', eventColor : 'red' },
        ...
    ]
});
```

<div class="external-example" data-file="Calendar/guides/tutorial/styling1.js"></div>

You can of course also use CSS to style the Calendar and its events. For example, to add more border-radius for a
rounded look when events are rendered as bars (such as in a MonthView):

```css
.b-cal-event { 
    border-radius : 25px; 
}
```

Much rounder now:

<div class="external-example" data-file="Calendar/guides/tutorial/result.js"></div>

That's it, you finished the tutorial 👍 Happy coding!

<p class="last-modified">Last modified on 2023-08-30 7:47:09</p>