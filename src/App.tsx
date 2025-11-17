import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import Header from '@/components/layout/Header';
import ProgressBar from '@/components/layout/ProgressBar';
import NavigationFooter from '@/components/layout/NavigationFooter';
import ModuleNavigation from '@/components/navigation/ModuleNavigation';
import SectionNavigation from '@/components/navigation/SectionNavigation';
import ContentArea from '@/components/content/ContentArea';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';

function App() {
  const { theme } = useAppStore();
  const { isMobile } = useResponsiveLayout();

  useEffect(() => {
    // Apply theme on mount
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-slate-900">
      <Header />
      <ProgressBar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isMobile ? (
          // Mobile layout - stacked
          <div className="space-y-6">
            <ModuleNavigation />
            <SectionNavigation />
            <ContentArea />
          </div>
        ) : (
          // Desktop layout - grid
          <div className="grid grid-cols-12 gap-6 h-full">
            {/* Left sidebar - Module navigation */}
            <div className="col-span-3 space-y-6">
              <ModuleNavigation />
            </div>

            {/* Middle - Section navigation */}
            <div className="col-span-2">
              <SectionNavigation />
            </div>

            {/* Right - Content area */}
            <div className="col-span-7 h-full">
              <ContentArea />
            </div>
          </div>
        )}
      </main>

      <NavigationFooter />
    </div>
  );
}

export default App;
