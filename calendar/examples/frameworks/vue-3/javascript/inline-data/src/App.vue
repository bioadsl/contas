<!-- Application -->
<template>
    <!-- BryntumDemoHeader component is used for Bryntum example styling only and can be removed -->
    <bryntum-demo-header />
    <bryntum-calendar
        ref="calendar"
        v-bind="calendarConfig"
        :events="events"
        :resources="resources"
    />
</template>

<script>
import { ref, reactive } from 'vue';

import {
    BryntumDemoHeader,
    BryntumCalendar
} from '@bryntum/calendar-vue-3';

import { useCalendarConfig } from '@/AppConfig';
import * as appData from '@/AppData';

export default {
    name : 'App',

    components : {
        BryntumDemoHeader,
        BryntumCalendar
    },

    setup() {
        const calendar = ref(null);

        const calendarConfig = reactive(useCalendarConfig());

        const events = ref(appData.events);
        const resources = ref(appData.resources);

        return {
            calendar,
            calendarConfig,
            events,
            resources
        };
    }
};
</script>

<style lang="scss">
@import './App.scss';
</style>
