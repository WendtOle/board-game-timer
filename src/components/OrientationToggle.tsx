'use client';

import { Orientation } from '@/hooks/useOrientation';

interface OrientationToggleProps {
  orientation: Orientation;
  onToggle: () => void;
}

export const OrientationToggle: React.FC<OrientationToggleProps> = ({
  orientation,
  onToggle,
}) => {
  return (
    <button
      onClick={onToggle}
      className={`fixed z-50 bg-white shadow-lg rounded-lg p-2 hover:bg-gray-50 transition-all duration-300 ${
        orientation === 'landscape' ? 'top-4 left-4' : 'top-4 right-4'
      }`}
      aria-label={`Switch to ${orientation === 'portrait' ? 'landscape' : 'portrait'} mode`}
    >
      {orientation === 'portrait' ? (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M8 12h8M12 8v8" />
        </svg>
      ) : (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      )}
    </button>
  );
};