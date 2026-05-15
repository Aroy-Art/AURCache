import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  AlignLeft,
  RotateCcw,
  XCircle,
  Trash2,
  Loader2,
} from 'lucide-react';
import { fetchBuild, fetchBuildOutput, retryBuild, cancelBuild, deleteBuild } from '../api/builds';
import { StatusIcon, StatusBadge } from '../components/ui/StatusIcon';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { formatRelativeTime, buildDuration } from '../utils/formatters';
import { isActiveStatus } from '../utils/status';
import { BUILD_STATUS } from '../types';
import toast from 'react-hot-toast';
import { usePageTitle } from '../hooks/usePageTitle';

export const BuildDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const buildId = parseInt(id!, 10);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [followLog, setFollowLog] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmRetry, setConfirmRetry] = useState(false);
  const [logLines, setLogLines] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const lastLineRef = useRef(0);

  const { data: build, isLoading } = useQuery({
    queryKey: ['build', buildId],
    queryFn: () => fetchBuild(buildId),
    refetchInterval: (query) =>
      isActiveStatus(query.state.data?.status ?? -1) ? 5000 : false,
  });

  const isActive = build ? isActiveStatus(build.status) : false;
  usePageTitle(build ? `Build #${build.id} — ${build.pkg_name}` : undefined);

  // Fetch logs on mount and whenever isActive changes (covers the active→done
  // transition for a final flush).  Polling interval only runs while active.
  // The `cancelled` flag guards against React 18 Strict Mode's double-mount.
  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      if (cancelled) return;
      try {
        const lines = await fetchBuildOutput(buildId, lastLineRef.current);
        if (!cancelled && lines.length > 0) {
          setLogLines((prev) => [...prev, ...lines]);
          lastLineRef.current += lines.length;
        }
      } catch {
        // ignore network / 404 errors
      }
    };

    poll();
    if (!isActive) return () => { cancelled = true; };

    const interval = setInterval(poll, 3000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [buildId, isActive]);

  // Auto-scroll — useLayoutEffect fires after DOM update, before paint
  useLayoutEffect(() => {
    if (followLog && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logLines, followLog]);

  const handleRetry = async () => {
    try {
      const newId = await retryBuild(buildId);
      toast.success('Build retried');
      navigate(`/build/${newId}`);
    } catch {
      toast.error('Failed to retry build');
    }
    setConfirmRetry(false);
  };

  const handleCancel = async () => {
    try {
      await cancelBuild(buildId);
      qc.invalidateQueries({ queryKey: ['build', buildId] });
      toast.success('Build cancelled');
    } catch {
      toast.error('Failed to cancel build');
    }
    setConfirmCancel(false);
  };

  const handleDelete = async () => {
    try {
      await deleteBuild(buildId);
      toast.success('Build deleted');
      navigate(-1);
    } catch {
      toast.error('Failed to delete build');
    }
    setConfirmDelete(false);
  };

  const scrollToTop = () => {
    if (logRef.current) logRef.current.scrollTop = 0;
  };

  const scrollToBottom = () => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  };

  if (isLoading) return <LoadingSpinner fullPage />;
  if (!build) return null;

  const duration = buildDuration(build.start_time, build.end_time);
  const triggered = build.start_time ? formatRelativeTime(build.start_time) : '–';

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-secondary border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <StatusIcon status={build.status} size={16} />
          <span className="font-semibold text-white">{build.pkg_name}</span>
          <span className="text-white/40 text-sm">triggered {triggered}</span>
        </div>

        {/* Log controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFollowLog((f) => !f)}
            title={followLog ? 'Stop following log' : 'Follow log'}
            className={`p-2 rounded-lg transition-colors ${followLog ? 'bg-primary/15 text-primary' : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
          >
            <AlignLeft size={16} />
          </button>
          <button
            onClick={scrollToTop}
            title="Go to top"
            className="p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
          >
            <ArrowUp size={16} />
          </button>
          <button
            onClick={scrollToBottom}
            title="Go to bottom"
            className="p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
          >
            <ArrowDown size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Log area */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          {build.status === BUILD_STATUS.QUEUED ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#0044AA]/15 border border-[#0044AA]/20 flex items-center justify-center mx-auto mb-4">
                  <Loader2 size={28} className="text-[#0044AA] animate-spin" />
                </div>
                <p className="text-white/50 text-sm">Build is queued, waiting to start...</p>
              </div>
            </div>
          ) : (
            <div
              ref={logRef}
              className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed bg-[#0d0f13] select-text"
              style={{ scrollBehavior: 'smooth' }}
            >
              {logLines.length === 0 ? (
                <p className="text-white/20 italic">No output yet...</p>
              ) : (
                logLines.map((line, i) => (
                  <div
                    key={i}
                    className="flex hover:bg-white/3 px-1 rounded"
                  >
                    <span className="text-blue-400 mr-3 select-none text-[10px] flex-shrink-0 w-8 text-right leading-relaxed">
                      {i + 1}
                    </span>
                    <span className="text-[#c8c8c8] whitespace-pre-wrap break-all flex-1 min-w-0">
                      {line}
                    </span>
                  </div>
                ))
              )}
              {isActive && (
                <div className="flex items-center gap-2 mt-2 text-white/30">
                  <Loader2 size={12} className="animate-spin" />
                  <span>Build in progress...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="w-64 bg-secondary border-l border-white/5 p-4 flex flex-col gap-5 flex-shrink-0 overflow-y-auto">
          {/* Actions */}
          <div>
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
              Actions
            </h3>
            <div className="flex flex-col gap-2">
              {build.status === BUILD_STATUS.BUILDING || build.status === BUILD_STATUS.QUEUED ? (
                <button
                  onClick={() => setConfirmCancel(true)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#FF4752]/10 hover:bg-[#FF4752]/20 text-[#FF4752] border border-[#FF4752]/20 text-sm font-medium transition-colors"
                >
                  <XCircle size={15} />
                  Cancel Build
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setConfirmRetry(true)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#9D8D00]/10 hover:bg-[#9D8D00]/20 text-[#9D8D00] border border-[#9D8D00]/20 text-sm font-medium transition-colors"
                  >
                    <RotateCcw size={15} />
                    Rebuild
                  </button>
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#FF4752]/10 hover:bg-[#FF4752]/20 text-[#FF4752] border border-[#FF4752]/20 text-sm font-medium transition-colors"
                  >
                    <Trash2 size={15} />
                    Delete Build
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Build Info */}
          <div>
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
              Build Information
            </h3>
            <div className="space-y-3">
              <InfoRow label="Build Number" value={`#${build.id}`} />
              <InfoRow label="Package" value={build.pkg_name} link={`/package/${build.pkg_id}`} />
              <InfoRow label="Version" value={build.version} mono />
              <InfoRow label="Platform" value={build.platform} mono />
              <InfoRow
                label="Status"
                value={<StatusBadge status={build.status} />}
              />
              <InfoRow
                label="Triggered"
                value={build.start_time ? formatRelativeTime(build.start_time) : '–'}
              />
              <InfoRow
                label="Finished"
                value={build.end_time ? formatRelativeTime(build.end_time) : 'Not yet'}
              />
              <InfoRow label="Duration" value={duration} />
            </div>
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmRetry}
        title="Rebuild Package"
        message="Are you sure you want to rebuild this package? The newest available version will be built."
        confirmLabel="Rebuild"
        confirmVariant="warning"
        onConfirm={handleRetry}
        onCancel={() => setConfirmRetry(false)}
      />
      <ConfirmDialog
        open={confirmCancel}
        title="Cancel Build"
        message="Are you sure you want to cancel this build?"
        confirmLabel="Cancel Build"
        confirmVariant="danger"
        onConfirm={handleCancel}
        onCancel={() => setConfirmCancel(false)}
      />
      <ConfirmDialog
        open={confirmDelete}
        title="Delete Build"
        message="Are you sure you want to delete this build? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
};

const InfoRow: React.FC<{
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  link?: string;
}> = ({ label, value, mono, link }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs text-white/30">{label}</span>
    {link ? (
      <Link to={link} className="text-sm text-primary hover:text-blue-300 transition-colors">
        {value}
      </Link>
    ) : (
      <span className={`text-sm text-white/70 ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    )}
  </div>
);
