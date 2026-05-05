import Link from "next/link";
import { teamBriefs } from "@/lib/mockBriefs";

export default function DailyBriefPage() {
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
          <Link href="/daily-brief" aria-current="page">
            Daily Brief
          </Link>
        </nav>
      </header>

      <section className="page-intro" aria-labelledby="daily-brief-title">
        <p className="eyebrow">Mock daily summaries</p>
        <h1 id="daily-brief-title">Daily Brief</h1>
        <p>
          Placeholder team notes for a future soccer summary app. No live news,
          scraping, APIs, AI, or databases are connected yet.
        </p>
      </section>

      <section className="brief-list" aria-label="Team daily summaries">
        {teamBriefs.map((team) => (
          <article className="brief-card" key={team.name}>
            <div className="brief-card-header">
              <div className="team-name-fallback compact">{team.name}</div>
              <div>
                <h2>{team.name}</h2>
                <p>{team.date}</p>
              </div>
            </div>

            <ul className="summary-list">
              {team.summary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="sources-block">
              <h3>Sources</h3>
              <div className="source-links">
                {team.sources.map((source) => (
                  <a href="#" key={source}>
                    {source}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      <footer className="site-footer">
        <p>JustDailyBanter is using mock placeholder brief content only.</p>
        <p>Real sources can be wired in later.</p>
      </footer>
    </main>
  );
}
