# Bryntum Calendar events in Vue

The Bryntum Calendar events are passed up to the Vue wrapper which makes it possible to listen to them the standard
Vue way.

## Listening to events

The following code demonstrates listening to the `eventClick` event:

Html:

```javascript
<template>
    <div>
        <bryntum-calendar
            ref="calendar"
            @eventclick="onEventClick"
        />
    </div>
</template>

<script>

import { BryntumCalendar } from "@bryntum/calendar-vue";

export default {

    name: "Calendar App",

    components: { BryntumCalendar },

    methods : {
        onEventClick() {
            // Do something
        }
   }
}
</script>
```

Please note that we prefix the capitalized event name with the `on` keyword and that we pass `$event` as
the argument to the listener.

## Preventable events

By returning `false` from a listener for an event documented as `preventable` the action that would otherwise be
executed after the event is prevented. These events names are usually prefixed with `before`.

For example:

```javascript
<template>
    <div>
        <bryntum-calendar
            ref="calendar"
            @beforeeventedit="onBeforeEventEdit"
        />
    </div>
</template>

<script>

import { BryntumCalendar } from "@bryntum/calendar-vue";

export default {

    name: "Calendar App",

    components: { BryntumCalendar },

    methods : {
        onBeforeEventEdit() {
            if (someCondition) {
                return false;
            }
        }
   }
}
</script>
```


<p class="last-modified">Last modified on 2023-08-30 8:52:26</p>