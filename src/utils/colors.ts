import colors from 'nice-color-palettes';

export const getRandomColor = (): string => {
  const flatColors = colors.flat();
  const colorIndex = Math.floor(Math.random() * flatColors.length);
  return flatColors[colorIndex];
};
