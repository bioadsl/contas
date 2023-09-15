

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
  static defaults = {
    invitees: []
  };

  // Define field getter to enable grouping by the start date *not including time portion*
  get eventStartDate() {
    return this.data.eventStartDate || DateHelper.startOf(this.startDate);
  }
}
const calendar = new Calendar({
  // Start life looking at this date
  date: new Date(2020, 9, 12),
  // Show the event list
  modes: {
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
  appendTo: 'container'
});