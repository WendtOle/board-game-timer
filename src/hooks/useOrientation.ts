import { useState, useCallback } from 'react';

export type Orientation = 'portrait' | 'landscape';

export const useOrientation = () => {
  const [orientation, setOrientation] = useState<Orientation>('portrait');

  const toggleOrientation = useCallback(() => {
    setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait');
  }, []);

  return {
    orientation,
    toggleOrientation,
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
  };
};