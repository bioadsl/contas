import { DateHelper, StringHelper, DomClassList } from '@bryntum/calendar';

/**
 * Application configuration
 */
const useCalendarConfig = function({ beforeEventDropFinalize, beforeEventResizeFinalize }) {
    return {
        // Start life looking at this date
        date               : new Date(2023, 9, 9),
        hideNonWorkingDays : true,
        modes              : {
            // Custom mode based on Scheduler
            timeline : {
                type : 'scheduler',

                // Used by the Calendar's mode selector button
                displayName : 'Timeline',

                // Change default event style for Scheduler to better match Calendars look
                eventStyle : 'calendar',

                columns : [
                    { type : 'resourceInfo', field : 'name', text : 'Staff/Resource', width : 220, useNameAsImageName : false }
                ],

                features : {
                    nonWorkingTime     : true,
                    // Shows background timespans that span all resources
                    timeRanges         : true,
                    // Shows  background timespans that span for a specific resource
                    resourceTimeRanges : true
                },

                workingTime : {
                    fromDay  : 1,
                    toDay    : 6,
                    fromHour : 7,
                    toHour   : 22
                },

                // Uncomment to change the date range of the time axis
                // range : 'month',

                // Uncomment to change how much the next / previous buttons shift the time axis
                // stepUnit : 'day',
                rowHeight      : 95,
                resourceMargin : 20,
                viewPreset     : {
                    base      : 'hourAndDay',
                    tickWidth : 70,

                    headers : [{
                        unit       : 'day',
                        dateFormat : 'ddd MM/DD'
                    }, {
                        unit       : 'hour',
                        dateFormat : 'h a'
                    }]
                },

                // Custom eventRenderer to match style used by Calendar
                eventRenderer({ eventRecord, renderData }) {
                    if (eventRecord.isInterDay) {
                        renderData.eventStyle = 'interday';
                        return StringHelper.encodeHtml(eventRecord.name);
                    }

                    renderData.style = 'align-items: start';

                    const
                        { eventColor, iconCls } = renderData,
                        noIcon                  = !iconCls?.length,
                        isRecurring             = eventRecord.isRecurring || eventRecord.isOccurrence;

                    return {
                        class    : 'b-cal-event-body',
                        children : [
                            {
                                class    : 'b-event-header',
                                children : [
                                    {
                                        class : 'b-event-time',
                                        text  : DateHelper.format(eventRecord.startDate, 'LST')
                                    },
                                    isRecurring && {
                                        tag   : 'i',
                                        class : {
                                            'b-icon'                : 1,
                                            'b-fw-icon'             : 1,
                                            'b-cal-event-icon'      : !noIcon,
                                            'b-cal-recurrence-icon' : noIcon,
                                            'b-icon-recurring'      : noIcon,
                                            ...DomClassList.normalize(iconCls, 'object')
                                        },
                                        style : eventColor ? {
                                            color : eventColor
                                        } : null
                                    }
                                ]
                            }, {
                                class : 'b-cal-event-desc',
                                text  : eventRecord.name
                            }
                        ]
                    };
                },

                // Catch events triggered in the Scheduler-based view
                listeners : {
                    beforeEventDropFinalize,
                    beforeEventResizeFinalize
                }
            }
        }
    };
};

export { useCalendarConfig };
