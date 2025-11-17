import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Charge, Vector3D } from '@/types';
import { calculateCoulombForce } from '@/physics/module1Electric';
import { formatWithUnit } from '@/utils/formatting';

export default function ForcePlayground() {
  const [charges, setCharges] = useState<Charge[]>([
    { id: '1', position: { x: -100, y: 0, z: 0 }, charge: 1e-6, fixed: false },
    { id: '2', position: { x: 100, y: 0, z: 0 }, charge: 1e-6, fixed: false },
  ]);
  
  const [selectedChargeId, setSelectedChargeId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const updateChargePosition = (id: string, position: Vector3D) => {
    setCharges(prev => prev.map(c => c.id === id ? { ...c, position } : c));
  };

  const updateChargeValue = (id: string, charge: number) => {
    setCharges(prev => prev.map(c => c.id === id ? { ...c, charge: charge * 1e-6 } : c));
  };

  const handleCanvasClick = () => {
    if (dragging) return;
    
    setSelectedChargeId(null);
  };

  const handleChargeMouseDown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedChargeId(id);
    setDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging || !selectedChargeId) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    updateChargePosition(selectedChargeId, { x, y, z: 0 });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const reset = () => {
    setCharges([
      { id: '1', position: { x: -100, y: 0, z: 0 }, charge: 1e-6, fixed: false },
      { id: '2', position: { x: 100, y: 0, z: 0 }, charge: 1e-6, fixed: false },
    ]);
    setSelectedChargeId(null);
  };

  const selectedCharge = charges.find(c => c.id === selectedChargeId);
  const otherCharge = selectedChargeId ? charges.find(c => c.id !== selectedChargeId) : null;
  
  const force = selectedCharge && otherCharge 
    ? calculateCoulombForce(selectedCharge, otherCharge) 
    : null;

  return (
    <div className="p-6 h-full">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Coulomb's Force Playground
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Drag charges and see how electric forces change with distance and charge
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Visualization */}
          <div className="md:col-span-2">
            <div className="card">
              <div
                className="relative w-full aspect-video bg-gray-50 dark:bg-slate-900 rounded-lg overflow-hidden cursor-crosshair"
                onClick={handleCanvasClick}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Grid */}
                <div className="absolute inset-0">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={`grid-h-${i}`}
                      className="absolute w-full border-t border-gray-200 dark:border-slate-800"
                      style={{ top: `${(i / 20) * 100}%` }}
                    />
                  ))}
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={`grid-v-${i}`}
                      className="absolute h-full border-l border-gray-200 dark:border-slate-800"
                      style={{ left: `${(i / 20) * 100}%` }}
                    />
                  ))}
                </div>

                {/* Center axes */}
                <div className="absolute top-1/2 w-full border-t-2 border-gray-400 dark:border-slate-600" />
                <div className="absolute left-1/2 h-full border-l-2 border-gray-400 dark:border-slate-600" />

                {/* Charges */}
                {charges.map((charge) => {
                  const isSelected = charge.id === selectedChargeId;
                  const isPositive = charge.charge > 0;
                  
                  return (
                    <div
                      key={charge.id}
                      className={`absolute w-12 h-12 rounded-full cursor-move transition-all ${
                        isPositive 
                          ? 'bg-red-500 border-red-700' 
                          : 'bg-blue-500 border-blue-700'
                      } border-4 flex items-center justify-center text-white font-bold text-xl ${
                        isSelected ? 'ring-4 ring-yellow-400 scale-110' : ''
                      }`}
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translate(calc(-50% + ${charge.position.x}px), calc(-50% + ${charge.position.y}px))`,
                      }}
                      onMouseDown={(e) => handleChargeMouseDown(charge.id, e)}
                    >
                      {isPositive ? '+' : '-'}
                    </div>
                  );
                })}

                {/* Force vectors */}
                {selectedCharge && otherCharge && force && (
                  <div
                    className="absolute"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${selectedCharge.position.x}px), calc(-50% + ${selectedCharge.position.y}px))`,
                    }}
                  >
                    <svg className="absolute" width="400" height="400" style={{ left: -200, top: -200 }}>
                      <defs>
                        <marker
                          id="arrowhead"
                          markerWidth="10"
                          markerHeight="10"
                          refX="9"
                          refY="3"
                          orient="auto"
                        >
                          <polygon points="0 0, 10 3, 0 6" fill="#f59e0b" />
                        </marker>
                      </defs>
                      <line
                        x1="200"
                        y1="200"
                        x2={200 + force.force.x * 0.5}
                        y2={200 + force.force.y * 0.5}
                        stroke="#f59e0b"
                        strokeWidth="3"
                        markerEnd="url(#arrowhead)"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Charge Controls
              </h3>
              
              {charges.map((charge, index) => (
                <div key={charge.id} className="mb-4 pb-4 border-b border-gray-200 dark:border-slate-700 last:border-0">
                  <label className="label">Charge {index + 1}</label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Value (μC):</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {(charge.charge * 1e6).toFixed(1)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      step="0.1"
                      value={charge.charge * 1e6}
                      onChange={(e) => updateChargeValue(charge.id, parseFloat(e.target.value))}
                      className="slider w-full"
                    />
                  </div>
                </div>
              ))}

              <button onClick={reset} className="btn-secondary w-full flex items-center justify-center space-x-2 mt-4">
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>

            {/* Force Info */}
            {selectedCharge && otherCharge && force && (
              <div className="card">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Force Analysis
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-700">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Force Magnitude:</span>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">
                      {formatWithUnit(force.magnitude, 'N', 3)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-700">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Direction:</span>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">
                      {selectedCharge.charge * otherCharge.charge > 0 ? 'Repulsive' : 'Attractive'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Distance:</span>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">
                      {formatWithUnit(
                        Math.sqrt(
                          Math.pow(selectedCharge.position.x - otherCharge.position.x, 2) +
                          Math.pow(selectedCharge.position.y - otherCharge.position.y, 2)
                        ) / 100,
                        'm',
                        2
                      )}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    💡 <strong>Tip:</strong> Drag charges to see how force changes with distance. 
                    Notice how force follows the inverse square law!
                  </p>
                </div>
              </div>
            )}

            {!selectedChargeId && (
              <div className="card">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click and drag a charge to see the force between them.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
