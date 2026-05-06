import Link from "next/link";
import { HomeDashboard } from "@/components/HomeDashboard";
import { getFootballSnapshot } from "@/lib/footballData";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initialSnapshot = await getFootballSnapshot();

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

        <HomeDashboard initialSnapshot={initialSnapshot} />
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
