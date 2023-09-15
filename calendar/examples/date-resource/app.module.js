import { Calendar } from '../../build/calendar.module.js';
import shared from '../_shared/shared.module.js';

const calendar = new Calendar({
    appendTo : 'container',
    date     : new Date(2023, 3, 2),

    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        autoLoad : true,
        loadUrl  : 'data/data.json'
    },

    resourceImagePath : '../_shared/images/users/',

    modes : {
        day         : null,
        week        : null,
        month       : null,
        year        : null,
        agenda      : null,
        dayresource : {
            // Save a little space by hiding weekends.
            hideNonWorkingDays : true,

            // Configure a nice min-width for the resource columns
            minResourceWidth : '10em',

            // Demo uses more padding than default, switch to the short event duration "earlier" to fit contents
            shortEventDuration : '1 hour'
        }
    },

    sidebar : {
        // Existing sidebar widgets can be customized and extra UI Widgets can be easily added too
        items : {
            datePicker : {
                tbar : {
                    // Hide the next/prev year buttons for a bit cleaner UI
                    items : {
                        prevYear : false,
                        nextYear : false
                    }
                }
            },
            resourceFilter : {
                minHeight : '22em',
                store     : {
                    // Group resources by a custom `team` field
                    groupers : [
                        { field : 'team', ascending : true }
                    ]
                },
                // initially select record team members of the Austin team
                selected : [1, 2, 3]
            }
        }
    },

    tbar : {
        items : {
            showAvatars : {
                type     : 'checkbox',
                text     : 'Show avatar',
                weight   : 600,
                checked  : true,
                style    : 'margin   : 0 1em',
                // "up." means resolve in owner will call on the Calendar
                onChange : 'up.onShowAvatarsChanged'
            },

            hideWeekends : {
                type     : 'checkbox',
                text     : 'Hide weekends',
                weight   : 600,
                checked  : true,
                style    : 'margin   : 0 1em',
                // "up." means resolve in owner will call on the Calendar
                onChange : 'up.onHideWeekendsChanged'
            },

            viewWidth : {
                type        : 'slider',
                text        : 'Resource width',
                weight      : 640,
                min         : 4,
                max         : 35,
                value       : 10,
                width       : 150,
                unit        : 'em',
                showValue   : false,
                showTooltip : true,
                onInput     : 'up.onResourceWidthChanged'
            }
        }
    },

    onShowAvatarsChanged({ value }) {
        this.activeView.showHeaderAvatars = value;
    },

    onHideWeekendsChanged({ value }) {
        this.activeView.hideNonWorkingDays = value;
    },

    onResourceWidthChanged({ source : { unit }, value }) {
        this.activeView.minResourceWidth = `${value}${unit}`;
    }
});
