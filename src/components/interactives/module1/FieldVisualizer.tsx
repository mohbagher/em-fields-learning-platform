import { useState } from 'react';
import { Plus, Trash2, RotateCcw } from 'lucide-react';
import { Charge, Vector3D } from '@/types';
import { calculateTotalElectricField } from '@/physics/module1Electric';
import { formatWithUnit } from '@/utils/formatting';

export default function FieldVisualizer() {
  const [charges, setCharges] = useState<Charge[]>([
    { id: '1', position: { x: -80, y: 0, z: 0 }, charge: 2e-6, fixed: false },
    { id: '2', position: { x: 80, y: 0, z: 0 }, charge: -2e-6, fixed: false },
  ]);
  
  const [showFieldLines, setShowFieldLines] = useState(true);
  const [showVectors, setShowVectors] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState<Vector3D | null>(null);

  const addCharge = () => {
    const newCharge: Charge = {
      id: Date.now().toString(),
      position: { x: Math.random() * 200 - 100, y: Math.random() * 100 - 50, z: 0 },
      charge: (Math.random() > 0.5 ? 1 : -1) * 1e-6,
      fixed: false,
    };
    setCharges([...charges, newCharge]);
  };

  const removeCharge = (id: string) => {
    setCharges(charges.filter(c => c.id !== id));
  };

  const updateChargeValue = (id: string, charge: number) => {
    setCharges(prev => prev.map(c => c.id === id ? { ...c, charge: charge * 1e-6 } : c));
  };

  const reset = () => {
    setCharges([
      { id: '1', position: { x: -80, y: 0, z: 0 }, charge: 2e-6, fixed: false },
      { id: '2', position: { x: 80, y: 0, z: 0 }, charge: -2e-6, fixed: false },
    ]);
    setSelectedPoint(null);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setSelectedPoint({ x, y, z: 0 });
  };

  // Generate field vectors at grid points
  const generateFieldVectors = () => {
    const vectors: { position: Vector3D; field: Vector3D; magnitude: number }[] = [];
    const gridSize = 8;
    const width = 400;
    const height = 300;
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = (i / (gridSize - 1)) * width - width / 2;
        const y = (j / (gridSize - 1)) * height - height / 2;
        const position = { x, y, z: 0 };
        
        // Check if point is too close to any charge
        const tooClose = charges.some(charge => {
          const dx = position.x - charge.position.x;
          const dy = position.y - charge.position.y;
          return Math.sqrt(dx * dx + dy * dy) < 20;
        });
        
        if (!tooClose) {
          const field = calculateTotalElectricField(charges, position);
          vectors.push({ position, field: field.field, magnitude: field.magnitude });
        }
      }
    }
    
    return vectors;
  };

  const fieldVectors = showVectors ? generateFieldVectors() : [];
  const selectedFieldData = selectedPoint 
    ? calculateTotalElectricField(charges, selectedPoint) 
    : null;

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Electric Field Visualizer
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize electric fields and see how they change with charge configuration
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Visualization */}
          <div className="md:col-span-2">
            <div className="card">
              <div
                className="relative w-full aspect-video bg-gray-50 dark:bg-slate-900 rounded-lg overflow-hidden cursor-pointer"
                onClick={handleCanvasClick}
              >
                {/* Grid background */}
                <div className="absolute inset-0 opacity-30">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div
                      key={`grid-h-${i}`}
                      className="absolute w-full border-t border-gray-300 dark:border-slate-700"
                      style={{ top: `${(i / 15) * 100}%` }}
                    />
                  ))}
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={`grid-v-${i}`}
                      className="absolute h-full border-l border-gray-300 dark:border-slate-700"
                      style={{ left: `${(i / 20) * 100}%` }}
                    />
                  ))}
                </div>

                {/* Center axes */}
                <div className="absolute top-1/2 w-full border-t-2 border-gray-400 dark:border-slate-600" />
                <div className="absolute left-1/2 h-full border-l-2 border-gray-400 dark:border-slate-600" />

                {/* Field vectors */}
                {fieldVectors.map((vector, idx) => {
                  const maxMag = Math.max(...fieldVectors.map(v => v.magnitude), 1);
                  const scale = 30 / maxMag;
                  const length = Math.min(vector.magnitude * scale, 30);
                  const angle = Math.atan2(vector.field.y, vector.field.x) * (180 / Math.PI);
                  
                  return (
                    <div
                      key={`vector-${idx}`}
                      className="absolute"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translate(calc(-50% + ${vector.position.x}px), calc(-50% + ${vector.position.y}px))`,
                      }}
                    >
                      <div
                        className="absolute"
                        style={{
                          width: `${length}px`,
                          height: '2px',
                          backgroundColor: '#3b82f6',
                          transform: `rotate(${angle}deg)`,
                          transformOrigin: '0 50%',
                        }}
                      >
                        <div
                          className="absolute right-0 top-1/2"
                          style={{
                            width: 0,
                            height: 0,
                            borderLeft: '6px solid #3b82f6',
                            borderTop: '3px solid transparent',
                            borderBottom: '3px solid transparent',
                            transform: 'translateY(-50%)',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Charges */}
                {charges.map((charge) => {
                  const isPositive = charge.charge > 0;
                  
                  return (
                    <div
                      key={charge.id}
                      className={`absolute w-10 h-10 rounded-full ${
                        isPositive 
                          ? 'bg-red-500 border-red-700' 
                          : 'bg-blue-500 border-blue-700'
                      } border-4 flex items-center justify-center text-white font-bold text-lg z-10`}
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translate(calc(-50% + ${charge.position.x}px), calc(-50% + ${charge.position.y}px))`,
                      }}
                    >
                      {isPositive ? '+' : '-'}
                    </div>
                  );
                })}

                {/* Selected point */}
                {selectedPoint && (
                  <div
                    className="absolute w-4 h-4 bg-green-500 rounded-full z-20 ring-4 ring-green-300"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${selectedPoint.x}px), calc(-50% + ${selectedPoint.y}px))`,
                    }}
                  />
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setShowVectors(!showVectors)}
                  className={`px-3 py-1 rounded text-sm ${
                    showVectors ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {showVectors ? 'Hide' : 'Show'} Vectors
                </button>
                <button
                  onClick={() => setShowFieldLines(!showFieldLines)}
                  className={`px-3 py-1 rounded text-sm ${
                    showFieldLines ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                  }`}
                  disabled
                >
                  Field Lines (Coming Soon)
                </button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Charges
              </h3>
              
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {charges.map((charge, index) => (
                  <div key={charge.id} className="p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        Charge {index + 1}
                      </span>
                      <button
                        onClick={() => removeCharge(charge.id)}
                        className="text-red-600 hover:text-red-700"
                        disabled={charges.length <= 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Value (μC):</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {(charge.charge * 1e6).toFixed(1)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-5"
                        max="5"
                        step="0.1"
                        value={charge.charge * 1e6}
                        onChange={(e) => updateChargeValue(charge.id, parseFloat(e.target.value))}
                        className="slider w-full"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <button 
                  onClick={addCharge} 
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                  disabled={charges.length >= 8}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Charge</span>
                </button>
                
                <button 
                  onClick={reset} 
                  className="btn-secondary w-full flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Field info at selected point */}
            {selectedFieldData && (
              <div className="card">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Field at Point
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-700">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Magnitude:</span>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">
                      {formatWithUnit(selectedFieldData.magnitude, 'N/C', 2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-700">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Direction:</span>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">
                      {(Math.atan2(selectedFieldData.field.y, selectedFieldData.field.x) * (180 / Math.PI)).toFixed(1)}°
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Components:</span>
                    <span className="font-mono text-xs text-gray-900 dark:text-white">
                      ({selectedFieldData.field.x.toExponential(1)}, {selectedFieldData.field.y.toExponential(1)})
                    </span>
                  </div>
                </div>
              </div>
            )}

            {!selectedPoint && (
              <div className="card">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click anywhere in the field to measure the electric field at that point.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
