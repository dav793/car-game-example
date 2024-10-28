
import { ThrottleEvent } from './types/throttle.js';
import { BrakeEvent } from './types/brake.js';
import { SteerEvent } from './types/steer.js';

export const EVENT_TYPE = {
    THROTTLE: 'THROTTLE',
    BRAKE: 'BRAKE',
    STEER: 'STEER'
} as const;
export type EventType = keyof typeof EVENT_TYPE;

export type DistinctEvent< T extends EventType > = (
    T extends typeof EVENT_TYPE.THROTTLE ? ThrottleEvent :
    T extends typeof EVENT_TYPE.BRAKE ? BrakeEvent :
    T extends typeof EVENT_TYPE.STEER ? SteerEvent :
    never
);
