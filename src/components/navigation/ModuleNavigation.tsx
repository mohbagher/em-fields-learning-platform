import { useAppStore } from '@/store/appStore';
import { CheckCircle2, Circle } from 'lucide-react';
import { clsx } from 'clsx';

export default function ModuleNavigation() {
  const { modules, currentModule, setCurrentModule } = useAppStore();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Modules</h2>
      <div className="space-y-3">
        {modules.map((module) => (
          <button
            key={module.id}
            onClick={() => setCurrentModule(module.id)}
            className={clsx(
              'w-full text-left p-4 rounded-lg border-2 transition-all duration-200',
              currentModule === module.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-slate-700/50'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-2xl">{module.icon === 'Zap' ? '⚡' : '📚'}</span>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {module.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {module.description}
                </p>
                <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-500">
                  <span>
                    {module.sections.filter(s => s.completed).length} / {module.sections.length} completed
                  </span>
                </div>
              </div>
              <div className="ml-3">
                {module.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
