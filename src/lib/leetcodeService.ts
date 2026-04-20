export type LeetCodeUserData = {
  heatmap: number[]; // 365 values in chronological order (intensity 0-3)
  counts: number[]; // 365 raw counts in same order
  streak: number;
  total: number;
  easy: number;
  medium: number;
  hard: number;
  platform_easy: number;
  platform_medium: number;
  platform_hard: number;
};
export async function fetchLeetCodeUser(
  username: string,
  options?: { cacheTTL?: number }
): Promise<LeetCodeUserData | null> {
  if (!username) return null;

  const ttl = options?.cacheTTL ?? 60 * 60; // seconds, default 1 hour
  const storageKey = `leetcode:user:${username}`;

  // Try browser cache first (localStorage) when available
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as { ts: number; data: LeetCodeUserData } | null;
        if (parsed && parsed.ts && Date.now() - parsed.ts < ttl * 1000) {
          return parsed.data;
        }
      }
    } catch {
      // ignore localStorage errors and fall back to network
    }
  }

  const url = `/api/leetcode/${encodeURIComponent(username)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch LeetCode data (${res.status})`);
  }

  const json = (await res.json()) as LeetCodeUserData;

  // Store in browser cache for subsequent loads
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const payload = JSON.stringify({ ts: Date.now(), data: json });
      localStorage.setItem(storageKey, payload);
    } catch {
      // ignore storage errors
    }
  }

  return json;
}
