/**
 * Format a number to a specified number of decimal places
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

/**
 * Format a number in scientific notation
 */
export function formatScientific(value: number, decimals: number = 2): string {
  return value.toExponential(decimals);
}

/**
 * Format a number with appropriate unit scaling
 */
export function formatWithUnit(value: number, unit: string, decimals: number = 2): string {
  const absValue = Math.abs(value);
  
  if (absValue === 0) {
    return `0 ${unit}`;
  }
  
  if (absValue >= 1e9) {
    return `${(value / 1e9).toFixed(decimals)} G${unit}`;
  } else if (absValue >= 1e6) {
    return `${(value / 1e6).toFixed(decimals)} M${unit}`;
  } else if (absValue >= 1e3) {
    return `${(value / 1e3).toFixed(decimals)} k${unit}`;
  } else if (absValue >= 1) {
    return `${value.toFixed(decimals)} ${unit}`;
  } else if (absValue >= 1e-3) {
    return `${(value * 1e3).toFixed(decimals)} m${unit}`;
  } else if (absValue >= 1e-6) {
    return `${(value * 1e6).toFixed(decimals)} μ${unit}`;
  } else if (absValue >= 1e-9) {
    return `${(value * 1e9).toFixed(decimals)} n${unit}`;
  } else {
    return `${(value * 1e12).toFixed(decimals)} p${unit}`;
  }
}

/**
 * Format a vector as a string
 */
export function formatVector(x: number, y: number, z?: number, decimals: number = 2): string {
  if (z !== undefined) {
    return `(${formatNumber(x, decimals)}, ${formatNumber(y, decimals)}, ${formatNumber(z, decimals)})`;
  }
  return `(${formatNumber(x, decimals)}, ${formatNumber(y, decimals)})`;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Map a value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Round to nearest step
 */
export function roundToStep(value: number, step: number): number {
  return Math.round(value / step) * step;
}
