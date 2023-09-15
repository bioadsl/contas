# Bryntum Calendar version history

## 5.5.2 - 2023-08-30

### FEATURES / ENHANCEMENTS

* New demo `drag-onto-tasks` showing how to drag custom objects onto an event
* `YearView` may now show "No events" in its cell tooltip ([#5530](https://github.com/bryntum/support/issues/5530))

### LOCALE UPDATES

* There is a new locale key `noEvents : 'No events'` which may be used by `YearView`'s cell tooltip

### BUG FIXES

* [#6993](https://github.com/bryntum/support/issues/6993) - `DatePicker` doesn't trigger `dateChange` for grayed days when `disableOtherMonthCells` false
* [#7331](https://github.com/bryntum/support/issues/7331) - Cannot set day and date in two separate statements
* [#7332](https://github.com/bryntum/support/issues/7332) - Crash when double clicking calendar icon in `dual-dayview` demo

## 5.5.1 - 2023-08-16

### BUG FIXES

* [#7179](https://github.com/bryntum/support/issues/7179) - `beforeAutoCreate` missing parameter in new `DayResourceView`
* [#7199](https://github.com/bryntum/support/issues/7199) - `timeFormat` localization is ignored
* [#7224](https://github.com/bryntum/support/issues/7224) - `isCreating` flag gets "stuck" if the edit is vetoed
* [#7256](https://github.com/bryntum/support/issues/7256) - Incorrect number of events
* [#7260](https://github.com/bryntum/support/issues/7260) - Event not rendered on `overflowClickAction` expand

## 5.5.0 - 2023-07-31

* This release is a replacement for the 5.4.3 patch release. It was changed to a minor version because of some larger
  changes behind the scenes to pave the way for future support for live updates in Scheduler Pro and Gantt.

### BUG FIXES

* [#7221](https://github.com/bryntum/support/issues/7221) - [VUE] Vue vite app doesn't compile with Bryntum vue wrappers
* [#7224](https://github.com/bryntum/support/issues/7224) - `isCreating` flag gets "stuck" if the edit is vetoed

## 5.4.2 - 2023-07-26

### BUG FIXES

* [#4163](https://github.com/bryntum/support/issues/4163) - Inconsistent undo/redo behavior in calendar demo
* [#6995](https://github.com/bryntum/support/issues/6995) - [VUE] An exception when use `workingTime` config in calendar timeline view
* [#7127](https://github.com/bryntum/support/issues/7127) - Id collision error when creating new event using an external button on `EventList` mode
* [#7166](https://github.com/bryntum/support/issues/7166) - Properly maintain `b-selected-date` class in `ResourceView` day headers
* [#7169](https://github.com/bryntum/support/issues/7169) - Events hidden behind other events when switching modes
* [#7185](https://github.com/bryntum/support/issues/7185) - Event sort works incorrect in Month View
* [#7196](https://github.com/bryntum/support/issues/7196) - `autoCreate` step not always propagated into `TimeField` step
* [#7208](https://github.com/bryntum/support/issues/7208) - Calendar's active date not changing with `Datepicker`

## 5.4.1 - 2023-07-13

### FEATURES / ENHANCEMENTS

* We have created a public repository to showcase Salesforce demos. All previous demos are merged into one Lightning
  Application which is easy to install to a new scratch org. You can find more information in updated guides and in this
  repository: https://github.com/bryntum/bryntum-salesforce-showcase#bryntum-salesforce-showcase
* We have created a public Salesforce org where this app is preinstalled. You can find link to it and login credentials
  on the updated examples page

### BUG FIXES

* [#6077](https://github.com/bryntum/support/issues/6077) - [TypeScript] `Model` constructors should allow second param
* [#7085](https://github.com/bryntum/support/issues/7085) - `beforeEventEdit` event should handle async handlers
* [#7106](https://github.com/bryntum/support/issues/7106) - `ExternalEventResource` drag drop crashes if no resource on `DayResourceView`
* [#7107](https://github.com/bryntum/support/issues/7107) - Extra horizontal scrollbars shown in `resourceview` in narrow window
* [#7132](https://github.com/bryntum/support/issues/7132) - Calendar `ResourceFilter` change listener has wrong 'oldValue' on select

## 5.4.0 - 2023-06-30

### FEATURES / ENHANCEMENTS

* `Widget` has a new config, `maximizeOnMobile` which takes effect only on `floating` widgets on a mobile device. It
  causes the widget to be maximized instead of positioned in order to accommodate the mobile virtual keyboard. This will
  make event editing much easier to use on mobile devices ([#6522](https://github.com/bryntum/support/issues/6522))
* On mobile devices, `type : 'checkbox'` is rendered as a `slidetoggle` widget. The API and value is the same, it is
  just a more appropriate UI for the platform
* Calendar has a new mode, `dayresourceview` which shows columns of events for each selected resource for each day
  in its range. Check it out in the new `date-resource` example
* The `CalendarDrag` feature now has a new config `removeFromExternalStore`. It defaults to `true` meaning that when an
  event is dropped on the Calendar from an outside event store, the record is removed from that store. If set
  to `false`, the record is *not* removed, and a __clone__ of the dragged record is inserted at the drop position.
* The `ExternalEventSource` feature now allows a `droppable` property to be specified. If a `grid` is configured as the
  external UI, then dropping will Just Work. If the event source is just DOM elements, there are `dragMoveExternal`
  and `dropExternal` events. ([#6826](https://github.com/bryntum/support/issues/6826))
* For a slightly better docs experience for most users, the docs browser now by default hides some more obscure APIs
  normally only used when implementing own widgets and features. Advanced users in need of these APIs can still opt in
  to see them using the `Show` menu in the docs browser

### BUG FIXES

* [#6957](https://github.com/bryntum/support/issues/6957) - Unexpected drag proxy in `dragfromgrid` demo
* [#6963](https://github.com/bryntum/support/issues/6963) - Drag from Grid demo exception when dragging
* [#7002](https://github.com/bryntum/support/issues/7002) - Clarify granularity level of `dayStartTime` and `dayEndTime` in API docs
* [#7003](https://github.com/bryntum/support/issues/7003) - Set `coreHours` to the `dayStart` and end if they went through rounding
* [#7007](https://github.com/bryntum/support/issues/7007) - ResourceView overwrites configuration with values from itself.
* [#7019](https://github.com/bryntum/support/issues/7019) - Align constrained doesn't work in some cases.
* [#7020](https://github.com/bryntum/support/issues/7020) - Drag from `ExternalEventSource` into Calendar with no resources throws Error
* [#7057](https://github.com/bryntum/support/issues/7057) - CalendarRow cell width mismatch on narrow Calendars
* [#7068](https://github.com/bryntum/support/issues/7068) - The "Select all" item in List is not internationalized

## 5.3.8 - 2023-06-28

### BUG FIXES

* [#6981](https://github.com/bryntum/support/issues/6981) - Applying german locale after init makes `ResourceView` show wrong week

## 5.3.7 - 2023-06-20

### FEATURES / ENHANCEMENTS

* New Event items demo. The example shows how to attach an arbitrary list of items (guests) to an event. The demo is
  located in `examples/event-items` folder

### API CHANGES

* When changing `timeZone` on a Calendar, the date range that the Calendar is currently displaying will not change
  unless the active view is a `DayView` and the selected days events center point will, when converted to a different
  time zone, be changed to a different day
* The `DayView` methods `zoomTo` and `zoomBy` now return a `Promise` that may be awaited if postprocessing the updated
  UI state is required

### BUG FIXES

* [#6467](https://github.com/bryntum/support/issues/6467) - Replace separate view live demos to enable drag drop
* [#6839](https://github.com/bryntum/support/issues/6839) - Calendar `currentTime` indicator is not converted to `timeZone`
* [#6871](https://github.com/bryntum/support/issues/6871) - `overflowPopup : null` should make `YearView` switch to `DayView` in Calendar
* [#6872](https://github.com/bryntum/support/issues/6872) - `FilterField` should tolerate its field value being `null`/`undefined`
* [#6880](https://github.com/bryntum/support/issues/6880) - `WeekView`'s all day row horizontal scroll may become out of sync if no all day events
  exist and the `minDayWidth` is set to cause horizontal overflow.
* [#6973](https://github.com/bryntum/support/issues/6973) - Calendar `editEvent(eventRecord)` crashes without `startDate` and `endDate`

## 5.3.6 - 2023-05-26

### API CHANGES

* Event bar colors are set in an event element using the `--cal-event-color` CSS property, not by setting a color name
  CSS class
* All day event bars (and all event bars which are rendered using the renderData option `solidBar : true`) which do not
  have an `iconCls` may now show the default circular "bullet" icon before the text. To enable this, configure that
  mode (or the Calendar's `modeDefaults`) with `showBullet : { bar : true }`
* The `durationUnit` used in the new record when drag-creating events now matches the unit specified in the `dragUnit`
  property of the active view. The defaults have not changed, so in a `DayView`, the duration of drag-created events
  will be in `hours` and in all other views, (including the all day `CalendarRow` in a `DayView`) in `days`
  ([#6798](https://github.com/bryntum/support/issues/6798))
* The `EventTooltip` feature may now be configured with `revealEventsInCluster : false` which means that when hovering a
  narrow event which is sharing day column width with other, overlapping events the hovered event does not expand to the
  full width ([#6410](https://github.com/bryntum/support/issues/6410))

### LOCALE UPDATES

* `DayView` and `WeekView` may now be configured with how to snap an autoCreate pointer date to an `autoCreate.step`
  point. The `autoCreate.snapType` may be configured as `'round'` (the default), `'floor'` or `'ceil'` ([#6739](https://github.com/bryntum/support/issues/6739))

### BUG FIXES

* [#6771](https://github.com/bryntum/support/issues/6771) - No cell content should be shown for "other month" cells in `MonthView`
* [#6772](https://github.com/bryntum/support/issues/6772) - Event colour source should be taken from correct resource
* [#6779](https://github.com/bryntum/support/issues/6779) - `MonthView` events bars not conforming to `eventColor` renderer values.
* [#6781](https://github.com/bryntum/support/issues/6781) - Remove erroneous `dayCellRenderer` docs from `AgendaView`
* [#6828](https://github.com/bryntum/support/issues/6828) - `CalendarDrag` should not create an `AllDayZone` if the `allDayEvents` widget has been configured away

## 5.3.5 - 2023-05-11

### FEATURES / ENHANCEMENTS

* The `ResourceFilter` widget may now be configured to also filter the `resourceStore` by configuring `filterResources`
  as `true` ([#6698](https://github.com/bryntum/support/issues/6698))
* `DayView` and `WeekView` event renderers now accept a `bodyColor` property to the `renderData` which specifies the
  background color of the body part of the event block ([#6690](https://github.com/bryntum/support/issues/6690))
* The `EventStore` setting `removeUnassignedEvent` now defaults to `false` for the Calendar product. This means that
  removing all assignments from an event will *not* remove it from the event store ([#6732](https://github.com/bryntum/support/issues/6732))

### BUG FIXES

* [#6093](https://github.com/bryntum/support/issues/6093) - Resource filter not respected on initial loading
* [#6516](https://github.com/bryntum/support/issues/6516) - Calendar state save and restore may include the date
* [#6683](https://github.com/bryntum/support/issues/6683) - Calendar sidebar collapses when `Combo` dropdown clicked
* [#6701](https://github.com/bryntum/support/issues/6701) - [IONIC] `Scrollbar` width could not be determined under Ionic framework
* [#6702](https://github.com/bryntum/support/issues/6702) - Setting EventList `listRangeItems` item to `null` causes error
* [#6705](https://github.com/bryntum/support/issues/6705) - Crash in `shifted` demo
* [#6708](https://github.com/bryntum/support/issues/6708) - `showEvents : 'count'` in `YearView` doesn't work
* [#6714](https://github.com/bryntum/support/issues/6714) - When `DayView` has `daySelector : true`, the time axis is not accounted for
* [#6733](https://github.com/bryntum/support/issues/6733) - Crash if calendar sidebar is destroyed while loading
* [#6744](https://github.com/bryntum/support/issues/6744) - `DayView` `allDayEvents` should be able to be configured as expanded

## 5.3.4 - 2023-04-28

### BUG FIXES

* [#4631](https://github.com/bryntum/support/issues/4631) - `eventDrag` not working well if data mapping used for start/end dates
* [#6588](https://github.com/bryntum/support/issues/6588) - `ListView` bugs when asked to display arbitrary date range as opposed to range config
* [#6627](https://github.com/bryntum/support/issues/6627) - Zero duration all Day Event shown incorrectly
* [#6629](https://github.com/bryntum/support/issues/6629) - Fix hiding context menus inside LWC components on scroll
* [#6633](https://github.com/bryntum/support/issues/6633) - `PickerField` `editable:false` doesn't work inside WebComponent
* [#6651](https://github.com/bryntum/support/issues/6651) - Calendar: after zoom, scroll jumps on click-n-drag event creation
* [#6652](https://github.com/bryntum/support/issues/6652) - Minified UMD bundle does not export `bryntum` namespace

## 5.3.3 - 2023-04-21

### FEATURES / ENHANCEMENTS

* [VUE-3] Added a new Vue-3 demo, "Scheduler Timeline". Demo is located in the
  `examples/frameworks/vue-3/calendar-scheduler` folder
* [VUE-3] Added a new Vue-3 demo showing binding to inline data arrays, "Scheduler Timeline Inline data". Demo is
  located in the `examples/frameworks/vue-3/calendar-scheduler-inline` folder
* `CalendarDatePicker` now offers an `eventFilter` config to match other Calendar widgets ([#6591](https://github.com/bryntum/support/issues/6591))
* [ANGULAR] Bryntum Calendar now ships with two npm Angular wrapper packages to support different versions of Angular
  framework. Existing `@bryntum/calendar-angular` package is now designed to work with Angular 12 and newer versions,
  which use the IVY rendering engine. New `@bryntum/calendar-angular-view` package is designed to work with Angular 11
  and older versions, which use the View Engine rendering. Check Upgrading and Angular integration guides in
  documentation for more information ([#6270](https://github.com/bryntum/support/issues/6270))
* [ANGULAR] `angular-7` demo has been upgraded to use Angular 11 and `@bryntum/calendar-angular-view` package. Demo is
  located in `examples/frameworks/angular/angular-11` folder

### BUG FIXES

* [#4516](https://github.com/bryntum/support/issues/4516) - Calendar doesn't accept `project` instance
* [#5532](https://github.com/bryntum/support/issues/5532) - Fix documentation of Vue 3 demo documentation
* [#6498](https://github.com/bryntum/support/issues/6498) - Allow application intervention in event positioning within `DayView`
* [#6583](https://github.com/bryntum/support/issues/6583) - `YearView` doesn't render recurring events which are `allDay`
* [#6612](https://github.com/bryntum/support/issues/6612) - Duplicate tooltip renderer called
* [#6614](https://github.com/bryntum/support/issues/6614) - + n more count incorrect when overflowing events start below the bottom of the cell
* [#6622](https://github.com/bryntum/support/issues/6622) - `DayView` does not change date on header click

## 5.3.2 - 2023-04-04

### FEATURES / ENHANCEMENTS

* Elements rendered by the `TaskNonWorkingTime` feature elements now trigger `taskNonWorkingTimeClick`,
  `taskNonWorkingTimeDblClick` and `taskNonWorkingTimeContextMenu` events on the Gantt instance. ([#5679](https://github.com/bryntum/support/issues/5679))
* There is a new `Calendar` event: `beforeAutoCreate`. This is a preventable event which fires before a UI-initiated
  create gesture is actioned. This allows a single point of validation for UI-initiated event creation ([#6472](https://github.com/bryntum/support/issues/6472))
* ScheduleMenu is now enabled by default, allowing easier event creation using context menu on empty schedule space.

### BUG FIXES

* [#6395](https://github.com/bryntum/support/issues/6395) - [ANGULAR] Cannot use `StateProvider` with a production build
* [#6417](https://github.com/bryntum/support/issues/6417) - `schedule<DomEvent>` events do not bubble out of `ResourceView` to the Calendar
* [#6458](https://github.com/bryntum/support/issues/6458) - Event dragging in Scheduler child mode does not relay onBeforeEventDrag event correctly
* [#6513](https://github.com/bryntum/support/issues/6513) - Event tooltip should not show when double clicking event inside scheduler
* [#6514](https://github.com/bryntum/support/issues/6514) - `ScheduleMenu` not working inside Scheduler mode
* [#6515](https://github.com/bryntum/support/issues/6515) - Clicking `EventList` row for event who's `startDate` is before visible range changes visible range

## 5.3.1 - 2023-03-17

### API CHANGES

* Date parsing was made more forgiving in regard to character used to separate date parts. For example these strings are
  now all acceptable as `HH:mm`: `10:20`, `10 20`, `10-20`, `10/20` ([#6344](https://github.com/bryntum/support/issues/6344))

### BUG FIXES

* [#6351](https://github.com/bryntum/support/issues/6351) - Components do not render into containers not already in DOM
* [#6368](https://github.com/bryntum/support/issues/6368) - `MonthView` event sorter gets order wrong

## 5.3.0 - 2023-03-02

### FEATURES / ENHANCEMENTS

* CSS changes in Scheduler has cut the size of Calendar's standalone CSS-bundles roughly in half (Calendar includes
  Schedulers styling to allow using Scheduler as a mode). See Schedulers upgrade guide for more information
* Support for Time zone conversion has been added to all Bryntum scheduling products. Simply set a IANA time zone
  identifier as value for the `timeZone` config and that's it. But, since time zones is not supported natively in
  JavaScript we strongly recommend to read our Time zone guide ([#1533](https://github.com/bryntum/support/issues/1533))
* Localization demos updated to show up-to-date localization approach
* New `TimeRanges` feature, that shades time ranges and displays a header in the gutter of day and week views. Try it
  out in the new `timeranges` demo ([#5113](https://github.com/bryntum/support/issues/5113))
* `AjaxHelper.fetch` now supports using request body to pass parameters for non-GET requests. Please check
  `addQueryParamsToBody` argument in the method documentation ([#2855](https://github.com/bryntum/support/issues/2855))
* We have added support for `resourceTimeRanges` to be added to a project. These are rendered only into subviews of a
  `ResourceView` which have matching resource ids ([#5835](https://github.com/bryntum/support/issues/5835))
* `DayView` and `WeekView` have a new `sixMinuteTicks` config. When set to true, the time axis is subdivided into six
  minute ticks instead of the default five minute ticks ([#5645](https://github.com/bryntum/support/issues/5645))
* Lots (but not all) of the not so informative `object` types in our TypeScript typings have been replaced with more
  specific types. Objects that in our JavaScript are used as maps are now declared as `Record<keyType, valueType>`, and
  for functions that accept object arguments many are replaced with anonymous type declarations, such as
  `{ foo: string, bar: number }` (Partially fixed [#5176](https://github.com/bryntum/support/issues/5176))
* `YearView` and the Calendar's `datePicker` may now show more than 4 dots when `showEvents` is `'dots'` by setting
  the `maxDots` config on the `year` mode or the `datePicker` config. Note that increasing this value may produce a
  cluttered UI ([#6238](https://github.com/bryntum/support/issues/6238))
* `YearView` and the Calendar's `datePicker` may now be configured with `eventCountTip : true` which causes a tooltip
  to appear to display the event count for the day when a cell is hovered

### API CHANGES

* [DEPRECATED] `LocaleManager.registerLocale` and `LocaleManager.extendLocale` are deprecated.
  `LocaleHelper.publishLocale` should be used instead.
* `DayView`'s `hourHeightBreakpoints` now accepts an array of heights instead of an object. The object form is still
  supported, but might get deprecated in the future

### LOCALE UPDATES

* Locales format and process for applying locales have been simplified
* New locales for 31 languages have been added. Currently available languages are listed in the localization guide
  (Guides/Customization/Localization)

### BUG FIXES

* [#4764](https://github.com/bryntum/support/issues/4764) - Calendar `multiEventSelect` not working
* [#5988](https://github.com/bryntum/support/issues/5988) - Calendar timezone demo UTC time incorrect
* [#6225](https://github.com/bryntum/support/issues/6225) - Calendar collapses and expands event on each subsequent click or double click
* [#6255](https://github.com/bryntum/support/issues/6255) - `EventTooltip` Placement Issue for Overlapping Events

## 5.2.10 - 2023-02-17

### FEATURES / ENHANCEMENTS

* Added support for adding different core hours times for each day ([#6043](https://github.com/bryntum/support/issues/6043))

### API CHANGES

* Recently browsers have added support for Unicode 15, which changes the output of `Intl.DateTimeFormat` when
  formatting time to include `AM`/`PM`. Those browsers now use "thin space" (`\u202f`) instead of regular space. This
  affects the `DateHelper.format()` function, but likely you do not need to take any action in your application. It
  also affects `DateHelper.parse()`, which has been updated to support the new unicode space ([#6193](https://github.com/bryntum/support/issues/6193))

### BUG FIXES

* [#5791](https://github.com/bryntum/support/issues/5791) - `EventHelper`'s listeners for `.b-using-keyboard` break iOS dragging
* [#6177](https://github.com/bryntum/support/issues/6177) - `EventSelection`'s `isEventSelectable` not called by Calendar's `EventSelection` mixin

## 5.2.9 - 2023-01-30

### FEATURES / ENHANCEMENTS

* The event editor of the `EventEdit` feature may be reconfigured to not be a popup by configuring the  `editorConfig`
  with `floating : false` or by adding an `appendTo` config. In this situation, the editor is displayed as a side-docked
  overlay. See the new docked-editor example. ([#5873](https://github.com/bryntum/support/issues/5873))

### BUG FIXES

* [#6019](https://github.com/bryntum/support/issues/6019) - [TypeScript] Feature classes and configs have `on` event handlers exposed on owner class

## 5.2.8 - 2023-01-19

### BUG FIXES

* [#5918](https://github.com/bryntum/support/issues/5918) - `DatePicker`'s month field does not update when locale changed at init time
* [#5934](https://github.com/bryntum/support/issues/5934) - Agenda view shows events in wrong year
* [#5962](https://github.com/bryntum/support/issues/5962) - Day zoom demo slider shows value with decimals when `devicePixelRatio` is not `1`

## 5.2.7 - 2023-01-11

### FEATURES / ENHANCEMENTS

* Internal code improvements and bugfixes

## 5.2.6 - 2022-12-28

### FEATURES / ENHANCEMENTS

* [REACT] React wrapper now supports React components in widgets and tooltips ([#774](https://github.com/bryntum/support/issues/774))

### BUG FIXES

* [#5789](https://github.com/bryntum/support/issues/5789) - Determining whether an event is `interDay` must consult the view's `dayTime` to handle shifted days
* [#5821](https://github.com/bryntum/support/issues/5821) - `constrainTo` not applied unless component is shown using `alignTo`
* [#5827](https://github.com/bryntum/support/issues/5827) - Error when navigating to view with event starting on hidden non working day

## 5.2.5 - 2022-12-16

### FEATURES / ENHANCEMENTS

* `ListView` now offers a `resourceColumn` in which is displayed a read-only `ChipView` depicting the resources assigned
  to the event

### API CHANGES

* The `EventStore` `loadDateRange` event would previously only fire when a different date range of events was requested
  from the store. Not as the documentation states "when a range of events is requested". This now fires whenever a date
  range of events is requested. A `changed` flag is set in the event if the range is a new date range

### BUG FIXES

* [#3954](https://github.com/bryntum/support/issues/3954) - Fixed dragging all-day events with `dayStartShift` in effect.
* [#4530](https://github.com/bryntum/support/issues/4530) - `loadOnDemand` with sidebar date picker using `showEvents : true` causes an infinite loop
* [#4920](https://github.com/bryntum/support/issues/4920) - Calendar throws error when dragging event from overflow popup
* [#5672](https://github.com/bryntum/support/issues/5672) - Double click on calendar date throws exception
* [#5685](https://github.com/bryntum/support/issues/5685) - Non-draggable events are draggable in overflow popup
* [#5763](https://github.com/bryntum/support/issues/5763) - `loadOnDemand` feature needs `refresh` method
* [#5780](https://github.com/bryntum/support/issues/5780) - ICS export datetime stamp is not UTC

## 5.2.4 - 2022-11-28

### FEATURES / ENHANCEMENTS

* We recently launched a new homepage over at [bryntum.com](https://bryntum.com), and have now slightly updated the
  styling for demos and docs to better match it (new logo, new header color, new font). Please note that this is not a
  change to our themes, only the look of the demos, and it won't affect your application

### BUG FIXES

* [#2125](https://github.com/bryntum/support/issues/2125) - Recurrence edit confirmation should not be displayed when drag creating a recurring event
* [#4220](https://github.com/bryntum/support/issues/4220) - Fixed calendar drag create in day/week view on DST days.
* [#5595](https://github.com/bryntum/support/issues/5595) - Fix panel collapse icon directions
* [#5606](https://github.com/bryntum/support/issues/5606) - Calendar events duplicated in UI when events start date is changed.

## 5.2.3 - 2022-11-17

### BUG FIXES

* [#5051](https://github.com/bryntum/support/issues/5051) - Field does not show its invalid state unless it is hovered
* [#5533](https://github.com/bryntum/support/issues/5533) - `DayViewDragZone` moves proxy element in the wrong direction in RTL mode

## 5.2.2 - 2022-11-08

### FEATURES / ENHANCEMENTS

* In `DayView`s, events with a duration such that relative to the `hourHeight`, the element is too small to contain
  wrapped text will automatically change to a compact rendition. If the `hourHeight` changes (such as by zooming), the
  rendition will be corrected as appropriate ([#1948](https://github.com/bryntum/support/issues/1948))
* `DayView` now has a `currentTimeIndicatorRenderer` which allows a customized current time indicator to be used
  ([#4972](https://github.com/bryntum/support/issues/4972))
* The `emptyText` config of the `agenda` mode may now be an HTML string ([#5046](https://github.com/bryntum/support/issues/5046))

### API CHANGES

* [DEPRECATED] The behaviour of the `store.data` getter will be changed in 6.0. Currently, it returns the **initial**
  raw dataset, in 6.0 it will be changed to have the more expected behaviour of returning the data objects for the
  **current** state instead. See Grid's upgrade guide for more information ([#5499](https://github.com/bryntum/support/issues/5499))

### BUG FIXES

* [#5484](https://github.com/bryntum/support/issues/5484) - Add day of week indicator class name to Calendar cells
* [#5495](https://github.com/bryntum/support/issues/5495) - `AgendaColumn` needs to be `autoHeight` if using a custom `eventRenderer`
* [#5528](https://github.com/bryntum/support/issues/5528) - `dayNumberClick` and `monthNameClick` events are not firing for specific modes
* [#5536](https://github.com/bryntum/support/issues/5536) - `allDayEvents : null` in `DayView` children of `resourceView` leaves all day rows in the timeaxes

## 5.2.1 - 2022-10-28

### FEATURES / ENHANCEMENTS

* `DatePicker` now fully supports two modes of `multiSelect`. Setting it to `true` means that multiple, discontinuous
  ranges may be selected. Setting it to `'range'` means that one single range of one or more consecutive dates may be
  selected. ([#5368](https://github.com/bryntum/support/issues/5368))

### API CHANGES

* Added `includeWeekendsButton` to `Calendar` with default value of `false`. Changed text of
  button to "Weekends" from "Full". ([#5459](https://github.com/bryntum/support/issues/5459))

### BUG FIXES

* [#5149](https://github.com/bryntum/support/issues/5149) - Angular demos now use component-local styles using `ViewEncapsulation.None`
* [#5374](https://github.com/bryntum/support/issues/5374) - Text cropped in calendar events
* [#5392](https://github.com/bryntum/support/issues/5392) - Crash when clicking mode selector button in small screen in web component
* [#5433](https://github.com/bryntum/support/issues/5433) - Today button does not reset small and large calendar to today
* [#5440](https://github.com/bryntum/support/issues/5440) - Allow custom `eventSorter` function for views including `OverflowPopup`
* [#5455](https://github.com/bryntum/support/issues/5455) - LTS date format does not parse seconds
* [#5460](https://github.com/bryntum/support/issues/5460) - The duplicate event option breaks assignment of events to resources

## 5.2.0 - 2022-10-13

### FEATURES / ENHANCEMENTS

* Calendar `DayView` now shows all week days above the detail area ([#2899](https://github.com/bryntum/support/issues/2899))
* Calendar responds to platform differences (via the `Responsive` mixin) and provides a significantly improved User
  Experience on small screens. This responsive behavior is also compatible with saving the calendar state In particular,
  on small screens:
* The calendar sidebar automatically switches to overlay mode
* The mode selection area switches to a menu button with radio items instead of the button group
* The calendar description text is shortened
* Improved year view layout ([#4617](https://github.com/bryntum/support/issues/4617))
* Calendar uses a new `Calendar.widget.ModeSelector` instead of a `Core.widget.ButtonGroup` on its toolbar
* The `ModeSelector` supports a `popup` mode which, when `popup: true`, displays the available calendar modes in a
      menu instead of the regular button group. This switch is made by default on small displays via the new
      `responsive` behavior described above.
* When the active mode of the calendar supports it, the mode selector displays a `Full` button to allow the user to
      toggle between full weeks and work weeks.
* Calendar views now have a `descriptionFormat` config to simplify changing the description responsively. If a
  `descriptionRenderer` is provided, it takes precedence over the `descriptionFormat`
* Calendar added the `navigatorPlacement` config to allow the forward/backward/Today buttons to appear on the sidebar
  instead of the toolbar
* Menu has a `separator` config to make it easier to visually separate menu items
* The responsive state objects used in the `responsive` config of the `Responsive` mixin now support a `once` property
  to allow configs to only be set on first activation of the state
* The `Core.helper.DateHelper` class has a new method `formatRange` method which can format date ranges, as well as new
  formatting options for week numbers
* A new config, `emptyCellRenderer` allows `MonthView` and `CalendarRow` (The all day row in a `DayView`
  or `WeekView`) to display a clickable button in cells which contain no events. There is a new
  `emptyCellClick` event. ([#4413](https://github.com/bryntum/support/issues/4413))

## 5.1.5 - 2022-10-12

### FEATURES / ENHANCEMENTS

* `DatePicker` now fully supports two modes of `multiSelect`. Setting it to `true` means
  that multiple, discontinuous ranges may be selected. Setting it to `'range'` means
  that one single range of one or more consecutive dates may be selected. ([#5368](https://github.com/bryntum/support/issues/5368))
* New records are assigned a generated `id` if none is provided. The generated `id` is meant to be temporary (a
  phantom `id`), and should be replaced by the backend on commit. Previously the `id` was based on a global counter
  incremented with each assignment. That simplistic scheme assured no two records got the same `id` during a session,
  but if an application serialized the generated `id` (note, they should not) and then reloaded it, it would eventually
  collide with a new generated `id`. To prevent this, the generated `id`s are now based on a random UUID instead
* Stores now by default show a warning on console when loading records that has generated `id`s, as a reminder that it
  should be replaced by the backend on commit

### BUG FIXES

* [#4434](https://github.com/bryntum/support/issues/4434) - The `EventMenu` context menu's "Delete event" option doesn't handle recurring events properly
* [#4488](https://github.com/bryntum/support/issues/4488) - Overflowed events with custom `propagateEndDate` not marked with right arrow
* [#4645](https://github.com/bryntum/support/issues/4645) - Improve error message "Bryntum bundle included twice"
* [#4654](https://github.com/bryntum/support/issues/4654) - [REACT] Bryntum widget wrappers don't accept all component properties in React 18
* [#4729](https://github.com/bryntum/support/issues/4729) - Can't clear multi-select options in combo with keyboard navigation only
* [#5333](https://github.com/bryntum/support/issues/5333) - `syncCurrentTimeIndicator` throws an error if "today" is a hidden non working day
* [#5346](https://github.com/bryntum/support/issues/5346) - Deleting the base of a repeating event causes exception
* [#5347](https://github.com/bryntum/support/issues/5347) - Allow `defaultCalendar` to be explicitly configured as `null`
* [#5370](https://github.com/bryntum/support/issues/5370) - `EventEditor` `resourceField` store cannot be reconfigured

## 5.1.4 - 2022-09-29

### FEATURES / ENHANCEMENTS

* The `showEvents` config of Calendar's sidebar `DatePicker` and Calendar's `YearView` may now be `'dots'` to show
  events as a series of event-coloured dots. Maximum of three in `YearView` and four in `DatePicker`. ([#5234](https://github.com/bryntum/support/issues/5234))

### API CHANGES

* [DEPRECATED] The `events` config of the sidebar `DatePicker` has been renamed to `showEvents`. The `events` property
  is deprecated but will continue to work during its deprecation period

### BUG FIXES

* [#5164](https://github.com/bryntum/support/issues/5164) - Calendar listview doesn't respect columns order when rendering
* [#5311](https://github.com/bryntum/support/issues/5311) - Enable app to change load parameters sent by `loadOnDemand` feature
* [#5313](https://github.com/bryntum/support/issues/5313) - Multiday event not displaying if `hideNonWorkingDays` is `true`

## 5.1.3 - 2022-09-09

### BUG FIXES

* [#415](https://github.com/bryntum/support/issues/415) - Improve docs on formatting currency values on `NumberField`
* [#2742](https://github.com/bryntum/support/issues/2742) - Configurable time axis tick `amount`/`unit` showing the Hours Between 15 Minutes
* [#5156](https://github.com/bryntum/support/issues/5156) - Calendar Overflow Popup is hidden behind other nearby components on the page
* [#5165](https://github.com/bryntum/support/issues/5165) - Keyboard operations from `overflowPopup` in `ResourceView` throw errors, or silently fail

## 5.1.2 - 2022-08-29

### FEATURES / ENHANCEMENTS

* Configs that accept configuration options for a widget (or other class) are now (mostly) documented to accept a typed
  config object rather than a plain object. For example instead of `{Object} tooltip - A tooltip configuration object`,
  it is now `{TooltipConfig} tooltip - A tooltip configuration object`. This improves our TypeScript typings (transforms
  to `Partial<TooltipConfig>` in typings) when using such configs, but also improves our docs by linking to the configs
  of the type
* We added the config `offsetStartsBeforeEvents` to `AgendaView` which, when set to `false`, removes the alignment of
  the textual content of event bars when there is an arrow indicating that the event is continued from a previous
  cell ([#5044](https://github.com/bryntum/support/issues/5044))

### BUG FIXES

* [#2124](https://github.com/bryntum/support/issues/2124) - UI issues related to recurring events
* [#3433](https://github.com/bryntum/support/issues/3433) - Changing `minDayWidth` of the week view makes dragged events misaligned
* [#4766](https://github.com/bryntum/support/issues/4766) - Focus changes when clicking scroll down resources list
* [#4769](https://github.com/bryntum/support/issues/4769) - `EventTooltip` tools which are not active are hidden (For example if Calendar is `readOnly`)
* [#4781](https://github.com/bryntum/support/issues/4781) - Calendar events are not being displayed correctly when ending at midnight
* [#4793](https://github.com/bryntum/support/issues/4793) - Wrong sidebar styling for classic theme in calendar demos
* [#4897](https://github.com/bryntum/support/issues/4897) - `ResourceFilter` should continue to filter when its own `Store` is filtered
* [#4988](https://github.com/bryntum/support/issues/4988) - `scheduleMenu` doesn't catch `resourceRecord` correctly in scheduler timeline mode
* [#5007](https://github.com/bryntum/support/issues/5007) - `zoomOnMousewheel` zooming has to be synced between multiple `DayViews` in `ResourceView`
* [#5017](https://github.com/bryntum/support/issues/5017) - [TypeScript] Property type is missing in `DataFieldConfig`
* [#5018](https://github.com/bryntum/support/issues/5018) - [Vue] Prop Validation fails for `String` options
* [#5024](https://github.com/bryntum/support/issues/5024) - `eventRenderer` `renderData` object needs an `iconStyle` property for apps to override defaults
* [#5079](https://github.com/bryntum/support/issues/5079) - Sidebar datepicker should not have a background color
* [#5111](https://github.com/bryntum/support/issues/5111) - Mouse events not being triggered properly in events on same day
* [#5120](https://github.com/bryntum/support/issues/5120) - `EventTip` throws error when shown on `contextmenu`

## 5.1.1 - 2022-07-28

### BUG FIXES

* [#4904](https://github.com/bryntum/support/issues/4904) - `eventsPerCell` not recalculated on month change when `sixWeeks` is `false`
* [#4951](https://github.com/bryntum/support/issues/4951) - `timeFormat` doesn't work in `resourceView`
* [#4958](https://github.com/bryntum/support/issues/4958) - List store reload needs to reset selection if no incoming records match previous selection

## 5.1.0 - 2022-07-21

### FEATURES / ENHANCEMENTS

* The new config `eventListTimeFormat` is available for views which extend `EventList` (`EventList` and
  `AgendaView`). This config specifies the format for rendering time values next to event bars ([#4375](https://github.com/bryntum/support/issues/4375))
* Our TypeScript typings for string types that have a predefined set of alternatives was improved to only accept
  those alternatives. For example previously the `dock` config which was previously declared as `dock: string` is now
  `dock : 'top'|'right'|'bottom'|'left'`
* Create React App templates now available
* Configuring the CrudManager was made a little easier by introducing shortcuts for setting load and sync urls using the
  new `loadUrl` and `syncUrl` configs
* Updated the built-in version of FontAwesome Free to `6.1.1`
* `KeyMap` is a mixin that allows for standardized and customizable keyboard shortcuts functionality. `KeyMap` is by
  default mixed in to `Widget` and therefore available to all `Widget`'s child classes. There is a new guide
  **Guides/Customization/Keyboard shortcuts** describing how to customize currently integrated keyboard shortcuts
  ([#4300](https://github.com/bryntum/support/issues/4300), [#4313](https://github.com/bryntum/support/issues/4313), [#4328](https://github.com/bryntum/support/issues/4328))
* Calendar's `MonthView` has a new config : `hideOtherMonthCells` Hide day cells which are not part of
  the current displayed month
* Calendar's `MonthView` has a new config : `disableOtherMonthCells` Disable all pointer interaction
  with day cells which are not part of the current displayed month

### API CHANGES

* [BREAKING] [ANGULAR] Angular wrappers now use the more modern module bundle by default, instead of the legacy umd
  bundle. Hence application imports must be changed to match. This will slightly improve application size and
  performance ([#2786](https://github.com/bryntum/support/issues/2786))
* [BREAKING] `calendar.lite.umd.js` bundle is no longer available
* [BREAKING] WebComponents has been removed from `calendar.module.js` ES modules bundle. New bundle with WebComponents
  is `calendar.wc.module.js`

### BUG FIXES

* [#3554](https://github.com/bryntum/support/issues/3554) - Prevent navigating when clicking "other month" day cells in month view
* [#4696](https://github.com/bryntum/support/issues/4696) - Parents sorted below children in docs
* [#4697](https://github.com/bryntum/support/issues/4697) - Too dark code background in docs
* [#4941](https://github.com/bryntum/support/issues/4941) - Calendar doesn't propagate dynamic `readOnly` setting to child views

## 5.0.7 - 2022-07-13

### BUG FIXES

* [#4610](https://github.com/bryntum/support/issues/4610) - Make `calendar.assignments` public
* [#4856](https://github.com/bryntum/support/issues/4856) - `OverflowPopup` disappears when right click one of its items
* [#4857](https://github.com/bryntum/support/issues/4857) - `OverflowZone`'s drag proxy only required if `owner.isYearView`
* [#4864](https://github.com/bryntum/support/issues/4864) - `MonthView` resize event using left edge leaves the event name rendered at the old position
* [#4895](https://github.com/bryntum/support/issues/4895) - [LWC] `DragCreate` in all day header throws
* [#4916](https://github.com/bryntum/support/issues/4916) - `Fullscreen` is not working on mobile Safari

## 5.0.6 - 2022-06-20

### BUG FIXES

* [#4597](https://github.com/bryntum/support/issues/4597) - Calendar `autoCreate.startHour` cannot be fractional
* [#4808](https://github.com/bryntum/support/issues/4808) - Typings are wrong for async functions

## 5.0.5 - 2022-05-30

### FEATURES / ENHANCEMENTS

* New Angular demo that shows how to drag events from an unplanned event grid to calendar (Partial fix of [#4587](https://github.com/bryntum/support/issues/4587))

### BUG FIXES

* [#4350](https://github.com/bryntum/support/issues/4350) - Fixed various panel and calendar sidebar collapse issues
* [#4607](https://github.com/bryntum/support/issues/4607) - [VUE] Incorrect prop types in Vue wrapper

## 5.0.4 - 2022-05-11

### BUG FIXES

* [#4499](https://github.com/bryntum/support/issues/4499) - Resource avatars demo not showing any event bars
* [#4529](https://github.com/bryntum/support/issues/4529) - Sync is triggered when Scheduler is used as Calendar mode, after double clicking to create new event
* [#4544](https://github.com/bryntum/support/issues/4544) - Calendar fires an `eventundefined` event upon key down
* [#4548](https://github.com/bryntum/support/issues/4548) - Not possible to hide delete button on the event editor
* [#4562](https://github.com/bryntum/support/issues/4562) - [REACT] React wrappers have incorrect source mapping urls

## 5.0.3 - 2022-04-26

### FEATURES / ENHANCEMENTS

* [WRAPPERS] `ProjectModel` wrapper component reference can now be used as `project` parameter for Bryntum Calendar
  wrapper component in Angular applications ([#4238](https://github.com/bryntum/support/issues/4238))
* [WRAPPERS] Calendar has a new `ProjectModel` framework wrapper available for React and Angular. It simplifies
  sharing data between multiple Bryntum components ([#4382](https://github.com/bryntum/support/issues/4382))
* [ANGULAR] New demo showing use of inline data and `ProjectModel` wrapper. Demo located in
  `examples/frameworks/angular/inline-data` folder
* [REACT] New demo showing use of inline data and `ProjectModel` wrapper. Demo located in
  `examples/frameworks/react/javascript/inline-data` folder
* [VUE-3] New demo showing use of inline data for `Calendar` wrapper. Demo located in
  `examples/frameworks/vue-3/javascript/inline-data` folder

### API CHANGES

* The `validateResponse` flag on `CrudManager` has been changed to default to `true`. When enabled, it validates
  `CrudManager` responses from the backend and outputs a message on console if the format isn't valid. This is helpful
  during the development phase, but can be turned off in production
* New Vue 2/3 wrapper config option `relayStoreEvents` (defaults to `false`). When set to `true`, the events fired by
  stores are relayed to the Bryntum Grid instance
* [REACT] New basic React demo with TypeScript. Demo located in `examples/frameworks/react/typescript/basic` folder
* [REACT] React wrappers now include TypeScript definitions ([#3378](https://github.com/bryntum/support/issues/3378))

### BUG FIXES

* [#4127](https://github.com/bryntum/support/issues/4127) - [LWC] `DomHelper.isInView()` throws
* [#4222](https://github.com/bryntum/support/issues/4222) - [LWC] Performance degradation in 5.0 release
* [#4316](https://github.com/bryntum/support/issues/4316) - `DatePicker`'s `events : 'count'` option should sync with the current filtered state of the `eventStore`
* [#4432](https://github.com/bryntum/support/issues/4432) - [LWC] Mouse events do not work
* [#4461](https://github.com/bryntum/support/issues/4461) - [Vue] wrapper triggers doubled `dataChange` events with different params

## 5.0.2 - 2022-04-13

### FEATURES / ENHANCEMENTS

* A new example (`megadataset`) has been added showcasing rapid view generation upon navigation through 100,000 event
  records
* `ResourceFilter` in `Sidebar` should be configurable with custom selection ([#2006](https://github.com/bryntum/support/issues/2006))
* `AgendaView`'s time rendering is now configurable with an `eventTimeRenderer` config ([#4437](https://github.com/bryntum/support/issues/4437))

### BUG FIXES

* [#3469](https://github.com/bryntum/support/issues/3469) - `loadOnDemand` causes fetch loop when involving Scheduler
* [#4279](https://github.com/bryntum/support/issues/4279) - Calendar Resource Filter works incorrectly after one of resources removed
* [#4303](https://github.com/bryntum/support/issues/4303) - `MonthView` `autoRowHeight -> false` can result in incorrect `eventsPerCell` count
* [#4307](https://github.com/bryntum/support/issues/4307) - Order of data setting must be enforced when data set through `setConfig`
* [#4315](https://github.com/bryntum/support/issues/4315) - `MonthView` doesn't refresh on prev/next click is it contains a cell for the new date
* [#4323](https://github.com/bryntum/support/issues/4323) - Calendar features should tolerate being invoked upon non-Calendar views
* [#4331](https://github.com/bryntum/support/issues/4331) - Resource view items can sometimes disappear when filtering by resource
* [#4353](https://github.com/bryntum/support/issues/4353) - Resource avatar hidden while dragging
* [#4406](https://github.com/bryntum/support/issues/4406) - Fixed items in disabled `fieldset`/`radiogroup` not being disabled
* [#4451](https://github.com/bryntum/support/issues/4451) - Removing a resource causes crash in agenda mode

## 5.0.1 - 2022-03-04

### FEATURES / ENHANCEMENTS

* The `Calendar` `modeDefaults` config is now dynamic. Mutations applied to any of its properties made will immediately
  be applied to all child views. ([#4268](https://github.com/bryntum/support/issues/4268))
* Add default "Duplicate Event" context menu item ([#4271](https://github.com/bryntum/support/issues/4271))

### BUG FIXES

* [#4186](https://github.com/bryntum/support/issues/4186) - Wrong docs in Angular integration guide
* [#4212](https://github.com/bryntum/support/issues/4212) - Error thrown when event is updated in a non-painted scheduler (re-fix)
* [#4261](https://github.com/bryntum/support/issues/4261) - Crash after changing start date of a recurring event in `calendar-scheduler` demo
* [#4284](https://github.com/bryntum/support/issues/4284) - Drag external event to certain resource

## 5.0.0 - 2022-02-21

* We are thrilled to announce version 5.0 of our Calendar product. This release marks a big milestone for us, after more
  than a year of development. In this version we have greatly simplified how to combine Bryntum products, and we have
  made a new combination demo with the TaskBoard to show you how. The release also includes lots of improvements to the
  other demos as well as bug fixes and enhancements requested by our community. A big thanks to our customers who
  helped us with testing our alpha & beta versions
* You are most welcome to join us on March 16th, at 9am PST (6pm CET) for a 5.0 walkthrough webinar, demonstrating all
  the shiny new features
  [Click here to register](https://us06web.zoom.us/webinar/register/5116438317103/WN_4MkExpZPQsGYNpzh1mR_Ag)
* We hope you will enjoy this release and we are looking forward to hearing your feedback of what you would like us to
  develop next

*/ Mats Bryntse, CEO @Bryntum

### FEATURES / ENHANCEMENTS

* New TaskBoard + Calendar integration demo
* The `EventList` calendar view which displays a grid-based view of the `EventStore` now *merges* any
  configured `columns` with its default `columns` by matching the `field` property. On display in the
  `listview` demo ([#3500](https://github.com/bryntum/support/issues/3500))
* Each product has a new "thin" JavaScript bundle. The thin bundle only contains product specific code, letting you
  combine multiple Bryntum products without downloading the shared code multiple times (previously only possible with
  custom-built bundles from sources). Find out more in the What's new guide ([#2805](https://github.com/bryntum/support/issues/2805))
* Each theme is now available in a version that only has product specific CSS in it, called a `thin` version. These
  files are name `[product].[theme].thin.css` - `calendar.stockholm.thin.css` for example. They are intended for using
  when you have multiple different bryntum products on the same page, to avoid including shared CSS multiple times
  Read more about it in the `What's new` section in docs ([#3276](https://github.com/bryntum/support/issues/3276))
* `Model` has a new `readOnly` field that is respected by UI level editing features to disallow editing records having
  `readOnly : true`. It does not directly affect the datalayer, meaning that you can still programmatically edit the
  records ([#665](https://github.com/bryntum/support/issues/665))
* New `ProjectModel` setters/getters for `assignments`, `dependencies`, `events`, `resources` ([#4043](https://github.com/bryntum/support/issues/4043))
* `window` references are replaced with `globalThis` which is supported in all modern browsers and across different JS
  environments ([#4071](https://github.com/bryntum/support/issues/4071))
* A new function called `downloadTestCase()` was added to Bryntum widgets, it is intended to simplify creating test
  cases for reporting issues on Bryntum's support forum. Running it collects the current value for the configs your app
  is using, inlines the current dataset and compiles that into a JavaScript app that is then downloaded. The app will
  most likely require a fair amount of manual tweaking to reproduce the issue, but we are hoping it will simplify the
  process for you. Run `calender.downloadTestCase()` on the console in a demo to try it
* Updated FontAwesome Free to version 6, which includes some new icons sponsored by Bryntum in the charts category:
  https://fontawesome.com/search?m=free&c=charts-diagrams&s=solid

### API CHANGES

* [BREAKING] React wrappers now use the more modern module bundle by default, instead of the legacy umd bundle. Hence
  application imports must be changed to match. This will slightly improve application size and performance
  ([#2787](https://github.com/bryntum/support/issues/2787))

### BUG FIXES

* [#3140](https://github.com/bryntum/support/issues/3140) - Possibility calendar entries side by side (when there is enough space)
* [#4223](https://github.com/bryntum/support/issues/4223) - ResourceView example. `minWidth` setting not applied to filtered out views
* [#4231](https://github.com/bryntum/support/issues/4231) - Fix day view sort by duration for interday events

## 4.3.9 - 2022-02-17

### FEATURES / ENHANCEMENTS

* `Calendar` now supports `minDate` and `maxDate`, meaning that temporal navigation may never place the start date of
  any view before the `minDate`, and never place the end date of any view after the `maxDate`
* Views (and therefore an owning `Calendar`) now fire a preventable `beforeDateChange` event before temporal navigation
  so that date changes may be vetoed by application logic ([#4057](https://github.com/bryntum/support/issues/4057))

### BUG FIXES

* [#4125](https://github.com/bryntum/support/issues/4125) - A tooltip and event editor shows different `endDate` for same event
* [#4160](https://github.com/bryntum/support/issues/4160) - Sort day/week view events that start before midnight as starting at midnight for each intersecting day
* [#4173](https://github.com/bryntum/support/issues/4173) - `ResourceView` does not handle multi assignment
* [#4175](https://github.com/bryntum/support/issues/4175) - Double border on far right side of resource view
* [#4196](https://github.com/bryntum/support/issues/4196) - Calendar Create event when Wednesday is a `nonWorkingDay` and `hideNonWorkingDays` is true
* [#4197](https://github.com/bryntum/support/issues/4197) - Crash when configuring resource filter with selectAllItem
* [#4204](https://github.com/bryntum/support/issues/4204) - `AgendaView` `dateRangeChange` event doesn't fire when `CrudManager` is `autoLoad : false`
* [#4217](https://github.com/bryntum/support/issues/4217) - Calendar "select all Items" is not working if inline data used

## 4.3.8 - 2022-02-07

### FEATURES / ENHANCEMENTS

* Short events get CSS class `b-short-event` added for special rendition. ([#4106](https://github.com/bryntum/support/issues/4106))

### BUG FIXES

* [#4099](https://github.com/bryntum/support/issues/4099) - `Tooltip` doesn't handle reshowing on delegate change consistently
* [#4103](https://github.com/bryntum/support/issues/4103) - `weekStartDay` is ignored when using Next/Previous week button in toolbar
* [#4111](https://github.com/bryntum/support/issues/4111) - Drag from external event source doesn't work on touch devices
* [#4112](https://github.com/bryntum/support/issues/4112) - Timeaxis in resource view is missing after resourceStore sort
* [#4114](https://github.com/bryntum/support/issues/4114) - ResourceView child `allDayEvents` rows don't sync height on filter in/out

## 4.3.7 - 2022-02-02

### BUG FIXES

* [#2850](https://github.com/bryntum/support/issues/2850) - `weekStart` not honored by date picker nor `AgendaView`
* [#4005](https://github.com/bryntum/support/issues/4005) - `eventColor` for resource and event not applied on Month and Agenda views
* [#4010](https://github.com/bryntum/support/issues/4010) - Menu icon in Agenda view is not round
* [#4011](https://github.com/bryntum/support/issues/4011) - All day text in Agenda view is not localized
* [#4015](https://github.com/bryntum/support/issues/4015) - Setting Calendar `readOnly` makes filter field in sidebar also `readOnly`
* [#4020](https://github.com/bryntum/support/issues/4020) - Document event mouse events
* [#4024](https://github.com/bryntum/support/issues/4024) - `calculatePropagateEndDate` needs to be passed more context and be public
* [#4063](https://github.com/bryntum/support/issues/4063) - `MonthView` `autoRowHeight` causes recursive `loadOnDemand` reloading
* [#4065](https://github.com/bryntum/support/issues/4065) - `CalendarRow`. When `autoHeight`, data changes do not sync scrollbar presence
* [#4069](https://github.com/bryntum/support/issues/4069) - Document schedule mouse events and the `eventAutoCreated` event
* [#4088](https://github.com/bryntum/support/issues/4088) - `EventTooltip`'s `activeClient` can be set before it gets shown
* [#4089](https://github.com/bryntum/support/issues/4089) - Click on an event bar in "other month" cell should not navigate to that month

## 4.3.6 - 2022-01-13

### FEATURES / ENHANCEMENTS

* `DayView` and `WeekView` have a new config, `coreHours` which specifies the core working hours to show. ([#3964](https://github.com/bryntum/support/issues/3964))

### BUG FIXES

* [#3489](https://github.com/bryntum/support/issues/3489) - Calendar styling issues
* [#3942](https://github.com/bryntum/support/issues/3942) - WeekView elements misaligned when day shifted and week crosses DST change boundary
* [#3971](https://github.com/bryntum/support/issues/3971) - MonthView dayCellRenderer result not used as HTML
* [#3973](https://github.com/bryntum/support/issues/3973) - Clicking overflow button and OverflowPopup on an "other month" cell changes month
* [#3990](https://github.com/bryntum/support/issues/3990) - Chrome & Content Security Policy causes failure because of debug code section

## 4.3.5 - 2021-12-24

### FEATURES / ENHANCEMENTS

* Views which show OverflowPopups now allow the `overflowPopup` to be reconfigured to show customized content, to be
  configured with an `eventRenderer` of the same type as their owning view, or to be configured away entirely
  ([#3860](https://github.com/bryntum/support/issues/3860))

### BUG FIXES

* [#3846](https://github.com/bryntum/support/issues/3846) - Fix drag/drop issues in `DayView` when `showAllDayHeader=false`
* [#3885](https://github.com/bryntum/support/issues/3885) - DayView needs a `dayCellRenderer` config
* [#3892](https://github.com/bryntum/support/issues/3892) - DayView does not lay out day-spanning events correctly when `showAllDayHeader` is false
* [#3893](https://github.com/bryntum/support/issues/3893) - Resource view filtering should refresh child views
* [#3896](https://github.com/bryntum/support/issues/3896) - [TypeScript] Wrong typings of model class configs
* [#3905](https://github.com/bryntum/support/issues/3905) - AgendaView doesn't remove cells when a day becomes empty due to event deletion/filtering
* [#3907](https://github.com/bryntum/support/issues/3907) - [TypeScript] Cannot pass Scheduler instance to `Store.relayAll`
* [#3914](https://github.com/bryntum/support/issues/3914) - Bug when EventEdit from EventTooltip used in DayView with `showAllDayHeader: false`
* [#3915](https://github.com/bryntum/support/issues/3915) - MonthView layout overlays events when events span multiple weeks
* [#3920](https://github.com/bryntum/support/issues/3920) - Listeners for eventTooltip not applying if config notation used
* [#3922](https://github.com/bryntum/support/issues/3922) - `hideNonWorkingDays` in yearView generates an error if configured initially
* [#3924](https://github.com/bryntum/support/issues/3924) - CalendarRow doesn't support `overflowClickAction`
* [#3928](https://github.com/bryntum/support/issues/3928) - DateHelper `k` format behaves incorrectly
* [#3929](https://github.com/bryntum/support/issues/3929) - YearView's overflow popup doesn't show event continuation arrows
* [#3934](https://github.com/bryntum/support/issues/3934) - Added `dayHeaderRenderer` to DayView to allow custom cay cell header in `allDayEvents`

## 4.3.4 - 2021-12-13

### FEATURES / ENHANCEMENTS

* Calendar's `DayView` (and, by extension, `WeekView`) now offers the `showAllDayHeader` config. This is
  `true` by default. Configure this as `false` to *not* show all day and inter-day events spanning days in
  *header cells*, but to arrange them in the day detail part of the view, wrapping into as many columns as necessary
  ([#3771](https://github.com/bryntum/support/issues/3771))
* Updated `filtering` Angular demo to use Angular 13 ([#3742](https://github.com/bryntum/support/issues/3742))
* Added a config to hide eventTooltip header. Use `header : false` ([#3828](https://github.com/bryntum/support/issues/3828))
* Added a new config to the `ResourceView`. `stableResourceOrder` is `true` by default and means that the resource child
  views will always be in the same order as the resources in the `resourceStore`. If set to
  `false`, newly added (or filtered in) child views will be appended to the combined view
* Calendar now supports the `overlaySidebar` config which means that the sidebar is collapsed and the collapse tool in
  the top toolbar toggles the sidebar between the collapsed state and an overlayed _revealed_ state. On small UIs such
  as phones, this mode is enabled by default
* Added a new config for `DayCellRenderer` widgets (`MonthView` and `CalendarRow`)
  `overflowButtonRenderer` which allows apps to customize the appearance of the "+n more" button
  ([#3867](https://github.com/bryntum/support/issues/3867))

### BUG FIXES

* [#3551](https://github.com/bryntum/support/issues/3551) - Localize listRangeMenu in Agenda section
* [#3621](https://github.com/bryntum/support/issues/3621) - [TypeScript] Improve typings of mixins
* [#3664](https://github.com/bryntum/support/issues/3664) - Correct date in calendar title when switching modes in a `ResourceView`
* [#3769](https://github.com/bryntum/support/issues/3769) - `ResourceView` child views should be in the same order as the `ResourceStore`
* [#3850](https://github.com/bryntum/support/issues/3850) - [TypeScript] Missing static properties in typings

## 4.3.3 - 2021-11-30

### FEATURES / ENHANCEMENTS

* Calendar modes now support a `syncViewDate` config. It is `true` by default. This means that a Calendar's modes have
  their date automatically synced with the Calendar's date. This may be set to `false` to opt out
* The `MonthView` now has an `autoRowHeight` config which means that week rows assume the height of the events they
  contain. The `minRowHeight` config controls how small week rows may shrink and may be specified in any CSS units, but
  also *in events*. So if you use `autoRowHeight`, you can specify `minRowHeight : '3ev'` which means empty weeks may
  shrink to the height equivalent to showing three event bars.

### BUG FIXES

* [#3505](https://github.com/bryntum/support/issues/3505) - Bryntum Calendar Agenda View Decade Button not working
* [#3629](https://github.com/bryntum/support/issues/3629) - Some views may not be tied to the Calendar's date. `EventList` may not be required to "snap"
* [#3648](https://github.com/bryntum/support/issues/3648) - [DOCS] Content navigation is broken
* [#3672](https://github.com/bryntum/support/issues/3672) - `ResourceView` gets its `start`/`end` date wrong
* [#3696](https://github.com/bryntum/support/issues/3696) - `MonthView` `WeekExpander` feature flips all other rows back to be flexed when expanding a row
* [#3697](https://github.com/bryntum/support/issues/3697) - `MonthView`'s `shrinkwrapWeekRow` (`WeekExpander` feature) is static. Week does not expand if events are
  added
* [#3743](https://github.com/bryntum/support/issues/3743) - [DOCS] `web.config` file for Windows IIS server

## 4.3.2 - 2021-10-29

### FEATURES / ENHANCEMENTS

* `DayView` now supports the `fitHours` config which sizes the hour cell heights to fit exactly within available height

### BUG FIXES

* [#2397](https://github.com/bryntum/support/issues/2397) - Events are re-rendered during drag and now include a footer with event end time
* [#2640](https://github.com/bryntum/support/issues/2640) - Events can be dragged into and out of the `allDay` zone on the day and week views
* [#3585](https://github.com/bryntum/support/issues/3585) - When using a `dayStartTime` in `DayView`, `CalendarDrag` gets the drop time wrong
* [#3586](https://github.com/bryntum/support/issues/3586) - Fixed event drag (move) in an expanded week of a month view when using `weekExpander` feature
* [#3633](https://github.com/bryntum/support/issues/3633) - `EventTooltip` feature needs to document it's currently active event record

## 4.3.1 - 2021-10-21

### FEATURES / ENHANCEMENTS

* YearView now supports `dayCellRenderer` to add custom styling to its day cells, see updated `custom-rendering` demo
  ([#2485](https://github.com/bryntum/support/issues/2485))
* Bumped builtin Font Awesome Free to version 5.15.4

### BUG FIXES

* [#3526](https://github.com/bryntum/support/issues/3526) - Fixed `EventList` in `ResourceView` crashes with `hideNonWorkingDays`
* [#3538](https://github.com/bryntum/support/issues/3538) - Calendar view do not show the time horizontal lines in angular 12 after initial load
* [#3567](https://github.com/bryntum/support/issues/3567) - Minified css bundle contains unicode chars
* [#3574](https://github.com/bryntum/support/issues/3574) - Fix recurrence editor handling of monthly pattern using "On the n'th of the month" ("first" was ignored,
  "second" was interpreted as "first", etc.)

## 4.3.0 - 2021-10-12

### FEATURES / ENHANCEMENTS

* Calendar has a new `ResourceView` that encapsulates a series of calendar views, one for each resource/calendar on
  display in the new `resourceview` demo ([#2353](https://github.com/bryntum/support/issues/2353), [#3385](https://github.com/bryntum/support/issues/3385))
* [IONIC] Added Ionic framework integration demo. Demo located in `examples/frameworks/ionic/ionic-4` folder
  ([#2622](https://github.com/bryntum/support/issues/2622))

### API CHANGES

* [DEPRECATED] Buttons `menuIconCls` config was deprecated in favor of the new `menuIcon` config, which better matches
  the naming of other configs

### BUG FIXES

* [#3513](https://github.com/bryntum/support/issues/3513) - Time axis column not aligned with resource border

## 4.2.7 - 2021-10-01

### FEATURES / ENHANCEMENTS

* When there are many "all day" events, and the all day row of a day or week view is expanded, the all day row now only
  grows to consume up to 50% of the Calendar's height ([#3317](https://github.com/bryntum/support/issues/3317))

### BUG FIXES

* [#1481](https://github.com/bryntum/support/issues/1481) - Recurring events repeats endless after delete one of occurrences
* [#3269](https://github.com/bryntum/support/issues/3269) - Zero duration events are not displayed
* [#3318](https://github.com/bryntum/support/issues/3318) - Calendar mode's overflow popup can be misaligned when there are many overflowing events
* [#3413](https://github.com/bryntum/support/issues/3413) - Correct DST handling in monthly recurrence for n-th weekdays of a month
* [#3417](https://github.com/bryntum/support/issues/3417) - Missing icon for all day events
* [#3456](https://github.com/bryntum/support/issues/3456) - End after X time setting not applies for event with end on date setting
* [#3458](https://github.com/bryntum/support/issues/3458) - Document nested fields
* [#3461](https://github.com/bryntum/support/issues/3461) - Dragging from grid makes resource selector single select

## 4.2.6 - 2021-09-15

### BUG FIXES

* [#3408](https://github.com/bryntum/support/issues/3408) - Updated typings to support spread operator for parameters
* [#3409](https://github.com/bryntum/support/issues/3409) - Missing icon Intraday events in Month and Agenda view

## 4.2.5 - 2021-09-08

### FEATURES / ENHANCEMENTS

* When using a Scheduler as a mode in Calendar (as in the calendar-scheduler demo) there are now two new useful configs,
  `range` and `stepUnit`. They let you configure how much time the time axis spans and how large steps to take when
  clicking the previous/next buttons on the toolbar. Another enhancement for the same combination is that clicking a
  date in the mini calendar in the sidebar now scrolls that date into view ([#3328](https://github.com/bryntum/support/issues/3328))
* ProjectModel now fires a `dataReady` event when the engine has finished its calculations and the result has been
  written back to the records ([#2019](https://github.com/bryntum/support/issues/2019))
* The API documentation now better communicates when a field or property accepts multiple input types but uses a single
  type for output. For example date fields on models, which usually accepts a `String` or `Date` but always outputs a
  `Date` ([#2933](https://github.com/bryntum/support/issues/2933))
* New `examples/frameworks/webpack` demo added which shows how build a Calendar bundle from sources with Webpack
  Available for licensed Calendar version which includes sources

### BUG FIXES

* [#3322](https://github.com/bryntum/support/issues/3322) - Add `dataChange` event to framework guides
* [#3408](https://github.com/bryntum/support/issues/3408) - Updated typings to support spread operator for method parameters

## 4.2.4 - 2021-08-27

### FEATURES / ENHANCEMENTS

* Previous versions of Calendar used a bottom border on events to create a fake gap between them in day and week views
  With this release there is now an actual gap between events instead, whose size is determined using the
  `eventSpacing` config of the DayView ([#2613](https://github.com/bryntum/support/issues/2613))

### BUG FIXES

* [#3265](https://github.com/bryntum/support/issues/3265) - Docs are not scrolled to the referenced member
* [#3294](https://github.com/bryntum/support/issues/3294) - List should update its selection prior to firing its item event
* [#3305](https://github.com/bryntum/support/issues/3305) - Guides look bad in the docs search results
* [#3306](https://github.com/bryntum/support/issues/3306) - Doc browser does not scroll to member

## 4.2.3 - 2021-08-05

### FEATURES / ENHANCEMENTS

* [NPM] Bryntum Npm server now supports remote private repository access for Artifactory with username and password
  authentication ([#2864](https://github.com/bryntum/support/issues/2864))
* [TYPINGS] Type definitions now contain typed `features` configs and properties ([#2740](https://github.com/bryntum/support/issues/2740))

### BUG FIXES

* [#1795](https://github.com/bryntum/support/issues/1795) - Add configs to show event `startTime` + `endTime` optionally (partial: `startTime` is optional)
* [#2395](https://github.com/bryntum/support/issues/2395) – Document `showTime` / `timeFormat` in CalendarMixin
* [#3239](https://github.com/bryntum/support/issues/3239) - `showTime: false` on Calendar WeekView throws + make `showTime` public

## 4.2.2 - 2021-07-21

### FEATURES / ENHANCEMENTS

* You can now distinguish new events being created using drag create (or double clicking in the schedule) by checking
  the Model#isCreating flag. In the DOM, a new CSS class b-sch-creating has been added to all events that are being
  created
* [NPM] Bryntum Npm server now supports `npm token` command for managing access tokens for CI/CD ([#2703](https://github.com/bryntum/support/issues/2703))

### BUG FIXES

* [#3039](https://github.com/bryntum/support/issues/3039) - Fixed incorrect `dragcancel` firing when only a click (and no drag) occurred
* [#3162](https://github.com/bryntum/support/issues/3162) - LoadOnDemand feature cannot be disabled in runtime
* [#3167](https://github.com/bryntum/support/issues/3167) - LWC bundle is missing from trial packages
* [#3178](https://github.com/bryntum/support/issues/3178) - Syntax highlighter messes up code snippets in docs
* [#3185](https://github.com/bryntum/support/issues/3185) - Add CSS class to indicate that an event is being created

## 4.2.1 - 2021-07-07

### FEATURES / ENHANCEMENTS

* [FRAMEWORKS] Added `dragFeature` and `externalEventSourceFeature` to frameworks wrappers ([#3135](https://github.com/bryntum/support/issues/3135))

### BUG FIXES

* [#3136](https://github.com/bryntum/support/issues/3136) - [NPM] Running `npm install` twice creates modified `package-lock.json` file
* [#3139](https://github.com/bryntum/support/issues/3139) - Support `on` and `un` methods for `eventTooltip` feature instance

## 4.2.0 - 2021-06-30

### FEATURES / ENHANCEMENTS

* New config for day/week views (`dayStartShift`) to allow day columns to start their 24-hour period at a specified time
  other than midnight. This differs from `dayStartTime` which only controls the first time to render
* Added "Upgrade Font Awesome icons to Pro version" guide
* Added "Replacing Font Awesome with Material Icons" guide
* Improved day view layout and added new configs to address layout issues with many overlapping events. ([#2409](https://github.com/bryntum/support/issues/2409))
* For more details, see [What's new](https://bryntum.com/products/calendar/docs/guide/Calendar/whats-new/4.2.0) in docs

### BUG FIXES

* [#1185](https://github.com/bryntum/support/issues/1185) - Calendar should auto-scroll as you drag an event close to edges
* [#3086](https://github.com/bryntum/support/issues/3086) - Day/WeekView now update correctly on changing `dayStartShift`

## 4.1.6 - 2021-06-23

### BUG FIXES

* [#3004](https://github.com/bryntum/support/issues/3004) - New calendar event added does not sync its assignment when using multi-assignment
* [#3005](https://github.com/bryntum/support/issues/3005) - [VUE-3] Problem with Critical Paths due to Vue Proxy and double native events firing bug
* [#3013](https://github.com/bryntum/support/issues/3013) - Card layout causes overflow during card change
* [#3026](https://github.com/bryntum/support/issues/3026) - [VUE-2] and [VUE-3] typescript type declarations are missing
* [#3027](https://github.com/bryntum/support/issues/3027) - Can't create event when using filter

## 4.1.5 - 2021-06-09

### FEATURES / ENHANCEMENTS

* [TYPINGS] API singleton classes are correctly exported to typings ([#2752](https://github.com/bryntum/support/issues/2752))

### BUG FIXES

* [#2943](https://github.com/bryntum/support/issues/2943) - Agenda view should not scroll after clicking event
* [#2958](https://github.com/bryntum/support/issues/2958) - Weekly Repeat event editor doesn't fit day names
* [#2959](https://github.com/bryntum/support/issues/2959) - TypeError: Cannot read property 'focus' of null on event edit in Year view
* [#2961](https://github.com/bryntum/support/issues/2961) - Recurring event rule is not working correctly for Week/Day view
* [#2972](https://github.com/bryntum/support/issues/2972) - Cancelling a newly created event in event editor should not trigger sync
* [#2978](https://github.com/bryntum/support/issues/2978) - Fixed focus/scroll reverting to previously resized event
* [#2990](https://github.com/bryntum/support/issues/2990) - [ANGULAR] Preventable async events don't work
* [#2994](https://github.com/bryntum/support/issues/2994) - Cannot configure defaultCalendar on Calendar instance

## 4.1.4 - 2021-05-28

### FEATURES / ENHANCEMENTS

* TypeScript definitions updated to use typed `Partial<>` parameters where available
* Calendar now fires preventable `beforeDragMoveEnd`, `beforeDragResizeEnd` and `beforeDragCreateEnd`. Each of these
  events can be prevented by returning `false` or a Promise yielding `false` (async confirmation)
* New demo `confirmation-dialogs` showing how to do asynchronous confirmation of drag drop, resize and drag create
  actions
* Buttons now has a new style `b-transparent` that renders them without background or borders ([#2853](https://github.com/bryntum/support/issues/2853))
* [NPM] repository package `@bryntum/calendar` now includes source code ([#2723](https://github.com/bryntum/support/issues/2723))
* [NPM] repository package `@bryntum/calendar` now includes minified versions of bundles ([#2842](https://github.com/bryntum/support/issues/2842))
* [FRAMEWORKS] Frameworks demos packages dependencies updated to support Node v12

### API CHANGES

* Resource field in EventEditor is no longer `required` by default

### BUG FIXES

* [#2699](https://github.com/bryntum/support/issues/2699) - First day of week is incorrect
* [#2781](https://github.com/bryntum/support/issues/2781) - Remove leading 0 in hour for US English locale
* [#2828](https://github.com/bryntum/support/issues/2828) - Memory leak when replacing project instance
* [#2834](https://github.com/bryntum/support/issues/2834) - Core should not use b-fa for icon prefix
* [#2892](https://github.com/bryntum/support/issues/2892) - MonthView eventHeight cannot use string based values (eg '2em')
* [#2894](https://github.com/bryntum/support/issues/2894) - Cannot assign multiple resources when creating new event
* [#2896](https://github.com/bryntum/support/issues/2896) - Event Adds Without Event Editor Prompt if month cell has many events
* [#2897](https://github.com/bryntum/support/issues/2897) - Crash when double clicking to create a new event
* [#2902](https://github.com/bryntum/support/issues/2902) - Overflowing events popup doesn't look good with a lot of content
* [#2903](https://github.com/bryntum/support/issues/2903) - Event Edit modal closes on iPhone when user taps "Done" on the keyboard

## 4.1.3 - 2021-05-13

### FEATURES / ENHANCEMENTS

* Bumped the built-in version of FontAwesome Free to 5.15.3 and added missing imports to allow stacked icons etc
* Bumped the `@babel/preset-env` config target to `chrome: 75` for the UMD and Module bundles. This decreased bundle
  sizes and improved performance for modern browsers
* Updated Angular Wrappers to be compatible with Angular 6-7 in production mode for target `es2015`

### BUG FIXES

* [#2778](https://github.com/bryntum/support/issues/2778) - Wrong module declaration in typings file
* [#2780](https://github.com/bryntum/support/issues/2780) - Changing dayStartTime / dayEndTime on the fly is not working
* [#2820](https://github.com/bryntum/support/issues/2820) - Loading SchedulerPro styles to a Calendar demo breaks it
* [#2844](https://github.com/bryntum/support/issues/2844) - Calendar scrollbar flicker on initial animation
* [#2851](https://github.com/bryntum/support/issues/2851) - Event tap doesn't work show event tooltip on touch devices
* Fixes [#2821](https://github.com/bryntum/support/issues/2821) - Cannot drag create an event in a calendar
* Fixes [#2848](https://github.com/bryntum/support/issues/2848) - Newly created event syncs before editor is shown

## 4.1.2 - 2021-04-27

### FEATURES / ENHANCEMENTS

* Internal code improvements and bugfixes

## 4.1.1 - 2021-04-23

### FEATURES / ENHANCEMENTS

* Added Lightning Web Component integration guide ([#2623](https://github.com/bryntum/support/issues/2623))
* New demo 'fit-hours' showing how to fit the week view timeline to available vertical space
* Updated 'visible-hours' demo with a number field which lets you configure the snap increment
* Scheduler / Gantt / Calendar will now react when CTRL-Z key to undo / redo recent changes made. Behavior can be
  controlled with the new `enableUndoRedoKeys` config ([#2532](https://github.com/bryntum/support/issues/2532))

### BUG FIXES

* [#1629](https://github.com/bryntum/support/issues/1629) - Calendar React Filtering demo styling
* [#1987](https://github.com/bryntum/support/issues/1987) - DOCS: React guide needs a section on how to listen for events
* [#2601](https://github.com/bryntum/support/issues/2601) - Drag proxy misplaced in all day bar
* [#2602](https://github.com/bryntum/support/issues/2602) - List view demo broken
* [#2603](https://github.com/bryntum/support/issues/2603) - Add opacity to original element while drag drop is ongoing
* [#2611](https://github.com/bryntum/support/issues/2611) - Drag move and drag resize operations now properly restore focus to the dragged event
* [#2619](https://github.com/bryntum/support/issues/2619) - Dragging non-allDay event in all day zone is offset incorrectly
* [#2679](https://github.com/bryntum/support/issues/2679) - on-owner events should be added to owner too in docs
* [#2681](https://github.com/bryntum/support/issues/2681) - Yarn. Package trial alias can not be installed
* [#2719](https://github.com/bryntum/support/issues/2719) - New event won't sync after drag creation
* [#2725](https://github.com/bryntum/support/issues/2725) - Calendar styles are broken when scheduler stylesheet is loaded on the same page

## 4.1.0 - 2021-04-02

### FEATURES / ENHANCEMENTS

* We are happy to announce that Bryntum Calendar now can be directly installed using our npm registry
  We've updated all our frameworks demos to use `@bryntum` npm packages. See them in `examples/frameworks` folder
  Please refer to "Npm packages" guide in docs for registry login and usage information
* Bryntum demos were updated with XSS protection code. `StringHelper.encodeHtml` and `StringHelper.xss` functions were
  used for this
* The calendar now defaults to show current date if no `date` config is provided
* Added new React 17 demo for configuring visible hours in Calendar. The example also implements theme switching
  ([#1823](https://github.com/bryntum/support/issues/1823) and [#2213](https://github.com/bryntum/support/issues/2213))
* A new Calendar mode, `list` is now available which shows events as a Grid in a fixed range around the Calendar's
  current date. Range may be `day`, `week`, `month`, `year`, `decade`. The default range is `'month'` ([#2034](https://github.com/bryntum/support/issues/2034))
* The Agenda mode now extends the `list` view and offers a settings button to change the range size ([#1875](https://github.com/bryntum/support/issues/1875))
* Added `shiftNext`, `shiftPrevious`, and `shiftToNow` methods to Calendar to navigate in Calendar views ([#2343](https://github.com/bryntum/support/issues/2343))
* Added new Vue 3 Basic demo to show how to use Bryntum Calendar in Vue 3 ([#1315](https://github.com/bryntum/support/issues/1315))
* Added new Calendar + Scheduler demo ([#1578](https://github.com/bryntum/support/issues/1578))
* Added support for `overflowClickAction : 'shrinkwrap'` which makes a click on a `+n more` indicator expand that week
  row to show all events in the week. The MonthView may then scroll vertically to show all week rows because this may
  make it overflow its available height. New API and event support. ([#1165](https://github.com/bryntum/support/issues/1165))
* Added a new Feature `weekExpander` which offers a UI to expand MonthView week rows which contain overflowing cells
* A new feature, `print` allows the current active view to be printed. ([#1595](https://github.com/bryntum/support/issues/1595))

### API CHANGES

* [BREAKING] Removed RequireJS demos and integration guides in favor of using modern ES6 Modules technology
  ([#1963](https://github.com/bryntum/support/issues/1963))
* [BREAKING] `init` method is no longer required in Lightning Web Components and was removed from the LWC bundle
* The drag create feature no longer shows a tooltip by default during dragging ([#2394](https://github.com/bryntum/support/issues/2394)). See upgrade guide for
  details

### BUG FIXES

* [#1452](https://github.com/bryntum/support/issues/1452) - All day event duration is not shown in the tooltip
* [#1794](https://github.com/bryntum/support/issues/1794) - Cannot toggle calendar modes in readonly mode
* [#2023](https://github.com/bryntum/support/issues/2023) - Calendar should not sync to the store when create a new event before the event is saved in Event Editor
* [#2211](https://github.com/bryntum/support/issues/2211) - Add test coverage for XSS
* [#2312](https://github.com/bryntum/support/issues/2312) - Wrong dragFeature name in wrappers
* [#2340](https://github.com/bryntum/support/issues/2340) - Saving events when resource field is disabled resets assigned resource
* [#2355](https://github.com/bryntum/support/issues/2355) - Multicombo box css is disturbed if it's not editable
* [#2359](https://github.com/bryntum/support/issues/2359) - Update readme files in all framework demos in all products
* [#2379](https://github.com/bryntum/support/issues/2379) - Add minified version of *.lite.umd.js to the bundle
* [#2399](https://github.com/bryntum/support/issues/2399) - sync triggered after loading initial data
* [#2400](https://github.com/bryntum/support/issues/2400) - Sync failure messages displayed in `syncMask` where not auto-closing
* [#2405](https://github.com/bryntum/support/issues/2405) - Corrected event position when moving or resizing an event that overlaps other events
* [#2416](https://github.com/bryntum/support/issues/2416) - Crash when beforeEventEdit returns false
* [#2439](https://github.com/bryntum/support/issues/2439) - Drag and drop selects text in Safari
* [#2445](https://github.com/bryntum/support/issues/2445) - Calendar year view should have white background
* [#2454](https://github.com/bryntum/support/issues/2454) - Editor stays opened in ListView demo
* [#2457](https://github.com/bryntum/support/issues/2457) - All day events with a picture look bad in Custom rendering demo

## 4.0.8 - 2021-01-27

* Internal code improvements and bugfixes

## 4.0.7 - 2021-01-12

### BUG FIXES

* [#2106](https://github.com/bryntum/support/issues/2106) - Add `tools` to tooltip demo to show interaction with the hovered event

## 4.0.6 - 2020-12-29

### FEATURES / ENHANCEMENTS

* The [Custom event editor example](https://bryntum.com/products/calendar/examples/eventedit/) has been enhanced to
  illustrate how to make the provided editor widgets match conform with a theme. Guides on how to customize the event
  editor have been improved. ([#2000](https://github.com/bryntum/support/issues/2000))

### BUG FIXES

* [#1421](https://github.com/bryntum/support/issues/1421) - Week start day and number are not updated on locale change
* [#2017](https://github.com/bryntum/support/issues/2017) - DayView and WeekView timeline time format and Event time format is not localized dynamically
* [#2108](https://github.com/bryntum/support/issues/2108) - Update of recurrent event occurrence specifying "All future events" when the occurrence is limited by a
  COUNT value resulted in the COUNT being applied from the modified date, so too many occurrences were created
* [#2113](https://github.com/bryntum/support/issues/2113) - Event width is preserved when dragging event in the calendar
* [#2149](https://github.com/bryntum/support/issues/2149) - Unable to filter multi assigned task

## 4.0.5 - 2020-12-15

### FEATURES / ENHANCEMENTS

* Two new Calendar features have been added, `EventMenu` which offers a context menu
  for right-click on events, and `ScheduleMenu` for right-click on empty areas of a calendar. These work in the same
  way as the Scheduler's features by the same name. ([#1274](https://github.com/bryntum/support/issues/1274))

### BUG FIXES

* [#2105](https://github.com/bryntum/support/issues/2105) - Crash when switching to single day view from any other calendar view

## 4.0.4 - 2020-12-09

### API CHANGES

* The following params of DayCellRenderer#dayCellRenderer and AgendaView#dayCellRenderer were made private:
  `key`, `day`, `visibleColumnIndex`, `isOtherMonth`, `visible`, `tomorrow`, `isRowStart`, `isRowEnd`, `renderedEvents`

### FEATURES / ENHANCEMENTS

* A new Calendar Feature, `ExternalEventSource` makes it extremely easy to drag in events to "import" them in to a
  Calendar instance. ([#1683](https://github.com/bryntum/support/issues/1683))

### BUG FIXES

* [#1812](https://github.com/bryntum/support/issues/1812) - Make tables look better in docs
* [#1898](https://github.com/bryntum/support/issues/1898) - Custom event renderer doesn't work properly for AgendaView
* [#1977](https://github.com/bryntum/support/issues/1977) - Fields added to a default layout Container are stretched along the main axis
* [#1991](https://github.com/bryntum/support/issues/1991) - Sidebar Customization example throws JS error when "Create Event" clicked when YearView is active

## 4.0.3 - 2020-11-17

### FEATURES / ENHANCEMENTS

* A new Scheduler widget type `undoredo` has been added which, when added to the `tbar` of a scheduling widget (such as
  a `Scheduler`, `Gantt`, or `Calendar`), provides undo and redo functionality
* Added experimental support for Salesforce Lightning Locker Service. The distributed bundle only supports modern
  browsers (not IE11 or non-chromium based Edge), since Salesforce drops support for those on January 1st 2021 too
  ([#1822](https://github.com/bryntum/support/issues/1822))
* Added Lightning Web Component demo, see `examples/salesforce/src/lwc`
* `calendar.umd.js` and `calendar.lite.umd.js` bundles are now compiled with up-to-date `@babel/preset-env` webpack
  preset with no extra polyfilling. This change decreases size for the bundle by ~20% and offers performance
  enhancements for supported browsers
* [DEPRECATED] `calendar.lite.umd.js` was deprecated in favor of `calendar.umd.js` and will be removed in version 5.0

### BUG FIXES

* [#1792](https://github.com/bryntum/support/issues/1792) - Resource filter names missing colors
* [#1852](https://github.com/bryntum/support/issues/1852) - Exception when editing new event in collapsed CalendarRow when that new event is in overflow
* [#1882](https://github.com/bryntum/support/issues/1882) - dblclick in YearView should not initiate autoCreate in the WeekView

## 4.0.2 - 2020-11-04

### BUG FIXES

* Fixed documentation bugs

## 4.0.1 - 2020-11-03

### BUG FIXES

* [#1451](https://github.com/bryntum/support/issues/1451) - Use selected element to anchor event editor instead of scrolling the first rendered element of an event
  into view
* [#1454](https://github.com/bryntum/support/issues/1454) - Calendar Month View: +2 more shown but only one event present
* [#1459](https://github.com/bryntum/support/issues/1459) - Fix cleanup issues when cancelling drag via ESC key press
* [#1609](https://github.com/bryntum/support/issues/1609) - Calendar CSS issues
* [#1617](https://github.com/bryntum/support/issues/1617) - Event layout, (ordering and element sizing) not corrected after drag move and drag create
* [#1720](https://github.com/bryntum/support/issues/1720) - Crash when clicking task in examples browser demo
* [#2168](https://github.com/bryntum/support/issues/2168) - dblclick in AgendaView adds new event, but doesn't show the editor

## 4.0.0 - 2020-10-19

### FEATURES / ENHANCEMENTS

* [BREAKING] Dropped Support for Edge 18 and older. Our Edge <=18 fixes are still in place and active, but we will not
  be adding more fixes. Existing fixes will be removed in a later version
* Improved default description property of `WeekView` to display week of year in addition to month
* Added `descriptionRenderer` config to calendar view widgets to allow custom descriptions
* Calendar now ships with the same set of themes as its relatives Grid, Scheduler and Gantt: material, stockholm,
  classic, classic-light and classic-dark ([#477](https://github.com/bryntum/support/issues/477))
* New event `dateRangeChange` is fired before any Calendar view changes its date range. This allows
  apps to request new data from the server. Upon loading data, any new events will appear
* Added new localization demo and guide ([#1409](https://github.com/bryntum/support/issues/1409))
* New `loadOnDemand` feature which dynamically loads the Calendar's CrudManager depending on the date
  range active in the current view
* Added a styling guide ([#1427](https://github.com/bryntum/support/issues/1427))
* Added XSS protection to default renderers (based on `StringHelper.encodeHtml` and `StringHelper.xss`)
* Added support to export events to ICS format with the new `TimeSpan#exportToICS` method. Demonstrated in the
  new `exporttoics` example
* Added `calendar.lite.umd.js` module that does not include `Promise` polyfill. This module is primarily intended to be
  used with Angular to prevent `zone.js` polyfills overwrite
* Added a new `angular-7` demo ([#1537](https://github.com/bryntum/support/issues/1537))

### API CHANGES

* Model fields in derived classes are now merged with corresponding model fields (by name) in super classes. This allows
  serialization and other attributes to be inherited when a derived class only wants to change the `defaultValue` or
  other attribute of the field
* The `dateFormat` config for `type='date'` model fields has been simplified to `format`

### BUG FIXES

* [#1133](https://github.com/bryntum/support/issues/1133) - Calendar event selection
* [#1228](https://github.com/bryntum/support/issues/1228) - Custom fields in event editor now properly hide and show based on `eventType`
* [#1234](https://github.com/bryntum/support/issues/1234) - Visible date range required event to notify when views navigate in tiime
* [#1237](https://github.com/bryntum/support/issues/1237) - CrudManager.load() resulted in doubling of events
* [#1246](https://github.com/bryntum/support/issues/1246) - Fix css warning in Calendar theme
* [#1253](https://github.com/bryntum/support/issues/1253) - All day header out of sync with main schedule body after browser zoom
* [#1257](https://github.com/bryntum/support/issues/1257) - Event editor docs regarding how to add the `eventTypeField` were incorrect
* [#1281](https://github.com/bryntum/support/issues/1281) - Calendar drag/drop did not work correctly with a scrolled body element
* [#1282](https://github.com/bryntum/support/issues/1282) - Ripple misplaced when clicking
* [#1285](https://github.com/bryntum/support/issues/1285) - Drag handles are no longer displayed where events in day view extend outside of day start/end times
* [#1422](https://github.com/bryntum/support/issues/1422) - Doubleclicking calendar throws after locale change
* [#1434](https://github.com/bryntum/support/issues/1434) - TimeAxis time format in Day and Week views should match time format in event elements
* [#1446](https://github.com/bryntum/support/issues/1446) - Calendar size is changed when switching months
* [#1548](https://github.com/bryntum/support/issues/1548) - [ANGULAR] Investigate zone.js loading order and set it to Angular default
* [#1641](https://github.com/bryntum/support/issues/1641) - Extra CSS classes applied to Calendar container
* [#1696](https://github.com/bryntum/support/issues/1696) - Calendar drag create throws error when event edit feature enabled

## 1.0.1 - 2020-07-24

### BUG FIXES

* [#1031](https://github.com/bryntum/support/issues/1031) - Some localized properties not processed
* [#1187](https://github.com/bryntum/support/issues/1187) - Corrected drag/drop handling for non-date drop locations
* [#1213](https://github.com/bryntum/support/issues/1213) - Events created on current date always uses current time
* [#1722](https://github.com/bryntum/support/issues/1722) - dblclick to edit event when autoCreate is false throws error

## 1.0.0 - 2020-07-17

* We are very excited to announce the 1.0 GA of the Bryntum Calendar – our super modern calendar component
  with day, week, month, year and agenda views. It is written in pure ES6+ with wrappers available for React, Vue and
  Angular. The data model and UI are both extremely flexible and can be extended to match any application data model.
  Additionally, the data model is identical to that used in the Gantt / Scheduler products so you can easily share
  project data between multiple views. The SDK contains lots of examples and API documentation to get you started
  quickly

### FEATURES / ENHANCEMENTS

* Added `DayView#visibleStartTime` config indicating the starting hour to scroll to for day / week view
* Added new 'visible-hours' demo showing how to customize the visible time span
* Added new 'undoredo' demo
* Added new 'recurrence' demo showing recurring events
* Added new 'filterfield' to sidebar widget
* Added new 'custom-rendering' demo showing use of the `eventRenderer` method
* Added new 'bigdataset' demo to show a very busy week, to test the performance

### BUG FIXES

* [#1173](https://github.com/bryntum/support/issues/1173) - `autoCreate: false` not propagated from calendar into participating views
* [#1684](https://github.com/bryntum/support/issues/1684) - `EventRecords` with recurrenceRule should be mutable before they acquire an `eventStore`

