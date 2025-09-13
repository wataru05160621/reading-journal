import { Injectable } from '@nestjs/common';

type Entry<T> = { value: T; exp: number };

@Injectable()
export class CacheService {
  private ttl = Number(process.env.API_CACHE_TTL_MS || 60_000);
  private store = new Map<string, Entry<unknown>>();

  get<T>(key: string): T | undefined {
    const v = this.store.get(key) as Entry<T> | undefined;
    if (!v) return undefined;
    if (Date.now() > v.exp) {
      this.store.delete(key);
      return undefined;
    }
    return v.value;
  }

  set<T>(key: string, value: T, ttl = this.ttl) {
    this.store.set(key, { value, exp: Date.now() + ttl });
  }

  clear() {
    this.store.clear();
  }
}

