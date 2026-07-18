export function isPositiveNumber(value) {
  return !isNaN(value) && Number(value) > 0;
}

export function isValidWeight(weight) {
  return (
    isPositiveNumber(weight) &&
    weight >= 20 &&
    weight <= 300
  );
}

export function isValidWater(value) {
  return (
    isPositiveNumber(value) &&
    value <= 20
  );
}

export function isValidCalories(value) {
  return (
    isPositiveNumber(value) &&
    value <= 10000
  );
}

export function isValidProtein(value) {
  return (
    isPositiveNumber(value) &&
    value <= 1000
  );
}