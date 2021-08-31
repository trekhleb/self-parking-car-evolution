import { sigmoid, sigmoidToCategories } from '../sigmoid';

const sigmoidTestCases: [number, number][] = [
  [-100, 0],
  [-50, 0],
  [-20, 0],
  [-10, 0.0000453],
  [-1, 0.2689414],
  [-0.5, 0.3775406],
  [0, 0.5],
  [0.5, 0.6224593],
  [1,  0.7310585],
  [10, 0.9999546],
  [20, 0.9999999],
  [50, 1],
  [100, 1],
];

const sigmoidToCategoriesTestCases: [number, number][] = [
  [-100, -1],
  [-50, -1],
  [-20, -1],
  [-10, 0],
  [-8, 0],
  [-5, 0],
  [-1, 0],
  [-0.5, 0],
  [0, 0],
  [0.5, 0],
  [1, 0],
  [5, 0],
  [8, 0],
  [10, 0],
  [20, 1],
  [50, 1],
  [100, 1],
];

describe('sigmoid', () => {
  for (let testCaseIndex = 0; testCaseIndex < sigmoidTestCases.length; testCaseIndex += 1) {
    const inputNumber: number = sigmoidTestCases[testCaseIndex][0];
    const expectedResult: number = sigmoidTestCases[testCaseIndex][1];

    it(`should calculate sigmoid correctly for input of ${inputNumber}`, () => {
      const calculatedResult: number = Math.floor(sigmoid(inputNumber) * 10000000) / 10000000;
      expect(calculatedResult).toBe(expectedResult);
    });
  }


  for (let testCaseIndex = 0; testCaseIndex < sigmoidToCategoriesTestCases.length; testCaseIndex += 1) {
    const inputNumber: number = sigmoidToCategoriesTestCases[testCaseIndex][0];
    const expectedResult: number = sigmoidToCategoriesTestCases[testCaseIndex][1];

    it(`should calculate sigmoidToCategories correctly for input of ${inputNumber}`, () => {
      const calculatedResult: number = sigmoidToCategories(sigmoid(inputNumber));
      expect(calculatedResult).toBe(expectedResult);
    });
  }
});

export {};
