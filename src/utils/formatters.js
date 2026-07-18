export function formatWeight(weight) {
  return `${Number(weight).toFixed(1)} kg`;
}

export function formatCalories(value) {
  return `${Math.round(value)} kcal`;
}

export function formatProtein(value) {
  return `${Number(value).toFixed(1)} g`;
}

export function formatWater(value) {
  return `${Number(value).toFixed(1)} L`;
}

export function formatPercent(value) {
  return `${Math.round(value)}%`;
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(date) {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}