import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Upload, Check, Loader2, ChevronRight } from 'lucide-react';
import { searchAur } from '../../api/aur';
import { addPackage } from '../../api/packages';
import toast from 'react-hot-toast';
import type { AurSearchResult } from '../../types';

interface AddPackageModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type SourceType = 'aur' | 'git' | 'upload';

const PLATFORMS = ['x86_64', 'aarch64'];


export const AddPackageModal: React.FC<AddPackageModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState(0);
  const [sourceType, setSourceType] = useState<SourceType>('aur');

  // AUR step
  const [aurQuery, setAurQuery] = useState('');
  const [aurResults, setAurResults] = useState<AurSearchResult[]>([]);
  const [aurSearching, setAurSearching] = useState(false);
  const [selectedAur, setSelectedAur] = useState<string | null>(null);

  // Git step
  const [gitUrl, setGitUrl] = useState('');
  const [gitRef, setGitRef] = useState('');
  const [gitSubfolder, setGitSubfolder] = useState('');

  // Platform step
  const [platforms, setPlatforms] = useState<string[]>(['x86_64']);

  const [submitting, setSubmitting] = useState(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) {
      // Reset on close
      setTimeout(() => {
        setStep(0);
        setAurQuery('');
        setAurResults([]);
        setSelectedAur(null);
        setGitUrl('');
        setGitRef('');
        setGitSubfolder('');
        setPlatforms(['x86_64']);
      }, 300);
    }
  }, [open]);

  useEffect(() => {
    if (aurQuery.trim().length < 2) {
      setAurResults([]);
      return;
    }
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(async () => {
      setAurSearching(true);
      try {
        const results = await searchAur(aurQuery.trim());
        setAurResults(results.slice(0, 15));
      } catch {
        setAurResults([]);
      } finally {
        setAurSearching(false);
      }
    }, 400);
  }, [aurQuery]);

  const togglePlatform = (p: string) => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const canGoNext = () => {
    if (step === 0) return true;
    if (step === 1) {
      if (sourceType === 'aur') return selectedAur !== null;
      if (sourceType === 'git') return gitUrl.trim().length > 0;
      if (sourceType === 'upload') return true;
    }
    return true;
  };

  const handleNext = () => {
    if (step < 2) setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    if (platforms.length === 0) {
      toast.error('Select at least one platform');
      return;
    }
    setSubmitting(true);
    try {
      if (sourceType === 'aur') {
        await addPackage({ platforms, source: { type: 'aur', name: selectedAur! } });
      } else if (sourceType === 'git') {
        await addPackage({
          platforms,
          source: { type: 'git', url: gitUrl, ref: gitRef || '', subfolder: gitSubfolder || '' },
        });
      }
      toast.success('Package added successfully!');
      onSuccess();
      onClose();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Failed to add package');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-secondary border border-white/10 rounded-card shadow-2xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <h2 className="text-white font-semibold text-lg">Add Package</h2>
            <div className="flex items-center gap-1.5 mt-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i <= step ? 'bg-primary w-6' : 'bg-white/10 w-3'
                  }`}
                />
              ))}
              <span className="text-white/30 text-xs ml-1">Step {step + 1}/3</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/80 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 min-h-[280px]">
          {step === 0 && (
            <div>
              <p className="text-white/50 text-sm mb-5">Choose the package source type:</p>
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    { type: 'aur' as SourceType, label: 'AUR', icon: <img src="/icons/Archlinux.svg" className="w-14 h-14 object-contain" alt="Arch Linux" /> },
                    { type: 'git' as SourceType, label: 'Git', icon: <img src="/icons/git.svg" className="w-14 h-14 object-contain" alt="Git" /> },
                    { type: 'upload' as SourceType, label: 'ZIP Upload', icon: <img src="/icons/zip-icon.svg" className="w-14 h-14 object-contain" alt="ZIP" /> },
                  ] as const
                ).map(({ type, label, icon }) => (
                  <button
                    key={type}
                    onClick={() => setSourceType(type)}
                    className={`flex flex-col items-center gap-2 py-4 rounded-xl border transition-all ${
                      sourceType === type
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-white/10 bg-white/3 text-white/40 hover:border-white/20 hover:text-white/70'
                    }`}
                  >
                    {icon}
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && sourceType === 'aur' && (
            <div>
              <p className="text-white/50 text-sm mb-4">Search for a package on the AUR:</p>
              <div className="relative mb-4">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  autoFocus
                  className="w-full bg-bg border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  placeholder="Search AUR packages..."
                  value={aurQuery}
                  onChange={(e) => setAurQuery(e.target.value)}
                />
                {aurSearching && (
                  <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 animate-spin" />
                )}
              </div>
              <div className="space-y-1 max-h-52 overflow-y-auto">
                {aurResults.map((r) => (
                  <button
                    key={r.name}
                    onClick={() => setSelectedAur(r.name)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                      selectedAur === r.name
                        ? 'bg-primary/15 border border-primary/30'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span className="text-sm font-medium text-white">{r.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/30 font-mono">{r.version}</span>
                      {selectedAur === r.name && <Check size={14} className="text-primary" />}
                    </div>
                  </button>
                ))}
                {aurQuery.length >= 2 && !aurSearching && aurResults.length === 0 && (
                  <p className="text-white/30 text-sm text-center py-6">No results found</p>
                )}
              </div>
            </div>
          )}

          {step === 1 && sourceType === 'git' && (
            <div className="space-y-4">
              <p className="text-white/50 text-sm">Enter the Git repository details:</p>
              <div>
                <label className="block text-xs text-white/40 font-medium mb-1.5">Repository URL *</label>
                <input
                  autoFocus
                  className="w-full bg-bg border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  placeholder="https://github.com/user/repo.git"
                  value={gitUrl}
                  onChange={(e) => setGitUrl(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 font-medium mb-1.5">Branch / Ref</label>
                <input
                  className="w-full bg-bg border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  placeholder="main"
                  value={gitRef}
                  onChange={(e) => setGitRef(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 font-medium mb-1.5">Subfolder</label>
                <input
                  className="w-full bg-bg border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                  placeholder="optional subfolder path"
                  value={gitSubfolder}
                  onChange={(e) => setGitSubfolder(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 1 && sourceType === 'upload' && (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Upload size={28} className="text-white/30" />
              </div>
              <p className="text-white/50 text-sm text-center">
                ZIP upload is not yet supported in this interface.
              </p>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-white/50 text-sm mb-5">Select target build platforms:</p>
              <div className="grid grid-cols-2 gap-3">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all ${
                      platforms.includes(p)
                        ? 'border-green bg-green/10 text-green'
                        : 'border-white/10 bg-white/3 text-white/40 hover:border-white/20 hover:text-white/70'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                      platforms.includes(p) ? 'border-green bg-green' : 'border-white/20'
                    }`}>
                      {platforms.includes(p) && <Check size={10} className="text-bg" />}
                    </div>
                    <span className="font-mono text-sm font-medium">{p}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
          <button
            onClick={() => step > 0 ? setStep((s) => s - 1) : onClose()}
            className="px-4 py-2 rounded-lg text-white/50 hover:text-white/80 text-sm font-medium transition-colors hover:bg-white/5"
          >
            {step === 0 ? 'Cancel' : 'Back'}
          </button>

          {step < 2 ? (
            <button
              onClick={handleNext}
              disabled={!canGoNext()}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
            >
              Next
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || platforms.length === 0}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#6B43A4] hover:bg-purple-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
            >
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Add Package
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
