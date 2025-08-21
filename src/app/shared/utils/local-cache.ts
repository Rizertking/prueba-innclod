export type Key = 'projects' | 'tasks';
type CacheShape<T> = { overrides: Record<number, T>, created: T[], deletedIds: number[] };

const empty = <T>(): CacheShape<T> => ({ overrides: {}, created: [], deletedIds: [] });

export function readCache<T>(key: Key): CacheShape<T> {
  try { return JSON.parse(localStorage.getItem('__cache_' + key) || '') as CacheShape<T>; }
  catch { return empty<T>(); }
}
export function writeCache<T>(key: Key, value: CacheShape<T>) {
  localStorage.setItem('__cache_' + key, JSON.stringify(value));
}
