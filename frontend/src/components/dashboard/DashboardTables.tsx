import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchPackages, updatePackage } from '../../api/packages';
import { isActiveStatus } from '../../utils/status';
import { fetchBuilds } from '../../api/builds';
import { StatusIcon } from '../ui/StatusIcon';
import { formatRelativeTime } from '../../utils/formatters';
import { AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import type { SimplePackage, Build } from '../../types';
import toast from 'react-hot-toast';

type Tab = 'packages' | 'builds';

const TABLE_HEAD = 'text-xs font-semibold text-white/40 uppercase tracking-wider px-4 py-3 text-left';
const TABLE_CELL = 'px-4 py-3 text-sm text-white/70';

const PackagesTable: React.FC<{ data: SimplePackage[] }> = ({ data }) => {
  const qc = useQueryClient();
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());
  const updateMutation = useMutation({
    mutationFn: (id: number) => {
      setPendingIds((s) => new Set(s).add(id));
      return updatePackage(id, false);
    },
    onSuccess: (_data, id) => {
      setPendingIds((s) => { const n = new Set(s); n.delete(id); return n; });
      toast.success('Update triggered');
      qc.invalidateQueries({ queryKey: ['packages'] });
    },
    onError: (_err, id) => {
      setPendingIds((s) => { const n = new Set(s); n.delete(id); return n; });
      toast.error('Failed to trigger update');
    },
  });

  return (
    <table className="w-full">
      <thead>
        <tr className="bg-heading-row">
          <th className={TABLE_HEAD}>ID</th>
          <th className={TABLE_HEAD}>Package</th>
          <th className={TABLE_HEAD}>Version</th>
          <th className={TABLE_HEAD}>Up-To-Date</th>
          <th className={TABLE_HEAD}>Status</th>
          <th className={TABLE_HEAD}></th>
        </tr>
      </thead>
      <tbody>
        {data.map((pkg) => (
          <tr key={pkg.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
            <td className={`${TABLE_CELL} text-white/30`}>
              <Link to={`/package/${pkg.id}`} className="hover:text-white/60 transition-colors">
                #{pkg.id}
              </Link>
            </td>
            <td className={`${TABLE_CELL} font-medium text-white`}>
              <Link to={`/package/${pkg.id}`} className="hover:text-primary transition-colors">
                {pkg.name}
              </Link>
            </td>
            <td className={`${TABLE_CELL} font-mono text-xs`}>{pkg.upstream_version || pkg.latest_version || '-'}</td>
            <td className={TABLE_CELL}>
              {pkg.outofdate === 1 ? (
                <span className="inline-flex items-center gap-1 text-[#6B43A4] text-xs">
                  <AlertTriangle size={12} />
                  Outdated
                </span>
              ) : (
                <span className="text-green text-xs">Current</span>
              )}
            </td>
            <td className={TABLE_CELL}>
              <StatusIcon status={pkg.status} size={16} />
            </td>
            <td className={TABLE_CELL}>
              {pkg.outofdate === 1 && !isActiveStatus(pkg.status) ? (
                <button
                  onClick={() => updateMutation.mutate(pkg.id)}
                  disabled={pendingIds.has(pkg.id)}
                  className="inline-flex items-center gap-1 text-[#d4bc00] hover:text-[#f0d800] text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={13} className={pendingIds.has(pkg.id) ? 'animate-spin' : ''} />
                  Update
                </button>
              ) : null}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const BuildsTable: React.FC<{ data: Build[] }> = ({ data }) => (
  <table className="w-full">
    <thead>
      <tr className="bg-heading-row">
        <th className={TABLE_HEAD}>Build ID</th>
        <th className={TABLE_HEAD}>Date</th>
        <th className={TABLE_HEAD}>Package</th>
        <th className={TABLE_HEAD}>Version</th>
        <th className={TABLE_HEAD}>Platform</th>
        <th className={TABLE_HEAD}>Status</th>
      </tr>
    </thead>
    <tbody>
      {data.map((build) => (
        <tr key={build.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
          <td className={`${TABLE_CELL} text-white/30`}>#{build.id}</td>
          <td className={TABLE_CELL}>
            {build.start_time ? formatRelativeTime(build.start_time) : '-'}
          </td>
          <td className={`${TABLE_CELL} font-medium text-white`}>{build.pkg_name}</td>
          <td className={`${TABLE_CELL} font-mono text-xs`}>{build.version}</td>
          <td className={`${TABLE_CELL} text-xs`}>{build.platform}</td>
          <td className={TABLE_CELL}>
            <Link to={`/build/${build.id}`}>
              <StatusIcon status={build.status} size={16} />
            </Link>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export const DashboardTables: React.FC = () => {
  const [tab, setTab] = useState<Tab>('packages');

  const { data: packages = [], isLoading: pkgLoading } = useQuery({
    queryKey: ['packages', 20, 0],
    queryFn: () => fetchPackages(20, 0),
    refetchInterval: 30_000,
    enabled: tab === 'packages',
  });

  const { data: builds = [], isLoading: buildLoading } = useQuery({
    queryKey: ['builds', undefined, 20, 0],
    queryFn: () => fetchBuilds({ limit: 20, page: 0 }),
    refetchInterval: 10_000,
    enabled: tab === 'builds',
  });

  const isLoading = tab === 'packages' ? pkgLoading : buildLoading;

  return (
    <div className="bg-secondary rounded-card border border-white/5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex rounded-lg bg-bg border border-white/5 p-0.5">
          <button
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              tab === 'packages'
                ? 'bg-white/10 text-white'
                : 'text-white/40 hover:text-white/70'
            }`}
            onClick={() => setTab('packages')}
          >
            Recent Packages
          </button>
          <button
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              tab === 'builds'
                ? 'bg-white/10 text-white'
                : 'text-white/40 hover:text-white/70'
            }`}
            onClick={() => setTab('builds')}
          >
            Recent Builds
          </button>
        </div>

        <Link
          to={tab === 'packages' ? '/packages' : '/builds'}
          className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors border border-white/10 hover:border-white/20 rounded-lg px-3 py-1.5"
        >
          View All
          <ArrowRight size={12} />
        </Link>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="space-y-px">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 px-4 py-3 animate-pulse">
                <div className="h-3 bg-white/5 rounded w-8" />
                <div className="h-3 bg-white/5 rounded w-32" />
                <div className="h-3 bg-white/5 rounded w-20" />
                <div className="h-3 bg-white/5 rounded w-16" />
              </div>
            ))}
          </div>
        ) : tab === 'packages' ? (
          packages.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-white/30 text-sm">
              No packages yet
            </div>
          ) : (
            <PackagesTable data={packages} />
          )
        ) : builds.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-white/30 text-sm">
            No builds yet
          </div>
        ) : (
          <BuildsTable data={builds} />
        )}
      </div>
    </div>
  );
};
