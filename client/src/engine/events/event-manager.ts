
import { Subject, Observable, filter } from 'rxjs';

import { EventType, DistinctEvent, BaseEvent } from './event.js';

export class EventManager {

    private _eventStream = new Subject< BaseEvent >();
    get eventStream() { return this._eventStream.asObservable(); }

    constructor() {}

    // listen events
    // detect event class (C) through inference, based on event type (T) 
    on<
        T extends EventType,
        C extends DistinctEvent<T>
    >(type: T): Observable<C> {
        return this.eventStream.pipe(
            filter(ev => ev.type === type)
        ) as Observable<C>;
    }

    // emit events
    // detect event class (C) through inference, based on event type (T) 
    push<
        T extends EventType, 
        C extends DistinctEvent<T>
    >(type: T, event: Omit<C, 'type'>): void {
        this._eventStream.next({
            ...event,
            type
        });
    }
}