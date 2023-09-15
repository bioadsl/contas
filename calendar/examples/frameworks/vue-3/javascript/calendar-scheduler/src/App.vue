<!-- Application -->
<template>
    <!-- BryntumDemoHeader component is used for Bryntum example styling only and can be removed -->
    <bryntum-demo-header />
    <bryntum-calendar
        ref="calendar"
        mode="timeline"
        v-bind="calendarConfig"
    />
</template>

<script>
// vue imports
import { ref } from 'vue';

// app components
import {
    BryntumDemoHeader,
    BryntumCalendar
} from '@bryntum/calendar-vue-3';
import { MessageDialog, Toast } from '@bryntum/calendar';
import { useCalendarConfig } from '@/AppConfig';

export default {
    name : 'App',

    components : {
        BryntumDemoHeader,
        BryntumCalendar
    },

    mounted() {
        Toast.show({
            timeout  : 3500,
            maxWidth : 480,
            html     : 'Please note that this example uses the <a href="//bryntum.com/products/scheduler">Bryntum Scheduler</a>, which is licensed separately.'
        });
    },

    setup() {
        // Catch drops
        async function beforeEventDropFinalize({ context }) {
            // Confirm drop if none of the events are recurring (recurring events already show a
            // confirmation dialog by default)
            if (context.eventRecords.every(event => !event.isRecurring)) {
                // EventDrag in Scheduler uses a legacy approach to handle async listeners. By setting this
                // flag it will handle responsibility for finalizing the drop over to the listener
                context.async = true;

                // Show confirmation dialog
                const result = await MessageDialog.confirm({
                    title   : 'Confirm move',
                    message : 'Are you sure you want to move the event?'
                });

                // Finalize depending on user choice
                context.finalize(result === MessageDialog.okButton);
            }
        }

        // Catch resize
        async function beforeEventResizeFinalize({ context }) {
            // Confirm resize if not recurring (recurring events already ask for confirmation by default)
            if (!context.eventRecord.isRecurring) {
                // EventResize in Scheduler uses a legacy approach to handle async listeners. By setting
                // this flag it will handle responsibility for finalizing the resize over to the listener
                context.async = true;

                // Show confirmation dialog
                const result = await MessageDialog.confirm({
                    title   : 'Confirm resize',
                    message : 'Are you sure you want to resize the event?'
                });

                // Finalize depending on user choice
                context.finalize(result === MessageDialog.okButton);
            }
        }

        const calendar = ref(null);
        const calendarConfig = useCalendarConfig({ beforeEventDropFinalize, beforeEventResizeFinalize });

        return {
            calendarConfig,
            calendar
        };
    }
};
</script>

<style lang="scss">
@import './App.scss';
</style>
