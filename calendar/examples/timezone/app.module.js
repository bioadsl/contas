import { DateHelper, ObjectHelper, Calendar, TimeZoneHelper, StringHelper } from '../../build/calendar.module.js';
import shared from '../_shared/shared.module.js';

const
    dataPromise = fetch('data/data.json').then(async response => await response.json()),
    setDates    = (record, baseDate) => {
        // Dates are from 11-18:th.
        const
            currentStartDate = new Date(record.startDate),
            startDeltaDay    = currentStartDate.getDate() - 11,
            currentEndDate   = new Date(record.endDate),
            endDeltaDay      = currentEndDate.getDate() - 11;

        record.startDate = new Date(Date.UTC(
            baseDate.getFullYear(),
            baseDate.getMonth(),
            baseDate.getDate() + startDeltaDay,
            currentStartDate.getHours(),
            currentStartDate.getMinutes()
        ));
        record.endDate = new Date(Date.UTC(
            baseDate.getFullYear(),
            baseDate.getMonth(),
            baseDate.getDate() + endDeltaDay,
            currentEndDate.getHours(),
            currentEndDate.getMinutes()
        ));
    };

shared.mockUrl('timezone-data', async(url, urlParams, { queryParams }) => {
    const
        { events, resources } = await dataPromise,
        e                     = ObjectHelper.clone(events),
        date                  = DateHelper.startOf(DateHelper.parseKey(queryParams.startDate), 'week');

    // Convert all dates to one close to provided date
    e.forEach(event => setDates(event, date));

    return {
        delay        : 100,
        responseText : JSON.stringify({
            success   : true,
            resources : {
                rows : resources
            },
            events : {
                rows : e
            }
        })
    };
});

// Event renderer which displays the unconverted UTC date as a string
const
    eventRenderer = ({ eventRecord }) => {
        let toRender = StringHelper.encodeHtml(eventRecord.name);

        if (!eventRecord.allDay) {
            const utcString = TimeZoneHelper.fromTimeZone(eventRecord.startDate, calendar.project.timeZone).toISOString();

            toRender += `<div style="font-size:0.7em;position:absolute;top:5px;right:5px;">${utcString.substring(11, 16)} UTC</div>`;
        }

        return toRender;
    },

    timeZones = ['America/Caracas', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'America/New_York',
        'America/Sao_Paulo', 'America/St_Johns', 'Asia/Bangkok', 'Asia/Dhaka', 'Asia/Hong_Kong', 'Asia/Tokyo',
        'Australia/Adelaide', 'Australia/Melbourne', 'Europe/London', 'Europe/Helsinki', 'Europe/Moscow',
        'Europe/Stockholm', 'Indian/Maldives', 'Indian/Mahe', 'Pacific/Auckland', 'Pacific/Honolulu'],

    calendar = new Calendar({
        appendTo : 'container',

        modes : {
            day : {
                eventRenderer
            },
            week : {
                eventRenderer
            }
        },

        crudManager : {
            loadUrl  : 'timezone-data',
            autoLoad : false,
            autoSync : false
        },

        features : {
            loadOnDemand : {
                alwaysLoadNewRange : true
            }
        },

        tbar : {
            items : {
                timezone : {
                    label          : 'Timezone:',
                    type           : 'combo',
                    filterOperator : '*',
                    width          : 300,
                    weight         : 600,
                    // Available options in the-drop down menu is those available for the native Intl.DateTimeFormat. The actual
                    // time zone conversion uses toLocaleString('locale', { timeZone: chosenTimeZone }) and then parses it into
                    // a local system date.
                    items          : Intl.supportedValuesOf?.('timeZone') || timeZones,
                    value          : new Intl.DateTimeFormat().resolvedOptions().timeZone, // Start value is local system timezone
                    onSelect       : 'up.onTimezoneSelected'
                }
            }
        },

        onTimezoneSelected({ record }) {
            this.project.timeZone = record.text;
        }
    });
