import { Panel, CalendarMixin, DateHelper, ObjectHelper, FunctionHelper, Calendar, DaySelectable, DayTime, Month, Base, EventStore } from '../../build/calendar.module.js';
import shared from '../_shared/shared.module.js';

/**
 * @module Calendar/widget/DualDayView
 */

/**
 * A Calendar view which encapsulates two `DayView`s side by side.
 *
 * The first one is part of the encapsulating Calendar's project.
 *
 * The second DayView contains events which are *not* part of the Calendar's project yet. They are read
 * from the provided {@link #config-sourceStore}
 *
 * @extends Core/widget/Panel
 * @mixes Calendar/widget/mixin/DaySelectable
 * @mixes Calendar/widget/mixin/CalendarMixin
 * @classtype dualdayview
 * @demo Calendar/dual-dayview
 */
class DualDayView extends Panel.mixin(CalendarMixin, DaySelectable) {
    static $name = 'DualDayView';

    // Factoryable type name
    static type = 'dualdayview';

    static configurable = {
        /**
         * The date to display in the side-by-side `DayView`s.
         * @config {Date}
         */
        date : {
            $config : {
                equal : 'date'
            },
            value : null
        },

        month : true,

        dayTime : 0,   // ensure the change/update cycle runs using dayStart/EndTime and dayStartShift

        daySelector : true,

        /**
         * An {@link Scheduler.data.EventStore} instance which contains external or unscheduled events
         * which are to ne displayed in the second DayView which can be dragged into the Calendar's project.
         * @config {Scheduler.data.EventStore}
         */
        sourceStore : null,

        // A config object to override how the source DayView is configured
        sourceView : {},

        dragZoneConfig : {}
    };

    // ECMAScript Class properties. Not configs
    static sharedConfigs   = ['date', 'dateFormat', 'includeTimeRanges', 'allowOverlap', 'timeFormat', 'coreHours', 'fitHours', 'hourHeight', 'visibleStartTime', 'dateFormat', 'dayStartTime', 'dayEndTime', 'hideNonWorkingDays', 'nonWorkingDays', 'readOnly', 'zoomOnMouseWheel', 'filterEventResources'];
    static timeAxisConfigs = ['allDayEvents'].concat(this.sharedConfigs);

    construct(config) {
        config.items = [{
            ...config,
            ...config.primaryView,
            parent           : this,
            type             : 'dayview',
            header           : false,
            showAllDayHeader : false,
            allDayEvents     : false,
            hidden           : false,
            scrollable       : {
                overflowY : 'hidden-scroll'
            }
        }, {
            ...config,
            ...config.sourceView,
            parent           : this,
            type             : 'dayview',
            header           : false,
            showAllDayHeader : false,
            allDayEvents     : false,
            hidden           : false,
            autoCreate       : false,
            project          : {
                eventStore : config.sourceStore
            },

            // The sourceView doesn't create or resize its events
            // Events in it can only be dragged.
            // No resize handles on hover.
            dragZoneConfig : {
                resizable  : false,
                creatable  : false,
                hoverEdges : ''
            }
        }];

        super.construct(config);

        [this.primaryView, this.sourceView] = this.items;

        this.primaryView.scrollable.addPartner(this.sourceView.scrollable, 'y');

    }

    onPaint() {
        super.onPaint(...arguments);

        const
            me           = this,
            { features } = me.calendar;

        // Hide edit and delete tools in the event tooltip in sourceView
        features.eventTooltip?.tooltip.on({
            beforeShow({ source }) {
                const hidden = DualDayView.fromElement(source.activeTarget) === me.sourceView;

                // They may have been configured away
                source.tools.edit && (source.tools.edit.hidden = hidden);
                source.tools.delete && (source.tools.delete.hidden = hidden);
            }
        });

        // Veto scheduleMenu in sourceView
        features.scheduleMenu?.menu.on({
            beforeShow() {
                return DualDayView.fromElement(features.scheduleMenu.menuContext.targetElement) !== me.sourceView;
            }
        });
    }

