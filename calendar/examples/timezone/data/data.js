import DateHelper from '../../../lib/Core/helper/DateHelper.js';
import ObjectHelper from '../../../lib/Core/helper/ObjectHelper.js';
import shared from '../../_shared/shared.js';

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
