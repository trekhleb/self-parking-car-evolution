// Tests might be flaky because of a lot of Math.random() usage under the hood.
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
  only?: boolean,
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
    maxAvgPolynomialResultsDistance?: number,
    // How big might be the absolute difference between target polynomial
    // coefficient and predicted (genetic) polynomial coefficients.
    maxCoefficientsDifference?: number,
    // What maximum fitness function value is expected.
    minFitness?: number,
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
      maxCoefficientsDifference: 0.5,
      maxAvgPolynomialResultsDistance: 0.1,
      minFitness: 0.95,
    },
  },
  {
    in: {
      epochs: 200,
      generationSize: 100,
      mutationProbability: 0,
      longLivingChampionsPercentage: 2,
      targetPolynomial: [0.0042],
    },
    out: {
      // maxCoefficientsDifference: 0.0001,
      maxAvgPolynomialResultsDistance: 0.01,
      minFitness: 0.95,
    },
  },
  {
    in: {
      epochs: 300,
      generationSize: 200,
      mutationProbability: 0.2,
      longLivingChampionsPercentage: 2,
      targetPolynomial: [42, -3],
    },
    out: {
      maxCoefficientsDifference: 0.5,
      maxAvgPolynomialResultsDistance: 0.1,
      minFitness: 0.95,
    },
  },
  {
    in: {
      epochs: 300,
      generationSize: 300,
      mutationProbability: 0.2,
      longLivingChampionsPercentage: 2,
      targetPolynomial: [-0.15, 142],
    },
    out: {
      // maxCoefficientsDifference: 1,
      // maxAvgPolynomialResultsDistance: 0.1,
      minFitness: 0.5,
    },
  },
  {
    in: {
      epochs: 1000,
      generationSize: 500,
      mutationProbability: 0.3,
      longLivingChampionsPercentage: 3,
      targetPolynomial: [
        504, 0.06, -496, 0, -504, 0.008, -0.014, 0.007,
      ],
    },
    out: {
      maxCoefficientsDifference: 10,
      // maxAvgPolynomialResultsDistance: 0.1,
      minFitness: 0.95,
    },
  },
  {
    only: true,
    in: {
      epochs: 1000,
      generationSize: 1000,
      mutationProbability: 0.2,
      longLivingChampionsPercentage: 6,
      targetPolynomial: [
        42.4, -3, 0.03, 120.05, 30, -0.01, 0, 170, 362,
        0.01, -10, -396, 0.01, -34.5, -287.5, 0.386, -440, 0,
      ],
    },
    out: {
      maxCoefficientsDifference: 0.01,
      // maxAvgPolynomialResultsDistance: 0.1,
      minFitness: 0.9,
    },
  },
];

describe('genetic', () => {
  it('should create a new generation of correct length', () => {
    const gen01 = createGeneration({
      generationSize: 500,
      genomeLength: 10,
    });

    expect(gen01.length).toBe(500);

    const gen02 = select(
      gen01,
      () => Math.random(),
      {
        mutationProbability: 0.3,
        longLivingChampionsPercentage: 3,
      },
    );

    expect(gen02.length).toBe(500);
  });

  let justOneTest = false;

  testCases.forEach((testCase: TestCase, testIndex: number) => {
    const { only = false } = testCase;
    justOneTest = justOneTest || only;
  });

  testCases.forEach((testCase: TestCase, testIndex: number) => {
    const {
      only = false,
      in: {
        epochs,
        generationSize,
        targetPolynomial,
        mutationProbability,
        longLivingChampionsPercentage,
      },
      out: {
        maxAvgPolynomialResultsDistance,
        maxCoefficientsDifference,
        minFitness,
      },
    } = testCase;

    const coefficientsNum: number = targetPolynomial.length;
    const genomeLength: number = coefficientsNum * precisionConfigs.custom.totalBitsCount;

    const fitness: FitnessFunction = (genome: Genome): number => {
      const genomePolynomial: number[] = genomeToNumbers(genome, precisionConfigs.custom.totalBitsCount);
      const avgDelta = avgPolynomialsDelta(genomePolynomial, targetPolynomial);
      return carLossToFitness(avgDelta, 0.00001);
    };

    if (!justOneTest || only) {
      it(`#${testIndex + 1}: should approximate the polynomial: coefficients - ${coefficientsNum}, epochs - ${epochs}, generation size - ${generationSize}, mutation - ${mutationProbability}, champions - ${longLivingChampionsPercentage}`, () => {
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
        const genomePolynomial: number[] = genomeToNumbers(bestGenome, precisionConfigs.custom.totalBitsCount);

        // Check if polynomial coefficients are OK.
        if (maxCoefficientsDifference !== undefined) {
          const failedCoefficientsChecks: number[][] = [];
          targetPolynomial.forEach((targetCoefficient: number, i: number) => {
            const geneticCoefficient = genomePolynomial[i];
            const coefficientDifference = Math.abs(geneticCoefficient - targetCoefficient);
            try {
              // eslint-disable-next-line jest/no-conditional-expect
              expect(maxCoefficientsDifference).toBeGreaterThanOrEqual(coefficientDifference);
            } catch(e) {
              failedCoefficientsChecks.push([i, geneticCoefficient, targetCoefficient]);
            }
          });
          if (failedCoefficientsChecks.length) {
            let errorMessage = `Expect coefficients to be close (< ${maxCoefficientsDifference}):`;
            failedCoefficientsChecks.forEach((failedCheck: number[]) => {
              const coefficientIndex = failedCheck[0];
              const geneticCoefficient = failedCheck[1];
              const targetCoefficient = failedCheck[2];
              errorMessage += `\n  • #${coefficientIndex}: ${geneticCoefficient} → ${targetCoefficient}`;
            });
            throw new Error(errorMessage);
          }
        }

        // Check if polynomial value is OK.
        if (maxAvgPolynomialResultsDistance !== undefined) {
          const avgDistance = avgPolynomialsDelta(genomePolynomial, targetPolynomial);
          try {
            // eslint-disable-next-line jest/no-conditional-expect
            expect(maxAvgPolynomialResultsDistance).toBeGreaterThanOrEqual(avgDistance);
          } catch(e) {
            throw new Error(`Expect avg polynomial results to be close (< ${maxAvgPolynomialResultsDistance}): ${avgDistance} ≤ ${maxAvgPolynomialResultsDistance}`);
          }
        }

        // Check if fitness value is OK.
        if (minFitness !== undefined) {
          const genomeFitness = fitness(bestGenome);
          try {
            // eslint-disable-next-line jest/no-conditional-expect
            expect(minFitness).toBeLessThanOrEqual(genomeFitness);
          } catch(e) {
            throw new Error(`Expect the fitness value of ${genomeFitness} to be greater than ${minFitness}`);
          }
        }
      });
    }
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