    changeDayTime(dayTime) {
        if (!dayTime) {
            dayTime = new DayTime(this);
        }

        if (!this._dayTime?.equals(dayTime)) {
            return dayTime;
        }
    }

    changeMonth(month) {
        const
            me       = this,
            { date } = me;

        if (!month?.isMonth) {
            month = new Month({
                date,
                weekStartDay       : me.weekStartDay,
                hideNonWorkingDays : me.hideNonWorkingDays,
                nonWorkingDays     : me.nonWorkingDays
            });

            if (me.nonWorkingDays == null) {
                me.nonWorkingDays = month.nonWorkingDays;
            }

            if (me.weekStartDay == null) {
                me.weekStartDay = month.weekStartDay;
            }
        }

        return month;
    }

    /**
     * Zooms to fit all visible events within the vertical scroll viewport.
     * @param {Object} [options] How to scroll.
     * @param {Number} [options.edgeOffset] edgeOffset A margin around the target to bring into view.
     * @param {Object|Boolean|Number} [options.animate] Set to `true` to animate the scroll by 300ms,
     * or the number of milliseconds to animate over, or an animation config object.
     * @param {Number} [options.animate.duration] The number of milliseconds to animate over.
     * @param {String} [options.animate.easing] The name of an easing function.
     */
    async zoomToEvents(options) {
        // If we are not the current mode of the Calendar, wait until we become visible
        if (this.isVisible) {
            const
                me     = this,
                events = me.eventStore.getEvents({
                    startDate : me.startDate,
                    endDate   : me.endDate,
                    filter    : e => !e.isInterDay
                }).concat(me.sourceStore.getEvents({
                    startDate : me.startDate,
                    endDate   : me.endDate,
                    filter    : e => !e.isInterDay
                })),
                [start, end] = events.reduce((r, e) => {
                    // Round times to nearest half hour
                    const
                        startHour = DateHelper.getTimeOfDay(DateHelper.floor(e.startDate, '0.5h'), 'h'),
                        endHour   = DateHelper.getTimeOfDay(DateHelper.ceil(e.endDate, '0.5h'), 'h');

                    return [(startHour < r[0]) ? startHour : r[0], (endHour > r[1]) ? endHour : r[1]];
                }, [24, 0]);

            await me.primaryView.zoomTo(Math.floor(me.primaryView.scrollable.clientHeight / (end - start)));

            await me.primaryView.scrollTo(start, options);
        }
        else {
            this.whenVisible('zoomToEvents', this, [options]);
        }
    }

    // This view is animating if any of its child views are animating
    get isAnimating() {
        return super.isAnimating || this.items.some(v => v.isAnimating);
    }

    /**
     * Executes the passed function for each child DayView.
     * @param {Function} fn The function to call.
     * @param {Object[]} [args] The arguments to pass. Defaults to the view being called followed by its index.
     * @param {Object} [thisObj] The `this` reference for the function. Defaults to the view being called.
     */
    eachView(fn, args, thisObj = null) {
        const
            passView  = args == null,
            { items } = this;

        for (let i = 0, { length } = items; i < length; i++) {
            const view = items[i];

            if (passView) {
                args = [view, i];
            }
            if (view.callback(fn, thisObj || view, args) === false) {
                return;
            }
        }
    }

    /**
     * Yields the views which this DualDayView owns.
     * @property {Calendar.widget.mixin.CalendarMixin[]}
     * @readonly
     */
    get views() {
        return this.items;
    }

    doRefresh() {
        // If this was called directly, cancel any queued call.
        this.refreshSoon.cancel();

        this.eachView('doRefresh');

        this.refreshCount = (this.refreshCount || 0) + 1;

        /**
         * Fires when this DualDayView refreshes.
         * @param {Calendar.widget.DualDayView} source The triggering instance.
         * @event refresh
         */
        this.trigger('refresh');
    }

