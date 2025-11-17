import { useEffect, useRef, useCallback } from 'react';
import { requestAnimFrame, cancelAnimFrame } from '@/utils/performance';

interface AnimationLoopOptions {
  onUpdate: (deltaTime: number, elapsedTime: number) => void;
  isPlaying?: boolean;
  fps?: number;
}

/**
 * Hook for creating smooth animation loops
 */
export function useAnimationLoop({
  onUpdate,
  isPlaying = true,
  fps = 60,
}: AnimationLoopOptions) {
  const requestRef = useRef<number | undefined>();
  const previousTimeRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const fpsInterval = 1000 / fps;
  const lastFrameTimeRef = useRef<number>(0);

  const animate = useCallback(
    (time: number) => {
      if (previousTimeRef.current === undefined) {
        previousTimeRef.current = time;
        startTimeRef.current = time;
        lastFrameTimeRef.current = time;
      }

      const elapsed = time - lastFrameTimeRef.current;

      if (elapsed > fpsInterval) {
        lastFrameTimeRef.current = time - (elapsed % fpsInterval);
        
        const deltaTime = (time - previousTimeRef.current) / 1000; // Convert to seconds
        const elapsedTime = (time - startTimeRef.current!) / 1000;

        onUpdate(deltaTime, elapsedTime);
        previousTimeRef.current = time;
      }

      requestRef.current = requestAnimFrame(animate);
    },
    [onUpdate, fpsInterval]
  );

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimFrame(animate);
    }

    return () => {
      if (requestRef.current) {
        cancelAnimFrame(requestRef.current);
      }
    };
  }, [isPlaying, animate]);

  const reset = useCallback(() => {
    previousTimeRef.current = undefined;
    startTimeRef.current = undefined;
    lastFrameTimeRef.current = 0;
  }, []);

  return { reset };
}
