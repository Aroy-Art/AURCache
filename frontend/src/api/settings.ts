import client from './client';
import type { ApplicationSettings, SingleSetting } from '../types';

export async function fetchSettings(pkgid?: number): Promise<ApplicationSettings> {
  const res = await client.get<ApplicationSettings>('/settings', {
    params: pkgid !== undefined ? { pkgid } : undefined,
  });
  return res.data;
}

export async function fetchSetting(key: string, pkgid?: number): Promise<SingleSetting> {
  const res = await client.get<SingleSetting>(`/settings/${key}`, {
    params: pkgid !== undefined ? { pkgid } : undefined,
  });
  return res.data;
}

export async function patchSetting(
  key: string,
  value: string,
  pkgid?: number
): Promise<boolean> {
  try {
    await client.patch(
      `/settings/${key}`,
      { value },
      { params: pkgid !== undefined ? { pkgid } : undefined }
    );
    return true;
  } catch {
    return false;
  }
}

export async function resetSetting(key: string, pkgid?: number): Promise<boolean> {
  try {
    await client.delete(`/settings/${key}`, {
      params: pkgid !== undefined ? { pkgid } : undefined,
    });
    return true;
  } catch {
    return false;
  }
}
