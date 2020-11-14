import { Component, Input } from '@angular/core';

import { Event } from '../../event.model';

@Component({
  selector: 'evt-ca-events-view',
  templateUrl: './events-view.component.html',
  styleUrls: ['./events-view.component.scss']
})
export class EventsViewComponent {

    /**
     * Events load in the component
     *
     * @type {Event[]}
     * @memberof EventComponent
     */
    @Input() events: Event[];

    /**
     * Use for isHeaderAlreadyGenerated function
     *
     * @private
     * @type {Event}
     * @memberof EventComponent
     */
    private previousEventCharged: Event;

    /**
     * Creates an instance of EventComponent.
     * @memberof EventComponent
     */
    constructor() {}

    /**
     * Allow to merge event header in case the event had the same start day
     *
     * @param {Event} event
     * @return {*}  {boolean}
     * @memberof EventComponent
     */
    public isHeaderAlreadyGenerated(event: Event): boolean {
        if (this.previousEventCharged && event !== this.previousEventCharged) {
            const result = this.previousEventCharged.start.toLocaleDateString() !== event.start.toLocaleDateString();
            this.previousEventCharged = event;
            return result;
        } else {
            this.previousEventCharged = event;
            return true;
        }
    }
}
