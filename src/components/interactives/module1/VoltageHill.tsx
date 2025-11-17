import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Charge, Vector3D } from '@/types';
import { calculateTotalPotential } from '@/physics/module1Electric';
import { formatWithUnit } from '@/utils/formatting';

export default function VoltageHill() {
  const [charges, setCharges] = useState<Charge[]>([
    { id: '1', position: { x: 0, y: 0, z: 0 }, charge: 5e-6, fixed: true },
  ]);
  
  const [testChargeValue, setTestChargeValue] = useState(1); // in nC
  const [selectedPoint, setSelectedPoint] = useState<Vector3D | null>(null);

  const updateChargeValue = (charge: number) => {
    setCharges([{ id: '1', position: { x: 0, y: 0, z: 0 }, charge: charge * 1e-6, fixed: true }]);
  };

  const reset = () => {
    setCharges([{ id: '1', position: { x: 0, y: 0, z: 0 }, charge: 5e-6, fixed: true }]);
    setTestChargeValue(1);
    setSelectedPoint(null);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Convert to meters (scale: 100px = 1m)
    const position = { x: x / 100, y: y / 100, z: 0 };
    setSelectedPoint(position);
  };

  const potentialAtSelected = selectedPoint 
    ? calculateTotalPotential(charges, selectedPoint) 
    : null;

  const testCharge = testChargeValue * 1e-9; // Convert nC to C
  const potentialEnergy = potentialAtSelected && selectedPoint
    ? potentialAtSelected * testCharge
    : null;

  const sourceCharge = charges[0];
  const distance = selectedPoint 
    ? Math.sqrt(selectedPoint.x ** 2 + selectedPoint.y ** 2)
    : null;

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Voltage and Electric Potential
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize electric potential as a "voltage hill" around charges
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Visualization */}
          <div className="md:col-span-2">
            <div className="card">
              <div
                className="relative w-full aspect-video bg-gray-900 dark:bg-slate-950 rounded-lg overflow-hidden cursor-crosshair"
                onClick={handleCanvasClick}
              >
                {/* Potential gradient visualization */}
                <svg className="absolute inset-0 w-full h-full">
                  <defs>
                    <radialGradient id="potentialGradient" cx="50%" cy="50%">
                      {sourceCharge.charge > 0 ? (
                        <>
                          <stop offset="0%" stopColor="#ff0000" stopOpacity="0.8" />
                          <stop offset="20%" stopColor="#ff6600" stopOpacity="0.6" />
                          <stop offset="40%" stopColor="#ffaa00" stopOpacity="0.4" />
                          <stop offset="60%" stopColor="#ffdd00" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#ffff00" stopOpacity="0.05" />
                        </>
                      ) : (
                        <>
                          <stop offset="0%" stopColor="#0000ff" stopOpacity="0.8" />
                          <stop offset="20%" stopColor="#0066ff" stopOpacity="0.6" />
                          <stop offset="40%" stopColor="#00aaff" stopOpacity="0.4" />
                          <stop offset="60%" stopColor="#00ddff" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#00ffff" stopOpacity="0.05" />
                        </>
                      )}
                    </radialGradient>
                  </defs>
                  <circle cx="50%" cy="50%" r="45%" fill="url(#potentialGradient)" />
                </svg>

                {/* Equipotential contours */}
                {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => (
                  <div
                    key={`contour-${idx}`}
                    className="absolute top-1/2 left-1/2 rounded-full border-2 border-white opacity-30"
                    style={{
                      width: `${ratio * 90}%`,
                      height: `${ratio * 90}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                ))}

                {/* Center axes */}
                <div className="absolute top-1/2 w-full border-t border-white opacity-20" />
                <div className="absolute left-1/2 h-full border-l border-white opacity-20" />

                {/* Source charge */}
                <div
                  className={`absolute w-12 h-12 rounded-full z-10 ${
                    sourceCharge.charge > 0 
                      ? 'bg-red-500 border-red-700' 
                      : 'bg-blue-500 border-blue-700'
                  } border-4 flex items-center justify-center text-white font-bold text-xl`}
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {sourceCharge.charge > 0 ? '+' : '-'}
                </div>

                {/* Selected point */}
                {selectedPoint && (
                  <>
                    <div
                      className="absolute w-4 h-4 bg-green-500 rounded-full z-20 ring-4 ring-green-300"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translate(calc(-50% + ${selectedPoint.x * 100}px), calc(-50% + ${selectedPoint.y * 100}px))`,
                      }}
                    />
                    {/* Line from center to point */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-15">
                      <line
                        x1="50%"
                        y1="50%"
                        x2={`calc(50% + ${selectedPoint.x * 100}px)`}
                        y2={`calc(50% + ${selectedPoint.y * 100}px)`}
                        stroke="#22c55e"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        opacity="0.7"
                      />
                    </svg>
                  </>
                )}
              </div>

              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  💡 <strong>Visualization:</strong> The color intensity represents potential magnitude. 
                  Click anywhere to place a test charge and see the potential and energy at that point.
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Source Charge
              </h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Value (μC):</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {(sourceCharge.charge * 1e6).toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  step="0.5"
                  value={sourceCharge.charge * 1e6}
                  onChange={(e) => updateChargeValue(parseFloat(e.target.value))}
                  className="slider w-full"
                />
              </div>

              <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                <h4 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Test Charge
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Value (nC):</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {testChargeValue.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.1"
                    value={testChargeValue}
                    onChange={(e) => setTestChargeValue(parseFloat(e.target.value))}
                    className="slider w-full"
                  />
                </div>
              </div>

              <button onClick={reset} className="btn-secondary w-full flex items-center justify-center space-x-2 mt-4">
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>

            {/* Measurements */}
            {selectedPoint && potentialAtSelected !== null && (
              <div className="card">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Measurements
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-700">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Distance:</span>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">
                      {distance ? formatWithUnit(distance, 'm', 2) : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-700">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Electric Potential:</span>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">
                      {formatWithUnit(potentialAtSelected, 'V', 2)}
                    </span>
                  </div>
                  
                  {potentialEnergy !== null && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Potential Energy:</span>
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">
                        {formatWithUnit(potentialEnergy, 'J', 2)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    <strong>Formula:</strong> V = kq/r
                    <br />
                    <strong>Energy:</strong> U = qV
                  </p>
                </div>
              </div>
            )}

            {!selectedPoint && (
              <div className="card">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Instructions
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click anywhere in the visualization to place a test charge and measure the electric potential and energy at that point.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Educational content */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            Understanding Electric Potential
          </h3>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p>
              <strong>Electric Potential (V):</strong> The electric potential at a point is the work done per unit charge 
              in bringing a test charge from infinity to that point. It's measured in Volts (V).
            </p>
            <p>
              <strong>Potential Energy (U):</strong> The energy stored in a test charge at a given potential. 
              U = qV, where q is the test charge and V is the potential.
            </p>
            <p>
              <strong>The "Hill" Analogy:</strong> Think of electric potential like a hill. Positive charges naturally 
              "roll down" from high to low potential (like a ball rolling downhill), while negative charges do the opposite.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
