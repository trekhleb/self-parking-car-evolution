import { NumVec3 } from '../../types/vectors';

export const WHEEL_MASS = 1;
export const WHEEL_RADIUS = 0.3;
export const WHEEL_WIDTH = 0.5;

// Roughly the cars' visual dimensions.
export const CHASSIS_LENGTH = 4;
export const CHASSIS_WIDTH = 1.5;
export const CHASSIS_HEIGHT = 1;
export const CHASSIS_SIZE: NumVec3 = [CHASSIS_WIDTH, CHASSIS_HEIGHT, CHASSIS_LENGTH];
export const CHASSIS_MASS = 500;
export const CHASSIS_BASE_COLOR = '#FFFFFF';
export const CHASSIS_FRONT_WHEEL_SHIFT = 1.3;
export const CHASSIS_BACK_WHEEL_SHIFT = -1.15;
export const CHASSIS_GROUND_CLEARANCE = -0.04;
export const CHASSIS_WHEEL_WIDTH = 1.2;
