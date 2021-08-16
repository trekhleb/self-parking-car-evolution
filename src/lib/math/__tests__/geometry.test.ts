import { euclideanDistance } from '../geometry';
import { NumVec3 } from '../../../types/vectors';

const testCases: [NumVec3, NumVec3, number][] = [
  [[0, 0, 0], [0, 0, 1], 1],
  [[0, 0, 0], [0, 0, 5], 5],
  [[0, 10, 0], [0, 10, 5], 5],
  [[1, 0, 0], [0, 0, 0], 1],
  [[4, 0, 0], [0, 0, 0], 4],
  [[0, 0, 0], [1, 0, 1], 1.41],
  [[1, 0, 1], [1, 0, 1], 0],
  [[5, 0, 8], [10, 0, 12], 6.4],
];

describe('geometry', () => {
  it('should calculate euclidean distance correctly', () => {
    for (let testCaseIndex = 0; testCaseIndex < testCases.length; testCaseIndex += 1) {
      const from: NumVec3 = testCases[testCaseIndex][0];
      const to: NumVec3 = testCases[testCaseIndex][1];
      const expectedDistance: number = testCases[testCaseIndex][2];
      const calculatedDistance: number = Math.floor(euclideanDistance(from, to) * 100) / 100;
      expect(calculatedDistance).toBe(expectedDistance);
    }
  });
});

export {};
