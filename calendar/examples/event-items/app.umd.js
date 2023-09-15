var {
    EventModel,
    Combo,
    Calendar,
    CrudManager,
    DomSync,
    DateHelper,
    StringHelper,
    ResourceModel,
    AvatarRendering
} = bryntum.calendar;

// A custom Event class with a few extra fields. You can extend this to add any fields and methods you want.
class Event extends EventModel {
    static $name = 'Event';
    static fields = [{
        name     : 'guests',
        internal : true
    }];

    static defaults = {
        guests : []
    };
}
class GuestSelector extends Combo {
    static $name = 'GuestSelector';
    static type = 'guestSelector';
    static configurable = {
        label        : 'Guests',
        displayField : 'name',
        multiSelect  : true,
        editable     : false
    };

    construct() {
        super.construct(...arguments);
        this.store = this.crudManager.getStore('guests');
    }
}

// Register this type with its factory
GuestSelector.initClass();

// The CrudManager arranges loading and syncing of data in JSON form from/to a web service
const crudManager = new CrudManager({
        resourceStore : {
            sorters : [{
                field     : 'name',
                ascending : true
            }]
        },
        // This demo uses a custom Event model with extra fields
        eventStore : {
            modelClass : Event
        },
        stores : [{
            storeId    : 'guests',
            modelClass : ResourceModel
        }],
        loadUrl  : 'data/data.json',
        autoLoad : true
    }),
    // Render the list of event guests
    eventRenderer = ({
        eventRecord,
        renderData,
        view
    }) => {
        const calendar = view.up('calendar'),
            guestsStore = calendar.crudManager.getStore('guests'),
            guestList = guestsStore.getRange().filter(r => eventRecord.guests.includes(r.id)),
            displayList = guestList.map(r => `<div>${r.name}</div>`);
        if (!calendar.avatarRendering) {
            calendar.avatarRendering = new AvatarRendering({
                element : calendar.element
            });
        }
        if (eventRecord.important) {
            renderData.iconCls['b-fa b-fa-exclamation'] = 1;
        }
        return {
            tag       : 'div',
            className : 'b-event-content',
            children  : [{
                tag       : 'span',
                className : 'b-event-name',
                text      : eventRecord.name
            }, {
                tag       : 'div',
                className : 'b-avatars-container',
                children  : guestList.map(r => calendar.avatarRendering.getResourceAvatar({
                    initials : r.initials,
                    dataset  : {
                        btip : r.name
                    }
                }))
            }]
        };
    },
    calendar = new Calendar({
        crudManager,
        // A block of configs which is applied to all modes.
        // We want overflow popups to show right on top of the day cell, so reconfigure
        // its align object.
        modeDefaults : {
            overflowPopup : {
                align : {
                    align  : 'c-c',
                    anchor : false
                }
            }
        },
        // Start life looking at this date
        date     : new Date(2023, 9, 8),
        appendTo : 'container',
        // Features named by the properties are included.
        // An object is used to configure the feature.
        features : {
            eventEdit : {
                editorConfig : {
                    width : 500
                },
                // Any items configured on the eventEdit feature are merged into the items
                // definition of the default editor.
                // If a system-supplied name is used as a property, it will reconfigure that existing
                // field.
                // Configuring a system-supplied field as false removes that field.
                // If a new property name is used, it will be added to the editor.
                // Fields are sorted in ascending order of their weight config.
                // System-supplied input fields have weights from 100 to 800.
                // This new item is therefore inserted below the first existing field.
                items : {
                    // Add a multiselect combo box to select guests
                    guestSelector : {
                        // name is the input name which corresponds to the field in the
                        // event record which is being edited.
                        name      : 'guests',
                        type      : 'guestselector',
                        // We prefer the clear trigger at the end.
                        // Higher weights gravitate towards center.
                        clearable : {
                            weight : -1000
                        },
                        // We'd like ESC to revert to initial value.
                        revertOnEscape : true,
                        // Insert just after event name which is at 100
                        weight         : 110,
                        // Don't allow it to grow our of control.
                        // Will begin to scroll the chips when it hits this limit.
                        maxHeight      : '8em',
                        crudManager
                    }
                }
            }
        },
        // Modes are the views available in the Calendar.
        // An object may be used to configure the view.
        // null means do not include the view.
        modes : {
            week : {
                eventRenderer
            },
            day : {
                eventRenderer
            }
        }
    });
