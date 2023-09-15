import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { BryntumCalendarComponent } from '@bryntum/calendar-angular';
import { Calendar, Checkbox, FilterField, MonthView, ResourceFilter } from '@bryntum/calendar';
import { calendarConfig } from './app.config';

@Component({
    selector      : 'app-root',
    templateUrl   : './app.component.html',
    styleUrls     : ['./app.component.scss'],
    encapsulation : ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
    @ViewChild(BryntumCalendarComponent) calendarComponent: BryntumCalendarComponent;

    private calendar: Calendar;
    private resourceFilter: ResourceFilter;
    private autoRowHeight: Checkbox;

    // calendar configuration
    calendarConfig = calendarConfig;

    onActiveItemChange({ activeItem }: { activeItem: any }): void {
        // Only meaningful if we are on the month view
        this.autoRowHeight.disabled = activeItem.modeName !== 'month';
    }

    onAutoRowHeightChanged({ checked }: { checked: boolean }): void {
        (this.calendar.modes as { month: MonthView }).month.autoRowHeight = checked;
    }

    // Called as the resourceFilterFilter's onChange handler
    onResourceFilterFilterChange({ value }: { value: string }): void {
        // A filter with an id replaces any previous filter with that id.
        // Leave any other filters which may be in use in place.
        this.resourceFilter.store.filter({
            id       : 'resourceFilterFilter',
            filterBy : r => r.name.toLowerCase().startsWith(value.toLowerCase()) // a function which returns true to include the record
        });
    }

    /**
     * Called after View is initialized
     */
    ngAfterViewInit(): void {
        this.calendar = this.calendarComponent.instance;

        const {
            autoRowHeight,
            resourceFilterFilter,
            resourceFilter
        } = this.calendar.widgetMap as { autoRowHeight: Checkbox; resourceFilterFilter: FilterField; resourceFilter: ResourceFilter };

        this.autoRowHeight = autoRowHeight;
        this.resourceFilter = resourceFilter;

        autoRowHeight.on({
            change  : this.onAutoRowHeightChanged,
            thisObj : this
        });
        resourceFilterFilter.on({
            change  : this.onResourceFilterFilterChange,
            thisObj : this
        });
    }
}
