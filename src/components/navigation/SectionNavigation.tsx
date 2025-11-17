import { useAppStore } from '@/store/appStore';
import { CheckCircle2, Circle, Play } from 'lucide-react';
import { clsx } from 'clsx';

export default function SectionNavigation() {
  const { modules, currentModule, currentSection, setCurrentSection } = useAppStore();

  const currentModuleData = modules.find(m => m.id === currentModule);

  if (!currentModuleData) {
    return null;
  }

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'intro':
        return '📖';
      case 'interactive':
        return '🎮';
      case 'quiz':
        return '📝';
      case 'summary':
        return '📊';
      default:
        return '📄';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Sections
      </h2>
      <div className="space-y-2">
        {currentModuleData.sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => setCurrentSection(section.id)}
            className={clsx(
              'w-full text-left p-3 rounded-lg border transition-all duration-200 flex items-center space-x-3',
              currentSection === section.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-slate-700/50'
            )}
          >
            <div className="flex-shrink-0">
              {section.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : currentSection === section.id ? (
                <Play className="w-5 h-5 text-blue-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{getSectionIcon(section.type)}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {index + 1}. {section.title}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
