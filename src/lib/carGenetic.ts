// Car has 16 distance sensors.
export const CAR_SENSORS_NUM = 16;

// Based on 16 distance sensors we need to provide two formulas that would define car behaviour:
// 1. Engine formula (input: 16 sensors; output: backward, neutral, forward)
// 2. Wheels formula (input: 16 sensors; output: left, straight, right)
export const FORMULAS_NUM = 2;

// How many genes we need to encode each numeric parameter for the formulas.
export const GENES_PER_FORMULA_PARAMETER = 8;

// The length of the binary genome of the car.
export const GENOME_LENGTH = CAR_SENSORS_NUM * GENES_PER_FORMULA_PARAMETER * FORMULAS_NUM;
