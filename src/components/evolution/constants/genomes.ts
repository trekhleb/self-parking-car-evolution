import { Genome } from '../../../libs/genetic';
import { genomeStringToGenome } from '../utils/evolution';

export const FIRST_BEST_GENOME: Genome = genomeStringToGenome(
  '1 0 1 1 1 1 0 1 0 0 1 1 0 1 1 1 1 0 0 0 1 1 1 1 1 1 0 0 0 0 1 0 1 1 1 0 0 1 1 1 1 0 1 1 1 1 0 1 0 0 1 1 0 1 0 0 1 1 0 0 0 1 1 1 0 1 0 1 0 0 1 0 1 1 1 1 0 0 0 1 1 1 0 0 0 0 0 0 1 1 0 0 1 1 1 0 1 1 1 1 1 0 0 0 1 0 0 1 1 0 1 1 0 1 0 1 0 1 0 0 1 0 0 1 0 1 1 0 1 1 1 1 0 0 0 0 1 1 0 1 0 1 0 0 0 0 0 0 0 0 1 0 0 1 1 1 1 0 1 1 0 1 0 1 0 0 1 0 0 0 0 0 0 1 0 0 0 0 1 1'
);

export const SECOND_BEST_GENOME: Genome = genomeStringToGenome(
  '1 0 0 0 0 0 0 0 0 1 0 0 0 0 1 0 0 0 1 1 0 0 0 0 1 1 0 0 1 0 1 0 1 0 1 1 0 1 1 1 0 0 0 0 1 0 0 0 0 1 1 0 0 1 0 0 1 1 0 1 1 1 1 1 1 0 1 1 0 1 0 0 0 0 0 0 1 0 1 0 1 1 0 0 0 0 0 1 0 0 0 0 0 1 0 1 0 1 1 1 0 0 0 1 1 0 1 0 1 0 1 0 1 1 0 1 0 0 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 1 1 0 1 1 1 1 0 1 0 0 0 1 0 0 1 0 0 0 1 1 1 1 1 0 0 1 1 0 0 0 1 0 0 1 0 1 0 1 1 0 1 1 1 1 0 0'
);
