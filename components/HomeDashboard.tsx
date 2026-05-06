"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { FootballSnapshot, FootballTeamSnapshot } from "@/lib/footballData";

type HomeDashboardProps = {
  initialSnapshot: FootballSnapshot;
};

export function HomeDashboard({ initialSnapshot }: HomeDashboardProps) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);

  useEffect(() => {
    const pollMs = snapshot.nextPollMs;

    if (!pollMs) {
      return;
    }

    const interval = window.setInterval(async () => {
      try {
        const response = await fetch("/api/football-data", {
          cache: "no-store"
        });

        if (!response.ok) {
          return;
        }

        const nextSnapshot = (await response.json()) as FootballSnapshot;
        setSnapshot(nextSnapshot);
      } catch (error) {
        console.error("Failed to load cached football data:", error);
      }
    }, pollMs);

    return () => window.clearInterval(interval);
  }, [snapshot.nextPollMs]);

  return (
    <div className="team-grid">
      {snapshot.teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}

function TeamCard({ team }: { team: FootballTeamSnapshot }) {
  return (
    <article className="team-card">
      <div className="team-card-header">
        {team.crestUrl ? (
          <div className="team-crest-frame">
            <Image
              className="team-crest"
              src={team.crestUrl}
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

      {team.result.available ? (
        <div className="latest-result">
          <p className="scoreline">{team.result.scoreline}</p>
          <p className="match-status">{team.result.status}</p>
        </div>
      ) : (
        <p className="score-fallback">No recent match available</p>
      )}

      <p className="next-match">{team.schedule.label}</p>
      <LeagueTablePreview team={team} />
    </article>
  );
}

function LeagueTablePreview({ team }: { team: FootballTeamSnapshot }) {
  const currentTeamRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    currentTeamRef.current?.scrollIntoView({
      block: "center"
    });
  }, [team.id, team.leagueTable.rows]);

  if (!team.leagueTable.available) {
    return <div className="league-preview fallback">League table unavailable</div>;
  }

  return (
    <div className="league-preview" aria-label="Domestic league table position">
      <div className="league-preview-header">
        <span>{team.leagueName}</span>
        <span>Pts</span>
      </div>
      <div className="league-rows" aria-label={`${team.leagueName} standings`} tabIndex={0}>
        {team.leagueTable.rows.map((row) => (
          <div
            className={`league-row ${row.emphasis}`}
            key={`${row.position}-${row.teamName}`}
            ref={row.isCurrentTeam ? currentTeamRef : undefined}
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
