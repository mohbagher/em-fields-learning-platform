import { useState } from 'react';
import { RotateCcw, Info } from 'lucide-react';
import { Capacitor } from '@/types';
import { calculateCapacitance, calculateCapacitorCharge, calculateCapacitorEnergy, calculatePlateFieldStrength } from '@/physics/module1Electric';
import { formatWithUnit } from '@/utils/formatting';

export default function CapacitorBuilder() {
  const [capacitor, setCapacitor] = useState<Capacitor>({
    id: '1',
    area: 0.01, // 0.01 m² = 100 cm²
    distance: 0.001, // 1 mm
    dielectric: 1.0, // air
    voltage: 100, // 100 V
    capacitance: 0,
    charge: 0,
  });

  const updateArea = (area: number) => {
    const newCap = calculateCapacitance(area, capacitor.distance, capacitor.dielectric);
    const newCharge = calculateCapacitorCharge(newCap, capacitor.voltage);
    setCapacitor({ ...capacitor, area, capacitance: newCap, charge: newCharge });
  };

  const updateDistance = (distance: number) => {
    const newCap = calculateCapacitance(capacitor.area, distance, capacitor.dielectric);
    const newCharge = calculateCapacitorCharge(newCap, capacitor.voltage);
    setCapacitor({ ...capacitor, distance, capacitance: newCap, charge: newCharge });
  };

  const updateDielectric = (dielectric: number) => {
    const newCap = calculateCapacitance(capacitor.area, capacitor.distance, dielectric);
    const newCharge = calculateCapacitorCharge(newCap, capacitor.voltage);
    setCapacitor({ ...capacitor, dielectric, capacitance: newCap, charge: newCharge });
  };

  const updateVoltage = (voltage: number) => {
    const newCharge = calculateCapacitorCharge(capacitor.capacitance, voltage);
    setCapacitor({ ...capacitor, voltage, charge: newCharge });
  };

  const reset = () => {
    const cap = calculateCapacitance(0.01, 0.001, 1.0);
    const charge = calculateCapacitorCharge(cap, 100);
    setCapacitor({
      id: '1',
      area: 0.01,
      distance: 0.001,
      dielectric: 1.0,
      voltage: 100,
      capacitance: cap,
      charge,
    });
  };

  // Calculate derived values
  const energy = calculateCapacitorEnergy(capacitor.capacitance, capacitor.voltage);
  const fieldStrength = calculatePlateFieldStrength(capacitor.voltage, capacitor.distance);

  // Dielectric materials
  const dielectricMaterials = [
    { name: 'Vacuum/Air', value: 1.0 },
    { name: 'Paper', value: 3.7 },
    { name: 'Glass', value: 6.0 },
    { name: 'Mica', value: 5.4 },
    { name: 'Ceramic', value: 10.0 },
  ];

  // Calculate plate dimensions for visualization (scaled to fit in display)
  const maxDisplaySize = 200; // px
  const displayScale = Math.min(maxDisplaySize, Math.sqrt(capacitor.area * 10000)); // scale for display
  const plateWidth = displayScale;
  const plateSeparation = Math.max(10, Math.min(100, capacitor.distance * 50000)); // scale distance for display

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Capacitor Builder
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Design and analyze parallel-plate capacitors
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Visualization */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Capacitor Visualization
            </h3>
            
            <div className="relative w-full aspect-square bg-gray-50 dark:bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
              {/* Top plate (positive) */}
              <div className="relative">
                <div
                  className="bg-red-500 border-2 border-red-700 mx-auto"
                  style={{
                    width: `${plateWidth}px`,
                    height: '20px',
                    marginBottom: `${plateSeparation}px`,
                  }}
                >
                  {/* Positive charges */}
                  <div className="flex justify-around items-center h-full px-2">
                    {Array.from({ length: Math.min(8, Math.ceil(capacitor.charge * 1e12)) }).map((_, i) => (
                      <span key={`pos-${i}`} className="text-white text-xs font-bold">+</span>
                    ))}
                  </div>
                  {/* Label */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-900 dark:text-white">
                    + Plate
                  </div>
                </div>

                {/* Electric field lines */}
                <div className="absolute left-0 right-0 flex justify-around" style={{ top: '20px', height: `${plateSeparation}px` }}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={`field-${i}`} className="relative" style={{ width: '2px' }}>
                      <div className="absolute top-0 w-full bg-blue-400 opacity-50" style={{ height: `${plateSeparation}px` }} />
                      <div
                        className="absolute w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-blue-400 left-1/2 transform -translate-x-1/2 opacity-50"
                        style={{ bottom: 0 }}
                      />
                    </div>
                  ))}
                </div>

                {/* Bottom plate (negative) */}
                <div
                  className="bg-blue-500 border-2 border-blue-700 mx-auto"
                  style={{
                    width: `${plateWidth}px`,
                    height: '20px',
                  }}
                >
                  {/* Negative charges */}
                  <div className="flex justify-around items-center h-full px-2">
                    {Array.from({ length: Math.min(8, Math.ceil(capacitor.charge * 1e12)) }).map((_, i) => (
                      <span key={`neg-${i}`} className="text-white text-xs font-bold">-</span>
                    ))}
                  </div>
                  {/* Label */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-900 dark:text-white">
                    - Plate
                  </div>
                </div>

                {/* Dimension labels */}
                <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 text-xs text-gray-600 dark:text-gray-400">
                  d = {(capacitor.distance * 1000).toFixed(2)} mm
                </div>
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400">
                  A = {(capacitor.area * 10000).toFixed(0)} cm²
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-gray-700 dark:text-gray-300 flex items-start space-x-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  The blue arrows represent the uniform electric field between the plates. 
                  Field strength is determined by voltage and plate separation.
                </span>
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Capacitor Parameters
              </h3>
              
              {/* Plate Area */}
              <div className="mb-4">
                <label className="label">Plate Area (cm²)</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={capacitor.area * 10000}
                    onChange={(e) => updateArea(parseFloat(e.target.value) / 10000)}
                    className="slider flex-1"
                  />
                  <span className="text-lg font-semibold text-gray-900 dark:text-white w-20 text-right">
                    {(capacitor.area * 10000).toFixed(0)}
                  </span>
                </div>
              </div>

              {/* Plate Separation */}
              <div className="mb-4">
                <label className="label">Plate Separation (mm)</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={capacitor.distance * 1000}
                    onChange={(e) => updateDistance(parseFloat(e.target.value) / 1000)}
                    className="slider flex-1"
                  />
                  <span className="text-lg font-semibold text-gray-900 dark:text-white w-20 text-right">
                    {(capacitor.distance * 1000).toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Dielectric Material */}
              <div className="mb-4">
                <label className="label">Dielectric Material</label>
                <select
                  value={capacitor.dielectric}
                  onChange={(e) => updateDielectric(parseFloat(e.target.value))}
                  className="input-field"
                >
                  {dielectricMaterials.map((material) => (
                    <option key={material.name} value={material.value}>
                      {material.name} (εᵣ = {material.value})
                    </option>
                  ))}
                </select>
              </div>

              {/* Applied Voltage */}
              <div className="mb-4">
                <label className="label">Applied Voltage (V)</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={capacitor.voltage}
                    onChange={(e) => updateVoltage(parseFloat(e.target.value))}
                    className="slider flex-1"
                  />
                  <span className="text-lg font-semibold text-gray-900 dark:text-white w-20 text-right">
                    {capacitor.voltage.toFixed(0)}
                  </span>
                </div>
              </div>

              <button onClick={reset} className="btn-secondary w-full flex items-center justify-center space-x-2">
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>

            {/* Calculated Properties */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Calculated Properties
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-700">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Capacitance:</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
                    {formatWithUnit(capacitor.capacitance, 'F', 2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-700">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Stored Charge:</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
                    {formatWithUnit(capacitor.charge, 'C', 2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-700">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Stored Energy:</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
                    {formatWithUnit(energy, 'J', 2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Field Strength:</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
                    {formatWithUnit(fieldStrength, 'V/m', 2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Educational content */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            Capacitor Formulas
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
              <p className="font-semibold mb-2">Capacitance:</p>
              <p className="font-mono">C = ε₀ · εᵣ · A / d</p>
              <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                Where ε₀ = 8.85×10⁻¹² F/m (permittivity of free space)
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
              <p className="font-semibold mb-2">Stored Charge:</p>
              <p className="font-mono">Q = C · V</p>
              <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                Charge is proportional to voltage
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
              <p className="font-semibold mb-2">Stored Energy:</p>
              <p className="font-mono">U = ½ · C · V²</p>
              <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                Energy stored in the electric field
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
              <p className="font-semibold mb-2">Field Strength:</p>
              <p className="font-mono">E = V / d</p>
              <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                Uniform field between parallel plates
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
