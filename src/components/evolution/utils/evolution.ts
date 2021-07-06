import { Generation, Genome } from '../../../lib/genetic';
import {
  CarLicencePlateType,
  CarsType,
  EngineOptionsType,
  SensorValuesType,
  WheelOptionsType
} from '../../world/types/car';
import { PARKING_SPOT_POINTS } from '../../world/surroundings/ParkingSpot';
import { RectanglePoints } from '../../world/types/vectors';
import { CAR_SENSORS_NUM, loss } from '../../../lib/carGenetic';

const generateLicencePlate = (
  generationIndex: number | null,
  genomeIndex: number
): CarLicencePlateType => {
  const generationIdx = generationIndex !== null ? (generationIndex + 1) : '';
  const genomeIdx = genomeIndex + 1;
  return `CAR-${generationIdx}-${genomeIdx}`;
};

type GenerationToCarsProps = {
  generationIndex: number | null,
  generation: Generation,
  onFitnessUpdate?: (licencePlate: CarLicencePlateType, fitness: number) => void,
};

export const generationToCars = (props: GenerationToCarsProps): CarsType => {
  const {
    generationIndex,
    generation,
    onFitnessUpdate = () => {},
  } = props;
  const cars: CarsType = {};
  generation.forEach((genome: Genome, genomeIndex) => {
    const licencePlate = generateLicencePlate(generationIndex, genomeIndex);

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
      const carLoss = loss({
        wheelsPosition: wheelsPoints,
        parkingLotCorners: PARKING_SPOT_POINTS,
      });
      onFitnessUpdate(licencePlate, carLoss);
    };

    cars[licencePlate] = {
      licencePlate,
      generationIndex: generationIndex !== null ? generationIndex : -1,
      sensorsNum: CAR_SENSORS_NUM,
      onEngine,
      onWheel,
      onMove,
      onHit: () => {},
    };
  });
  return cars;
};

export const formatLossValue = (lossValue: number | null | undefined): number | null => {
  if (typeof lossValue !== 'number') {
    return null;
  }
  return Math.ceil(lossValue * 100) / 100;
};
