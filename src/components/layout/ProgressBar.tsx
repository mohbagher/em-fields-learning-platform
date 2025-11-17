import { useAppStore } from '@/store/appStore';
import { useMemo } from 'react';

export default function ProgressBar() {
  const { modules, currentModule } = useAppStore();

  const progress = useMemo(() => {
    const totalSections = modules.reduce((sum, module) => sum + module.sections.length, 0);
    const completedSections = modules.reduce(
      (sum, module) => sum + module.sections.filter(s => s.completed).length,
      0
    );
    return totalSections > 0 ? (completedSections / totalSections) * 100 : 0;
  }, [modules]);

  const currentModuleData = modules.find(m => m.id === currentModule);
  const moduleProgress = useMemo(() => {
    if (!currentModuleData) return 0;
    const completed = currentModuleData.sections.filter(s => s.completed).length;
    return currentModuleData.sections.length > 0
      ? (completed / currentModuleData.sections.length) * 100
      : 0;
  }, [currentModuleData]);

  return (
    <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-2">
          {/* Overall Progress */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Overall Progress
              </span>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                {progress.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Current Module Progress */}
          {currentModuleData && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {currentModuleData.title}
                </span>
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                  {moduleProgress.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${moduleProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