    // Override at this level. Child views process events
    onCalendarPointerInteraction() {}

    // Override at this level. Child views process data mutations
    onCalendarStoreChange() {}

    onChildAdd(child) {
        super.onChildAdd(child);

        // We get a look at child view config changes to see if we need to propagate them to their siblings
        FunctionHelper.before(child, 'onConfigChange', 'onChildViewConfigChange', this, { return : false });
    }

    onChildViewConfigChange({ name, value }) {
        // Propagate timeAxisConfig settings between all siblings.
        // Do not proceed if we're already responding, *or* if this config change
        // is the result of a syncViewConfig call and will be applied to all views anyway.
        if (!this.syncingChildViewConfigs && !this.syncingViewConfig && this.constructor.timeAxisConfigs.includes(name)) {

            this.syncingChildViewConfigs = true;

            this.items.forEach(i => {
                if (name in i) {
                    i[name] = value;
                }
            });

            this.syncingChildViewConfigs = false;
        }
    }

    setupWidgetConfig(widgetConfig, type) {
        const result = super.setupWidgetConfig(widgetConfig, type);

        // Copy in shared configs like hourHeight, dateFormat, dayStartTime, readOnly etc
        ObjectHelper.copyPropertiesIf(result, this, this.constructor.sharedConfigs);

        return result;
    }

    createWidget() {
        const view = super.createWidget(...arguments);

        view.ion({
            catchAll : 'onChildViewCatchAll',
            thisObj  : this
        });
        if (view.contentElement) {
            view.element.removeAttribute('tabIndex');
            view.contentElement.removeAttribute('tabIndex');
        }

        /**
         * Fires when a new sub view is created.
         * @param {Calendar.widget.ResourceView} source The triggering instance.
         * @param {Calendar.widget.mixin.CalendarMixin} view The newly created sub view.
         * @event viewCreate
         */
        this.trigger('viewCreate', { view });

        return view;
    }

    onChildViewCatchAll(e) {
        // Inject the child view's resource into the event as the resourceRecord
        e.resourceRecord = e.source.resource;

        if (e.type !== 'paint' && !(e.source === this.sourceView && e.type === 'eventdblclick')) {
            this.trigger(e.eventName, e);
        }
    }

    // Override here because we need to delegate the request to both sub views
    getEventElement(eventRecord, date = eventRecord.startDate) {
        return this.primaryView.getEventElement(...arguments) || this.sourceView.getEventElement(...arguments);
    }

    scrollTo(target) {
        const { items } = this;

        if (target.isEventModel) {
            const owningView = items.find(v => v.eventStore.includes(target));

            return owningView?.scrollTo(target);
        }
        return items[0].scrollTo(target);
    }

    updateDate(date) {
        // Inhibit any refreshes during multiple subview updates
        this.suspendVisibility();

        // Keep both views in sync.
        this.items.forEach(v => {
            v.date = date;
        });

        // Trigger one round of refreshes.
        this.resumeVisibility();
    }

    updateIncludeTimeRanges(value) {
        if (!this.isConfiguring) {
            this.syncViewConfig('includeTimeRanges', value);
        }
    }

    syncViewConfig(configName, value) {
        const update = view => {
            view[configName] = value;
        };

        // Cache this during the run so that onChildViewConfigChange doesn't bounce
        this.syncingViewConfig = true;

        this.eachView(update);

        this.syncingViewConfig = false;
    }

    get startDate() {
        return this.items[0].startDate;
    }

    get endDate() {
        return this.items[0].endDate;
    }

    get stepUnit() {
        return this.items[0].stepUnit;
    }

    get firstChild() {
        return this.items[0];
    }
}

// Register with type factory
Calendar.Modes.register('dualdayview', DualDayView);

class DualDayViewZone extends Base {
    static get configurable() {
        return {
            view : null,

            zones : {
                $config : ['nullify'],
                value   : []
            }
        };
    }

