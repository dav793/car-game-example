
import { BaseEvent } from '../base-event.js';

export class SteerEvent extends BaseEvent {
    direction: 'left'|'right';
    isPressed: boolean;
}
