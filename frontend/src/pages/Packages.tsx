import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { fetchPackages, updatePackage } from '../api/packages';
import { isActiveStatus } from '../utils/status';
import { StatusIcon } from '../components/ui/StatusIcon';
import { AddPackageModal } from '../components/packages/AddPackageModal';
import { usePageTitle } from '../hooks/usePageTitle';
import toast from 'react-hot-toast';

const PAGE_SIZE = 40;

const TABLE_HEAD = 'text-xs font-semibold text-white/40 uppercase tracking-wider px-4 py-3 text-left';
const TABLE_CELL = 'px-4 py-3 text-sm';

export const Packages: React.FC = () => {
  usePageTitle('Packages');
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());
  const qc = useQueryClient();

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ['packages', PAGE_SIZE, page],
    queryFn: () => fetchPackages(PAGE_SIZE, page - 1),
    refetchInterval: 30_000,
  });

  const handleAddSuccess = () => {
    qc.invalidateQueries({ queryKey: ['packages'] });
    qc.invalidateQueries({ queryKey: ['stats'] });
  };

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
    <div className="p-5 flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Packages</h1>
          <p className="text-white/40 text-sm mt-0.5">Manage AUR packages</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6B43A4] hover:bg-purple-600 text-white text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Package
        </button>
      </div>

      {/* Table */}
      <div className="bg-secondary rounded-card border border-white/5 flex-1 flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full">
            <thead>
              <tr className="bg-heading-row border-b border-white/5">
                <th className={TABLE_HEAD}>ID</th>
                <th className={TABLE_HEAD}>Package Name</th>
                <th className={TABLE_HEAD}>Version</th>
                <th className={TABLE_HEAD}>Upstream</th>
                <th className={TABLE_HEAD}>Up-To-Date</th>
                <th className={TABLE_HEAD}>Status</th>
                <th className={TABLE_HEAD}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/5 animate-pulse">
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className={TABLE_CELL}>
                          <div className="h-3 bg-white/5 rounded w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                : packages.map((pkg) => (
                    <tr
                      key={pkg.id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className={`${TABLE_CELL} text-white/30`}>
                        <Link to={`/package/${pkg.id}`} className="hover:text-white/60 transition-colors">
                          #{pkg.id}
                        </Link>
                      </td>
                      <td className={`${TABLE_CELL} font-medium`}>
                        <Link to={`/package/${pkg.id}`} className="text-white hover:text-primary transition-colors">
                          {pkg.name}
                        </Link>
                      </td>
                      <td className={`${TABLE_CELL} font-mono text-xs text-white/60`}>
                        {pkg.latest_version || '–'}
                      </td>
                      <td className={`${TABLE_CELL} font-mono text-xs text-white/60`}>
                        {pkg.upstream_version || '–'}
                      </td>
                      <td className={TABLE_CELL}>
                        {pkg.outofdate === 1 ? (
                          <span className="inline-flex items-center gap-1 text-[#6B43A4] text-xs font-medium">
                            <AlertTriangle size={12} />
                            Out of date
                          </span>
                        ) : (
                          <span className="text-[#6bab58] text-xs font-medium">Current</span>
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
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#9D8D00]/15 hover:bg-[#9D8D00]/25 text-[#d4bc00] text-xs font-medium transition-colors border border-[#9D8D00]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <RefreshCw size={12} className={pendingIds.has(pkg.id) ? 'animate-spin' : ''} />
                            Update
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {!isLoading && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
            <span className="text-white/30 text-xs">
              {packages.length} packages on page {page}
            </span>
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
                disabled={packages.length < PAGE_SIZE}
                className="p-1.5 rounded-lg text-white/40 hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <AddPackageModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
};
