import { BookOpen, Lightbulb, Target } from 'lucide-react';

export default function ConceptIntro() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
            <span className="text-4xl">⚡</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Electric Charges and Fields
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Discover the fundamental forces that shape our world
          </p>
        </div>

        {/* Introduction */}
        <div className="card">
          <div className="flex items-start space-x-4">
            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                What are Electric Charges?
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Electric charge is a fundamental property of matter. Everything around us—from the atoms
                in our bodies to the stars in the sky—is made up of charged particles. There are two
                types of electric charge: positive and negative.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Like charges repel each other, while opposite charges attract. This simple principle
                governs countless phenomena, from the structure of atoms to the behavior of lightning.
              </p>
            </div>
          </div>
        </div>

        {/* Key Concepts */}
        <div className="card">
          <div className="flex items-start space-x-4">
            <Lightbulb className="w-8 h-8 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Key Concepts
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                  <div>
                    <strong className="text-gray-900 dark:text-white">Coulomb's Law:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      The force between two charges is proportional to the product of their charges
                      and inversely proportional to the square of the distance between them.
                    </span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                  <div>
                    <strong className="text-gray-900 dark:text-white">Electric Fields:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      A region of space around a charged particle where other charged particles
                      experience a force.
                    </span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
                  <div>
                    <strong className="text-gray-900 dark:text-white">Electric Potential:</strong>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">
                      The electric potential energy per unit charge at a point in space.
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="card">
          <div className="flex items-start space-x-4">
            <Target className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                What You'll Learn
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    🔬 Build Atoms
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Create atoms by adding protons, neutrons, and electrons to understand charge balance
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    🎯 Explore Forces
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Visualize how charges interact and see Coulomb's law in action
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    🌊 Map Fields
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    See electric field lines and understand field strength and direction
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    ⚡ Design Capacitors
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Build and test capacitors to learn about energy storage
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ready to Start */}
        <div className="text-center py-8">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            Ready to explore the fascinating world of electromagnetism?
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Click "Next" below to begin your journey!
          </p>
        </div>
      </div>
    </div>
  );
}
