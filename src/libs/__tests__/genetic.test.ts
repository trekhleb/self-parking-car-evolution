import {
  createGeneration,
  FitnessFunction,
  Generation,
  Genome,
  Percentage,
  Probability,
  select,
} from '../genetic';
import { carLossToFitness, genomeToNumbers } from '../carGenetic';
import { linearPolynomial } from '../math/polynomial';
import { precisionConfigs } from '../math/floats';

type TestCase = {
  in: {
    targetPolynomial: number[],
    epochs: number,
    generationSize: number,
    mutationProbability: Probability,
    longLivingChampionsPercentage: Percentage,
  },
  out: {
    // How big might be the average (for 10 points in space) distance between
    // target polynomial value and predicted (genetic) polynomial value.
    expectedMaxAvgDistance?: number,
    // How big might be the absolute difference between target polynomial
    // coefficient and predicted (genetic) polynomial coefficients.
    expectedMaxCoefficientsDifference?: number,
    // What maximum fitness function value is expected.
    expectedMinFitness?: number,
  },
};

const testCases: TestCase[] = [
  {
    in: {
      epochs: 100,
      generationSize: 100,
      mutationProbability: 0,
      longLivingChampionsPercentage: 2,
      targetPolynomial: [42],
    },
    out: {
      expectedMaxCoefficientsDifference: 0.5,
      expectedMaxAvgDistance: 0.1,
      expectedMinFitness: undefined,
    },
  },
];

describe('genetic', () => {
  testCases.forEach((testCase: TestCase) => {
    const {
      in: {
        epochs,
        generationSize,
        targetPolynomial,
        mutationProbability,
        longLivingChampionsPercentage,
      },
      out: {
        expectedMaxAvgDistance,
        expectedMaxCoefficientsDifference,
        expectedMinFitness,
      },
    } = testCase;

    const coefficientsNum: number = targetPolynomial.length;
    const genomeLength: number = coefficientsNum * precisionConfigs.half.totalBitsCount;

    const fitness: FitnessFunction = (genome: Genome): number => {
      const genomePolynomial: number[] = genomeToNumbers(genome, precisionConfigs.half.totalBitsCount);
      const avgDelta = avgPolynomialsDelta(genomePolynomial, targetPolynomial);
      return carLossToFitness(avgDelta);
    };

    it(`should approximate the polynomial: coefficients - ${coefficientsNum}, epochs - ${epochs}, generation size - ${generationSize}, mutation - ${mutationProbability}`, () => {
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

      // We may take the first individuum since they are sorted
      // by fitness value from best to worst.
      const bestGenome = latestGeneration[0];
      const genomePolynomial: number[] = genomeToNumbers(bestGenome, precisionConfigs.half.totalBitsCount);

      // Check if polynomial coefficients are OK.
      if (expectedMaxCoefficientsDifference !== undefined) {
        targetPolynomial.forEach((targetCoefficient: number, i: number) => {
          const geneticCoefficient = genomePolynomial[i];
          const coefficientDifference = Math.abs(geneticCoefficient - targetCoefficient);
          try {
            expect(expectedMaxCoefficientsDifference).toBeGreaterThanOrEqual(coefficientDifference);
          } catch(e) {
            throw new Error(`Expect coefficient ${geneticCoefficient} to be close to coefficient ${targetCoefficient} with less than ${expectedMaxCoefficientsDifference} difference`);
          }
        });
      }

      // Check if polynomial value is OK.
      if (expectedMaxAvgDistance !== undefined) {
        const avgDistance = avgPolynomialsDelta(genomePolynomial, targetPolynomial);
        try {
          expect(expectedMaxAvgDistance).toBeGreaterThanOrEqual(avgDistance);
        } catch(e) {
          throw new Error(`Expect the average distance of ${avgDistance} to be less than ${expectedMaxAvgDistance}`);
        }
      }

      // Check if fitness value is OK.
      if (expectedMinFitness !== undefined) {
        const genomeFitness = fitness(bestGenome);
        try {
          expect(expectedMinFitness).toBeLessThanOrEqual(genomeFitness);
        } catch(e) {
          throw new Error(`Expect the fitness value of ${genomeFitness} to be greater than ${expectedMinFitness}`);
        }
      }
    });
  });
});

const avgPolynomialsDelta = (
  polynomialA: number[],
  polynomialB: number[],
  numPointsToTest: number = 10,
): number => {
  let delta: number = 0;

  const coefficientsNum = polynomialA.length;

  for (let testPointIndex = 0; testPointIndex < numPointsToTest; testPointIndex += 1) {
    const variables: number[] = new Array(coefficientsNum - 1)
      .fill(null)
      .map(() => 100 * Math.random());

    const genomeY: number = linearPolynomial(polynomialA, variables);
    const targetY: number = linearPolynomial(polynomialB, variables);

    delta += Math.sqrt((genomeY - targetY) ** 2);
  }

  const avgDelta = delta / numPointsToTest;
  return avgDelta;
};

export {};
