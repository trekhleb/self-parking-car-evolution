import { Generation, Genome } from '../../../lib/genetic';
import {
  CarLicencePlateType,
  CarsType,
  EngineOptionsType,
  SensorValuesType,
  WheelOptionsType
} from '../../world/types/car';
import { PARKING_SPOT_POINTS } from '../../world/surroundings/ParkingSpot';
import { NumVec3, RectanglePoints } from '../../world/types/vectors';

export const SENSORS_TOTAL = 16;
export const GENES_PER_PARAMETER = 8;
export const GENOME_LENGTH = SENSORS_TOTAL * GENES_PER_PARAMETER;

export const generateWorldVersion = (generationIndex: number | null, batchIndex: number | null): string => {
  const generation = generationIndex === null ? -1 : generationIndex;
  const batch = batchIndex === null ? -1: batchIndex;
  return `world-${generation}-${batch}`;
};

const generateLicencePlate = (genomeIndex: number): CarLicencePlateType => {
  return `CAR-${genomeIndex + 1}`;
};

export const generationToCars = (
  population: Generation,
  onFitnessUpdate: (licencePlate: CarLicencePlateType, fitness: number) => void = () => {},
): CarsType => {
  const cars: CarsType = {};
  population.forEach((genome: Genome, genomeIndex) => {
    const licencePlate = generateLicencePlate(genomeIndex);

    const onEngine = (sensors: SensorValuesType): EngineOptionsType => {
      const random = Math.random();
      if (random < 0.3) {
        return 'backwards';
      }
      if (random > 0.6) {
        return 'forward'
      }
      return 'neutral';
    };

    const onWheel = (sensors: SensorValuesType): WheelOptionsType => {
      const random = Math.random();
      if (random < 0.3) {
        return 'left';
      }
      if (random > 0.6) {
        return 'straight'
      }
      return 'right';
    };

    const onMove = (wheelsPoints: RectanglePoints) => {
      const carFitness = fitness({
        wheelsPoints: wheelsPoints,
        parkingLotPoints: PARKING_SPOT_POINTS,
      });
      onFitnessUpdate(licencePlate, carFitness);
    };

    cars[licencePlate] = {
      licencePlate,
      sensorsNum: SENSORS_TOTAL,
      onEngine,
      onWheel,
      onMove,
      onHit: () => {},
    };
  });
  return cars;
};

export type FitnessParams = {
  wheelsPoints: RectanglePoints,
  parkingLotPoints: RectanglePoints,
};

export const fitness = (params: FitnessParams): number => {
  const { wheelsPoints, parkingLotPoints } = params;
  const { fl: flWheel, fr: frWheel, br: brWheel, bl: blWheel } = wheelsPoints;
  const { fl: flLot, fr: frLot, br: brLot, bl: blLot } = parkingLotPoints;

  const flDistance = distance(flWheel, flLot);
  const frDistance = distance(frWheel, frLot);
  const brDistance = distance(brWheel, brLot);
  const blDistance = distance(blWheel, blLot);

  return (flDistance + frDistance + brDistance + blDistance) / 4;
};

const distance = (from: NumVec3, to: NumVec3) => {
  const [fromX, fromY, fromZ] = from;
  const [toX, toY, toZ] = to;
  return Math.sqrt((fromX - toX) ** 2 + (fromZ - toZ) ** 2);
};

export const formatFitnessValue = (fitnessValue: number | null | undefined): number | null => {
  if (typeof fitnessValue !== 'number') {
    return null;
  }
  return Math.ceil(fitnessValue * 100) / 100;
};
