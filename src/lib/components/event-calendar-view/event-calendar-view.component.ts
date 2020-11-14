import { AfterViewChecked, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import {
    CalendarDateFormatter,
    CalendarMonthViewBeforeRenderEvent,
    CalendarMonthViewDay,
    CalendarView,
    CalendarWeekViewBeforeRenderEvent,
    DateAdapter,
    DAYS_OF_WEEK,
    getWeekViewPeriod,
} from 'angular-calendar';
import { WeekDay } from 'calendar-utils/calendar-utils';
import { noop, Subject } from 'rxjs';

import { Event } from '../../event.model';
import { CalendarDateDefaultFormatterService } from '../../formatter/calendar-date-default-formatter.service';

@Component({
  selector: 'evt-ca-event-calendar-view',
  templateUrl: './event-calendar-view.component.html',
  styleUrls: ['./event-calendar-view.component.scss'],
  providers: [
        {
            provide: CalendarDateFormatter,
            useClass: CalendarDateDefaultFormatterService,
        },
    ]
})
export class EventCalendarViewComponent implements OnInit, AfterViewChecked {

    @Input()
    public allEvent: Event[];

    @Input()
    public useDefaultEventView = true;

    @Output()
    public dayClickedHandler: EventEmitter<WeekDay|CalendarMonthViewDay> = new EventEmitter<WeekDay|CalendarMonthViewDay>();

    @Output()
    public dayFiltredByCalendar: EventEmitter<Event[]> = new EventEmitter<Event[]>();

    public eventsDisplayed: Event[];

    /**
     * Active view mode of the component
     * Default is Month
     *
     * @type {CalendarView}
     * @memberof CalendarComponent
     */
    public view: CalendarView = CalendarView.Month;

    /**
     * Define what day start the week
     *
     * @type {number}
     * @memberof CalendarComponent
     */
    public weekStartsOn: number = DAYS_OF_WEEK.MONDAY;

    /**
     * Locale format of the date
     *
     * note: All responsive format date is actually based on french date format
     *
     * @memberof CalendarComponent
     */
    public locale = 'fr';

    /**
     * Active date of angular-calendar components
     *
     * Default is Today
     *
     * @memberof CalendarComponent
     */
    public viewDate = new Date();

    /**
     * List of available modes of angular-calendar view
     *
     * @memberof CalendarComponent
     */
    public CalendarView = CalendarView;

    /**
     * Selected day of Event Calendar
     *
     * @type {(WeekDay|CalendarMonthViewDay)}
     * @memberof CalendarComponent
     */
    public selectedMonthViewDay: WeekDay|CalendarMonthViewDay;

    /**
     * Refresh flag to trigger a complete refresh of the view
     *
     * @type {Subject<any>}
     * @memberof CalendarComponent
     */
    public refresh: Subject<any> = new Subject();

    /**
     * Active css class
     *
     * Default is 'selected'
     *
     * @memberof CalendarComponent
     */
    public active = 'selected';

    /**
     * Flag to display the month selector component
     *
     * @memberof CalendarComponent
     */
    public monthSelect = false;

    /**
     * Comunicate the year of the selected day
     * Would be deprecated in the next version
     *
     * @type {number}
     * @memberof CalendarComponent
     */
    public actualYearView: number;

    /**
     * Previous view mode active
     * Allow to determinate the correct selectedDay in the before loop
     *
     * @private
     * @type {CalendarView}
     * @memberof CalendarComponent
     */
    private previousView: CalendarView;

    /**
     * Creates an instance of CalendarComponent.
     * @memberof CalendarComponent
     */
    constructor(private dateAdapter: DateAdapter) {}

    /**
     * ngOnInit - Angular Cycle Hook
     * Played before the ngAfterViewChecked
     *
     * @memberof CalendarComponent
     */
    ngOnInit(): void { }

    /**
     * Use to delete the angular-calendar event week component (not used)
     *
     * @memberof CalendarComponent
     */
    ngAfterViewChecked(): void {
        /* Performance optimization */
        // Time event component isn't use here and consume ~1s each time viewDate changed
        const uselessWeekTimeEvent = document.body.querySelector('.cal-week-view .cal-time-events');
        if (uselessWeekTimeEvent) {
            uselessWeekTimeEvent.remove();
        }
    }

    /**
     * Function call to switch between views
     *
     * @param {CalendarView} view
     * @memberof CalendarComponent
     */
    public setView(view: CalendarView): void {
        switch (view) {
            case 'week':
                this.viewDate = this.selectedMonthViewDay.date;
                this.view = view;
                break;
            case 'day':
                this.viewDate = this.selectedMonthViewDay.date;
                this.view = view;
                this.previousView = CalendarView.Day;
                this.filterEvent(CalendarView.Day);
                break;
            case 'month':
                this.view = view;
                this.filterEvent(CalendarView.Month);
                this.refresh.next();
                break;
        }
    }

    /**
     * Before init for week view loop triggered by angular-calendar event
     *
     * @param {CalendarWeekViewBeforeRenderEvent} renderEvent
     * @memberof CalendarComponent
     */
    public beforeWeekViewRender(renderEvent: CalendarWeekViewBeforeRenderEvent): void {
        const today = renderEvent.header.find((day) => day.isToday);
        if (today && !this.selectedMonthViewDay) {
            today.cssClass = this.active;
            this.selectedMonthViewDay = today;
        }
        if (!this.selectedMonthViewDay && this.view === CalendarView.Week) {
            this.selectedMonthViewDay = renderEvent.header[0];
            this.selectedMonthViewDay.cssClass = this.active;
        } else if (this.selectedMonthViewDay) {
            this.selectedMonthViewDay = renderEvent.header.find(
                (el) =>
                    el.date.toLocaleDateString() ===
                    this.selectedMonthViewDay.date.toLocaleDateString()
            );
            this.selectedMonthViewDay.cssClass = this.active;
        }
        this.actualYearView = this.viewDate.getFullYear();
        this.previousView = CalendarView.Week;
        this.filterEvent(this.view);
        renderEvent.header.forEach(day => {
            const eventFound: any = this.allEvent.filter(event => event.start.toLocaleDateString() === day.date.toLocaleDateString());
            if (eventFound) {
                // @ts-ignore Adding events to week days model -> Allow to manage events in the week view
                day.events = eventFound;
            }
        });
    }

    /**
     * Before init for month view loop triggered by angular-calendar event
     *
     * @param {CalendarMonthViewBeforeRenderEvent} renderEvent
     * @memberof CalendarComponent
     */
    public beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
        const today = renderEvent.body.find((day) => day.isToday);
        if (today && !this.selectedMonthViewDay) {
            today.cssClass = this.active;
            this.selectedMonthViewDay = today;
        }
        if (!this.selectedMonthViewDay) {
            this.selectedMonthViewDay = renderEvent.body.find(
                (el) => el.inMonth
            );
            this.selectedMonthViewDay.cssClass = this.active;
            // @ts-ignore function is call only when this property exist
        } else if (!this.selectedMonthViewDay.inMonth) {
            this.selectedMonthViewDay = renderEvent.body.find((el) => el.date.toLocaleDateString() === this.selectedMonthViewDay.date.toLocaleDateString());
            this.selectedMonthViewDay.cssClass = this.active;
        }
        if (this.selectedMonthViewDay && (this.previousView === CalendarView.Day || this.previousView === CalendarView.Week)) {
            this.selectedMonthViewDay = renderEvent.body.find((el) => el.date.toLocaleDateString() === this.selectedMonthViewDay.date.toLocaleDateString());
            this.selectedMonthViewDay.cssClass = this.active;
        }
        this.actualYearView = this.viewDate.getFullYear();
        this.previousView = CalendarView.Month;
        this.filterEvent(this.view);
        renderEvent.body.forEach(day => {
            const eventFound: any = this.allEvent.filter(event => event.start.toLocaleDateString() === day.date.toLocaleDateString());
            if (eventFound) {
                day.events = eventFound;
            }
        });
    }

    /**
     * Handler for Month component click
     * Triggered on each click on month component days
     *
     * @param {CalendarMonthViewDay} dayClicked
     * @memberof CalendarComponent
     */
    public handlerMonthClicker(dayClicked: CalendarMonthViewDay): void {
        if (!dayClicked.inMonth && (dayClicked.isPast || dayClicked.isFuture)) {
            this.viewDate = dayClicked.date;
        }
        this.updateSelectedDate(dayClicked);
    }

    /**
     * Handler for Week component click
     * Triggered on each click on week component day
     *
     * @param {WeekDay} dayClicked
     * @memberof CalendarComponent
     */
    public handleWeekClicker(dayClicked: WeekDay): void {
        this.viewDate = dayClicked.date;
        this.updateSelectedDate(dayClicked);
    }

    /**
     * Handler for the month selector
     *
     * @param {Date} monthSelected
     * @memberof CalendarComponent
     */
    public monthSelected(monthSelected: Date): void {
        this.viewDate = monthSelected;
        this.periodChange();
        this.toggleWithMonthSelect();
    }

    /**
     * Handler for click event on header arrows
     *
     * @memberof CalendarComponent
     */
    public periodChange(): void {
        if (this.view === CalendarView.Day) {
            this.selectedMonthViewDay.date = this.viewDate;
        } else {
            this.selectedMonthViewDay = null;
        }
        this.actualYearView = this.viewDate.getFullYear();
    }

    /**
     * Toggle for the month selector component
     *
     * @memberof CalendarComponent
     */
    public toggleWithMonthSelect(): void {
        this.view === CalendarView.Month ? this.monthSelect = !this.monthSelect : noop();
    }

    /**
     * Host listener to trigger the before init loop of components on window resize event
     * Trigger responsive on day column header
     *
     * @memberof CalendarComponent
     */
    @HostListener('window:resize')
    public onResizeWindow(): void {
        this.selectedMonthViewDay = null;
        this.refresh.next();
    }

    /**
     * Update the selected day of Event calendar component
     *
     * @param {(CalendarMonthViewDay | WeekDay)} dayClicked
     * @memberof CalendarComponent
     */
    private updateSelectedDate(dayClicked: CalendarMonthViewDay | WeekDay): void {
        if (this.selectedMonthViewDay.date.toLocaleDateString() !== dayClicked.date.toLocaleDateString()) {
            delete this.selectedMonthViewDay.cssClass;
        }
        dayClicked.cssClass = this.active;
        this.selectedMonthViewDay = dayClicked;
        this.dayClickedHandler.emit(this.selectedMonthViewDay);
    }

    /**
     * Called each time the view changed
     * Filter events
     *
     * @private
     * @param {CalendarView} view
     * @memberof CalendarComponent
     */
    private filterEvent(view: CalendarView): void {
        switch (view) {
            case 'week':
                const period = getWeekViewPeriod(this.dateAdapter, this.selectedMonthViewDay.date, this.weekStartsOn);
                this.eventsDisplayed = this.allEvent.filter(event => event.start >= period.viewStart && event.start <= period.viewEnd).sort((eventA, eventB) => eventA.start.getTime() - eventB.start.getTime());
                break;
            case 'day':
                this.eventsDisplayed = this.allEvent.filter(event => event.start.toLocaleDateString() === this.selectedMonthViewDay.date.toLocaleDateString()).sort((eventA, eventB) => eventA.start.getTime() - eventB.start.getTime());
                break;
            case 'month':
                // prevent error on init Month view
                if (this.selectedMonthViewDay) {
                    this.eventsDisplayed = this.allEvent
                                        .filter(event => event.start.getMonth() === this.selectedMonthViewDay.date.getMonth() && event.start.getFullYear() === this.selectedMonthViewDay.date.getFullYear())
                                        .sort((eventA, eventB) => eventA.start.getTime() - eventB.start.getTime());
                }
                break;
        }
        this.dayFiltredByCalendar.emit(this.eventsDisplayed);
    }
}
