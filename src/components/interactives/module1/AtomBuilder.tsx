import { useState } from 'react';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import { Atom } from '@/types';
import { CONSTANTS } from '@/utils/units';

export default function AtomBuilder() {
  const [atom, setAtom] = useState<Atom>({
    protons: 1,
    neutrons: 0,
    electrons: 1,
    particles: [],
  });

  const addParticle = (type: 'proton' | 'neutron' | 'electron') => {
    setAtom(prev => {
      const newAtom = { ...prev };
      if (type === 'proton') newAtom.protons++;
      else if (type === 'neutron') newAtom.neutrons++;
      else newAtom.electrons++;
      return newAtom;
    });
  };

  const removeParticle = (type: 'proton' | 'neutron' | 'electron') => {
    setAtom(prev => {
      const newAtom = { ...prev };
      if (type === 'proton' && newAtom.protons > 0) newAtom.protons--;
      else if (type === 'neutron' && newAtom.neutrons > 0) newAtom.neutrons--;
      else if (type === 'electron' && newAtom.electrons > 0) newAtom.electrons--;
      return newAtom;
    });
  };

  const reset = () => {
    setAtom({
      protons: 1,
      neutrons: 0,
      electrons: 1,
      particles: [],
    });
  };

  const netCharge = (atom.protons - atom.electrons) * CONSTANTS.e;
  const isNeutral = atom.protons === atom.electrons;
  const atomicNumber = atom.protons;
  const massNumber = atom.protons + atom.neutrons;

  return (
    <div className="p-6 h-full">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Atom Builder
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Build atoms and explore how protons, neutrons, and electrons determine properties
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Visualization */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Atom Visualization
            </h3>
            <div className="relative aspect-square bg-gray-50 dark:bg-slate-900 rounded-lg overflow-hidden">
              {/* Nucleus */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  {/* Protons */}
                  {Array.from({ length: atom.protons }).map((_, i) => {
                    const angle = (i / atom.protons) * 2 * Math.PI;
                    const radius = 20 + Math.floor(i / 6) * 15;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    return (
                      <div
                        key={`proton-${i}`}
                        className="absolute w-8 h-8 bg-red-500 rounded-full border-2 border-red-700 flex items-center justify-center text-white text-xs font-bold"
                        style={{
                          left: `${x}px`,
                          top: `${y}px`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        +
                      </div>
                    );
                  })}
                  
                  {/* Neutrons */}
                  {Array.from({ length: atom.neutrons }).map((_, i) => {
                    const angle = (i / atom.neutrons) * 2 * Math.PI + Math.PI / 4;
                    const radius = 20 + Math.floor(i / 6) * 15;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    return (
                      <div
                        key={`neutron-${i}`}
                        className="absolute w-8 h-8 bg-gray-500 rounded-full border-2 border-gray-700 flex items-center justify-center text-white text-xs font-bold"
                        style={{
                          left: `${x}px`,
                          top: `${y}px`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        0
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Electron Shells */}
              {atom.electrons > 0 && (
                <>
                  {[2, 8, 8].map((shellCapacity, shellIndex) => {
                    const electronsInShell = Math.min(
                      shellCapacity,
                      Math.max(0, atom.electrons - [0, 2, 10][shellIndex])
                    );
                    const radius = 80 + shellIndex * 50;
                    
                    return electronsInShell > 0 ? (
                      <div key={`shell-${shellIndex}`}>
                        {/* Shell orbit */}
                        <div
                          className="absolute top-1/2 left-1/2 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-full"
                          style={{
                            width: `${radius * 2}px`,
                            height: `${radius * 2}px`,
                            transform: 'translate(-50%, -50%)',
                          }}
                        />
                        
                        {/* Electrons */}
                        {Array.from({ length: electronsInShell }).map((_, i) => {
                          const angle = (i / electronsInShell) * 2 * Math.PI;
                          const x = Math.cos(angle) * radius;
                          const y = Math.sin(angle) * radius;
                          return (
                            <div
                              key={`electron-${shellIndex}-${i}`}
                              className="absolute w-6 h-6 bg-blue-500 rounded-full border-2 border-blue-700 flex items-center justify-center text-white text-xs font-bold top-1/2 left-1/2"
                              style={{
                                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                              }}
                            >
                              -
                            </div>
                          );
                        })}
                      </div>
                    ) : null;
                  })}
                </>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Particle Controls
              </h3>
              
              {/* Protons */}
              <div className="mb-4">
                <label className="label">Protons (Red, +)</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => removeParticle('proton')}
                    className="btn-secondary w-10 h-10 p-0 flex items-center justify-center"
                    disabled={atom.protons === 0}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white w-16 text-center">
                    {atom.protons}
                  </span>
                  <button
                    onClick={() => addParticle('proton')}
                    className="btn-secondary w-10 h-10 p-0 flex items-center justify-center"
                    disabled={atom.protons >= 20}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Neutrons */}
              <div className="mb-4">
                <label className="label">Neutrons (Gray, 0)</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => removeParticle('neutron')}
                    className="btn-secondary w-10 h-10 p-0 flex items-center justify-center"
                    disabled={atom.neutrons === 0}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white w-16 text-center">
                    {atom.neutrons}
                  </span>
                  <button
                    onClick={() => addParticle('neutron')}
                    className="btn-secondary w-10 h-10 p-0 flex items-center justify-center"
                    disabled={atom.neutrons >= 30}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Electrons */}
              <div className="mb-4">
                <label className="label">Electrons (Blue, -)</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => removeParticle('electron')}
                    className="btn-secondary w-10 h-10 p-0 flex items-center justify-center"
                    disabled={atom.electrons === 0}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white w-16 text-center">
                    {atom.electrons}
                  </span>
                  <button
                    onClick={() => addParticle('electron')}
                    className="btn-secondary w-10 h-10 p-0 flex items-center justify-center"
                    disabled={atom.electrons >= 18}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button onClick={reset} className="btn-secondary w-full flex items-center justify-center space-x-2">
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>

            {/* Atom Properties */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Atom Properties
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-700">
                  <span className="text-gray-700 dark:text-gray-300">Atomic Number (Z):</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{atomicNumber}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-700">
                  <span className="text-gray-700 dark:text-gray-300">Mass Number (A):</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{massNumber}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-slate-700">
                  <span className="text-gray-700 dark:text-gray-300">Net Charge:</span>
                  <span className={`font-semibold ${isNeutral ? 'text-green-600' : 'text-red-600'}`}>
                    {isNeutral ? 'Neutral' : netCharge > 0 ? `+${(netCharge / CONSTANTS.e).toFixed(0)}e` : `${(netCharge / CONSTANTS.e).toFixed(0)}e`}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700 dark:text-gray-300">Type:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {isNeutral ? 'Neutral Atom' : netCharge > 0 ? 'Cation (+)' : 'Anion (-)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
