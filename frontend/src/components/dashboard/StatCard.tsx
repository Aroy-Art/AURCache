import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatTrend } from '../../utils/formatters';

interface StatCardProps {
  title: string;
  value: string;
  trend?: number; // raw trend float e.g. 1.1 = +10%
  icon?: React.ReactNode;
  circularProgress?: number; // 0..1
  circularLabel?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  icon,
  circularProgress,
  circularLabel,
}) => {
  const trendStr = trend !== undefined ? formatTrend(trend) : null;
  const trendPct = trend !== undefined ? (trend - 1) * 100 : 0;
  const trendColor =
    trendPct > 0.5 ? '#A9FF0F' : trendPct < -0.5 ? '#FF4752' : '#868686';

  const TrendIcon =
    trendPct > 0.5 ? TrendingUp : trendPct < -0.5 ? TrendingDown : Minus;

  // SVG circular progress
  const radius = 22;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (circularProgress ?? 0) * circ;

  return (
    <div className="bg-secondary rounded-card p-4 flex items-center justify-between gap-3 border border-white/5 min-w-0">
      <div className="min-w-0">
        <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1 truncate">
          {title}
        </p>
        <p className="text-white text-2xl font-semibold leading-tight">
          {value}
        </p>
        {trendStr !== null && (
          <div
            className="flex items-center gap-1 mt-1.5 text-xs font-medium"
            style={{ color: trendColor }}
          >
            <TrendIcon size={12} />
            <span>{trendStr}</span>
          </div>
        )}
      </div>

      {/* Icon or circular progress */}
      <div className="flex-shrink-0">
        {circularProgress !== undefined ? (
          <div className="relative w-14 h-14">
            <svg viewBox="0 0 56 56" className="-rotate-90 w-14 h-14">
              <circle
                cx="28"
                cy="28"
                r={radius}
                fill="none"
                stroke="#292e35"
                strokeWidth="6"
              />
              <circle
                cx="28"
                cy="28"
                r={radius}
                fill="none"
                stroke="#A9FF0F"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                className="transition-all duration-700"
              />
            </svg>
            {circularLabel && (
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/90">
                {circularLabel}
              </span>
            )}
          </div>
        ) : (
          icon && (
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/30">
              {icon}
            </div>
          )
        )}
      </div>
    </div>
  );
};
