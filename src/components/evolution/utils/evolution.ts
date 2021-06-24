import { Generation, Genome } from '../../../lib/genetic';
import { CarLicencePlateType, CarsType } from '../../world/types/car';

export const generateWorldVersion = (generationIndex: number | null, batchIndex: number | null): string => {
  const generation = generationIndex === null ? -1 : generationIndex;
  const batch = batchIndex === null ? -1: batchIndex;
  return `world-${generation}-${batch}`;
};

const generateLicencePlate = (genomeIndex: number): CarLicencePlateType => {
  return `CAR-${genomeIndex + 1}`;
};

export const generationToCars = (population: Generation): CarsType => {
  const cars: CarsType = {};
  population.forEach((genome: Genome, genomeIndex) => {
    const licencePlate = generateLicencePlate(genomeIndex);
    cars[licencePlate] = {
      licencePlate,
      onEngine: () => {},
      onWheel: () => {},
      onHit: () => {},
      onMove: () => {},
    };
  });
  return cars;
};
