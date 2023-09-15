

var {
  Calendar
} = bryntum.calendar;
const calendar = new Calendar({
  // Start life looking at this date
  date: new Date(2020, 9, 12),
  // CrudManager arranges loading and syncing of data in JSON form from/to a web service
  crudManager: {
    loadUrl: 'data/data.json',
    autoLoad: true
  },
  appendTo: 'container',
  modes: {
    day: null,
    month: null,
    year: null,
    agenda: null,
    week: {
      listeners: {
        // "up." means resolve in owner. Will call on the Calendar
        layoutUpdate: 'up.onWeekviewLayout'
      }
    }
  },
  sidebar: {
    items: {
      hourHeightSlider: {
        weight: 110,
        value: 42,
        min: 20,
        max: 500,
        text: 'Hour height',
        type: 'slider',
        step: 1,
        // We need to react during the drag, not just on mouseup
        triggerChangeOnInput: true,
        // "up." means resolve in owner. Will call on the Calendar
        onChange: 'up.onRowHeightChange'
      },
      fitHeightCheckbox: {
        type: 'checkbox',
        weight: 120,
        checked: false,
        label: 'Fit hours',
        // "up." means resolve in owner. Will call on the Calendar
        onChange: 'up.onFitHoursCheckChange'
      }
    }
  },
  onWeekviewLayout({
    source: weekView
  }) {
    const {
      hourHeightSlider
    } = this.widgetMap;

    // Keep the slider in sync with reality.
    // For example when view gets flipped back to fitHours : true
    if (weekView.fitHours) {
      hourHeightSlider.suspendEvents();
    }
    hourHeightSlider.value = weekView.hourHeight;
    if (weekView.fitHours) {
      hourHeightSlider.resumeEvents();
    }
  },
  onRowHeightChange({
    source
  }) {
    var _this$activeView$zoom, _this$activeView;
    (_this$activeView$zoom = (_this$activeView = this.activeView).zoomTo) === null || _this$activeView$zoom === void 0 ? void 0 : _this$activeView$zoom.call(_this$activeView, source.value);
    this.widgetMap.fitHeightCheckbox.value = false;
  },
  onFitHoursCheckChange({
    checked
  }) {
    this.activeView.fitHours = checked;
  }
});

// Each change event coming out of the slider must wait till the next animation frame so that
// The center point can be kept steady.
calendar.onRowHeightChange = calendar.createOnFrame(calendar.onRowHeightChange, [], calendar, true);