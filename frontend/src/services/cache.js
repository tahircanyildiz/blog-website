/**
 * Simple in-memory cache service
 * Önbellek süresi: 5 dakika
 */

const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika
const cache = new Map();

export const cacheService = {
  set: (key, data) => {
    cache.set(key, {
      data,
      timestamp: Date.now()
    });
  },

  get: (key) => {
    const item = cache.get(key);

    if (!item) {
      return null;
    }

    // Cache süresi dolmuşsa null dön
    if (Date.now() - item.timestamp > CACHE_DURATION) {
      cache.delete(key);
      return null;
    }

    return item.data;
  },

  clear: (key) => {
    if (key) {
      cache.delete(key);
    } else {
      cache.clear();
    }
  },

  has: (key) => {
    const item = cache.get(key);
    if (!item) return false;

    // Cache süresi dolmuşsa false dön
    if (Date.now() - item.timestamp > CACHE_DURATION) {
      cache.delete(key);
      return false;
    }

    return true;
  }
};
