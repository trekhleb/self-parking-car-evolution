import { Gene, Generation, Genome } from '../../../lib/genetic';
import {
  CarLicencePlateType,
  CarsType,
  EngineOptionsType,
  SensorValuesType, SensorValueType,
  WheelOptionsType
} from '../../world/types/car';
import { PARKING_SPOT_POINTS } from '../../world/surroundings/ParkingSpot';
import { RectanglePoints } from '../../../types/vectors';
import { CAR_SENSORS_NUM, engineFormula, carLoss, wheelsFormula } from '../../../lib/carGenetic';
import { SENSOR_DISTANCE_FALLBACK } from '../../world/car/constants';

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
  onLossUpdate?: (licencePlate: CarLicencePlateType, loss: number) => void,
};

export const generationToCars = (props: GenerationToCarsProps): CarsType => {
  const {
    generationIndex,
    generation,
    onLossUpdate = () => {},
  } = props;
  const cars: CarsType = {};
  generation.forEach((genome: Genome, genomeIndex) => {
    const licencePlate = generateLicencePlate(generationIndex, genomeIndex);

    const onEngine = (sensors: SensorValuesType): EngineOptionsType => {
      const formulaOutput = engineFormula(genome, cleanUpSensors(sensors));
      if (formulaOutput === -1) {
        return 'backwards';
      }
      if (formulaOutput === 1) {
        return 'forward'
      }
      return 'neutral';
    };

    const onWheel = (sensors: SensorValuesType): WheelOptionsType => {
      const formulaOutput = wheelsFormula(genome, cleanUpSensors(sensors));
      if (formulaOutput === -1) {
        return 'left';
      }
      if (formulaOutput === 1) {
        return 'right'
      }
      return 'straight';
    };

    const onMove = (wheelsPoints: RectanglePoints) => {
      const loss = carLoss({
        wheelsPosition: wheelsPoints,
        parkingLotCorners: PARKING_SPOT_POINTS,
      });
      onLossUpdate(licencePlate, loss);
    };

    cars[licencePlate] = {
      licencePlate,
      generationIndex: generationIndex !== null ? generationIndex : -1,
      sensorsNum: CAR_SENSORS_NUM,
      genomeIndex,
      onEngine,
      onWheel,
      onMove,
      onHit: () => {},
    };
  });
  return cars;
};

const cleanUpSensors = (sensors: SensorValuesType): number[] => {
  return sensors.map((sensor: SensorValueType) => {
    if (sensor === null || sensor === undefined) {
      return SENSOR_DISTANCE_FALLBACK;
    }
    return sensor;
  });
};

export const formatLossValue = (lossValue: number | null | undefined): number | null => {
  if (typeof lossValue !== 'number') {
    return null;
  }
  return Math.ceil(lossValue * 100) / 100;
};

export const generateWorldVersion = (
  generationIndex: number | null,
  batchIndex: number | null
): string => {
  const generation = generationIndex === null ? -1 : generationIndex;
  const batch = batchIndex === null ? -1: batchIndex;
  return `world-${generation}-${batch}`;
};

export const genomeStringToGenome = (genomeString: string): Genome => {
  return genomeString
    .split(' ')
    .map<Gene>((geneString: string) => {
      const gene: Gene = parseInt(geneString, 10) === 1 ? 1 : 0;
      return gene;
    });
};
