import { teamBriefs } from "@/lib/mockBriefs";

type FootballDataTeam = {
  id: number;
  name: string;
  shortName?: string;
  crest?: string;
};

type FootballDataMatch = {
  id: number;
  utcDate: string;
  status: string;
  homeTeam: FootballDataTeam;
  awayTeam: FootballDataTeam;
  score: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
};

type FootballDataMatchesResponse = {
  matches?: FootballDataMatch[];
  message?: string;
};

type FootballDataStandingRow = {
  position: number;
  team: FootballDataTeam;
  points: number;
};

type FootballDataStandingsResponse = {
  standings?: Array<{
    type: string;
    table: FootballDataStandingRow[];
  }>;
  message?: string;
};

export type TeamResult = {
  available: boolean;
  crestUrl?: string;
  scoreline: string;
  status: string;
};

export type TeamSchedule = {
  available: boolean;
  label: string;
};

export type LeagueTableRow = {
  position: number;
  teamName: string;
  points: number;
  isCurrentTeam: boolean;
  emphasis: "muted" | "normal" | "current";
};

export type LeagueTableSlice = {
  available: boolean;
  rows: LeagueTableRow[];
};

export type FootballTeamSnapshot = {
  id: number;
  name: string;
  leagueName: string;
  crestUrl?: string;
  result: TeamResult;
  schedule: TeamSchedule;
  leagueTable: LeagueTableSlice;
};

export type FootballSnapshot = {
  teams: FootballTeamSnapshot[];
  hasLiveMatches: boolean;
  updatedAt: string;
  nextPollMs: number;
  servedFromCache: boolean;
  errors: string[];
};

type SnapshotOptions = {
  forceRefresh?: boolean;
};

type CompetitionData = {
  code: string;
  finishedMatches: FootballDataMatch[];
  liveMatches: FootballDataMatch[];
  scheduledMatches: FootballDataMatch[];
  standings: FootballDataStandingRow[];
};

const FOOTBALL_DATA_BASE_URL = "https://api.football-data.org/v4";
const FOOTBALL_DATA_TIMEOUT_MS = 8000;
const LIVE_REFRESH_MS = 60 * 1000;
const IDLE_CLIENT_POLL_MS = 5 * 60 * 1000;
// Non-live data is primarily refreshed by Vercel Cron; this max age is a
// fallback so a warm server instance can self-heal if it misses a cron refresh.
const SCHEDULED_CACHE_MAX_AGE_MS = 12 * 60 * 60 * 1000;

let cachedSnapshot: FootballSnapshot | null = null;
let cachedSnapshotAt = 0;

function getApiKey() {
  return process.env.FOOTBALL_DATA_API_KEY;
}

function compactTeamName(name: string) {
  return name
    .replace(/\bFC\b/g, "")
    .replace(/\bAFC\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatCentralDate(utcDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Chicago"
  }).format(new Date(utcDate));
}

function isTeamInMatch(match: FootballDataMatch, teamId: number) {
  return match.homeTeam.id === teamId || match.awayTeam.id === teamId;
}

function getTeamFromMatch(match: FootballDataMatch, teamId: number) {
  return match.homeTeam.id === teamId ? match.homeTeam : match.awayTeam;
}

function formatScoreline(match: FootballDataMatch, teamId: number, teamName: string) {
  const isHomeTeam = match.homeTeam.id === teamId;
  const teamScore = isHomeTeam ? match.score.fullTime.home : match.score.fullTime.away;
  const opponentScore = isHomeTeam ? match.score.fullTime.away : match.score.fullTime.home;
  const opponent = isHomeTeam ? match.awayTeam.name : match.homeTeam.name;

  if (teamScore === null || opponentScore === null) {
    return null;
  }

  return `${teamName} ${teamScore} - ${opponentScore} ${compactTeamName(opponent)}`;
}

function latestMatchForTeam(matches: FootballDataMatch[], teamId: number) {
  return matches
    .filter((match) => isTeamInMatch(match, teamId))
    .sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())[0];
}

function nextMatchForTeam(matches: FootballDataMatch[], teamId: number) {
  return matches
    .filter((match) => isTeamInMatch(match, teamId))
    .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())[0];
}

