import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, RotateCcw, FileText, Plus, X, Save } from 'lucide-react';
import { fetchPackage, patchPackage } from '../api/packages';
import { fetchSettings, patchSetting, resetSetting } from '../api/settings';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import type { SettingSource } from '../types';
import { usePageTitle } from '../hooks/usePageTitle';

const PLATFORMS = ['x86_64', 'aarch64', 'armv7h', 'i686'];

const SourceBadge: React.FC<{ source: SettingSource }> = ({ source }) => {
  const labels: Record<SettingSource, string> = {
    env: 'ENV',
    package: 'PKG',
    global: 'GLOBAL',
    default: 'DEFAULT',
  };
  const colors: Record<SettingSource, string> = {
    env: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    package: 'bg-primary/15 text-primary border-primary/20',
    global: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    default: 'bg-white/5 text-white/30 border-white/10',
  };
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${colors[source]}`}>
      {labels[source]}
    </span>
  );
};

interface SettingRowProps {
  label: string;
  description: string;
  settingKey: string;
  value: string;
  source: SettingSource;
  type?: 'text' | 'number';
  pkgid: number;
  onChanged: () => void;
}

const SettingRow: React.FC<SettingRowProps> = ({
  label,
  description,
  settingKey,
  value,
  source,
  type = 'text',
  pkgid,
  onChanged,
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const ok = await patchSetting(settingKey, draft, pkgid);
    setSaving(false);
    if (ok) {
      toast.success(`${label} saved`);
      onChanged();
      setEditing(false);
    } else {
      toast.error(`Failed to save ${label}`);
    }
  };

  const handleReset = async () => {
    const ok = await resetSetting(settingKey, pkgid);
    if (ok) {
      toast.success(`${label} reset to default`);
      onChanged();
      setEditing(false);
    } else {
      toast.error(`Failed to reset ${label}`);
    }
  };

  return (
    <div className="py-4 border-b border-white/5 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-medium text-white">{label}</span>
            <SourceBadge source={source} />
          </div>
          <p className="text-xs text-white/40">{description}</p>
        </div>

        {!editing ? (
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="font-mono text-sm text-white/70 bg-bg border border-white/10 rounded-lg px-3 py-1.5">
              {value || '–'}
            </span>
            <button
              onClick={() => { setDraft(value); setEditing(true); }}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs transition-colors"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-shrink-0">
            <input
              autoFocus
              type={type}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="font-mono text-sm text-white bg-bg border border-primary/40 rounded-lg px-3 py-1.5 w-36 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="p-1.5 rounded-lg bg-primary/15 hover:bg-primary/25 text-primary transition-colors"
            >
              <Save size={14} />
            </button>
            <button
              onClick={() => setEditing(false)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
            <button
              onClick={handleReset}
              title="Reset to default"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const PackageSettings: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const pkgId = parseInt(id!, 10);
  const qc = useQueryClient();
  const [newFlag, setNewFlag] = useState('');
  const [saving, setSaving] = useState(false);

  const { data: pkg, isLoading: pkgLoading } = useQuery({
    queryKey: ['package', pkgId],
    queryFn: () => fetchPackage(pkgId),
  });
  usePageTitle(pkg ? `${pkg.name} — Settings` : undefined);

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['settings', pkgId],
    queryFn: () => fetchSettings(pkgId),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['settings', pkgId] });
    qc.invalidateQueries({ queryKey: ['package', pkgId] });
  };

  const togglePlatform = async (p: string) => {
    if (!pkg) return;
    const current = pkg.selected_platforms;
    const next = current.includes(p) ? current.filter((x) => x !== p) : [...current, p];
    setSaving(true);
    try {
      await patchPackage(pkgId, { platforms: next });
      qc.invalidateQueries({ queryKey: ['package', pkgId] });
      toast.success('Platforms updated');
    } catch {
      toast.error('Failed to update platforms');
    }
    setSaving(false);
  };

  const removeFlag = async (flag: string) => {
    if (!pkg) return;
    const next = pkg.selected_build_flags.filter((f) => f !== flag);
    try {
      await patchPackage(pkgId, { build_flags: next });
      qc.invalidateQueries({ queryKey: ['package', pkgId] });
    } catch {
      toast.error('Failed to remove flag');
    }
  };

  const addFlag = async () => {
    const trimmed = newFlag.trim();
    if (!trimmed || !pkg) return;
    const next = [...pkg.selected_build_flags, trimmed];
    try {
      await patchPackage(pkgId, { build_flags: next });
      qc.invalidateQueries({ queryKey: ['package', pkgId] });
      setNewFlag('');
    } catch {
      toast.error('Failed to add flag');
    }
  };

  if (pkgLoading || settingsLoading) return <LoadingSpinner fullPage />;
  if (!pkg || !settings) return null;

  return (
    <div className="p-5 flex flex-col gap-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to={`/package/${pkgId}`}
          className="text-white/40 hover:text-white/80 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-white">Package Settings</h1>
          <p className="text-white/40 text-sm">{pkg.name}</p>
        </div>
      </div>

      {/* Build Configuration */}
      <section className="bg-secondary rounded-card border border-white/5 p-5">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
          Build Configuration
        </h2>

        {/* Platforms */}
        <div className="mb-5">
          <p className="text-sm font-medium text-white mb-1">Selected Build Platforms</p>
          <p className="text-xs text-white/40 mb-3">
            Builds will be triggered for each selected platform.
          </p>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => {
              const active = pkg.selected_platforms.includes(p);
              return (
                <button
                  key={p}
                  onClick={() => togglePlatform(p)}
                  disabled={saving}
                  className={`px-3 py-1.5 rounded-lg text-sm font-mono font-medium border transition-all ${
                    active
                      ? 'bg-[#6bab58]/15 border-[#6bab58]/30 text-[#6bab58]'
                      : 'bg-white/3 border-white/10 text-white/30 hover:border-white/20 hover:text-white/60'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Build flags */}
        <div>
          <p className="text-sm font-medium text-white mb-1">Build Flags</p>
          <p className="text-xs text-white/40 mb-3">
            Extra flags passed to paru when building this package.
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {pkg.selected_build_flags.map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs font-mono"
              >
                {f}
                <button
                  onClick={() => removeFlag(f)}
                  className="text-white/30 hover:text-[#FF4752] transition-colors"
                >
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newFlag}
              onChange={(e) => setNewFlag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addFlag()}
              placeholder="--flag"
              className="flex-1 bg-bg border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-primary/40"
            />
            <button
              onClick={addFlag}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-sm transition-colors"
            >
              <Plus size={14} />
              Add
            </button>
          </div>
        </div>
      </section>

      {/* Resource Limits */}
      <section className="bg-secondary rounded-card border border-white/5 p-5">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
          Resource Limits
        </h2>
        <SettingRow
          label="CPU Limit"
          description="µCPUs to use for this package's builds (0 = unlimited)"
          settingKey="cpu_limit"
          value={settings.cpu_limit.value.toString()}
          source={settings.cpu_limit.source}
          type="number"
          pkgid={pkgId}
          onChanged={invalidate}
        />
        <SettingRow
          label="Memory Limit"
          description="Maximum memory for this package's builds (-1 = unlimited)"
          settingKey="memory_limit"
          value={settings.memory_limit.value.toString()}
          source={settings.memory_limit.source}
          type="number"
          pkgid={pkgId}
          onChanged={invalidate}
        />
        <SettingRow
          label="Job Timeout"
          description="Maximum build duration for this package (in seconds)"
          settingKey="job_timeout"
          value={settings.job_timeout.value.toString()}
          source={settings.job_timeout.source}
          type="number"
          pkgid={pkgId}
          onChanged={invalidate}
        />
      </section>

      {/* Build Environment */}
      <section className="bg-secondary rounded-card border border-white/5 p-5">
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
          Build Environment
        </h2>

        <Link
          to={`/package/${pkgId}/config-files`}
          className="flex items-center justify-between p-3 rounded-xl bg-bg border border-white/8 hover:border-white/15 transition-colors mb-4"
        >
          <div className="flex items-center gap-3">
            <FileText size={16} className="text-white/40" />
            <div>
              <p className="text-sm font-medium text-white">Config Files</p>
              <p className="text-xs text-white/40">Override makepkg.conf and pacman.conf for this package</p>
            </div>
          </div>
          <ArrowLeft size={14} className="text-white/30 rotate-180" />
        </Link>

        <SettingRow
          label="Builder Image"
          description="Use a custom builder image for this package"
          settingKey="builder_image"
          value={settings.builder_image.value}
          source={settings.builder_image.source}
          pkgid={pkgId}
          onChanged={invalidate}
        />
      </section>
    </div>
  );
};
