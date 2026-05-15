import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { fetchActivity } from '../api/activity';
import { formatDateTime, formatRelativeTime } from '../utils/formatters';
import { usePageTitle } from '../hooks/usePageTitle';

const TABLE_HEAD = 'text-xs font-semibold text-white/40 uppercase tracking-wider px-4 py-3 text-left';
const TABLE_CELL = 'px-4 py-3 text-sm';
const PAGE_SIZE = 50;

export const Activity: React.FC = () => {
  usePageTitle('Activity');
  const [page, setPage] = useState(1);

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['activity', PAGE_SIZE * page],
    queryFn: () => fetchActivity(PAGE_SIZE * page),
    refetchInterval: 60_000,
  });

  const pageItems = activities.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-5 flex flex-col gap-4 h-full">
      <div>
        <h1 className="text-xl font-semibold text-white">Activity Log</h1>
        <p className="text-white/40 text-sm mt-0.5">All system activity and events</p>
      </div>

      <div className="bg-secondary rounded-card border border-white/5 flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full">
            <thead>
              <tr className="bg-heading-row border-b border-white/5">
                <th className={TABLE_HEAD}>Timestamp</th>
                <th className={TABLE_HEAD}>User</th>
                <th className={TABLE_HEAD}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/5 animate-pulse">
                      <td className={TABLE_CELL}><div className="h-3 bg-white/5 rounded w-32" /></td>
                      <td className={TABLE_CELL}><div className="h-3 bg-white/5 rounded w-20" /></td>
                      <td className={TABLE_CELL}><div className="h-3 bg-white/5 rounded w-48" /></td>
                    </tr>
                  ))
                : pageItems.map((item, i) => (
                    <tr
                      key={i}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className={`${TABLE_CELL} text-white/40`}>
                        <div>{formatDateTime(item.timestamp)}</div>
                        <div className="text-xs text-white/25">{formatRelativeTime(item.timestamp)}</div>
                      </td>
                      <td className={TABLE_CELL}>
                        {item.user ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                              <User size={11} className="text-primary" />
                            </div>
                            <span className="text-white/70 font-medium">{item.user}</span>
                          </div>
                        ) : (
                          <span className="text-white/25">–</span>
                        )}
                      </td>
                      <td className={`${TABLE_CELL} text-white/60`}>{item.text}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {!isLoading && pageItems.length === 0 && (
          <div className="flex items-center justify-center h-32 text-white/30 text-sm">
            No activity yet
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
          <span className="text-white/30 text-xs">{activities.length} total events</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg text-white/40 hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-white/50 text-sm px-2">{page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={pageItems.length < PAGE_SIZE}
              className="p-1.5 rounded-lg text-white/40 hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
