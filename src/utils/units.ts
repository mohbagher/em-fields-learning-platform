/**
 * Physical constants
 */
export const CONSTANTS = {
  // Coulomb's constant (N⋅m²/C²)
  k: 8.987551787e9,
  
  // Permittivity of free space (F/m)
  epsilon0: 8.854187817e-12,
  
  // Elementary charge (C)
  e: 1.602176634e-19,
  
  // Electron mass (kg)
  me: 9.10938356e-31,
  
  // Proton mass (kg)
  mp: 1.672621898e-27,
  
  // Neutron mass (kg)
  mn: 1.674927471e-27,
};

/**
 * Convert charge between units
 */
export function convertCharge(value: number, from: string, to: string): number {
  const toBase: { [key: string]: number } = {
    C: 1,
    mC: 1e-3,
    μC: 1e-6,
    nC: 1e-9,
    pC: 1e-12,
  };

  const baseValue = value * toBase[from];
  return baseValue / toBase[to];
}

/**
 * Convert voltage between units
 */
export function convertVoltage(value: number, from: string, to: string): number {
  const toBase: { [key: string]: number } = {
    V: 1,
    kV: 1e3,
    mV: 1e-3,
    μV: 1e-6,
  };

  const baseValue = value * toBase[from];
  return baseValue / toBase[to];
}

/**
 * Convert distance between units
 */
export function convertDistance(value: number, from: string, to: string): number {
  const toBase: { [key: string]: number } = {
    m: 1,
    cm: 1e-2,
    mm: 1e-3,
    μm: 1e-6,
    nm: 1e-9,
  };

  const baseValue = value * toBase[from];
  return baseValue / toBase[to];
}

/**
 * Convert capacitance between units
 */
export function convertCapacitance(value: number, from: string, to: string): number {
  const toBase: { [key: string]: number } = {
    F: 1,
    mF: 1e-3,
    μF: 1e-6,
    nF: 1e-9,
    pF: 1e-12,
  };

  const baseValue = value * toBase[from];
  return baseValue / toBase[to];
}

/**
 * Convert electric field between units
 */
export function convertElectricField(value: number, from: string, to: string): number {
  // N/C and V/m are equivalent
  if ((from === 'N/C' && to === 'V/m') || (from === 'V/m' && to === 'N/C')) {
    return value;
  }
  return value;
}

/**
 * Convert energy between units
 */
export function convertEnergy(value: number, from: string, to: string): number {
  const toBase: { [key: string]: number } = {
    J: 1,
    eV: 1.602176634e-19,
    keV: 1.602176634e-16,
    MeV: 1.602176634e-13,
  };

  const baseValue = value * toBase[from];
  return baseValue / toBase[to];
}

/**
 * Get appropriate charge unit for display
 */
export function getAppropriateChargeUnit(charge: number): string {
  const absCharge = Math.abs(charge);
  
  if (absCharge >= 1e-3) return 'mC';
  if (absCharge >= 1e-6) return 'μC';
  if (absCharge >= 1e-9) return 'nC';
  return 'pC';
}

/**
 * Get appropriate distance unit for display
 */
export function getAppropriateDistanceUnit(distance: number): string {
  const absDistance = Math.abs(distance);
  
  if (absDistance >= 1) return 'm';
  if (absDistance >= 1e-2) return 'cm';
  if (absDistance >= 1e-3) return 'mm';
  return 'μm';
}
