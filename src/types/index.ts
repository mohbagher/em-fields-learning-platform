// Core geometric types
export interface Vector2D {
  x: number;
  y: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

// Physics types
export interface Charge {
  id: string;
  position: Vector3D;
  charge: number; // in Coulombs
  fixed?: boolean;
}

export interface ElectricField {
  position: Vector3D;
  field: Vector3D; // field vector at this position
  magnitude: number;
}

export interface ForceVector {
  position: Vector3D;
  force: Vector3D;
  magnitude: number;
}

export interface Capacitor {
  id: string;
  area: number; // in m²
  distance: number; // plate separation in m
  dielectric: number; // dielectric constant
  voltage: number; // in Volts
  capacitance: number; // in Farads
  charge: number; // in Coulombs
}

// Particle types
export interface Particle {
  id: string;
  type: 'proton' | 'neutron' | 'electron';
  position: Vector3D;
  velocity?: Vector3D;
  charge: number;
  mass: number;
}

export interface Atom {
  protons: number;
  neutrons: number;
  electrons: number;
  particles: Particle[];
}

// Module and section types
export interface Module {
  id: number;
  title: string;
  description: string;
  sections: Section[];
  completed: boolean;
  icon: string;
}

export interface Section {
  id: number;
  moduleId: number;
  title: string;
  type: 'intro' | 'interactive' | 'quiz' | 'summary';
  component: string;
  completed: boolean;
}

// App state types
export interface AppState {
  currentModule: number;
  currentSection: number;
  modules: Module[];
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  
  // Actions
  setCurrentModule: (moduleId: number) => void;
  setCurrentSection: (sectionId: number) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSound: () => void;
  markSectionComplete: (moduleId: number, sectionId: number) => void;
  nextSection: () => void;
  previousSection: () => void;
}

// Visualization types
export interface GraphData {
  x: number[];
  y: number[];
  label: string;
  color?: string;
}

export interface VisualizationConfig {
  showGrid: boolean;
  showAxes: boolean;
  showVectors: boolean;
  showFieldLines: boolean;
  vectorScale: number;
  fieldLineCount: number;
}

// Animation types
export interface AnimationState {
  isPlaying: boolean;
  time: number;
  speed: number;
}

// Unit types
export type ElectricFieldUnit = 'N/C' | 'V/m';
export type ChargeUnit = 'C' | 'μC' | 'nC';
export type VoltageUnit = 'V' | 'kV' | 'mV';
export type DistanceUnit = 'm' | 'cm' | 'mm';
export type CapacitanceUnit = 'F' | 'μF' | 'nF' | 'pF';
