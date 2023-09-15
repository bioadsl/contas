var {
    Calendar
} = bryntum.calendar;
const calendar = new Calendar({
    // Start life looking at this date
    date        : new Date(2021, 0, 1),
    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        transport : {
            load : {
                // The data set has multi assigned events
                url : 'data/data.json'
            }
        },
        autoLoad : true
    },
    appendTo          : 'container',
    // Where the avatar rendering utility finds the resource images
    resourceImagePath : '../_shared/images/users/',
    // Features named by the properties are included.
    // An object is used to configure the feature.
    features          : {
        eventTooltip : {
            // Configuration options are passed on to the tooltip instance
            // We want the tooltip's left edge aligned to the right edge of the event if possible.
            align : 'l-r'
        }
    },
    // When rendering needs a resource to get a colour and style from, ensure
    // we use the first resource that is still filtered in.
    filterEventResources : true,
    modes                : {
        week : {
            // Show avatars in last position
            showResourceAvatars : 'last'
        }
    }
});
