import client from './client';
import type { Stats, GraphDataPoint } from '../types';

export async function fetchStats(): Promise<Stats> {
  const res = await client.get<Stats>('/stats');
  return res.data;
}

export async function fetchGraph(): Promise<GraphDataPoint[]> {
  const res = await client.get<GraphDataPoint[]>('/graph');
  return res.data;
}

export async function fetchUserInfo(): Promise<{ username?: string }> {
  const res = await client.get<{ username?: string }>('/userinfo');
  return res.data;
}
