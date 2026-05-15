import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchActivity } from '../../api/activity';
import { formatRelativeTime } from '../../utils/formatters';
import { User } from 'lucide-react';

interface ActivityLogProps {
  limit?: number;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ limit = 10 }) => {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['activity', limit],
    queryFn: () => fetchActivity(limit),
    refetchInterval: 60_000,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-white/5 flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-white/5 rounded w-3/4" />
              <div className="h-2.5 bg-white/5 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <p className="text-white/30 text-sm text-center py-4">No recent activity</p>
    );
  }

  return (
    <div className="space-y-1">
      {activities.map((activity, idx) => (
        <div
          key={idx}
          className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0"
        >
          <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <User size={12} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/80 text-sm leading-snug">
              {activity.user && (
                <span className="font-semibold text-white">{activity.user} </span>
              )}
              <span className="text-white/60">{activity.text}</span>
            </p>
            <p className="text-white/30 text-xs mt-0.5">
              {formatRelativeTime(activity.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
