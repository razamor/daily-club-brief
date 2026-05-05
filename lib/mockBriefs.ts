export type TeamBrief = {
  name: string;
  shortName: string;
  footballDataTeamId: number;
  colors: {
    primary: string;
    secondary: string;
  };
  date: string;
  summary: string[];
  sources: string[];
};

export const teamBriefs: TeamBrief[] = [
  {
    name: "AC Milan",
    shortName: "ACM",
    footballDataTeamId: 98,
    colors: {
      primary: "#d71920",
      secondary: "#151515"
    },
    date: "May 5, 2026",
    summary: [
      "The squad is keeping the tempo high in training after a busy run of fixtures.",
      "Midfield rotation is expected to stay flexible while the staff manages minutes.",
      "The latest mock transfer chatter points to interest in adding another wide attacker.",
      "A young academy prospect is earning positive notes from the coaching group."
    ],
    sources: ["Club note", "Training desk", "Transfer notebook"]
  },
  {
    name: "Leeds",
    shortName: "LEE",
    footballDataTeamId: 341,
    colors: {
      primary: "#ffcd00",
      secondary: "#1d428a"
    },
    date: "May 5, 2026",
    summary: [
      "The mood around the club is upbeat after a sharp week on the training pitch.",
      "Coaches are focusing on faster switches of play and cleaner final passes.",
      "Supporters are watching the full-back situation as the next match approaches.",
      "The academy pipeline remains a bright talking point in this placeholder brief."
    ],
    sources: ["Match preview", "Local notes", "Fan watch"]
  },
  {
    name: "Chelsea",
    shortName: "CHE",
    footballDataTeamId: 61,
    colors: {
      primary: "#034694",
      secondary: "#ffffff"
    },
    date: "May 5, 2026",
    summary: [
      "The team is looking for a steadier rhythm after another demanding league stretch.",
      "Attacking combinations are the main focus in this mock morning update.",
      "Several squad players are being framed as important depth options for the run-in.",
      "Recruitment chatter is quiet for now, with no real reporting connected here."
    ],
    sources: ["Briefing room", "Squad tracker", "Weekend notes"]
  }
];
