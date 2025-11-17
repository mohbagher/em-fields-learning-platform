import { create } from 'zustand';
import { AppState, Module } from '@/types';

const initialModules: Module[] = [
  {
    id: 1,
    title: 'Electric Charges and Fields',
    description: 'Explore the fundamental concepts of electric charges, Coulomb\'s law, and electric fields',
    icon: 'Zap',
    completed: false,
    sections: [
      {
        id: 1,
        moduleId: 1,
        title: 'Introduction to Electric Charges',
        type: 'intro',
        component: 'ConceptIntro',
        completed: false,
      },
      {
        id: 2,
        moduleId: 1,
        title: 'Building Atoms',
        type: 'interactive',
        component: 'AtomBuilder',
        completed: false,
      },
      {
        id: 3,
        moduleId: 1,
        title: 'Coulomb\'s Force Playground',
        type: 'interactive',
        component: 'ForcePlayground',
        completed: false,
      },
      {
        id: 4,
        moduleId: 1,
        title: 'Electric Field Visualizer',
        type: 'interactive',
        component: 'FieldVisualizer',
        completed: false,
      },
      {
        id: 5,
        moduleId: 1,
        title: 'Voltage and Potential',
        type: 'interactive',
        component: 'VoltageHill',
        completed: false,
      },
      {
        id: 6,
        moduleId: 1,
        title: 'Capacitor Builder',
        type: 'interactive',
        component: 'CapacitorBuilder',
        completed: false,
      },
    ],
  },
];

export const useAppStore = create<AppState>((set, get) => ({
  currentModule: 1,
  currentSection: 1,
  modules: initialModules,
  theme: 'light',
  soundEnabled: true,

  setCurrentModule: (moduleId: number) => {
    const modules = get().modules;
    const module = modules.find(m => m.id === moduleId);
    if (module && module.sections.length > 0) {
      set({ currentModule: moduleId, currentSection: module.sections[0].id });
    }
  },

  setCurrentSection: (sectionId: number) => {
    set({ currentSection: sectionId });
  },

  setTheme: (theme: 'light' | 'dark') => {
    set({ theme });
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  toggleSound: () => {
    set(state => ({ soundEnabled: !state.soundEnabled }));
  },

  markSectionComplete: (moduleId: number, sectionId: number) => {
    set(state => ({
      modules: state.modules.map(module => {
        if (module.id === moduleId) {
          const updatedSections = module.sections.map(section =>
            section.id === sectionId ? { ...section, completed: true } : section
          );
          const allCompleted = updatedSections.every(s => s.completed);
          return {
            ...module,
            sections: updatedSections,
            completed: allCompleted,
          };
        }
        return module;
      }),
    }));
  },

  nextSection: () => {
    const { currentModule, currentSection, modules } = get();
    const module = modules.find(m => m.id === currentModule);
    if (!module) return;

    const currentSectionIndex = module.sections.findIndex(s => s.id === currentSection);
    if (currentSectionIndex < module.sections.length - 1) {
      // Move to next section in current module
      set({ currentSection: module.sections[currentSectionIndex + 1].id });
    } else {
      // Move to first section of next module
      const nextModule = modules.find(m => m.id === currentModule + 1);
      if (nextModule && nextModule.sections.length > 0) {
        set({
          currentModule: nextModule.id,
          currentSection: nextModule.sections[0].id,
        });
      }
    }
  },

  previousSection: () => {
    const { currentModule, currentSection, modules } = get();
    const module = modules.find(m => m.id === currentModule);
    if (!module) return;

    const currentSectionIndex = module.sections.findIndex(s => s.id === currentSection);
    if (currentSectionIndex > 0) {
      // Move to previous section in current module
      set({ currentSection: module.sections[currentSectionIndex - 1].id });
    } else {
      // Move to last section of previous module
      const prevModule = modules.find(m => m.id === currentModule - 1);
      if (prevModule && prevModule.sections.length > 0) {
        set({
          currentModule: prevModule.id,
          currentSection: prevModule.sections[prevModule.sections.length - 1].id,
        });
      }
    }
  },
}));
