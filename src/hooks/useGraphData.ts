import { useMemo } from 'react';
import { GraphData } from '@/types';

interface GraphDataOptions {
  xMin: number;
  xMax: number;
  points: number;
  func: (x: number) => number;
  label?: string;
  color?: string;
}

/**
 * Hook for generating graph data from mathematical functions
 */
export function useGraphData(options: GraphDataOptions): GraphData {
  return useMemo(() => {
    const { xMin, xMax, points, func, label = 'Data', color } = options;
    const x: number[] = [];
    const y: number[] = [];
    const step = (xMax - xMin) / (points - 1);

    for (let i = 0; i < points; i++) {
      const xVal = xMin + i * step;
      x.push(xVal);
      y.push(func(xVal));
    }

    return { x, y, label, color };
  }, [options]);
}

/**
 * Hook for generating multiple graph datasets
 */
export function useMultipleGraphData(datasets: GraphDataOptions[]): GraphData[] {
  return useMemo(() => {
    return datasets.map(options => {
      const { xMin, xMax, points, func, label = 'Data', color } = options;
      const x: number[] = [];
      const y: number[] = [];
      const step = (xMax - xMin) / (points - 1);

      for (let i = 0; i < points; i++) {
        const xVal = xMin + i * step;
        x.push(xVal);
        y.push(func(xVal));
      }

      return { x, y, label, color };
    });
  }, [datasets]);
}

/**
 * Hook for generating parametric curve data
 */
export function useParametricGraphData(
  tMin: number,
  tMax: number,
  points: number,
  funcX: (t: number) => number,
  funcY: (t: number) => number,
  label?: string,
  color?: string
): GraphData {
  return useMemo(() => {
    const x: number[] = [];
    const y: number[] = [];
    const step = (tMax - tMin) / (points - 1);

    for (let i = 0; i < points; i++) {
      const t = tMin + i * step;
      x.push(funcX(t));
      y.push(funcY(t));
    }

    return { x, y, label: label || 'Parametric', color };
  }, [tMin, tMax, points, funcX, funcY, label, color]);
}
