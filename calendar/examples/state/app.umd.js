var {
    AjaxHelper,
    AsyncHelper,
    Calendar,
    StateProvider
} = bryntum.calendar;

/**
 * A simple example of saving a StateProvider's data to a backend.
 */
class BackendState {
    constructor(stateProvider) {
        this.stateProvider = stateProvider;
    }

    async init() {

        const response = await AjaxHelper.get('data/state.json');
        this.stateProvider.data = await response.json();

        // Start listening for changes after we load up the data:
        this.stateProvider.on({
            save : this.onSave.bind(this)
        });
    }

    onSave() {
    // Grab data to save and call save() if it is not running already. We could
    // use the "stateIds" we receive to deal with only those properties that are
    // changing. See Core.state.StateProvider "save" event for more details.
        this.stateData = this.stateProvider.data;
        if (!this.saving) {
            this.save().catch(err => console.warn('Failed to persist state', err));
        }
    }

    async save() {
        this.saving = true;
        try {
            while (this.stateData) {
                // Grab the changes and save them. Keep doing so until all are saved.
                const data = this.stateData;
                this.stateData = null;
                await this.saveChanges(data);
            }
        }
        finally {
            this.saving = false;
        }
    }

    async saveChanges() {

        await AsyncHelper.sleep(250);
    }
}
function launch() {
    const calendar = new Calendar({
    // Start life looking at this date
        date     : new Date(2020, 9, 12),
        // But on every run, start where we left off
        stateful : ['date'],
        // The key used to automatically save this widget's state in the page's state provider
        stateId  : 'mainCalendar',
        sidebar  : {
            stateful : ['collapsed']
        },
        tbar : {
            items : {
                resetState : {
                    text    : 'Reset to default',
                    onClick : 'up.onResetStateClicked',
                    weight  : 610
                },
                toggleNonWorking : {
                    type     : 'checkbox',
                    label    : 'Hide non working days',
                    onChange : 'up.onHideNonWorkingDaysToggle',
                    weight   : 620
                }
            }
        },
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
        onResetStateClicked() {
            this.resetDefaultState();
            this.widgetMap.toggleNonWorking.checked = this.hideNonWorkingDays;
        },
        onHideNonWorkingDaysToggle({
            checked
        }) {
            this.hideNonWorkingDays = checked;
        },
        onChangeHideNonWorkingDays({
            value
        }) {
            this.widgetMap.toggleNonWorking.value = value;
        }
    });
}

/*
    By default, state is saved locally in localStorage. State can also be saved to
    a backend server, however, there are some caveats to consider when doing so:

    #1 - State must be ready at app launch time

    Stateful widgets consume state data during their construction, which cannot be
    done asynchronously. This can be handled with an AJAX fetch issued before
    widgets are created (as in this example), or by "rendering" the state data on
    the server and returning it as content in the page.

    If the state is loaded asynchronously and applied after widget creation, there
    will be a noticeable flicker as the defaults are replaced with the state values.

    #2 - State is not always the same as settings or preferences

    Users may use an application on different device types (desktop, phone, and
    tablet) and expect their experience on each device to be what they had when
    they last used that device.

    #3 - Undesired state is harder to clear

    Potentially undesired application state will not be cleared by clearing browser
    user data (a common troubleshooting strategy) and will follow the user to other
    browsers as well (another common troubleshooting technique).
 */

if (new URL(window.location).searchParams.get('state') === 'remote') {
    // if ('?state=remote' in URL)
    // For server-side state, initialize the page widgets after the state is loaded from the server.
    new BackendState(StateProvider.setup('memory')).init().then(launch);
}
else {
    // To use localStorage instead of a backend for state, the launch process is simply this:
    StateProvider.setup('local');
    launch();
}
