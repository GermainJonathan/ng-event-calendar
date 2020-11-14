import { CommonModule, TitleCasePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { EventCalendarViewComponent } from './components/event-calendar-view/event-calendar-view.component';
import { EventsViewComponent } from './components/events-view/events-view.component';
import { MonthSelectComponent } from './components/month-select/month-select.component';

@NgModule({
    declarations: [
        EventCalendarViewComponent,
        EventsViewComponent,
        MonthSelectComponent,
    ],
    imports: [
        CommonModule,
        MatButtonToggleModule,
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
    ],
    providers: [TitleCasePipe],
    exports: [
        EventCalendarViewComponent,
        EventsViewComponent,
        MonthSelectComponent,
    ]
})
export class EventsCalendarModule {}
