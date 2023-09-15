import { Calendar, LocaleManager, Localizable } from '../../build/calendar.module.js';
import shared from '../_shared/shared.module.js';
/**
 * Localization demo main app file
 */

// Importing custom locales

// Enable missing localization Error throwing here to show how it can be used in end-user apps
// All non-localized strings which are in `L{foo}` format will throw runtime error
LocaleManager.throwOnMissingLocale = true;

// panel with toolbar and grid
const calendar = new Calendar({
    // Start life looking at this date
    date : new Date(2020, 9, 12),

    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        transport : {
            load : {
                url : 'data/data.json'
            }
        },
        autoLoad : true
    },

    appendTo : 'container',

    // Features named by the properties are included.
    // An object is used to configure the feature.
    features : {
        eventTooltip : {
            // Configuration options are passed on to the tooltip instance
            // We want the tooltip's left edge aligned to the right edge of the event if possible.
            align : 'l-r'
        }
    },

    tbar : {
        items : {
            showAllDayEvents : {
                type       : 'button',
                text       : 'L{Show all day events}',
                toggleable : true,
                pressed    : true,
                onToggle({ pressed }) {
                    if (!pressed) {
                        calendar.eventStore.filter({
                            id       : 'allday',
                            filterBy : record => !record.allDay
                        });
                    }
                    else {
                        calendar.eventStore.removeFilter('allday');
                    }
                }
            },
            myButton : {
                type : 'button'
            },

            // Use button form with dropdown menu due to the other items on the tbar
            modeSelector : {
                responsive : null,
                minified   : true
            }
        }
    },

    setDemoTitle() {
        const title                                = Localizable().L('L{App.Localization demo}');
        document.getElementById('title').innerHTML = `<h1>${title}</h1>`;
        document.title                             = title;
    },

    setMyButtonText() {
        const { myButton } = this.tbar.widgetMap;
        myButton.text      = myButton.L('L{My button}', Math.floor(Math.random() * 100));
    },

    onLocaleUpdated() {
        this.setDemoTitle();
        this.setMyButtonText();
    },

    listeners : {
        paint({ firstPaint }) {
            if (firstPaint) {
                // Add listener to update contents when locale changes
                LocaleManager.on('locale', this.onLocaleUpdated, this);

                // update localization after load
                this.onLocaleUpdated();
            }
        }
    }
});
