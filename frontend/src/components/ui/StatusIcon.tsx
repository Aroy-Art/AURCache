import React from 'react';
import {
  Loader2,
  CheckCircle2,
  XCircle,
  PauseCircle,
  MinusCircle,
} from 'lucide-react';
import { getStatusStyle } from '../../utils/status';
import { BUILD_STATUS } from '../../types';

interface StatusIconProps {
  status: number;
  size?: number;
  className?: string;
}

export const StatusIcon: React.FC<StatusIconProps> = ({
  status,
  size = 18,
  className = '',
}) => {
  const style = getStatusStyle(status);

  const iconProps = {
    size,
    className,
    style: { color: style.color },
  };

  switch (status) {
    case BUILD_STATUS.BUILDING:
      return <Loader2 {...iconProps} className={`${className} animate-spin`} />;
    case BUILD_STATUS.SUCCESS:
      return <CheckCircle2 {...iconProps} />;
    case BUILD_STATUS.FAILED:
      return <XCircle {...iconProps} />;
    case BUILD_STATUS.QUEUED:
      return <PauseCircle {...iconProps} />;
    case BUILD_STATUS.CANCELLED:
      return <MinusCircle {...iconProps} />;
    default:
      return <XCircle {...iconProps} />;
  }
};

interface StatusBadgeProps {
  status: number;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const style = getStatusStyle(status);
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{
        color: style.color,
        backgroundColor: `${style.color}22`,
        border: `1px solid ${style.color}44`,
      }}
    >
      <StatusIcon status={status} size={12} />
      {style.label}
    </span>
  );
};
