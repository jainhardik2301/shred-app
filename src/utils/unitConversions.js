// Weight conversions

export function kgToLb(kg) {
  const value = Number(kg);

  if (!Number.isFinite(value)) return 0;

  return value * 2.20462;
}

export function lbToKg(lb) {
  const value = Number(lb);

  if (!Number.isFinite(value)) return 0;

  return value / 2.20462;
}


// Height conversions

export function cmToFeetInches(cm) {
  const value = Number(cm);

  if (!Number.isFinite(value)) {
    return {
      feet: 0,
      inches: 0,
    };
  }

  const totalInches = value / 2.54;

  let feet = Math.floor(totalInches / 12);
  let inches = Math.round(
    totalInches - feet * 12
  );

  // Handle rounding 11.9 inches → 12 inches
  if (inches === 12) {
    feet += 1;
    inches = 0;
  }

  return {
    feet,
    inches,
  };
}

export function feetInchesToCm(
  feet,
  inches
) {
  const ft = Number(feet) || 0;
  const inch = Number(inches) || 0;

  return (ft * 12 + inch) * 2.54;
}


// Display helpers

export function formatWeight(
  weightKg,
  unit = "kg"
) {
  const weight = Number(weightKg);

  if (!Number.isFinite(weight)) {
    return `0 ${unit}`;
  }

  if (unit === "lb") {
    return `${kgToLb(weight).toFixed(1)} lb`;
  }

  return `${weight.toFixed(1)} kg`;
}

export function formatHeight(
  heightCm,
  unit = "cm"
) {
  const height = Number(heightCm);

  if (!Number.isFinite(height)) {
    return unit === "ft"
      ? `0' 0"`
      : "0 cm";
  }

  if (unit === "ft") {
    const { feet, inches } =
      cmToFeetInches(height);

    return `${feet}' ${inches}"`;
  }

  return `${Math.round(height)} cm`;
}


// Input conversion helpers

export function weightToDisplay(
  weightKg,
  unit = "kg"
) {
  const weight = Number(weightKg);

  if (!Number.isFinite(weight)) {
    return "";
  }

  if (unit === "lb") {
    return Number(
      kgToLb(weight).toFixed(1)
    );
  }

  return weight;
}

export function weightToStorage(
  value,
  unit = "kg"
) {
  const weight = Number(value);

  if (!Number.isFinite(weight)) {
    return 0;
  }

  if (unit === "lb") {
    return Number(
      lbToKg(weight).toFixed(2)
    );
  }

  return weight;
}