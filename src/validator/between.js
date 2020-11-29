export const between = (min, max) => (value) => {
  return value > min && value < max;
};