    updateView(view) {
        // Create sub zones for any already existent views.
        // If project had static data, they will be generated at config time.
        view.eachView(view => {
            this.onDualDayViewViewCreate({ view });
        });

        // If data is loaded async, they will be created when Resources arrive.
        view.ion({
            viewCreate : 'onDualDayViewViewCreate',
            thisObj    : this
        });
    }

    onDualDayViewViewCreate({ view }) {
        const
            me    = this,
            {
                zones,
                owner
            }     = me,
            modes = owner.client.constructor.Modes,
            type  = owner.getViewZoneType(modes.resolveType(view.type));

        type && zones.push(owner.createZone(type, {
            view,
            ...view.dragZoneConfig
        }));
    }

    changeZones(zones, oldZones) {
        if (oldZones?.length && !zones) {
            for (let i = 0, { length } = oldZones; i < length; i++) {
                oldZones[i].destroy();
            }
        }
        return zones;
    }
}

const
    // This is the store of unscheduled events which may be dragged into the main Calendar
    sourceStore = new EventStore({
        readUrl  : 'data/unscheduled.json',
        autoLoad : true
    }),
    calendar    = new Calendar({
    // Start life looking at this date
        date : new Date(2023, 3, 2),

        // CrudManager arranges loading and syncing of data in JSON form from/to a web service
        crudManager : {
            autoLoad : true,
            loadUrl  : 'data/data.json'
        },

        modes : {
            day    : null,
            week   : null,
            month  : null,
            year   : null,
            agenda : null,

            // The DualDayView extension needs to be configured with a sourceStore containing the unscheduled events
            dualdayview : {
                sixMinuteTicks : true,

                autoCreate : {
                    step : '6 min'
                },

                // When dragging events, constrain up/down to fix events inside the day bounds
                // We do not want to be able to drag so that events cross midnight and become
                // interDay events
                dragZoneConfig : {
                    constrainToDay : true
                },

                sourceStore,

                sourceView : {
                    actionButtons : [{
                        cls     : 'b-fa b-fa-calendar-check',
                        tooltip : 'Move to schedule',
                        handler : 'up.onAddButtonClick'
                    }]
                },

                // Whenever it grabs a new batch of events, we might need to zoom to fit
                onCellMapPopulated : 'up.onDualDayViewDataChange'
            }
        },

        features : {
            drag : {
                zoneTypes : {
                    dualdayview : DualDayViewZone
                }
            }
        },

        sidebar : {
            items : {
                zoomOnDateChange : {
                    weight   : 180,
                    type     : 'checkbox',
                    text     : 'Fit events',
                    onChange : 'up.onFitEventsToggle',
                    tooltip  : 'Events will be fitted upon navigation when checked'
                },
                zoomButton : {
                    weight  : 190,
                    type    : 'button',
                    text    : 'Zoom to events',
                    onClick : 'up.zoomToEvents',
                    tooltip : 'Fit events within scroll range'
                }
            }
        },

        appendTo : 'container',

        // Triggered when the view has to gather a new set of events. Either from being navigated in time
        // or by detecting data changes, such as events added, removed or mutated.
        onDualDayViewDataChange() {
            if (this.widgetMap.zoomOnDateChange.checked) {
            // Allow both views to update before zooming
                this.requestAnimationFrame(() => {
                // The animated scroll happening during the new date horizontal slide-in looks bad, so don't animate.
                    this.zoomToEvents({ animate : false });
                });
            }
        },

        onAddButtonClick({ eventRecord }) {
            this.modes.dualdayview.sourceStore.remove(eventRecord);
            this.eventStore.add(eventRecord);
        },

        onFitEventsToggle({ checked }) {
            if (checked) {
                this.modes.dualdayview.zoomToEvents();
            }
        },

        zoomToEvents(options) {
            this.modes.dualdayview.zoomToEvents(options);
        }
    });
