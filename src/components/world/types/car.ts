import { RectanglePoints } from '../../../types/vectors';

export type CarLicencePlateType = string;

export type SensorValueType = number | undefined | null;
export type SensorValuesType = SensorValueType[];

export type EngineOptionsType = 'backwards' | 'neutral' | 'forward';
export type WheelOptionsType = 'left' | 'straight' | 'right';

export type CarType = {
  licencePlate: CarLicencePlateType,
  generationIndex: number,
  genomeIndex: number,
  sensorsNum?: number,
  onHit?: () => void,
  onEngine?: (sensors: SensorValuesType) => EngineOptionsType,
  onWheel?: (sensors: SensorValuesType) => WheelOptionsType,
  onMove?: (wheelsPoints: RectanglePoints) => void,
  meta?: Record<string, any>,
};

type CarPartType = 'chassis' | 'wheel';

export type userCarUUID = string;

export type CarMetaData = {
  uuid: string,
  type: CarPartType,
  isSensorObstacle: boolean,
};

export type CarsType = Record<CarLicencePlateType, CarType>;

export type RaycastVehiclePublicApi = {
  setSteeringValue: (value: number, wheelIndex: number) => void
  applyEngineForce: (value: number, wheelIndex: number) => void
  setBrake: (brake: number, wheelIndex: number) => void
};

export type WheelInfoOptions = {
  radius?: number
  directionLocal?: number[]
  suspensionStiffness?: number
  suspensionRestLength?: number
  maxSuspensionForce?: number
  maxSuspensionTravel?: number
  dampingRelaxation?: number
  dampingCompression?: number
  frictionSlip?: number
  rollInfluence?: number
  axleLocal?: number[]
  chassisConnectionPointLocal?: number[]
  isFrontWheel?: boolean
  useCustomSlidingRotationalSpeed?: boolean
  customSlidingRotationalSpeed?: number
};
