import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  Trash2,
  Settings,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { fetchPackage } from '../api/packages';
import { fetchBuilds } from '../api/builds';
import { updatePackage, deletePackage } from '../api/packages';
import { StatusIcon } from '../components/ui/StatusIcon';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { formatRelativeTime, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';
import type { Build } from '../types';
import { usePageTitle } from '../hooks/usePageTitle';

const TABLE_HEAD = 'text-xs font-semibold text-white/40 uppercase tracking-wider px-4 py-3 text-left';
const TABLE_CELL = 'px-4 py-3 text-sm';

const PAGE_SIZE = 40;

export const PackageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const pkgId = parseInt(id!, 10);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmRebuild, setConfirmRebuild] = useState(false);
  const [buildsPage, setBuildsPage] = useState(1);

  const { data: pkg, isLoading: pkgLoading } = useQuery({
    queryKey: ['package', pkgId],
    queryFn: () => fetchPackage(pkgId),
    refetchInterval: 60_000,
  });
  usePageTitle(pkg?.name);

  const { data: builds = [], isLoading: buildsLoading } = useQuery({
    queryKey: ['builds', pkgId, PAGE_SIZE, buildsPage],
    queryFn: () => fetchBuilds({ pkgid: pkgId, limit: PAGE_SIZE, page: buildsPage - 1 }),
    refetchInterval: 10_000,
    enabled: !!pkgId,
  });

  const handleForceRebuild = async () => {
    try {
      await updatePackage(pkgId, true);
      qc.invalidateQueries({ queryKey: ['package', pkgId] });
      qc.invalidateQueries({ queryKey: ['builds', pkgId] });
      toast.success('Force rebuild triggered');
    } catch {
      toast.error('Failed to trigger rebuild');
    }
    setConfirmRebuild(false);
  };

  const handleDelete = async () => {
    try {
      await deletePackage(pkgId);
      toast.success('Package deleted');
      navigate('/packages');
    } catch {
      toast.error('Failed to delete package');
    }
    setConfirmDelete(false);
  };

  if (pkgLoading) return <LoadingSpinner fullPage />;
  if (!pkg) return null;

  const source = pkg.package_source;
  const isAur = source.package_type === 'Aur';
  const isAurNotFound = source.package_type === 'AurNotFound';
  const isGit = source.package_type === 'Git';
  const aurSource = isAur ? source : null;
  const gitSource = isGit ? source : null;

  const externalUrl = isAur
    ? (aurSource as any).aur_url
    : isGit
    ? (gitSource as any).git_url
    : null;

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-secondary border-b border-white/5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-semibold text-white">{pkg.name}</h1>
          {externalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-primary transition-colors"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setConfirmRebuild(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#9D8D00]/15 hover:bg-[#9D8D00]/25 text-[#9D8D00] border border-[#9D8D00]/30 text-xs font-medium transition-colors"
          >
            <RefreshCw size={13} />
            Force Rebuild
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF4752]/10 hover:bg-[#FF4752]/20 text-[#FF4752] border border-[#FF4752]/20 text-xs font-medium transition-colors"
          >
            <Trash2 size={13} />
            Delete
          </button>
          <Link
            to={`/package/${pkgId}/settings`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-medium transition-colors"
          >
            <Settings size={13} />
            Settings
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Main area */}
        <div className="flex-1 p-5 flex flex-col gap-4 min-h-0 overflow-y-auto">
          {/* AUR not found warning */}
          {isAurNotFound && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
              <AlertTriangle size={18} className="text-orange-400 flex-shrink-0 mt-0.5" />
              <p className="text-orange-300 text-sm">
                This package is no longer available in the AUR. It may have been moved to the
                official repositories or deleted. You can delete it using the button above.
              </p>
            </div>
          )}

          {/* AUR description */}
          {isAur && (aurSource as any).description && (
            <p className="text-white/50 text-sm leading-relaxed">
              {(aurSource as any).description}
            </p>
          )}

          {/* Builds table */}
          <div className="bg-secondary rounded-card border border-white/5 flex-1 flex flex-col">
            <div className="px-4 py-3 border-b border-white/5">
              <h2 className="text-sm font-semibold text-white/70">
                Builds of {pkg.name}
              </h2>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full">
                <thead>
                  <tr className="bg-heading-row border-b border-white/5">
                    <th className={TABLE_HEAD}>Build ID</th>
                    <th className={TABLE_HEAD}>Date</th>
                    <th className={TABLE_HEAD}>Version</th>
                    <th className={TABLE_HEAD}>Platform</th>
                    <th className={TABLE_HEAD}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {buildsLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-b border-white/5 animate-pulse">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <td key={j} className={TABLE_CELL}>
                              <div className="h-3 bg-white/5 rounded" />
                            </td>
                          ))}
                        </tr>
                      ))
                    : builds.map((build: Build) => (
                        <tr
                          key={build.id}
                          className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                        >
                          <td className={`${TABLE_CELL} text-white/30`}>
                            <Link to={`/build/${build.id}`} className="hover:text-white/60 transition-colors">
                              #{build.id}
                            </Link>
                          </td>
                          <td className={`${TABLE_CELL} text-white/60`}>
                            {build.start_time ? formatRelativeTime(build.start_time) : '–'}
                          </td>
                          <td className={`${TABLE_CELL} font-mono text-xs text-white/60`}>
                            {build.version}
                          </td>
                          <td className={`${TABLE_CELL} text-xs text-white/60`}>
                            {build.platform}
                          </td>
                          <td className={TABLE_CELL}>
                            <Link to={`/build/${build.id}`}>
                              <StatusIcon status={build.status} size={16} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>

            {!buildsLoading && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
                <span className="text-white/30 text-xs">{builds.length} builds on page {buildsPage}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setBuildsPage((p) => Math.max(1, p - 1))}
                    disabled={buildsPage === 1}
                    className="p-1.5 rounded-lg text-white/40 hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-white/50 text-sm px-2">{buildsPage}</span>
                  <button
                    onClick={() => setBuildsPage((p) => p + 1)}
                    disabled={builds.length < PAGE_SIZE}
                    className="p-1.5 rounded-lg text-white/40 hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-72 bg-secondary border-l border-white/5 p-4 overflow-y-auto flex-shrink-0">
          <h3 className="text-sm font-semibold text-white/50 mb-4">
            Details for {pkg.name}
          </h3>

          <div className="space-y-3">
            <SideField label="Upstream Version" value={pkg.upstream_version} />

            {isAur && aurSource && (
              <>
                {(aurSource as any).last_updated && (
                  <SideField
                    label="Last Updated"
                    value={formatDate((aurSource as any).last_updated)}
                  />
                )}
                {(aurSource as any).first_submitted && (
                  <SideField
                    label="First Submitted"
                    value={formatDate((aurSource as any).first_submitted)}
                  />
                )}
                {(aurSource as any).licenses && (
                  <SideField label="Licenses" value={(aurSource as any).licenses} />
                )}
                {(aurSource as any).maintainer && (
                  <SideField label="Maintainer" value={(aurSource as any).maintainer} />
                )}
                <SideField
                  label="AUR Flagged Outdated"
                  value={(aurSource as any).aur_flagged_outdated ? 'Yes' : 'No'}
                />
              </>
            )}

            {isGit && gitSource && (
              <>
                <SideField label="Git Repository" value={(gitSource as any).git_url ?? '–'} />
                <SideField label="Git Ref" value={(gitSource as any).git_ref ?? '–'} />
                <SideField label="Subfolder" value={(gitSource as any).subfolder ?? '–'} />
              </>
            )}
          </div>

          <div className="border-t border-white/5 my-4" />

          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
            Build Platforms
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {pkg.selected_platforms.length > 0 ? (
              pkg.selected_platforms.map((p) => (
                <span
                  key={p}
                  className="px-2.5 py-1 rounded-lg bg-[#6bab58]/15 border border-[#6bab58]/30 text-[#6bab58] text-xs font-mono font-medium"
                >
                  {p}
                </span>
              ))
            ) : (
              <span className="text-white/30 text-xs">None</span>
            )}
          </div>

          <div className="border-t border-white/5 my-4" />

          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
            Build Flags
          </h3>
          <div className="flex flex-wrap gap-2">
            {pkg.selected_build_flags.length > 0 ? (
              pkg.selected_build_flags.map((f) => (
                <span
                  key={f}
                  className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/50 text-xs font-mono"
                >
                  {f}
                </span>
              ))
            ) : (
              <span className="text-white/30 text-xs">None</span>
            )}
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmRebuild}
        title="Force Rebuild Package"
        message="Are you sure you want to force a package rebuild? If the package is outdated, the newest version will be built."
        confirmLabel="Force Rebuild"
        confirmVariant="warning"
        onConfirm={handleForceRebuild}
        onCancel={() => setConfirmRebuild(false)}
      />

      <ConfirmDialog
        open={confirmDelete}
        title="Delete Package"
        message="Are you sure you want to delete this package? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
};

const SideField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-xs text-white/40 font-medium mb-0.5">{label}</p>
    <p className="text-sm text-white/70 break-all">{value}</p>
  </div>
);
