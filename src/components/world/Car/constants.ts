import { NumVec3 } from '../../../types/vectors';
import { getModelPath } from '../../../utils/models';

export const WHEEL_MASS = 1;
export const WHEEL_RADIUS = 0.3;
export const WHEEL_WIDTH = 0.5;
export const WHEEL_MODEL_PATH = getModelPath('wheel.glb');

// Roughly the cars' visual dimensions.
export const CHASSIS_LENGTH = 4;
export const CHASSIS_WIDTH = 1.5;
export const CHASSIS_HEIGHT = 1;
export const CHASSIS_SIZE: NumVec3 = [CHASSIS_WIDTH, CHASSIS_HEIGHT, CHASSIS_LENGTH];
export const CHASSIS_MASS = 500; // kg
export const CHASSIS_BASE_COLOR = '#FFFFFF';
export const CHASSIS_BASE_TOUCHED_COLOR = '#FF1111';
export const CHASSIS_FRONT_WHEEL_SHIFT = 1.3;
export const CHASSIS_BACK_WHEEL_SHIFT = -1.15;
export const CHASSIS_GROUND_CLEARANCE = -0.04;
export const CHASSIS_WHEEL_WIDTH = 1.2;
export const CHASSIS_MODEL_PATH = getModelPath('beetle.glb');
export const CHASSIS_RELATIVE_POSITION: NumVec3 = [0, -0.6, 0];

// Sensors.
export const SENSOR_HEIGHT = CHASSIS_HEIGHT / 4;
export const SENSOR_DISTANCE = 4;

// Car.
export const CAR_MAX_STEER_VALUE = 0.5;
export const CAR_MAX_FORCE = 1000;
export const CAR_MAX_BREAK_FORCE = 10000;
