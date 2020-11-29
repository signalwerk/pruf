export const required = (value) => {
  if (value === undefined || value === null) {
    return false;
  }

  if (value === false) {
    return true;
  }

  if (value === 0) {
    return true;
  }

  // if (Array.isArray(value)) return value.length > 0;

  return !!value;
};
