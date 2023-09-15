# Preventable events

## Preventing events

By returning `false` from a listener for an event documented as `preventable` the action that would otherwise be
executed after the event is prevented. These events names are usually prefixed with `before`.

**Sample code:**

```javascript
onBeforeEventEdit(event) {
    if (someCondition) {
       return false;
    } 
}
```

## Frameworks integration

Check
[Angular](#Calendar/guides/integration/angular/events.md#preventable-events),
[React](#Calendar/guides/integration/react/events.md#preventable-events) and 
[Vue](#Calendar/guides/integration/vue/events.md#preventable-events) framework integration guides for the details.


<p class="last-modified">Last modified on 2023-08-30 8:52:26</p>