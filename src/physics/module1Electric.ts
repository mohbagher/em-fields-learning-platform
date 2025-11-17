import { Vector3D, Charge, ElectricField, ForceVector } from '@/types';
import { CONSTANTS } from '@/utils/units';

/**
 * Calculate the magnitude of a 3D vector
 */
export function magnitude(v: Vector3D): number {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

/**
 * Normalize a 3D vector
 */
export function normalize(v: Vector3D): Vector3D {
  const mag = magnitude(v);
  if (mag === 0) return { x: 0, y: 0, z: 0 };
  return {
    x: v.x / mag,
    y: v.y / mag,
    z: v.z / mag,
  };
}

/**
 * Add two vectors
 */
export function addVectors(v1: Vector3D, v2: Vector3D): Vector3D {
  return {
    x: v1.x + v2.x,
    y: v1.y + v2.y,
    z: v1.z + v2.z,
  };
}

/**
 * Subtract two vectors
 */
export function subtractVectors(v1: Vector3D, v2: Vector3D): Vector3D {
  return {
    x: v1.x - v2.x,
    y: v1.y - v2.y,
    z: v1.z - v2.z,
  };
}

/**
 * Multiply a vector by a scalar
 */
export function scaleVector(v: Vector3D, scalar: number): Vector3D {
  return {
    x: v.x * scalar,
    y: v.y * scalar,
    z: v.z * scalar,
  };
}

/**
 * Calculate distance between two points
 */
export function distance(p1: Vector3D, p2: Vector3D): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dz = p2.z - p1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Calculate the electric force between two charges using Coulomb's law
 * F = k * |q1 * q2| / r²
 */
export function calculateCoulombForce(charge1: Charge, charge2: Charge): ForceVector {
  const r = distance(charge1.position, charge2.position);
  
  // Avoid division by zero
  if (r < 1e-10) {
    return {
      position: charge1.position,
      force: { x: 0, y: 0, z: 0 },
      magnitude: 0,
    };
  }

  // Calculate force magnitude
  const forceMagnitude = (CONSTANTS.k * Math.abs(charge1.charge * charge2.charge)) / (r * r);

  // Calculate direction (from charge2 to charge1 for repulsion, opposite for attraction)
  const direction = normalize(subtractVectors(charge1.position, charge2.position));
  
  // If charges have opposite signs, reverse direction (attraction)
  const sign = charge1.charge * charge2.charge > 0 ? 1 : -1;
  
  const force = scaleVector(direction, forceMagnitude * sign);

  return {
    position: charge1.position,
    force,
    magnitude: forceMagnitude,
  };
}

/**
 * Calculate the electric field at a point due to a single charge
 * E = k * q / r²
 */
export function calculateElectricField(charge: Charge, position: Vector3D): ElectricField {
  const r = distance(charge.position, position);
  
  // Avoid division by zero
  if (r < 1e-10) {
    return {
      position,
      field: { x: 0, y: 0, z: 0 },
      magnitude: 0,
    };
  }

  // Calculate field magnitude
  const fieldMagnitude = (CONSTANTS.k * Math.abs(charge.charge)) / (r * r);

  // Calculate direction
  const direction = normalize(subtractVectors(position, charge.position));
  
  // If charge is negative, reverse direction
  const sign = charge.charge > 0 ? 1 : -1;
  
  const field = scaleVector(direction, fieldMagnitude * sign);

  return {
    position,
    field,
    magnitude: fieldMagnitude,
  };
}

/**
 * Calculate the total electric field at a point due to multiple charges
 */
export function calculateTotalElectricField(charges: Charge[], position: Vector3D): ElectricField {
  let totalField: Vector3D = { x: 0, y: 0, z: 0 };

  for (const charge of charges) {
    const fieldAtPoint = calculateElectricField(charge, position);
    totalField = addVectors(totalField, fieldAtPoint.field);
  }

  return {
    position,
    field: totalField,
    magnitude: magnitude(totalField),
  };
}

/**
 * Calculate the total force on a charge due to other charges
 */
export function calculateTotalForce(targetCharge: Charge, otherCharges: Charge[]): ForceVector {
  let totalForce: Vector3D = { x: 0, y: 0, z: 0 };

  for (const charge of otherCharges) {
    if (charge.id !== targetCharge.id) {
      const force = calculateCoulombForce(targetCharge, charge);
      totalForce = addVectors(totalForce, force.force);
    }
  }

  return {
    position: targetCharge.position,
    force: totalForce,
    magnitude: magnitude(totalForce),
  };
}

/**
 * Calculate electric potential at a point due to a charge
 * V = k * q / r
 */
export function calculateElectricPotential(charge: Charge, position: Vector3D): number {
  const r = distance(charge.position, position);
  
  // Avoid division by zero
  if (r < 1e-10) {
    return 0;
  }

  return (CONSTANTS.k * charge.charge) / r;
}

/**
 * Calculate total electric potential at a point due to multiple charges
 */
export function calculateTotalPotential(charges: Charge[], position: Vector3D): number {
  let totalPotential = 0;

  for (const charge of charges) {
    totalPotential += calculateElectricPotential(charge, position);
  }

  return totalPotential;
}

/**
 * Calculate electric potential energy between two charges
 * U = k * q1 * q2 / r
 */
export function calculatePotentialEnergy(charge1: Charge, charge2: Charge): number {
  const r = distance(charge1.position, charge2.position);
  
  // Avoid division by zero
  if (r < 1e-10) {
    return 0;
  }

  return (CONSTANTS.k * charge1.charge * charge2.charge) / r;
}

/**
 * Calculate capacitance of a parallel plate capacitor
 * C = ε₀ * εᵣ * A / d
 */
export function calculateCapacitance(area: number, distance: number, dielectric: number = 1): number {
  if (distance === 0) return 0;
  return (CONSTANTS.epsilon0 * dielectric * area) / distance;
}

/**
 * Calculate charge on a capacitor
 * Q = C * V
 */
export function calculateCapacitorCharge(capacitance: number, voltage: number): number {
  return capacitance * voltage;
}

/**
 * Calculate energy stored in a capacitor
 * U = 0.5 * C * V²
 */
export function calculateCapacitorEnergy(capacitance: number, voltage: number): number {
  return 0.5 * capacitance * voltage * voltage;
}

/**
 * Calculate electric field between parallel plates
 * E = V / d
 */
export function calculatePlateFieldStrength(voltage: number, distance: number): number {
  if (distance === 0) return 0;
  return voltage / distance;
}
