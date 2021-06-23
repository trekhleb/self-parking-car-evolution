import { Generation, Genome } from '../lib/genetic';
import { CarLicencePlateType, CarsType } from '../components/world/types/car';

type CarMetadataType = {
  genomeIndex: number,
};

const generateLicencePlate = (genomeIndex: number): CarLicencePlateType => {
  return `CAR-${genomeIndex}`;
};

export const generationToCars = (population: Generation): CarsType => {
  const cars: CarsType = {};
  population.forEach((genome: Genome, genomeIndex) => {
    const licencePlate = generateLicencePlate(genomeIndex);
    const meta: CarMetadataType = {
      genomeIndex,
    };
    cars[licencePlate] = {
      licencePlate,
      meta,
      onEngine: () => {},
      onWheel: () => {},
      onHit: () => {},
      onMove: () => {},
    };
  });
  return cars;
};
