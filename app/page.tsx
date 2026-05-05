import Link from "next/link";
import Image from "next/image";
import {
  fetchLatestTeamResults,
  fetchLeagueTableSlices
} from "@/lib/footballData";
import { teamBriefs } from "@/lib/mockBriefs";

export const dynamic = "force-dynamic";

export default async function Home() {
  const teams = teamBriefs.map((team) => ({
    id: team.footballDataTeamId,
    name: team.name,
    competitionCode: team.domesticLeagueCode
  }));
  const [latestResults, leagueTables] = await Promise.all([
    fetchLatestTeamResults(teams),
    fetchLeagueTableSlices(teams)
  ]);

  return (
    <main className="site-shell">
      <header className="site-header" aria-label="Primary navigation">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            JDB
          </span>
          <span>JustDailyBanter</span>
        </Link>
        <nav className="nav-links" aria-label="Main menu">
          <Link href="/daily-brief">Daily Brief</Link>
        </nav>
      </header>

      <section className="home-hero" aria-labelledby="hero-title">
        <h1 id="hero-title">JustDailyBanter</h1>
        <p className="hero-tagline">Soccer briefs, minus the noise</p>
      </section>

      <section className="teams-section" aria-labelledby="teams-title">
        <div className="section-heading">
          <p className="eyebrow">Included clubs</p>
          <h2 id="teams-title">Today&apos;s lineup</h2>
        </div>

        <div className="team-grid">
          {teamBriefs.map((team) => (
            <TeamCard
              key={team.name}
              team={team}
              result={latestResults[team.name]}
              leagueTable={leagueTables[team.name]}
              leagueName={team.domesticLeagueName}
            />
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <p>JustDailyBanter is a two-page MVP with live scores and mock brief content.</p>
        <p>
          <Link href="/daily-brief">Read the Daily Brief</Link>
        </p>
      </footer>
    </main>
  );
}

function TeamCard({
  team,
  result,
  leagueTable,
  leagueName
}: {
  team: (typeof teamBriefs)[number];
  result: Awaited<ReturnType<typeof fetchLatestTeamResults>>[string];
  leagueTable: Awaited<ReturnType<typeof fetchLeagueTableSlices>>[string];
  leagueName: string;
}) {
  return (
    <article className="team-card">
      <div className="team-card-header">
        {result.crestUrl ? (
          <div className="team-crest-frame">
            <Image
              className="team-crest"
              src={result.crestUrl}
              alt={`${team.name} crest`}
              width={64}
              height={64}
            />
          </div>
        ) : (
          <div className="team-name-fallback">{team.name}</div>
        )}
        <h3>{team.name}</h3>
      </div>
      {result.available ? (
        <div className="latest-result">
          <p className="scoreline">{result.scoreline}</p>
          <p className="match-status">{result.status}</p>
        </div>
      ) : (
        <p className="score-fallback">No recent match available</p>
      )}
      <LeagueTablePreview leagueTable={leagueTable} leagueName={leagueName} />
    </article>
  );
}

function LeagueTablePreview({
  leagueTable,
  leagueName
}: {
  leagueTable: Awaited<ReturnType<typeof fetchLeagueTableSlices>>[string];
  leagueName: string;
}) {
  if (!leagueTable.available) {
    return (
      <div className="league-preview fallback">
        League table unavailable
      </div>
    );
  }

  return (
    <div className="league-preview" aria-label="Domestic league table position">
      <div className="league-preview-header">
        <span>{leagueName}</span>
        <span>Pts</span>
      </div>
      <div className="league-rows">
        {leagueTable.rows.map((row) => (
          <div
            className={`league-row ${row.emphasis}`}
            key={`${row.position}-${row.teamName}`}
          >
            <span className="league-position">{row.position}</span>
            <span className="league-team">{row.teamName}</span>
            <span className="league-points">{row.points}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
