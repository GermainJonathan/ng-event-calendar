import { formatDate, TitleCasePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { CalendarDateFormatter, DateAdapter, DateFormatterParams, getWeekViewPeriod } from 'angular-calendar';

/**
 * Formatter use to format Event Calendar header and column date format
 *
 * @export
 * @class CalendarDateDefaultFormatterService
 * @extends {CalendarDateFormatter}
 */
@Injectable({
  providedIn: 'root'
})
export class CalendarDateDefaultFormatterService extends CalendarDateFormatter {

  /**
   * Creates an instance of CalendarDateDefaultFormatterService.
   *
   * @param {TitleCasePipe} titlePipe Use to add UpperCase first Letter of Tile and column header
   * @param {DateAdapter} dateAdapter Date Adapter of the App
   * @memberof CalendarDateDefaultFormatterService
   */
  constructor(
    private titlePipe: TitleCasePipe,
    protected dateAdapter: DateAdapter
  ) {
    super(dateAdapter);
  }

  /**
   * monthViewColumnHeader from angular-calendar
   *
   * @param {DateFormatterParams} { date, locale }
   * @return {*}  {string}
   * @memberof CalendarDateDefaultFormatterService
   */
  public monthViewColumnHeader({ date, locale }: DateFormatterParams): string {
    let format = 'EEEE';
    if (window.innerWidth < 510) {
        format = 'EEE';
    }
    return this.titlePipe.transform(formatDate(date, format, locale));
  }

  /**
   * monthViewTitle from angular-calendar
   *
   * @param {DateFormatterParams} { date, locale }
   * @return {*}  {string}
   * @memberof CalendarDateDefaultFormatterService
   */
  public monthViewTitle({ date, locale }: DateFormatterParams): string {
    let format = 'MMMM y';
    if (window.innerWidth < 376) {
        format = 'MMM y';
    }
    return this.titlePipe.transform(formatDate(date, format, locale));
  }

  /**
   * dayViewTitle from angular-calendar
   *
   * @param {DateFormatterParams} { date, locale }
   * @return {*}  {string}
   * @memberof CalendarDateDefaultFormatterService
   */
  public dayViewTitle({ date, locale }: DateFormatterParams): string {
    let format = 'EEEE dd MMMM y';
    if (window.innerWidth < 321) {
        format = 'dd MMM y';
    } else if (window.innerWidth < 510) {
        format = 'EEE dd MMM y';
    }
    return this.titlePipe.transform(formatDate(date, format, locale));
  }

  /**
   * weekViewColumnSubHeader from angular-calendar
   *
   * @param {DateFormatterParams} { date, locale }
   * @return {*}  {string}
   * @memberof CalendarDateDefaultFormatterService
   */
  public weekViewColumnSubHeader({ date, locale }: DateFormatterParams): string {
    return this.titlePipe.transform(formatDate(date, 'dd', locale));
  }

  /**
   * weekViewTitle from angular-calendar
   *
   * @param {DateFormatterParams} {date, locale, weekStartsOn, excludeDays, daysInWeek}
   * @return {*}  {string}
   * @memberof CalendarDateDefaultFormatterService
   */
  public weekViewTitle({date, locale, weekStartsOn, excludeDays, daysInWeek}: DateFormatterParams): string {
    const period = getWeekViewPeriod(this.dateAdapter, date, weekStartsOn, excludeDays, daysInWeek);
    const viewEnd = period.viewEnd;
    const viewStart = period.viewStart;
    let formatEnd = 'dd MMMM y';
    let formatStart = 'dd MMMM';
    if (window.innerWidth < 321) {
        formatEnd = 'dd/MM';
        formatStart = 'dd/MM';
    } else if (window.innerWidth < 376) {
        formatEnd = 'dd MMM';
        formatStart = 'dd MMM';
    } else if (window.innerWidth < 510) {
        formatEnd = 'dd MMM y';
        formatStart = 'dd MMM';
    }
    if (viewStart.getFullYear() !== viewEnd.getFullYear()) {
        formatStart += ' y';
    }
    return this.titlePipe.transform(formatDate(viewStart, formatStart, locale)) + ' - ' + this.titlePipe.transform(formatDate(viewEnd, formatEnd, locale));
  }

  /**
   * weekViewColumnHeader from angular-calendar
   *
   * @param {DateFormatterParams} {date, locale}
   * @return {*}  {string}
   * @memberof CalendarDateDefaultFormatterService
   */
  public weekViewColumnHeader({date, locale}: DateFormatterParams): string {
    let format = 'EEEE';
    if (window.innerWidth < 510) {
        format = 'EEE';
    }
    return this.titlePipe.transform(formatDate(date, format, locale));
  }
}
