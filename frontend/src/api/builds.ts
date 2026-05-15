import client from './client';
import type { Build } from '../types';

export async function fetchBuilds(params?: {
  pkgid?: number;
  limit?: number;
  page?: number;
}): Promise<Build[]> {
  const res = await client.get<Build[]>('/builds', { params });
  return res.data;
}

export async function fetchBuild(id: number): Promise<Build> {
  const res = await client.get<Build>(`/build/${id}`);
  return res.data;
}

export async function fetchBuildOutput(
  id: number,
  startline = 0
): Promise<string[]> {
  const res = await client.get<string>(`/build/${id}/output`, {
    params: { startline },
  });
  if (!res.data) return [];
  const lines = res.data.split('\n');
  // Strip trailing empty string from trailing newline to keep line count
  // consistent with the backend's `.lines()` iterator
  if (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
  return lines;
}

export async function retryBuild(id: number): Promise<number> {
  const res = await client.post<number>(`/build/${id}/retry`);
  return res.data;
}

export async function cancelBuild(id: number): Promise<void> {
  await client.post(`/build/${id}/cancel`);
}

export async function deleteBuild(id: number): Promise<void> {
  await client.delete(`/build/${id}`);
}