function formatResult(teamId: number, teamName: string, match?: FootballDataMatch): TeamResult {
  if (!match) {
    return {
      available: false,
      scoreline: "No recent match available",
      status: ""
    };
  }

  const scoreline = formatScoreline(match, teamId, teamName);
  const currentTeam = getTeamFromMatch(match, teamId);

  if (!scoreline) {
    return {
      available: false,
      crestUrl: currentTeam.crest,
      scoreline: "No recent match available",
      status: ""
    };
  }

  return {
    available: true,
    crestUrl: currentTeam.crest,
    scoreline,
    status: match.status === "FINISHED" ? "Final" : "Live"
  };
}

function formatSchedule(teamId: number, match?: FootballDataMatch): TeamSchedule {
  if (!match) {
    return {
      available: false,
      label: "No upcoming match listed"
    };
  }

  return {
    available: true,
    label: `Next: ${compactTeamName(match.homeTeam.name)} vs ${compactTeamName(
      match.awayTeam.name
    )} \u00b7 ${formatCentralDate(match.utcDate)}`
  };
}

function formatLeagueTable(teamId: number, table: FootballDataStandingRow[]): LeagueTableSlice {
  const currentIndex = table.findIndex((row) => row.team.id === teamId);

  if (currentIndex === -1) {
    return {
      available: false,
      rows: []
    };
  }

  const rows = table.map((row) => ({
    position: row.position,
    teamName: compactTeamName(row.team.shortName || row.team.name),
    points: row.points,
    isCurrentTeam: row.team.id === teamId,
    emphasis: row.team.id === teamId ? "current" : "normal"
  })) satisfies LeagueTableRow[];

  return {
    available: true,
    rows
  };
}

