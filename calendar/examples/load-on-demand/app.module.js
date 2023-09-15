import { Calendar, DateHelper, Toast } from '../../build/calendar.module.js';
import shared from '../_shared/shared.module.js';

const
    today       = new Date(),
    currentYear = today.getFullYear(),
    eventColors = [
        '#D50000', '#E67C73', '#F4511E', '#F6BF26',
        '#33B679', '#0B8043', '#039BE5', '#3F51B5',
        '#7986CB', '#8E24AA', '#616161'],
    eventNames  = [
        'Quarterly Board Meeting',
        'Development Meeting',
        'Sales Dept Meeting',
        'Interview with Julia',
        'Interview with Naomi'],
    sourceRecords   = new Array(100000);

// Create 100,000 events
for (let i = 0; i < 100000; i++) {
    const
        year          = Math.round(Math.random() * (currentYear + 5 - currentYear) + currentYear),
        month         = Math.round(Math.random() * 12),
        day           = Math.round(Math.random() * 31),
        hour          = Math.round(Math.random() * 8) + 4,
        durationHours = Math.round(Math.random() * 71) + 1;

    sourceRecords[i] = {
        id         : i,
        name       : eventNames[Math.round(Math.random() * 4)],
        startDate  : new Date(year, month, day, hour),
        endDate    : new Date(year, month, day, hour + durationHours),
        eventColor : eventColors[Math.round(Math.random() * 10)],
        resourceId : Math.round(Math.random() * 4)
    };
}

// Mocked up end point for the CrudManager just to avoid having to set up a server
shared.mockUrl('dynamic-load', (url, urlParams, { queryParams }) => {
    const
        startDate = DateHelper.parseKey(queryParams.startDate),
        endDate   = DateHelper.parseKey(queryParams.endDate),
        events    = startDate && endDate ? sourceRecords.filter(e => {
            return !e.removed && DateHelper.intersectSpans(startDate, endDate, e.startDate, e.endDate);
        }) : [];

    Toast.show(`Server request for ${queryParams.startDate} to ${queryParams.endDate}`);

    return {
        delay        : 100,
        responseText : JSON.stringify({
            success   : true,
            resources : {
                rows : []
            },
            events : {
                rows : events
            }
        })
    };
});

// Mocked up end point for the CrudManager just to avoid having to set up a server
// We can fake create, update and delete.
shared.mockUrl('dynamic-load-sync', (url, urlParams, { body, queryParams }) => {
    body = JSON.parse(body);
    const {
        added,
        removed,
        updated
    } = body.events;

    updated?.forEach(e => {
        e.startDate && (e.startDate = DateHelper.parse(e.startDate));
        e.endDate && (e.endDate = DateHelper.parse(e.endDate));
        Object.assign(sourceRecords[e.id], e);
    });

    removed?.forEach(e => {
        // load handler filters these out
        sourceRecords[e.id].removed = true;
    });

    added?.forEach(e => {
        e.id = sourceRecords.length;

        e.startDate && (e.startDate = DateHelper.parse(e.startDate));
        e.endDate && (e.endDate = DateHelper.parse(e.endDate));
        sourceRecords[e.id] = e;
    });

    return {
        delay        : 100,
        responseText : JSON.stringify({
            success : true,
            events  : {
                rows : [...(added || []), ...(removed || []), ...(updated || [])]
            }
        })
    };
});

const calendar = new Calendar({
    appendTo : 'container',

    crudManager : {
        loadUrl  : 'dynamic-load',
        syncUrl  : 'dynamic-load-sync',
        autoLoad : false,
        autoSync : true
    },

    // Will control the CrudManager sending load requests only for
    // the date range the UI requires.
    features : {
        loadOnDemand : {
            // Clear down the store on range change so we get a clear UI.
            clearOnNewRange : true
        }
    },

    // Start life looking at this date
    date : new Date(),

    onDateRangeLoad(e) {
        Toast.show(`Loaded ${this.eventStore.count} events`);
    }
});
