import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BryntumCalendarComponent } from '@bryntum/calendar-angular';
import { Calendar, EventStore } from '@bryntum/calendar';
import { calendarConfig } from './app.config';

interface CalendarData {
    success: boolean
    events: { rows: Array<Record<string, any>> }
    resources: { rows: Array<Record<string, any>> }
}

@Component({
    selector      : 'app-root',
    templateUrl   : './app.component.html',
    styleUrls     : ['./app.component.scss'],
    encapsulation : ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {

    @ViewChild(BryntumCalendarComponent) calendarComponent!: BryntumCalendarComponent;

    private calendar!: Calendar;
    private eventStore!: EventStore;

    calendarConfig = calendarConfig;

    events!: Array<Record<string, any>>;
    resources!: Array<Record<string, any>>;

    // inject HttpClient
    constructor(private http: HttpClient) {}

    /**
     * Called after View is initialized
     */
    ngAfterViewInit(): void {
        this.calendar = this.calendarComponent.instance;
        this.eventStore = this.calendar.eventStore;

        this.http
            .get<CalendarData>('assets/data/data.json')
            .subscribe((value: CalendarData):void => {
                this.resources = value.resources.rows;
                this.events = value.events.rows;
            });
    }

    onCalendarEvents(event: any): void {
        // Uncomment the code in this method to start "logging" events
        /*
        switch (event.type) {
          case 'aftereventsave':
            console.log(`New event saved: ${event.eventRecord.name}`);
            break;

          case 'beforeeventdelete':
            console.log(`Events removed: ${event.eventRecords.map(eventRecord => eventRecord.name).join(',')}`);
            break;
        }
        */
    }
}
