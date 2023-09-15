import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { BryntumCalendarComponent } from '@bryntum/calendar-angular';
import { Calendar, NumberField, DayView } from '@bryntum/calendar';
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

    // calendar configuration
    calendarConfig = calendarConfig;

    onStartHourChange({ value } : { value: any}): void {
        (this.calendar.activeView as DayView).scrollTo(value, {
            animate : true,
            block   : 'start'
        });
    }

    /**
     * Called after View is initialized
     */
    ngAfterViewInit(): void {
        this.calendar = this.calendarComponent.instance;

        const { scrollHour } = this.calendar.widgetMap as { scrollHour: NumberField };

        scrollHour.on({ change : this.onStartHourChange, thisObj : this });
    }
}
