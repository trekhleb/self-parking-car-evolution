import { NumVec3 } from '../../types/vectors';

// Calculates the XZ distance between two points in space.
// The vertical Y distance is not being taken into account.
export const euclideanDistance = (from: NumVec3, to: NumVec3) => {
  const fromX = from[0];
  const fromZ = from[2];
  const toX = to[0];
  const toZ = to[2];
  return Math.sqrt((fromX - toX) ** 2 + (fromZ - toZ) ** 2);
};
