type FootballDataTeam = {
  id: number;
  name: string;
  crest?: string;
};

type FootballDataMatch = {
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

export type TeamResult = {
  available: boolean;
  crestUrl?: string;
  scoreline: string;
  status: string;
};

type TeamLookup = {
  id: number;
  name: string;
};

const FOOTBALL_DATA_BASE_URL = "https://api.football-data.org/v4";
const FOOTBALL_DATA_TIMEOUT_MS = 8000;
const NO_RECENT_MATCH: TeamResult = {
  available: false,
  scoreline: "No recent match available",
  status: ""
};

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

function formatLatestResult(match: FootballDataMatch, team: TeamLookup): TeamResult {
  const isHomeTeam = match.homeTeam.id === team.id;
  const teamScore = isHomeTeam ? match.score.fullTime.home : match.score.fullTime.away;
  const opponentScore = isHomeTeam ? match.score.fullTime.away : match.score.fullTime.home;
  const opponent = isHomeTeam ? match.awayTeam.name : match.homeTeam.name;
  const currentTeam = isHomeTeam ? match.homeTeam : match.awayTeam;

  if (teamScore === null || opponentScore === null) {
    return NO_RECENT_MATCH;
  }

  return {
    available: true,
    crestUrl: currentTeam.crest,
    scoreline: `${team.name} ${teamScore} - ${opponentScore} ${compactTeamName(opponent)}`,
    status: "Final"
  };
}

export async function fetchTeamMatches(teamId: number) {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error("FOOTBALL_DATA_API_KEY is not configured.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FOOTBALL_DATA_TIMEOUT_MS);

  try {
    const response = await fetch(
      `${FOOTBALL_DATA_BASE_URL}/teams/${teamId}/matches?status=FINISHED&limit=10`,
      {
        cache: "no-store",
        headers: {
          "X-Auth-Token": apiKey
        },
        signal: controller.signal
      }
    );

    const data = (await response.json()) as FootballDataMatchesResponse;

    if (!response.ok) {
      throw new Error(
        data.message || `football-data.org request failed with ${response.status}.`
      );
    }

    return data.matches || [];
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchLatestTeamResult(team: TeamLookup): Promise<TeamResult> {
  try {
    const matches = await fetchTeamMatches(team.id);
    const latestMatch = matches
      .filter((match) => match.status === "FINISHED")
      .sort(
        (a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime()
      )[0];

    if (!latestMatch) {
      return NO_RECENT_MATCH;
    }

    return formatLatestResult(latestMatch, team);
  } catch (error) {
    console.error(`Failed to fetch latest result for ${team.name}:`, error);
    return NO_RECENT_MATCH;
  }
}

export async function fetchLatestTeamResults(teams: TeamLookup[]) {
  const results = await Promise.all(
    teams.map(async (team) => [team.name, await fetchLatestTeamResult(team)] as const)
  );

  return Object.fromEntries(results) as Record<string, TeamResult>;
}
