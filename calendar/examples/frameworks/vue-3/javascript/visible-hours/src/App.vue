<!-- Application -->
<template>
    <!-- BryntumDemoHeader component is used for Bryntum example styling only and can be removed -->
    <bryntum-demo-header />
    <bryntum-calendar
        ref="calendarRef"
        v-bind="calendarConfig"
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

        function onStartHourChange({ value }) {
            calendarRef.value.instance.value.activeView.scrollTo(value, {
                animate : true,
                block   : 'start'
            });
        }

        onMounted(() => {
            const calendar = calendarRef.value.instance.value;
            calendar.widgetMap.scrollHour.on({ change : onStartHourChange });
        });

        return {
            calendarConfig,
            calendarRef
        };
    }
};
</script>

<style lang="scss">
@import './App.scss';
</style>
