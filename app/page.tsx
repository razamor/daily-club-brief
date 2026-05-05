const summaryItems = [
  "Milan are reportedly focused on sharpening their final-third movement ahead of the weekend.",
  "A returning midfielder is expected to add more control and depth to the matchday squad.",
  "Club staff are said to be monitoring a promising academy forward after a strong run of form."
];

const sources = [
  "Official club updates",
  "Italian football desk",
  "Matchday press notes"
];

export default function Home() {
  return (
    <main className="site-shell">
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="#">
          <span className="brand-mark" aria-hidden="true">
            DCB
          </span>
          <span>Daily Club Brief</span>
        </a>
        <nav className="nav-links" aria-label="Main menu">
          <a href="#brief">Brief</a>
          <a href="#sources">Sources</a>
          <a href="#about">About</a>
        </nav>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">AC Milan daily placeholder</p>
          <h1 id="hero-title">Your daily AC Milan briefing</h1>
          <p className="hero-text">
            A clean starting point for a future sports news summary experience,
            built now with simple placeholder content only.
          </p>
        </div>
      </section>

      <section className="content-grid" aria-label="Daily brief content">
        <article className="summary-card" id="brief">
          <div className="section-heading">
            <p className="eyebrow">Today&apos;s brief</p>
            <h2>Three things to know</h2>
          </div>
          <ul>
            {summaryItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <aside className="sources-panel" id="sources">
          <div className="section-heading">
            <p className="eyebrow">Placeholder links</p>
            <h2>Source list</h2>
          </div>
          <div className="source-links">
            {sources.map((source) => (
              <a href="#" key={source} aria-label={`${source} placeholder link`}>
                {source}
              </a>
            ))}
          </div>
        </aside>
      </section>

      <footer className="site-footer" id="about">
        <p>Daily Club Brief is a placeholder AC Milan news summary concept.</p>
        <p>No APIs, AI, database, or live news sources are connected.</p>
      </footer>
    </main>
  );
}
