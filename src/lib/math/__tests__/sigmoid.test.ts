import { sigmoid, sigmoidToCategories } from '../sigmoid';

const sigmoidTestCases: [number, number][] = [
  [-100, 0],
  [-10, 0.00004],
  [-1, 0.26894],
  [-0.5, 0.37754],
  [0, 0.5],
  [0.5, 0.62245],
  [1, 0.73105],
  [10, 0.99995],
  [100, 1],
];

const sigmoidToCategoriesTestCases: [number, number][] = [
  [-100, -1],
  [-10, -1],
  [-1, 0],
  [-0.5, 0],
  [0, 0],
  [0.5, 0],
  [1, 0],
  [10, 1],
  [100, 1],
];

describe('sigmoid', () => {
  it('should calculate sigmoid correctly', () => {
    for (let testCaseIndex = 0; testCaseIndex < sigmoidTestCases.length; testCaseIndex += 1) {
      const inputNumber: number = sigmoidTestCases[testCaseIndex][0];
      const expectedResult: number = sigmoidTestCases[testCaseIndex][1];
      const calculatedResult: number = Math.floor(sigmoid(inputNumber) * 100000) / 100000;
      expect(calculatedResult).toBe(expectedResult);
    }
  });

  it('should calculate sigmoidToCategories correctly', () => {
    for (let testCaseIndex = 0; testCaseIndex < sigmoidToCategoriesTestCases.length; testCaseIndex += 1) {
      const inputNumber: number = sigmoidToCategoriesTestCases[testCaseIndex][0];
      const expectedResult: number = sigmoidToCategoriesTestCases[testCaseIndex][1];
      const calculatedResult: number = sigmoidToCategories(sigmoid(inputNumber));
      expect(calculatedResult).toBe(expectedResult);
    }
  });
});

export {};
