import client from './client';
import type { AurSearchResult } from '../types';

export async function searchAur(query: string): Promise<AurSearchResult[]> {
  const res = await client.get<AurSearchResult[]>('/search', {
    params: { query },
  });
  return res.data;
}
