import { linearPolynomial } from '../polynomial';

const testCases: [number[], number[], number][] = [
  [[0, 0, 0], [0, 0], 0],
  [[0, 0, 0], [1, 2], 0],
  [[1, 1, 1], [1, 2], 4],
  [[1, 2, 3], [4, 5], 17],
  [[1, 2, 3], [0, 0], 3],
];

describe('polynomial', () => {
  it('should calculate polynomial correctly', () => {
    for (let testCaseIndex = 0; testCaseIndex < testCases.length; testCaseIndex += 1) {
      const coefficients: number[] = testCases[testCaseIndex][0];
      const variables: number[] = testCases[testCaseIndex][1];
      const expectedResult: number = testCases[testCaseIndex][2];
      const calculatedResult: number = Math.floor(linearPolynomial(coefficients, variables) * 100) / 100;
      expect(calculatedResult).toBe(expectedResult);
    }
  });
});

export {};
