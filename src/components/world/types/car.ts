export type CarLicencePlateType = string;

export type CarType = {
  licencePlate: CarLicencePlateType,
  onHit?: () => void,
  onEngine?: () => void,
  onWheel?: () => void,
  onMove?: () => void,
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
