import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  fullPage?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 32,
  className = '',
  fullPage = false,
}) => {
  const spinner = (
    <Loader2
      size={size}
      className={`animate-spin text-primary ${className}`}
    />
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        {spinner}
      </div>
    );
  }

  return spinner;
};
