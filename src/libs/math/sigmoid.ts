export const sigmoid = (x: number): number => {
  return 1 / (1 + Math.E ** -x);
};

export const sigmoidToCategories = (
  sigmoidValue: number,
  aroundZeroMargin: number = 0.49999, // Value between 0 and 0.5:  [0 ... (0.5 - margin) ... 0.5 ... (0.5 + margin) ... 1]
): -1 | 0 | 1 => {
  if (sigmoidValue < (0.5 - aroundZeroMargin)) {
    return -1;
  }
  if (sigmoidValue > (0.5 + aroundZeroMargin)) {
    return 1;
  }
  return 0;
};
