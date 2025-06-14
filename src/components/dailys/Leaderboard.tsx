import { FC, useState } from "react";
import styles from "./Leaderboard.module.css";
import { LeagueManagement } from "./LeagueManagement";

interface LeaderboardProps {
  selectedGame: string | null;
}

type LeaderboardTab = "daily" | "weekly" | "all-time";

const MOCK_ENTRIES = [
  { id: "1", username: "player1", score: 1234, isCurrentUser: true },
  { id: "2", username: "player2", score: 1100 },
  { id: "3", username: "player3", score: 950 },
  { id: "4", username: "player4", score: 800 },
  { id: "5", username: "player5", score: 750 },
];

export const Leaderboard: FC<LeaderboardProps> = ({ selectedGame }) => {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("daily");

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Leaderboard</h2>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${
                activeTab === "daily" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("daily")}
            >
              Daily
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "weekly" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("weekly")}
            >
              Weekly
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "all-time" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("all-time")}
            >
              All Time
            </button>
          </div>
        </div>

        {selectedGame ? (
          <div className={styles.entries}>
            {MOCK_ENTRIES.map((entry, index) => (
              <div
                key={entry.id}
                className={`${styles.entry} ${
                  entry.isCurrentUser ? styles.currentUser : ""
                }`}
              >
                <div className={styles.rank}>{index + 1}</div>
                <div className={styles.info}>
                  <span className={styles.username}>{entry.username}</span>
                  <span className={styles.score}>{entry.score}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.placeholder}>
            <p>Select a game to view leaderboards</p>
          </div>
        )}
      </div>

      <LeagueManagement selectedGame={selectedGame} />
    </>
  );
};

// TODO: League/Leaderboard Refactor Plan
// 1. Tabs skal vise ligaene brukeren er med i, ikke daily/weekly/all-time.
//    Hent brukerens ligaer fra backend eller mock, og vis en tab per liga.
//    Husk at brukeren kan være med i mange ligaer (f.eks. 10+).
// 2. Leaderboard skal vise score for valgt liga. (Nå vises kun MOCK_ENTRIES.)
// 3. På sikt: Klikk på en spiller for å vise detaljert info om hvor poeng er hentet fra (eks: Connections, ShapeFit, etc).
// 4. På sikt: Utvidet leaderboard ("store") skal vise hvordan spillere har løst oppgavene (eks: Connections - hvilke valg, feil, deling av ekstern score).
// 5. LeagueManagement skal ligge nederst i denne komponenten og styre ligaene.
// 6. TODO: Rydd opp i duplisering mellom LeagueManagement/Leaderboard og DailyGamesContainer.
// 7. TODO: Støtte for eksterne daily-spill og deling av score.

// TODO: Bytt ut tabs med dynamiske liga-tabs når liga-data er klart
