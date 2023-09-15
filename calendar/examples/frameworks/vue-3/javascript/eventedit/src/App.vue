<!-- Application -->
<template>
    <!-- BryntumDemoHeader component is used for Bryntum example styling only and can be removed -->
    <bryntum-demo-header />
    <bryntum-calendar
        v-bind="calendarConfig"
    />
</template>

<script>
// vue imports

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
        return {
            calendarConfig
        };
    }
};
</script>

<style lang="scss">
@import './App.scss';
</style>
