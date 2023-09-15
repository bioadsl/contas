

var {
  EventModel,
  DateHelper,
  Calendar
} = bryntum.calendar;

// A custom Event class with a few extra fields. You can extend this to add any fields and methods you want.
class AppEvent extends EventModel {
  // Add some extra fields to demonstrate the createColumnsFromModel option of ColumnPicker
  static fields = [{
    name: 'notes',
    // Provide defaults for when a column is autocreated for this field
    column: {
      width: '20em',
      editor: {
        type: 'textareapickerfield'
      }
    }
  }, {
    name: 'important',
    type: 'boolean'
  }];

  // Define field getter to enable grouping by the start date *not including time portion*
  get eventStartDate() {
    return this.get('eventStartDate') || DateHelper.startOf(this.startDate);
  }
}
const startDate = '2023-10-09',
  endDate = '2023-10-23',
  calendar = new Calendar({
    // Start life looking at this date
    date: new Date(2023, 9, 12),
    sidebar: {
      width: '20em',
      items: {
        // A container which encapsulates the start and end input fields
        rangeDisplay: {
          type: 'container',
          weight: 0,
          defaults: {
            editable: false,
            triggers: {
              expand: null
            },
            step: '1d',
            labelPosition: 'above',
            flex: 1,
            listeners: {
              change: 'up.onRangeFieldChanged'
            }
          },
          items: {
            startDate: {
              label: 'Start',
              type: 'datefield',
              value: startDate,
              format: 'MMM DD'
            },
            endDate: {
              label: 'End',
              type: 'datefield',
              value: endDate,
              format: 'MMM DD'
            }
          }
        },
        datePicker: {
          weight: 0,
          type: 'datepicker',
          // In this mode, the "selection" is applied to any child
          // EventList views - EventList and AgendaView
          multiSelect: 'range',
          selection: [startDate, endDate],
          listeners: {
            selectionChange: 'up.onDatePickerRangeSelected'
          }
        },
        resourceFilter: {
          minHeight: null
        }
      }
    },
    modeDefaults: {
      startDate,
      endDate,
      // Disable picking a range using the list's UI.
      // We control the exact date range
      listRangeMenu: null
    },
    // Show only event lists
    modes: {
      day: null,
      week: null,
      month: null,
      year: null,
      list: {
        // If we use field names which the EventList creates for itself, our config
        // gets merged into the default, so we can affect the EventList's own columns.
        columns: [{
          field: 'name',
          flex: '0 0 12em',
          renderer({
            record
          }) {
            var _record$resource;
            return [{
              tag: 'i',
              className: 'b-icon b-icon-circle',
              style: `color:${(_record$resource = record.resource) === null || _record$resource === void 0 ? void 0 : _record$resource.eventColor}`
            }, {
              text: record.name
            }];
          }
        }],
        features: {
          group: {
            field: 'eventStartDate',
            // Render the group date for the first (group field) column
            renderer({
              grid,
              rowElement,
              isFirstColumn,
              groupRowFor
            }) {
              if (isFirstColumn) {
                rowElement.dataset.date = DateHelper.makeKey(groupRowFor);
                return DateHelper.format(groupRowFor, grid.dateFormat);
              }
            },
            // We can't group by other fields, so disable all grouping menu options
            populateHeaderMenu: () => {}
          }
        }
      }
    },
    mode: 'list',
    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager: {
      loadUrl: 'data/busy.json',
      // This demo uses a custom Event model with extra fields
      eventStore: {
        modelClass: AppEvent
      },
      autoLoad: true
    },
    appendTo: 'container',
    listeners: {
      rangeChange: 'this.onViewRangeChanged'
    },
    // When a calendar view announces that it has changed its range, ensure
    // our two input fields match
    onViewRangeChanged({
      new: {
        startDate,
        endDate
      }
    }) {
      this.widgetMap.startDate.value = startDate;
      this.widgetMap.endDate.value = endDate;
    },
    // Respond to the two DateFields being changed - update the views
    onRangeFieldChanged() {
      this.eachView(v => v.setConfig({
        startDate: this.widgetMap.startDate.value,
        endDate: this.widgetMap.endDate.value
      }));
    },
    // If the date picker selects a range, ensure
    // our two input fields match
    onDatePickerRangeSelected({
      source,
      selection: [startDate, endDate]
    }) {
      if (source.multiSelect === 'range') {
        this.widgetMap.startDate.value = startDate;
        this.widgetMap.endDate.value = endDate;
      }
    }
  });