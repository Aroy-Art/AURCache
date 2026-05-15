import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, ArrowRight, HardDrive } from 'lucide-react';
import {
  IconTilePackages,
  IconTileBuilds,
  IconTileClock,
} from '../assets/icons';
import { fetchStats } from '../api/stats';
import { fetchUserInfo } from '../api/stats';
import { StatCard } from '../components/dashboard/StatCard';
import { BuildsChart } from '../components/dashboard/BuildsChart';
import { ActivityLog } from '../components/dashboard/ActivityLog';
import { DashboardTables } from '../components/dashboard/DashboardTables';
import { AddPackageModal } from '../components/packages/AddPackageModal';
import { formatBytes, formatDuration } from '../utils/formatters';
import { usePageTitle } from '../hooks/usePageTitle';

export const Dashboard: React.FC = () => {
  usePageTitle('Dashboard');
  const [addPkgOpen, setAddPkgOpen] = useState(false);
  const qc = useQueryClient();

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    refetchInterval: 60_000,
  });

  const { data: userInfo } = useQuery({
    queryKey: ['userinfo'],
    queryFn: fetchUserInfo,
  });

  const buildSuccessRate =
    stats && stats.successful_builds + stats.failed_builds > 0
      ? stats.successful_builds / (stats.successful_builds + stats.failed_builds)
      : 0;

  const handleAddSuccess = () => {
    qc.invalidateQueries({ queryKey: ['packages'] });
    qc.invalidateQueries({ queryKey: ['stats'] });
  };

  return (
    <div className="flex flex-col h-full p-5 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">
            Hi, {userInfo?.username ?? 'there'}{' '}
            <span role="img" aria-label="wave">👋</span>
          </h1>
          <p className="text-white/40 text-sm mt-0.5">
            AURCache Build Server Dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddPkgOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6B43A4] hover:bg-purple-600 text-white text-sm font-medium transition-colors shadow-lg shadow-purple-900/30"
          >
            <Plus size={16} />
            Add Package
          </button>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        <StatCard
          title="Total Packages"
          value={stats?.total_packages.toString() ?? '–'}
          icon={<IconTilePackages size={22} />}
        />
        <StatCard
          title="Total Builds"
          value={stats?.total_builds.toString() ?? '–'}
          trend={stats?.total_build_trend}
          icon={<IconTileBuilds size={22} />}
        />
        <StatCard
          title="Repo Size"
          value={stats ? formatBytes(stats.repo_size) : '–'}
          icon={<HardDrive size={22} />}
        />
        <StatCard
          title="Avg Build Time"
          value={stats ? formatDuration(stats.avg_build_time) : '–'}
          trend={stats?.avg_build_time_trend}
          icon={<IconTileClock size={22} />}
        />
        <StatCard
          title="Build Success"
          value={`${Math.round(buildSuccessRate * 100)}%`}
          circularProgress={buildSuccessRate}
          circularLabel={`${Math.round(buildSuccessRate * 100)}%`}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-5 gap-4 min-h-0">
        {/* Left: tables (3/5) */}
        <div className="xl:col-span-3">
          <DashboardTables />
        </div>

        {/* Right: chart + activity (2/5) */}
        <div className="xl:col-span-2 flex flex-col gap-4 min-h-0">
          {/* Builds per month */}
          <div className="bg-secondary rounded-card border border-white/5 p-4">
            <h3 className="text-sm font-semibold text-white/70 mb-3">Builds Per Month</h3>
            <BuildsChart />
          </div>

          {/* Recent activity */}
          <div className="bg-secondary rounded-card border border-white/5 p-4 flex flex-col min-h-0 flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white/70">Recent Activity</h3>
              <Link
                to="/activities"
                className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                View All <ArrowRight size={11} />
              </Link>
            </div>
            <div className="overflow-y-auto flex-1">
              <ActivityLog limit={15} />
            </div>
          </div>
        </div>
      </div>

      <AddPackageModal
        open={addPkgOpen}
        onClose={() => setAddPkgOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
};
