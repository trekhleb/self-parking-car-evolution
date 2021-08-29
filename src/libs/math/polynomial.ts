export const linearPolynomial = (coefficients: number[], variables: number[]): number => {
  if (coefficients.length !== (variables.length + 1)) {
    throw new Error(`Incompatible number polynomial coefficients and variables: ${coefficients.length} and ${variables.length}`);
  }
  let result = 0;
  coefficients.forEach((coefficient: number, coefficientIndex: number) => {
    if (coefficientIndex < variables.length) {
      result += coefficient * variables[coefficientIndex];
    } else {
      result += coefficient
    }
  });
  return result;
};
