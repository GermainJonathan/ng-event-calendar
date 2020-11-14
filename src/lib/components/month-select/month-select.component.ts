import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output } from '@angular/core';

/**
 * Month selector component
 *
 * @export
 * @class MonthSelectComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'evt-ca-month-select',
    templateUrl: './month-select.component.html',
    styleUrls: ['./month-select.component.scss'],
})
export class MonthSelectComponent implements OnInit {
    /**
     * Event triggered on click on month button
     *
     * @type {EventEmitter<Date>}
     * @memberof MonthSelectComponent
     */
    @Output()
    public monthChanged = new EventEmitter<Date>();

    /**
     * Would be deprectated in the new version
     *
     * @type {number}
     * @memberof MonthSelectComponent
     */
    @Input()
    public yearView: number;

    /**
     * Format of month
     *
     * @type {('long' | 'short')}
     * @memberof MonthSelectComponent
     */
    @Input() format: 'long' | 'short' = 'long';

    /**
     * Months numbers
     *
     * @memberof MonthSelectComponent
     */
    public monthId = [...Array(12).keys()];

    /**
     * List of month name resolve by locale
     *
     * @type {Array<string>}
     * @memberof MonthSelectComponent
     */
    public monthList: Array<string>;

    /**
     * The date of the day
     *
     * @private
     * @memberof MonthSelectComponent
     */
    private today = new Date();

    /**
     * Creates an instance of MonthSelectComponent.
     *
     * @param {string} locale
     * @memberof MonthSelectComponent
     */
    constructor(
        @Inject(LOCALE_ID) private locale: string
    ) {}

    /**
     * Init of the component
     *
     * @memberof MonthSelectComponent
     */
    ngOnInit(): void {
        this.monthList = this.monthId.map((monthIndex: number) => {
            const formatter = new Intl.DateTimeFormat(this.locale, {
                month: this.format,
            });
            return formatter.format(new Date(this.today.getFullYear(), monthIndex));
        });
    }

    /**
     * Handler for the click on a month button
     *
     * @param {*} month
     * @memberof MonthSelectComponent
     */
    public select(month: any): void {
        const date = new Date();
        date.setMonth(this.monthId[this.monthList.indexOf(month)]);
        date.setFullYear(this.yearView);
        this.monthChanged.emit(date);
    }
}
