import {
  createGeneration,
  FitnessFunction,
  Generation,
  Genome,
  Percentage,
  Probability,
  select,
} from '../genetic';
import { genomeToNumbers } from '../carGenetic';
import { linearPolynomial } from '../math/polynomial';
import { precisionConfigs } from '../math/floats';

type TestCase = {
  targetPolynomial: number[],
  epochs: number,
  generationSize: number,
  mutationProbability: Probability,
  longLivingChampionsPercentage: Percentage,
};

const testCases: TestCase[] = [
  {
    epochs: 10,
    generationSize: 100,
    mutationProbability: 0.2,
    longLivingChampionsPercentage: 10,
    targetPolynomial: [150.679, 17, -3, -0.0984]
  },
];

describe('genetic', () => {
  testCases.forEach((testCase: TestCase) => {
    const {
      epochs,
      generationSize,
      targetPolynomial,
      mutationProbability,
      longLivingChampionsPercentage,
    } = testCase;

    const coefficientsNum: number = targetPolynomial.length;
    const genomeLength: number = coefficientsNum * precisionConfigs.half.totalBitsCount;
    const testName: string = `should approximate the polynomial with ${coefficientsNum} coefficients in ${epochs} epochs and generation size of ${generationSize}`;

    const fitness: FitnessFunction = (genome: Genome): number => {
      const genomePolynomial: number[] = genomeToNumbers(genome, precisionConfigs.half.totalBitsCount);

      let delta = 0;
      const numPointsToTest = 10;

      for (let testPointIndex = 0; testPointIndex < numPointsToTest; testPointIndex += 1) {
        const variables: number[] = new Array(coefficientsNum - 1)
          .fill(null)
          .map(() => 100 * Math.random());

        const genomeY: number = linearPolynomial(genomePolynomial, variables);
        const targetY: number = linearPolynomial(targetPolynomial, variables);

        delta += Math.sqrt((genomeY - targetY) ** 2);
      }

      const avgDelta = delta / numPointsToTest;

      return avgDelta;
    };

    it(testName, () => {
      // Create the first generation.
      const firstGeneration = createGeneration({
        generationSize,
        genomeLength,
      });

      // Let generations live and mate for several epochs.
      let epoch = 0;
      let latestGeneration: Generation = firstGeneration;
      while (epoch < epochs) {
        epoch += 1;
        latestGeneration = select(
          latestGeneration,
          fitness,
          {
            mutationProbability,
            longLivingChampionsPercentage,
          },
        );
      }

      // Check the fitness of the latest generation.

    });
  });
});

export {};
