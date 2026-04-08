/**
 * Structured API fallback wrapper.
 * Wraps async API calls with retry, caching, and graceful degradation.
 */

const CACHE_PREFIX = "sanri_cache_";
const RETRY_DELAY = 2000;

/**
 * Wrap an API call with fallback behavior:
 * - On network error: use cached result or fallbackFn
 * - On 5xx: retry once after 2s, then fallback
 * - On 429: return cached result with a "busy" flag
 *
 * @param {Function} apiCall - async function that returns data
 * @param {Function} fallbackFn - sync function returning fallback data
 * @param {Object} [options]
 * @param {string} [options.cacheKey] - sessionStorage key for caching last good result
 * @param {boolean} [options.retry] - enable single retry on 5xx (default true)
 * @returns {Promise<{data: any, source: 'api'|'cache'|'fallback'|'retry', busy?: boolean}>}
 */
export async function withFallback(apiCall, fallbackFn, options = {}) {
  const { cacheKey, retry = true } = options;

  const getCached = () => {
    if (!cacheKey) return null;
    try {
      const raw = sessionStorage.getItem(CACHE_PREFIX + cacheKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const setCache = (data) => {
    if (!cacheKey) return;
    try {
      sessionStorage.setItem(CACHE_PREFIX + cacheKey, JSON.stringify(data));
    } catch { /* quota exceeded */ }
  };

  try {
    const data = await apiCall();
    setCache(data);
    return { data, source: "api" };
  } catch (err) {
    const status = err?.status || 0;

    if (status === 429) {
      const cached = getCached();
      if (cached) return { data: cached, source: "cache", busy: true };
      return { data: fallbackFn(), source: "fallback", busy: true };
    }

    if (status >= 500 && retry) {
      try {
        await new Promise((r) => setTimeout(r, RETRY_DELAY));
        const data = await apiCall();
        setCache(data);
        return { data, source: "retry" };
      } catch {
        // fall through to fallback
      }
    }

    const cached = getCached();
    if (cached) return { data: cached, source: "cache" };
    return { data: fallbackFn(), source: "fallback" };
  }
}

/**
 * Simple fire-and-forget API call that never throws.
 * Good for analytics, tracking, and non-critical POSTs.
 */
export async function safeFire(apiCall) {
  try {
    await apiCall();
  } catch {
    // intentionally silent
  }
}
