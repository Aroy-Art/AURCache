import client from './client';
import type { Activity } from '../types';

export async function fetchActivity(limit = 20): Promise<Activity[]> {
  const res = await client.get<Activity[]>('/activity', { params: { limit } });
  return res.data;
}
