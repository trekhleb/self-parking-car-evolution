import { NumVec3, RectanglePoints } from '../components/world/types/vectors';

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

type LossParams = {
  wheelsPosition: RectanglePoints,
  parkingLotCorners: RectanglePoints,
};

// Loss function calculates how far the car is from the parking lot
// by comparing the wheels positions with parking lot corners positions.
export const loss = (params: LossParams): number => {
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

  const flDistance = distance(flWheel, flCorner);
  const frDistance = distance(frWheel, frCorner);
  const brDistance = distance(brWheel, brCorner);
  const blDistance = distance(blWheel, blCorner);

  return (flDistance + frDistance + brDistance + blDistance) / 4;
};

// Calculates the XZ distance between two points in space.
// The vertical Y distance is not being taken into account.
const distance = (from: NumVec3, to: NumVec3) => {
  const [fromX, fromY, fromZ] = from;
  const [toX, toY, toZ] = to;
  return Math.sqrt((fromX - toX) ** 2 + (fromZ - toZ) ** 2);
};
