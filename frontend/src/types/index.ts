export interface Stats {
  total_builds: number;
  successful_builds: number;
  failed_builds: number;
  avg_build_time: number; // seconds
  repo_size: number; // bytes
  total_packages: number;
  total_build_trend: number; // float, e.g. 1.1 = +10%
  avg_build_time_trend: number;
}

export interface GraphDataPoint {
  month: number;
  year: number;
  count: number;
}

export interface SimplePackage {
  id: number;
  name: string;
  status: number;
  outofdate: number; // 0 = up to date, 1 = out of date
  latest_version: string;
  upstream_version: string;
}

export interface Build {
  id: number;
  pkg_id: number;
  pkg_name: string;
  platform: string;
  version: string;
  status: number;
  start_time: number | null; // unix timestamp seconds
  end_time: number | null;
}

export interface Activity {
  user?: string;
  text: string;
  timestamp: number;
}

export type SettingSource = 'env' | 'package' | 'global' | 'default';

export interface SettingsEntry<T> {
  value: T;
  source: SettingSource;
}

export interface ApplicationSettings {
  cpu_limit: SettingsEntry<number>;
  memory_limit: SettingsEntry<number>;
  max_concurrent_builds: SettingsEntry<number>;
  version_check_interval: SettingsEntry<number>;
  auto_update_interval: SettingsEntry<string | null>;
  job_timeout: SettingsEntry<number>;
  builder_image: SettingsEntry<string>;
}

export interface SingleSetting {
  value: string;
  source: SettingSource;
}

export type PackageSourceType = 'Aur' | 'AurNotFound' | 'Git' | 'Upload';

export interface AurSource {
  package_type: 'Aur';
  aur_url?: string;
  description?: string;
  last_updated?: number;
  first_submitted?: number;
  licenses?: string;
  maintainer?: string;
  aur_flagged_outdated?: boolean;
}

export interface AurNotFoundSource {
  package_type: 'AurNotFound';
}

export interface GitSource {
  package_type: 'Git';
  git_url?: string;
  git_ref?: string;
  subfolder?: string;
}

export interface UploadSource {
  package_type: 'Upload';
}

export type PackageSource = AurSource | AurNotFoundSource | GitSource | UploadSource;

export interface ExtendedPackage {
  id: number;
  name: string;
  status: number;
  outofdate: number;
  upstream_version: string;
  latest_version?: string;
  selected_platforms: string[];
  selected_build_flags: string[];
  package_source: PackageSource;
}

export interface AurSearchResult {
  name: string;
  version: string;
}

// Build status constants
export const BUILD_STATUS = {
  BUILDING: 0,
  SUCCESS: 1,
  FAILED: 2,
  QUEUED: 3,
  CANCELLED: 4,
} as const;
