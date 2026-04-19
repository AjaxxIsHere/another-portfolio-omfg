import { NextResponse } from "next/server";

type ACItem = { difficulty?: string; count?: number };

type ResponseData = {
  data?: {
    matchedUser?: {
      submissionCalendar?: string | Record<string, number>;
      submitStats?: { acSubmissionNum?: ACItem[] };
    };
    allQuestionsCount?: ACItem[];
  };
  errors?: unknown;
};

const GRAPHQL_QUERY = `query getUserProfile($username: String!) {
  allQuestionsCount {
    difficulty
    count
  }
  matchedUser(username: $username) {
    submissionCalendar
    submitStats {
      acSubmissionNum {
        difficulty
        count
      }
    }
  }
}`;

function normalizeDateKey(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0, 10);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  // Next.js App Router NOTE: dynamic params are Promises in newer versions
  const { username } = await params;

  if (!username) {
    return NextResponse.json({ error: "missing username" }, { status: 400 });
  }

  try {
    const body = JSON.stringify({ query: GRAPHQL_QUERY, variables: { username } });

    const resp = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      // do not cache LeetCode responses
      cache: "no-store",
    });

    if (!resp.ok) {
      return NextResponse.json({ error: "leetcode fetch failed", status: resp.status }, { status: 502 });
    }

    const json = (await resp.json()) as ResponseData;
    const matchedUser = json.data?.matchedUser;
    const allQuestions = json.data?.allQuestionsCount ?? [];

    if (!matchedUser) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }

    // submissionCalendar may be a JSON string or an object
    let calendarObj: Record<string, number> = {};
    const calRaw = matchedUser.submissionCalendar;
    if (calRaw) {
      if (typeof calRaw === "string") {
        try {
          calendarObj = JSON.parse(calRaw);
        } catch {
          calendarObj = {};
        }
      } else if (typeof calRaw === "object") {
        calendarObj = calRaw;
      }
    }

    // build daily submissions map keyed by ISO yyyy-mm-dd
    const daily = new Map<string, number>();
    Object.entries(calendarObj).forEach(([tsStr, count]) => {
      const ms = Number(tsStr) * 1000;
      const d = new Date(ms);
      const k = normalizeDateKey(d);
      daily.set(k, (daily.get(k) || 0) + Number(count || 0));
    });

    // compute current streak (replicating the Dart logic)
    const now = new Date();
    const todayKey = normalizeDateKey(now);
    let streak = 0;

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayKey = normalizeDateKey(yesterday);

    if ((daily.get(todayKey) || 0) > 0) {
      streak++;
      const target = new Date(now);
      target.setDate(target.getDate() - 1);
      while (true) {
        const k = normalizeDateKey(target);
        if ((daily.get(k) || 0) > 0) {
          streak++;
          target.setDate(target.getDate() - 1);
        } else break;
      }
    } else {
      if ((daily.get(yesterdayKey) || 0) === 0) {
        streak = 0;
      } else {
        const target = new Date(yesterday);
        while (true) {
          const k = normalizeDateKey(target);
          if ((daily.get(k) || 0) > 0) {
            streak++;
            target.setDate(target.getDate() - 1);
          } else break;
        }
      }
    }

    // build heatmap intensities (0..3) and raw counts for the last 365 days
    const daysToFetch = 365;
    const intensities: number[] = [];
    const counts: number[] = [];
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    for (let i = daysToFetch - 1; i >= 0; i--) {
      const t = new Date(today);
      t.setDate(today.getDate() - i);
      const k = normalizeDateKey(t);
      const count = daily.get(k) || 0;
      counts.push(count);
      let level = 0;
      if (count === 0) level = 0;
      else if (count === 1) level = 1;
      else if (count <= 3) level = 2;
      else level = 3;
      intensities.push(level);
    }

    // totals
    const ac: ACItem[] = matchedUser.submitStats?.acSubmissionNum ?? [];
    let easy = 0,
      medium = 0,
      hard = 0,
      total = 0;
    for (const it of ac) {
      if (it.difficulty === "Easy") easy = Number(it.count || 0);
      if (it.difficulty === "Medium") medium = Number(it.count || 0);
      if (it.difficulty === "Hard") hard = Number(it.count || 0);
      if (it.difficulty === "All") total = Number(it.count || 0);
    }

    let platform_easy = 0,
      platform_medium = 0,
      platform_hard = 0;
    for (const it of (allQuestions as ACItem[])) {
      if (it.difficulty === "Easy") platform_easy = Number(it.count || 0);
      if (it.difficulty === "Medium") platform_medium = Number(it.count || 0);
      if (it.difficulty === "Hard") platform_hard = Number(it.count || 0);
    }

    const result = {
      heatmap: intensities,
      counts,
      streak,
      total,
      easy,
      medium,
      hard,
      platform_easy,
      platform_medium,
      platform_hard,
    };

    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
