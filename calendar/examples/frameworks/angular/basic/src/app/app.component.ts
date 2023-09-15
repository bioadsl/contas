import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { BryntumCalendarComponent } from '@bryntum/calendar-angular';
import { Calendar } from '@bryntum/calendar';
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

    /**
     * Called after View is initialized
     */
    ngAfterViewInit(): void {
        this.calendar = this.calendarComponent.instance;
    }
}
