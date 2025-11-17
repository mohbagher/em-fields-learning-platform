import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

export default function NavigationFooter() {
  const { modules, currentModule, currentSection, previousSection, nextSection, markSectionComplete } = useAppStore();

  const currentModuleData = modules.find(m => m.id === currentModule);
  const currentSectionData = currentModuleData?.sections.find(s => s.id === currentSection);
  
  const canGoPrevious = () => {
    if (!currentModuleData) return false;
    const sectionIndex = currentModuleData.sections.findIndex(s => s.id === currentSection);
    if (sectionIndex > 0) return true;
    return currentModule > 1;
  };

  const canGoNext = () => {
    if (!currentModuleData) return false;
    const sectionIndex = currentModuleData.sections.findIndex(s => s.id === currentSection);
    if (sectionIndex < currentModuleData.sections.length - 1) return true;
    return currentModule < modules.length;
  };

  const handleNext = () => {
    if (currentSectionData && !currentSectionData.completed) {
      markSectionComplete(currentModule, currentSection);
    }
    nextSection();
  };

  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 shadow-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <button
            onClick={previousSection}
            disabled={!canGoPrevious()}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Previous</span>
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Section {currentSection} of {currentModuleData?.sections.length || 0}
            </p>
            {currentSectionData && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {currentSectionData.title}
              </p>
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={!canGoNext()}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="font-medium">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
