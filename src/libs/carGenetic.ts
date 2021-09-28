import { RectanglePoints } from '../types/vectors';
import { Gene, Genome } from './genetic';
import { bitsToFloat10, precisionConfigs } from './math/floats';
import { linearPolynomial } from './math/polynomial';
import { sigmoid, sigmoidToCategories } from './math/sigmoid';
import { euclideanDistance } from './math/geometry';

// Car has 8 distance sensors.
export const CAR_SENSORS_NUM = 8;

// Additional formula coefficient that is not connected to a sensor.
export const BIAS_UNITS = 1;

// How many genes we need to encode each numeric parameter for the formulas.
export const GENES_PER_NUMBER = precisionConfigs.custom.totalBitsCount;

// Based on 8 distance sensors we need to provide two formulas that would define car's behaviour:
// 1. Engine formula (input: 8 sensors; output: -1 (backward), 0 (neutral), +1 (forward))
// 2. Wheels formula (input: 8 sensors; output: -1 (left), 0 (straight), +1 (right))
export const ENGINE_FORMULA_GENES_NUM = (CAR_SENSORS_NUM + BIAS_UNITS) * GENES_PER_NUMBER;
export const WHEELS_FORMULA_GENES_NUM = (CAR_SENSORS_NUM + BIAS_UNITS) * GENES_PER_NUMBER;

// The length of the binary genome of the car.
export const GENOME_LENGTH = ENGINE_FORMULA_GENES_NUM + WHEELS_FORMULA_GENES_NUM;

type LossParams = {
  wheelsPosition: RectanglePoints,
  parkingLotCorners: RectanglePoints,
};

// Loss function calculates how far the car is from the parking lot
// by comparing the wheels positions with parking lot corners positions.
export const carLoss = (params: LossParams): number => {
  const { wheelsPosition, parkingLotCorners } = params;

  const {
    fl: flWheel,
    fr: frWheel,
    br: brWheel,
    bl: blWheel,
  } = wheelsPosition;

  const {
    fl: flCorner,
    fr: frCorner,
    br: brCorner,
    bl: blCorner,
  } = parkingLotCorners;

  const flDistance = euclideanDistance(flWheel, flCorner);
  const frDistance = euclideanDistance(frWheel, frCorner);
  const brDistance = euclideanDistance(brWheel, brCorner);
  const blDistance = euclideanDistance(blWheel, blCorner);

  return (flDistance + frDistance + brDistance + blDistance) / 4;
};

export const carLossToFitness = (loss: number, alpha: number = 1): number => {
  return 1 / (alpha * loss + 1);
};

export type SensorValues = number[];

export type FormulaCoefficients = number[];

export type FormulaResult = -1 | 0 | 1;

type DecodedGenome = {
  engineFormulaCoefficients: FormulaCoefficients,
  wheelsFormulaCoefficients: FormulaCoefficients,
}

export const decodeGenome = (genome: Genome): DecodedGenome => {
  const engineGenes: Gene[] = genome.slice(0, ENGINE_FORMULA_GENES_NUM);
  const wheelsGenes: Gene[] = genome.slice(
    ENGINE_FORMULA_GENES_NUM,
    ENGINE_FORMULA_GENES_NUM + WHEELS_FORMULA_GENES_NUM,
  );

  const engineFormulaCoefficients: FormulaCoefficients = genomeToNumbers(engineGenes, GENES_PER_NUMBER);
  const wheelsFormulaCoefficients: FormulaCoefficients = genomeToNumbers(wheelsGenes, GENES_PER_NUMBER);

  return {
    engineFormulaCoefficients,
    wheelsFormulaCoefficients,
  };
};

export const genomeToNumbers = (genome: Genome, genesPerNumber: number): number[] => {
  if (genome.length % genesPerNumber !== 0) {
    throw new Error('Wrong number of genes in the numbers genome');
  }
  const numbers: number[] = [];
  for (let numberIndex = 0; numberIndex < genome.length; numberIndex += genesPerNumber) {
    const number: number = bitsToFloat10(genome.slice(numberIndex, numberIndex + genesPerNumber));
    numbers.push(number);
  }
  return numbers;
};

export const engineFormula = (genome: Genome, sensors: SensorValues): FormulaResult => {
  const {engineFormulaCoefficients} = decodeGenome(genome);
  const rawResult = linearPolynomial(engineFormulaCoefficients, sensors);
  const normalizedResult = sigmoid(rawResult);
  return sigmoidToCategories(normalizedResult);
};

export const wheelsFormula = (genome: Genome, sensors: SensorValues): FormulaResult => {
  const {wheelsFormulaCoefficients} = decodeGenome(genome);
  const rawResult = linearPolynomial(wheelsFormulaCoefficients, sensors);
  const normalizedResult = sigmoid(rawResult);
  return sigmoidToCategories(normalizedResult);
};
