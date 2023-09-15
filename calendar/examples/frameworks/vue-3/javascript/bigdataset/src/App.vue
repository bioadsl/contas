<!-- Application -->
<template>
    <!-- BryntumDemoHeader component is used for Bryntum example styling only and can be removed -->
    <bryntum-demo-header />
    <bryntum-calendar
        ref="calendarRef"
        v-bind="calendarConfig"
        :onActiveItemChange="onActiveItemChange"
    />
</template>

<script>
// vue imports
import { ref, onMounted } from 'vue';

// app components
import {
    BryntumDemoHeader,
    BryntumCalendar
} from '@bryntum/calendar-vue-3';
import { calendarConfig } from '@/AppConfig';

export default {
    name : 'App',

    components : {
        BryntumDemoHeader,
        BryntumCalendar
    },

    setup() {
        const calendarRef = ref(null);

        function onActiveItemChange({ activeItem }) {
            const calendar = calendarRef.value.instance.value;
            // Only meaningful if we are on the month view
            calendar.widgetMap.autoRowHeight.disabled = activeItem.modeName !== 'month';
        }

        function onAutoRowHeightChanged({ checked }) {
            const calendar = calendarRef.value.instance.value;

            calendar.modes.month.autoRowHeight = checked;
        }

        // Called as the resourceFilterFilter's onChange handler
        function onResourceFilterFilterChange({ value }) {
            const calendar = calendarRef.value.instance.value;
            // A filter with an id replaces any previous filter with that id.
            // Leave any other filters which may be in use in place.
            calendar.widgetMap.resourceFilter.store.filter({
                id       : 'resourceFilterFilter',
                filterBy : r => r.name.toLowerCase().startsWith(value.toLowerCase()) // a function which returns true to include the record
            });
        }

        onMounted(() => {
            const calendar = calendarRef.value.instance.value;

            calendar.widgetMap.autoRowHeight.on({ change : onAutoRowHeightChanged });
            calendar.widgetMap.resourceFilterFilter.on({ change : onResourceFilterFilterChange });
        });

        return {
            calendarConfig,
            onActiveItemChange,
            calendarRef
        };
    }
};
</script>

<style lang="scss">
@import './App.scss';
</style>
