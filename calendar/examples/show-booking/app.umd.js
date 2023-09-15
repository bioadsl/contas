

var {
  ResourceModel,
  EventModel,
  Calendar,
  NumberFormat,
  StringHelper,
  DateHelper,
  ArrayHelper,
  Popup
} = bryntum.calendar;
class Show extends ResourceModel {
  static fields = [{
    name: 'minCost',
    type: 'number'
  }];
}
class Performance extends EventModel {
  static fields = [{
    name: 'cost',
    type: 'number'
  }];
}
const costFormatter = new NumberFormat({
    template: '$9.99',
    locale: 'en-GB',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }),
  seats = (() => {
    const result = [];
    for (let i = 0; i < 26; i++) {
      for (let j = 0; j < 40; j++) {
        result.push(`${String.fromCharCode(i + 65)}${j + 1}`);
      }
    }
    return result;
  })(),
  isSmallDevice = !window.matchMedia('screen and (min-width : 700px)').matches;
;
const calendar = new Calendar({
  // We use ISO standard
  weekStartDay: 1,
  // Start life looking at this date
  date: new Date(2022, 6, 12),
  // CrudManager arranges loading and syncing of data in JSON form from/to a web service
  crudManager: {
    resourceStore: {
      modelClass: Show
    },
    eventStore: {
      modelClass: Performance
    },
    loadUrl: 'data/data.json',
    autoLoad: true
  },
  modeDefaults: {
    eventHeight: '3.2em',
    eventRenderer: 'up.performanceRenderer'
  },
  modes: {
    day: null,
    week: null,
    month: {
      dayNameFormat: isSmallDevice ? 'ddd' : 'dddd',
      dayCellNameFormat: isSmallDevice ? 'D MMM' : 'D MMMM',
      emptyCellRenderer: 'up.noPerformancesRenderer',
      listeners: {
        emptyCellClick: 'up.findAlternateShows'
      }
    },
    year: {
      showEvents: 'dots'
    }
  },
  // By default the UI is in public-facing mode to handle bookings
  readOnly: true,
  mode: 'month',
  sidebar: false,
  tbar: {
    items: {
      todayButton: null,
      spacer: null,
      showSelector: {
        weight: 100,
        type: 'combo',
        editable: false,
        label: isSmallDevice ? '' : 'Choose show',
        flex: isSmallDevice ? '0 0 10em' : '0 0 20em',
        labelPosition: 'before',
        displayField: 'name',
        onChange: 'up.onShowSelect',
        clearable: true,
        displayValueRenderer: 'up.showValueRenderer'
      },
      prevButton: {
        weight: 450
      },
      nextButton: {
        weight: 550
      },
      adminMode: {
        weight: 560,
        type: 'checkbox',
        label: 'Admin',
        onChange: 'up.onAdminToggle',
        tooltip: 'Select admin mode to allow editing and rescheduling of performances',
        hidden: isSmallDevice
      }
    }
  },
  autoCreate: {
    startHour: 15
  },
  features: {
    eventMenu: true,
    eventEdit: {
      // Only allowed in admin mode
      disabled: true,
      items: {
        resourceField: {
          editable: false,
          label: 'Show',
          onChange: 'up.onEditorShowSelect'
        },
        costField: {
          name: 'cost',
          type: 'numberfield',
          decimalPrecision: 2,
          label: 'cost',
          weight: 650
        },
        nameField: null,
        allDay: null,
        endDateField: null,
        endTimeField: null
      }
    },
    eventTooltip: {
      tools: {
        delete: null,
        edit: null
      },
      showOn: 'hover',
      renderer: 'up.showTipRenderer'
    },
    drag: {
      creatable: false,
      resizable: false
    }
  },
  listeners: {
    eventAutoCreated: 'this.onPerformanceAdded',
    eventClick: 'this.bookShow'
  },
  appendTo: 'container',
  showTipRenderer({
    eventRecord: performance
  }) {
    return {
      children: [{
        text: `${performance.name} at ${DateHelper.format(performance.startDate, 'HH:mm')}`
      }, {
        text: `${Math.floor(Math.random() * 30 + 1)} seats available`
      }]
    };
  },
  // Called when an admin adds a performance.
  // The name is inherited from the show.
  // The cost is preset to the minCost for that show.
  onPerformanceAdded({
    eventRecord
  }) {
    eventRecord.fullDuration = {
      magnitude: 2.5,
      unit: 'hour'
    };
    eventRecord.name = eventRecord.resource.name;
    eventRecord.cost = eventRecord.resource.minCost;
  },
  onEditorShowSelect({
    source
  }) {
    const {
      eventEdit
    } = this.features;

    // On selection of show to add to schedule, the name and min cost is defaulted in
    eventEdit.eventRecord.name = source.selected.name;
    eventEdit.editor.widgetMap.costField.value = source.selected.minCost;
  },
  findAlternateShows({
    date,
    domEvent
  }) {
    const performances = this.eventStore.getEvents({
        startDate: date,
        endDate: DateHelper.add(date, 1, 'd'),
        ignoreFilters: true
      }),
      shows = ArrayHelper.unique(performances.map(p => p.resource));
    new Popup({
      closeAction: 'destroy',
      owner: this,
      title: 'Other shows on this date',
      layout: 'vbox',
      anchor: true,
      items: {
        showList: {
          type: 'list',
          cls: 'b-other-show-list',
          displayField: 'name',
          store: shows,
          getItemCls: 'up.getShowListItemCls',
          onItem: 'up.onOtherShowSelect'
        }
      }
    }).showBy(domEvent.target);
  },
  getShowListItemCls(record) {
    return `b-color-${record.eventColor}`;
  },
  onOtherShowSelect({
    record
  }) {
    this.widgetMap.showSelector.value = record;
    this.widgetMap.showSelector.focus();
  },
  noPerformancesRenderer({
    date
  }) {
    const performances = this.eventStore.getEvents({
        startDate: date,
        endDate: DateHelper.add(date, 1, 'd'),
        ignoreFilters: true
      }),
      shows = ArrayHelper.unique(performances.map(p => p.resourceId));
    if (shows.length) {
      return isSmallDevice ? 'Other shows available' : 'Click here for other shows on this date';
    } else {
      // Let's not clutter the UI with unhelpful info
    }
  },
  performanceRenderer({
    eventRecord,
    renderData
  }) {
    renderData.iconCls['b-icon-clock'] = 1;
    renderData.solidBar = true;
    return [{
      text: `${DateHelper.format(eventRecord.startDate, 'HH:mm')}${this.eventStore.filters.count ? '' : ' ' + eventRecord.name}`
    }, {
      text: `${isSmallDevice ? '' : 'From'} ${costFormatter.format(eventRecord.cost || eventRecord.resource.minCost)}`
    }];
  },
  // If the show selection combo is cleared, display all in the input field
  showValueRenderer(show) {
    return (show === null || show === void 0 ? void 0 : show.name) || 'All';
  },
  onShowSelect({
    value
  }) {
    if (value) {
      // Filter to only show performances of selected show
      this.eventStore.filter({
        id: 'show-filter',
        property: 'resourceId',
        value
      });
    } else {
      this.eventStore.clearFilters();
    }
  },
  onAdminToggle({
    source,
    value
  }) {
    const me = this,
      {
        showSelector
      } = me.widgetMap;
    if (value) {
      me.eventStore.clearFilters();
      me.modeDefaults.readOnly = me.readOnly = me.features.eventEdit.disabled = false;
    } else {
      me.onShowSelect({
        value: me.widgetMap.showSelector.value
      });
      me.modeDefaults.readOnly = me.readOnly = me.features.eventEdit.disabled = true;

      // These must be changeable still
      source.readOnly = showSelector.readOnly = false;
    }
  },
  bookShow({
    eventRecord: performance
  }) {
    // Administrators do not get click to book
    if (!this.widgetMap.adminMode.value) {
      this.bookingPopup = new Popup({
        owner: this,
        performance,
        centered: true,
        modal: true,
        // A new one is created for each booking request, so make sure they do not leak
        closeAction: 'destroy',
        title: StringHelper.xss`Book ${performance.name} at ${DateHelper.format(performance.startDate, 'HH:mm')}`,
        items: {
          total: {
            label: 'Total',
            type: 'numberfield',
            format: costFormatter,
            readOnly: true,
            triggers: null,
            value: 0
          },
          seatSelector: {
            label: 'Seats',
            type: 'combo',
            items: seats,
            multiSelect: true,
            onChange: 'up.onSeatSelectionChange'
          }
        },
        bbar: {
          items: {
            cancelButton: {
              text: 'Cancel',
              onClick: 'up.close'
            },
            OKButton: {
              text: 'Proceed to payment',
              onClick: 'up.close',
              disabled: true
            }
          }
        }
      });
    }
  },
  onSeatSelectionChange({
    source
  }) {
    const {
      widgetMap
    } = this.bookingPopup;
    widgetMap.total.value = this.bookingPopup.performance.cost * source.value.length;
    widgetMap.OKButton.disabled = widgetMap.total.value == 0;
  }
});
calendar.widgetMap.showSelector.store = calendar.resourceStore.makeChained();
calendar.resourceStore.on({
  refresh({
    source
  }) {
    calendar.widgetMap.showSelector.value = source.first;
  },
  once: true
});