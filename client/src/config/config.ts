
export const CONFIG = {
    ENGINE_FORCE: 200,
    // DRAG: 0.84,
    // ROLLING_RESISTANCE: 25.6,
    DRAG: 2.5,
    ROLLING_RESISTANCE: 200,
    ROLLING_RESISTANCE_DECAY: 0.1,
    BRAKING_FORCE: 100,
    CAR_MASS: 10,
    STEER_RATE: 1.2,    // rotation per sec in radians
    MAX_STEER_ANGLE: 20,
    WHEEL_BASE: 1,
} as const;
