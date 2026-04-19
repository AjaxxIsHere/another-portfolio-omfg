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

export async function fetchLeetCodeUser(username: string): Promise<LeetCodeUserData | null> {
  if (!username) return null;

  const url = `/api/leetcode/${encodeURIComponent(username)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch LeetCode data (${res.status})`);
  }

  const json = await res.json();
  return json as LeetCodeUserData;
}
