import { useState, useEffect } from 'react';
import { debounce } from '@/utils/performance';

interface ScreenSize {
  width: number;
  height: number;
}

interface BreakpointState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
}

/**
 * Hook for tracking screen size
 */
export function useScreenSize(): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    const handleResize = debounce(() => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 150);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
}

/**
 * Hook for responsive breakpoints
 */
export function useBreakpoints(): BreakpointState {
  const { width } = useScreenSize();

  return {
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024 && width < 1280,
    isLargeDesktop: width >= 1280,
  };
}

/**
 * Hook for responsive layout with custom breakpoints
 */
export function useResponsiveLayout(breakpoints?: {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}) {
  const { width } = useScreenSize();
  const bp = {
    mobile: breakpoints?.mobile || 640,
    tablet: breakpoints?.tablet || 1024,
    desktop: breakpoints?.desktop || 1280,
  };

  const layout = {
    isMobile: width < bp.mobile,
    isTablet: width >= bp.mobile && width < bp.tablet,
    isDesktop: width >= bp.tablet && width < bp.desktop,
    isLargeDesktop: width >= bp.desktop,
    width,
  };

  // Calculate number of columns based on screen size
  const columns = layout.isMobile ? 1 : layout.isTablet ? 2 : layout.isDesktop ? 3 : 4;

  // Calculate appropriate padding
  const padding = layout.isMobile ? 16 : layout.isTablet ? 24 : 32;

  return {
    ...layout,
    columns,
    padding,
  };
}

/**
 * Hook for checking if element is visible in viewport
 */
export function useInView(ref: React.RefObject<HTMLElement>): boolean {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const element = ref.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [ref]);

  return isInView;
}
