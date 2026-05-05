import Link from "next/link";
import type { CSSProperties } from "react";
import { teamBriefs } from "@/lib/mockBriefs";

export default function Home() {
  return (
    <main className="site-shell">
      <header className="site-header" aria-label="Primary navigation">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            JB
          </span>
          <span>JustBanter</span>
        </Link>
        <nav className="nav-links" aria-label="Main menu">
          <Link href="/daily-brief">Daily Brief</Link>
        </nav>
      </header>

      <section className="home-hero" aria-labelledby="hero-title">
        <p className="eyebrow">Soccer briefs, minus the noise</p>
        <h1 id="hero-title">JustBanter</h1>
        <p className="hero-text">
          A playful daily summary MVP for keeping tabs on the clubs you care
          about. For now, everything here is friendly placeholder content.
        </p>
      </section>

      <section className="teams-section" aria-labelledby="teams-title">
        <div className="section-heading">
          <p className="eyebrow">Included clubs</p>
          <h2 id="teams-title">Today&apos;s lineup</h2>
        </div>

        <div className="team-grid">
          {teamBriefs.map((team) => (
            <article className="team-card" key={team.name}>
              <div
                className="team-badge large"
                style={{
                  "--team-primary": team.colors.primary,
                  "--team-secondary": team.colors.secondary
                } as CSSProperties}
                aria-hidden="true"
              >
                {team.shortName}
              </div>
              <h3>{team.name}</h3>
              <p>
                Daily mock notes, source placeholders, and enough soccer chatter
                to give the page a pulse.
              </p>
            </article>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <p>JustBanter is a two-page MVP with mock content only.</p>
        <p>
          <Link href="/daily-brief">Read the Daily Brief</Link>
        </p>
      </footer>
    </main>
  );
}
