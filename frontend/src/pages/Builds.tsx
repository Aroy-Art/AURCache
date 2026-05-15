import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchBuilds } from '../api/builds';
import { StatusIcon, StatusBadge } from '../components/ui/StatusIcon';
import { formatRelativeTime, buildDuration } from '../utils/formatters';
import { usePageTitle } from '../hooks/usePageTitle';

const PAGE_SIZE = 40;
const TABLE_HEAD = 'text-xs font-semibold text-white/40 uppercase tracking-wider px-4 py-3 text-left';
const TABLE_CELL = 'px-4 py-3 text-sm';

export const Builds: React.FC = () => {
  usePageTitle('Builds');
  const [page, setPage] = useState(1);

  const { data: builds = [], isLoading } = useQuery({
    queryKey: ['builds', undefined, PAGE_SIZE, page],
    queryFn: () => fetchBuilds({ limit: PAGE_SIZE, page: page - 1 }),
    refetchInterval: 10_000,
  });

  return (
    <div className="p-5 flex flex-col gap-4 h-full">
      <div>
        <h1 className="text-xl font-semibold text-white">Builds</h1>
        <p className="text-white/40 text-sm mt-0.5">Build history across all packages</p>
      </div>

      <div className="bg-secondary rounded-card border border-white/5 flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full">
            <thead>
              <tr className="bg-heading-row border-b border-white/5">
                <th className={TABLE_HEAD}>Build ID</th>
                <th className={TABLE_HEAD}>Date</th>
                <th className={TABLE_HEAD}>Package</th>
                <th className={TABLE_HEAD}>Version</th>
                <th className={TABLE_HEAD}>Platform</th>
                <th className={TABLE_HEAD}>Duration</th>
                <th className={TABLE_HEAD}>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/5 animate-pulse">
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className={TABLE_CELL}>
                          <div className="h-3 bg-white/5 rounded" />
                        </td>
                      ))}
                    </tr>
                  ))
                : builds.map((build) => (
                    <tr
                      key={build.id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className={`${TABLE_CELL} text-white/50`}>
                        <Link to={`/build/${build.id}`} className="hover:text-white/80 transition-colors">
                          #{build.id}
                        </Link>
                      </td>
                      <td className={`${TABLE_CELL} text-white/80`}>
                        {build.start_time ? formatRelativeTime(build.start_time) : '–'}
                      </td>
                      <td className={`${TABLE_CELL} font-medium`}>
                        <Link
                          to={`/package/${build.pkg_id}`}
                          className="text-white hover:text-primary transition-colors"
                        >
                          {build.pkg_name}
                        </Link>
                      </td>
                      <td className={`${TABLE_CELL} font-mono text-xs text-white/80`}>
                        {build.version}
                      </td>
                      <td className={`${TABLE_CELL} text-xs text-white/80`}>
                        {build.platform}
                      </td>
                      <td className={`${TABLE_CELL} text-xs text-white/70`}>
                        {buildDuration(build.start_time, build.end_time)}
                      </td>
                      <td className={TABLE_CELL}>
                        <Link to={`/build/${build.id}`}>
                          <StatusBadge status={build.status} />
                        </Link>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {!isLoading && builds.length === 0 && (
          <div className="flex items-center justify-center h-32 text-white/30 text-sm">
            No builds yet
          </div>
        )}

        <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
          <span className="text-white/30 text-xs">{builds.length} builds on page {page}</span>
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
              disabled={builds.length < PAGE_SIZE}
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
