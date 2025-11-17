import { useAppStore } from '@/store/appStore';
import ConceptIntro from './ConceptIntro';
import AtomBuilder from '../interactives/module1/AtomBuilder';
import ForcePlayground from '../interactives/module1/ForcePlayground';
import FieldVisualizer from '../interactives/module1/FieldVisualizer';
import VoltageHill from '../interactives/module1/VoltageHill';
import CapacitorBuilder from '../interactives/module1/CapacitorBuilder';

export default function ContentArea() {
  const { modules, currentModule, currentSection } = useAppStore();

  const currentModuleData = modules.find(m => m.id === currentModule);
  const currentSectionData = currentModuleData?.sections.find(s => s.id === currentSection);

  if (!currentSectionData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400">No section selected</p>
      </div>
    );
  }

  const renderComponent = () => {
    switch (currentSectionData.component) {
      case 'ConceptIntro':
        return <ConceptIntro />;
      case 'AtomBuilder':
        return <AtomBuilder />;
      case 'ForcePlayground':
        return <ForcePlayground />;
      case 'FieldVisualizer':
        return <FieldVisualizer />;
      case 'VoltageHill':
        return <VoltageHill />;
      case 'CapacitorBuilder':
        return <CapacitorBuilder />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Component "{currentSectionData.component}" not found
            </p>
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
      <div className="h-full overflow-y-auto">
        {renderComponent()}
      </div>
    </div>
  );
}