async function fetchFootballApi<T>(path: string): Promise<T> {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error("FOOTBALL_DATA_API_KEY is not configured.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FOOTBALL_DATA_TIMEOUT_MS);

  try {
    const response = await fetch(`${FOOTBALL_DATA_BASE_URL}${path}`, {
      cache: "no-store",
      headers: {
        "X-Auth-Token": apiKey
      },
      signal: controller.signal
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || `football-data.org request failed with ${response.status}.`
      );
    }

    return data as T;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchCompetitionMatches(competitionCode: string, status: string) {
  const data = await fetchFootballApi<FootballDataMatchesResponse>(
    `/competitions/${competitionCode}/matches?status=${status}`
  );

  return data.matches || [];
}

async function fetchCompetitionStandings(competitionCode: string) {
  const data = await fetchFootballApi<FootballDataStandingsResponse>(
    `/competitions/${competitionCode}/standings`
  );

  return data.standings?.find((standing) => standing.type === "TOTAL")?.table || [];
}

async function fetchCompetitionData(code: string): Promise<CompetitionData> {
  const [finishedMatches, liveMatches, scheduledMatches, standings] = await Promise.all([
    fetchCompetitionMatches(code, "FINISHED"),
    fetchCompetitionMatches(code, "LIVE"),
    fetchCompetitionMatches(code, "SCHEDULED"),
    fetchCompetitionStandings(code)
  ]);

  return {
    code,
    finishedMatches,
    liveMatches,
    scheduledMatches,
    standings
  };
}

function buildFallbackSnapshot(errors: string[]): FootballSnapshot {
  return {
    teams: teamBriefs.map((team) => ({
      id: team.footballDataTeamId,
      name: team.name,
      leagueName: team.domesticLeagueName,
      result: {
        available: false,
        scoreline: "No recent match available",
        status: ""
      },
      schedule: {
        available: false,
        label: "No upcoming match listed"
      },
      leagueTable: {
        available: false,
        rows: []
      }
    })),
    hasLiveMatches: false,
    updatedAt: new Date().toISOString(),
    nextPollMs: IDLE_CLIENT_POLL_MS,
    servedFromCache: false,
    errors
  };
}

async function fetchFreshFootballSnapshot(): Promise<FootballSnapshot> {
  const competitionCodes = Array.from(
    new Set(teamBriefs.map((team) => team.domesticLeagueCode))
  );
  const competitionEntries = await Promise.all(
    competitionCodes.map(async (code) => [code, await fetchCompetitionData(code)] as const)
  );
  const competitionData = Object.fromEntries(competitionEntries);

  const teams = teamBriefs.map((team) => {
    const data = competitionData[team.domesticLeagueCode];
    const liveMatch = latestMatchForTeam(data.liveMatches, team.footballDataTeamId);
    const latestFinishedMatch = latestMatchForTeam(
      data.finishedMatches,
      team.footballDataTeamId
    );
    const upcomingMatch = nextMatchForTeam(
      data.scheduledMatches,
      team.footballDataTeamId
    );
    const result = formatResult(
      team.footballDataTeamId,
      team.name,
      liveMatch || latestFinishedMatch
    );

    return {
      id: team.footballDataTeamId,
      name: team.name,
      leagueName: team.domesticLeagueName,
      crestUrl: result.crestUrl,
      result,
      schedule: formatSchedule(team.footballDataTeamId, upcomingMatch),
      leagueTable: formatLeagueTable(team.footballDataTeamId, data.standings)
    };
  });
  const hasLiveMatches = teams.some((team) => team.result.status === "Live");

  return {
    teams,
    hasLiveMatches,
    updatedAt: new Date().toISOString(),
    nextPollMs: hasLiveMatches ? LIVE_REFRESH_MS : IDLE_CLIENT_POLL_MS,
    servedFromCache: false,
    errors: []
  };
}

function shouldUseCachedSnapshot(options: SnapshotOptions) {
  if (!cachedSnapshot || options.forceRefresh) {
    return false;
  }

  if (!cachedSnapshot.hasLiveMatches) {
    return Date.now() - cachedSnapshotAt < SCHEDULED_CACHE_MAX_AGE_MS;
  }

  return Date.now() - cachedSnapshotAt < LIVE_REFRESH_MS;
}

async function refreshLiveScoresFromCache(snapshot: FootballSnapshot) {
  const competitionCodes = Array.from(
    new Set(teamBriefs.map((team) => team.domesticLeagueCode))
  );
  const liveEntries = await Promise.all(
    competitionCodes.map(async (code) => [
      code,
      await fetchCompetitionMatches(code, "LIVE")
    ] as const)
  );
  const liveMatchesByCompetition = Object.fromEntries(liveEntries);
  const hasAnyLiveMatch = liveEntries.some(([, matches]) => matches.length > 0);

  if (!hasAnyLiveMatch) {
    return fetchFreshFootballSnapshot();
  }

  const teams = snapshot.teams.map((snapshotTeam) => {
    const teamConfig = teamBriefs.find(
      (team) => team.footballDataTeamId === snapshotTeam.id
    );

    if (!teamConfig) {
      return snapshotTeam;
    }

    const liveMatch = latestMatchForTeam(
      liveMatchesByCompetition[teamConfig.domesticLeagueCode] || [],
      snapshotTeam.id
    );

    if (!liveMatch) {
      return snapshotTeam;
    }

    return {
      ...snapshotTeam,
      result: formatResult(snapshotTeam.id, snapshotTeam.name, liveMatch)
    };
  });

  return {
    ...snapshot,
    teams,
    hasLiveMatches: teams.some((team) => team.result.status === "Live"),
    updatedAt: new Date().toISOString(),
    nextPollMs: LIVE_REFRESH_MS,
    servedFromCache: false,
    errors: []
  };
}

// Central cache entrypoint. The frontend and cron routes both read/write through this
// module so API keys stay server-side and football-data.org is not called on every render.
export async function getFootballSnapshot(options: SnapshotOptions = {}) {
  if (shouldUseCachedSnapshot(options)) {
    return {
      ...cachedSnapshot!,
      servedFromCache: true
    };
  }

  try {
    const nextSnapshot =
      cachedSnapshot?.hasLiveMatches && !options.forceRefresh
        ? await refreshLiveScoresFromCache(cachedSnapshot)
        : await fetchFreshFootballSnapshot();
    cachedSnapshot = nextSnapshot;
    cachedSnapshotAt = Date.now();

    return nextSnapshot;
  } catch (error) {
    console.error("Failed to refresh football data:", error);

    if (cachedSnapshot) {
      return {
        ...cachedSnapshot,
        servedFromCache: true,
        errors: ["Showing last successful football data refresh."]
      };
    }

    return buildFallbackSnapshot(["Football data is temporarily unavailable."]);
  }
}

// Used by Vercel Cron and manual refreshes to force a new cached snapshot.
export async function refreshFootballSnapshot() {
  return getFootballSnapshot({
    forceRefresh: true
  });
}
