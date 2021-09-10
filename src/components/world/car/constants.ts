import { NumVec3 } from '../../../types/vectors';
import { getModelPath } from '../utils/models';
import { CAR_SENSORS_NUM } from '../../../libs/carGenetic';

// Wheels.
export const WHEEL_OBJECT_NAME = 'wheel';
export const WHEEL_MASS = 0.1;
export const WHEEL_RADIUS = 0.3;
export const WHEEL_WIDTH = 0.5;
export const WHEEL_MODEL_PATH = getModelPath('wheel.glb');
export const WHEEL_SUSPENSION_STIFFNESS = 30;
export const WHEEL_SUSPENSION_REST_LENGTH = 0.3;
export const WHEEL_MAX_SUSPENSION_FORCE = 10000;
export const WHEEL_MAX_SUSPENSION_TRAVEL = 0.3;
export const WHEEL_DAMPING_RELAXATION = 2.3;
export const WHEEL_DAMPING_COMPRESSION = 4.4;
export const WHEEL_FRICTION_SLIP = 5;
export const WHEEL_ROLL_INFLUENCE = 0.01;
export const WHEEL_CUSTOM_SLIDING_ROTATION_SPEED = -30;

// Roughly the cars' visual dimensions.
export const CHASSIS_OBJECT_NAME = 'chassis';
export const CHASSIS_LENGTH = 4;
export const CHASSIS_WIDTH = 1.5;
export const CHASSIS_HEIGHT = 1;
export const CHASSIS_SIZE: NumVec3 = [CHASSIS_WIDTH, CHASSIS_HEIGHT, CHASSIS_LENGTH];
export const CHASSIS_MASS = 3; // kg
export const CHASSIS_BASE_COLOR = '#FFFFFF';
export const CHASSIS_SIMPLIFIED_BASE_COLOR = 'orange';
export const CHASSIS_BASE_TOUCHED_COLOR = '#FF1111';
export const CHASSIS_FRONT_WHEEL_SHIFT = 1.3;
export const CHASSIS_BACK_WHEEL_SHIFT = -1.15;
export const CHASSIS_GROUND_CLEARANCE = -0.04;
export const CHASSIS_WHEEL_WIDTH = 1.2;
export const CHASSIS_MODEL_PATH = getModelPath('beetle.glb');
export const CHASSIS_RELATIVE_POSITION: NumVec3 = [0, -0.6, 0];

// Sensors.
export const SENSORS_NUM = CAR_SENSORS_NUM;
export const SENSOR_HEIGHT = -0.15;
export const SENSOR_DISTANCE = 4;
export const SENSOR_DISTANCE_FALLBACK = 0;

// Car.
export const CAR_MAX_STEER_VALUE = 0.6;
export const CAR_MAX_FORCE = 2;
export const CAR_MAX_BREAK_FORCE = 2;
