import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Save, RefreshCw, RotateCcw, AlertTriangle } from 'lucide-react';
import { fetchSetting, patchSetting, resetSetting } from '../api/settings';
import { fetchPackage } from '../api/packages';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import type { SingleSetting, SettingSource } from '../types';
import { usePageTitle } from '../hooks/usePageTitle';

type ConfigKey = 'makepkg_conf' | 'pacman_conf';

interface TabState {
  content: string;
  dirty: boolean;
  setting: SingleSetting | null;
}

function getSourceLabel(source: SettingSource, isPackageScope: boolean): string | null {
  if (source === 'env' && !isPackageScope) return 'env-forced';
  if (source === 'default') return 'default';
  if (isPackageScope && source === 'global') return 'inherited from global';
  if (isPackageScope && source === 'env') return 'inherited from env';
  return null;
}

export const ConfigFiles: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const pkgId = id ? parseInt(id, 10) : undefined;
  const isPackageScope = pkgId !== undefined;
  usePageTitle(isPackageScope ? (pkg ? `${pkg.name} — Config Files` : undefined) : 'Config Files');

  const [activeTab, setActiveTab] = useState<ConfigKey>('makepkg_conf');
  const [tabs, setTabs] = useState<Record<ConfigKey, TabState>>({
    makepkg_conf: { content: '', dirty: false, setting: null },
    pacman_conf: { content: '', dirty: false, setting: null },
  });
  const [loading, setLoading] = useState(true);

  const { data: pkg } = useQuery({
    queryKey: ['package', pkgId],
    queryFn: () => fetchPackage(pkgId!),
    enabled: isPackageScope,
  });

  const loadFiles = useCallback(async () => {
    setLoading(true);
    try {
      const [makepkg, pacman] = await Promise.all([
        fetchSetting('makepkg_conf', pkgId),
        fetchSetting('pacman_conf', pkgId),
      ]);
      setTabs({
        makepkg_conf: { content: makepkg.value, dirty: false, setting: makepkg },
        pacman_conf: { content: pacman.value, dirty: false, setting: pacman },
      });
    } catch (e) {
      toast.error('Failed to load config files');
    } finally {
      setLoading(false);
    }
  }, [pkgId]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleChange = (key: ConfigKey, value: string) => {
    setTabs((prev) => ({
      ...prev,
      [key]: { ...prev[key], content: value, dirty: true },
    }));
  };

  const handleSave = async (key: ConfigKey) => {
    const ok = await patchSetting(key, tabs[key].content, pkgId);
    if (ok) {
      toast.success(`Saved ${key === 'makepkg_conf' ? 'makepkg.conf' : 'pacman.conf'}`);
      await loadFiles();
    } else {
      toast.error('Failed to save');
    }
  };

  const handleReset = async (key: ConfigKey) => {
    const filename = key === 'makepkg_conf' ? 'makepkg.conf' : 'pacman.conf';
    const ok = await resetSetting(key, pkgId);
    if (ok) {
      toast.success(`Reset ${filename}`);
      await loadFiles();
    } else {
      toast.error(`Failed to reset ${filename}`);
    }
  };

  const title = isPackageScope
    ? pkg ? `${pkg.name}: Config Files` : 'Package Config Files'
    : 'Config Files';

  const backRoute = isPackageScope ? `/package/${pkgId}/settings` : '/settings';

  const hints: Record<ConfigKey, string> = {
    makepkg_conf: isPackageScope
      ? 'Per-package makepkg.conf override. Falls back to the global value when empty/reset. PKGDEST and MAKEFLAGS are always appended automatically.'
      : 'Custom makepkg.conf — PKGDEST and MAKEFLAGS are always appended automatically.',
    pacman_conf: isPackageScope
      ? "Per-package pacman.conf override. Replaces /etc/pacman.conf inside this package's build container. Reset to fall back to the global value."
      : 'Custom pacman.conf — replaces /etc/pacman.conf in the build container. Leave empty to use the builder default.',
  };

  const currentTab = tabs[activeTab];
  const isEnvLocked = currentTab.setting?.source === 'env' && !isPackageScope;

  const hasOverride = isPackageScope
    ? currentTab.setting?.source === 'package'
    : currentTab.setting !== null &&
      currentTab.setting.source !== 'env' &&
      currentTab.setting.source !== 'default';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 bg-secondary border-b border-white/5 flex-shrink-0">
        <Link to={backRoute} className="text-white/40 hover:text-white/80 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-base font-semibold text-white">{title}</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 border-b border-white/5 bg-secondary px-5 flex-shrink-0">
        {(['makepkg_conf', 'pacman_conf'] as ConfigKey[]).map((key) => {
          const label = key === 'makepkg_conf' ? 'makepkg.conf' : 'pacman.conf';
          const tab = tabs[key];
          const sourceLabel = tab.setting ? getSourceLabel(tab.setting.source, isPackageScope) : null;
          const isActive = activeTab === key;

          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-primary text-white'
                  : 'border-transparent text-white/40 hover:text-white/70'
              }`}
            >
              {label}
              {sourceLabel && (
                <span className="text-[10px] text-white/30 italic">({sourceLabel})</span>
              )}
              {tab.dirty && (
                <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Editor */}
      {loading ? (
        <LoadingSpinner fullPage />
      ) : (
        <div className="flex-1 flex flex-col min-h-0 p-5 gap-4">
          {/* Hint */}
          <p className="text-xs text-white/40 leading-relaxed">{hints[activeTab]}</p>

          {/* Env forced warning */}
          {isEnvLocked && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <AlertTriangle size={15} className="text-orange-400 flex-shrink-0" />
              <p className="text-orange-300 text-xs">
                Forced by environment variable — read-only.
              </p>
            </div>
          )}

          {/* Textarea */}
          <div className="flex-1 min-h-0">
            <textarea
              value={currentTab.content}
              onChange={(e) => handleChange(activeTab, e.target.value)}
              disabled={isEnvLocked}
              spellCheck={false}
              className="w-full h-full font-mono text-xs text-[#c8c8c8] bg-[#0d0f13] border border-white/8 rounded-xl p-4 resize-none focus:outline-none focus:border-primary/30 disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed"
              style={{ minHeight: '300px' }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            {hasOverride && (
              <button
                onClick={() => handleReset(activeTab)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/8 text-sm transition-colors"
              >
                <RotateCcw size={14} />
                {isPackageScope ? 'Reset to inherited' : 'Reset to default'}
              </button>
            )}
            <button
              onClick={loadFiles}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/8 text-sm transition-colors"
            >
              <RefreshCw size={14} />
              Reload
            </button>
            <button
              onClick={() => handleSave(activeTab)}
              disabled={isEnvLocked}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
            >
              <Save size={14} />
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
