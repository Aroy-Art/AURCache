import client from './client';
import type { SimplePackage, ExtendedPackage } from '../types';

export async function fetchPackages(limit?: number, page?: number): Promise<SimplePackage[]> {
  const res = await client.get<SimplePackage[]>('/packages/list', {
    params: { limit, page },
  });
  return res.data;
}

export async function fetchPackage(id: number): Promise<ExtendedPackage> {
  const res = await client.get<ExtendedPackage>(`/package/${id}`);
  return res.data;
}

export async function addPackage(data: {
  platforms: string[];
  build_flags?: string[];
  source:
    | { type: 'aur'; name: string }
    | { type: 'git'; url: string; ref: string; subfolder: string }
    | { type: 'upload'; archive: number[] };
}): Promise<void> {
  await client.post('/package', data);
}

export async function patchPackage(
  id: number,
  data: { platforms?: string[]; build_flags?: string[] }
): Promise<void> {
  await client.patch(`/package/${id}`, data);
}

export async function updatePackage(id: number, force: boolean): Promise<void> {
  await client.post(`/package/${id}/update`, { force });
}

export async function deletePackage(id: number): Promise<void> {
  await client.delete(`/package/${id}`);
}
