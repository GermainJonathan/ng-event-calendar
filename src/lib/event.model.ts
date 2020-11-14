/**
 * Model for an Event
 *
 * @export
 * @interface Event
 */
export interface Event {
    title: string;
    color?: string;
    place?: string;
    description?: string;
    start: Date;
    end?: Date;
    allDay: boolean;
    metadata?: object;
}
