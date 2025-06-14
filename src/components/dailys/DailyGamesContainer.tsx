import { FC, useState, useEffect } from "react";
import { registry } from "./registry/DailyGamesRegistry";
import styles from "./DailyGamesContainer.module.css";
import "./games";

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
}

export const DailyGamesContainer: FC = () => {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    // Temporary mock data
    { rank: 1, name: "Player 1", score: 1000 },
    { rank: 2, name: "Player 2", score: 950 },
    { rank: 3, name: "Player 3", score: 900 },
  ]);

  const games = registry.getAllGames();

  useEffect(() => {
    // Set up keyboard shortcuts
    const handleKeyPress = (e: KeyboardEvent) => {
      const game = games.find((g) => g.metadata.keyboardShortcut === e.key);
      if (game) {
        setSelectedGameId(game.metadata.id);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [games]);

  const handleGameComplete = (gameScore: number) => {
    setTimeout(() => setScore(gameScore), 0);
    // TODO: Update leaderboard
  };

  const selectedGame = games.find((g) => g.metadata.id === selectedGameId);

  // Effekt for å auto-fjerne overlay etter noen sekunder
  useEffect(() => {
    if (score !== null) {
      const timeout = setTimeout(() => setScore(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [score]);

  return (
    <div className={styles.container}>
      {/* Game Selection Sidebar */}
      <div className={styles.sidebar}>
        <h2>Daily Games</h2>
        <div className={styles.gameList}>
          {games.map((game) => (
            <button
              key={game.metadata.id}
              className={`${styles.gameButton} ${
                selectedGameId === game.metadata.id ? styles.selected : ""
              }`}
              onClick={() => setSelectedGameId(game.metadata.id)}
            >
              <span className={styles.gameTitle}>{game.metadata.title}</span>
              {game.metadata.keyboardShortcut && (
                <span className={styles.shortcut}>
                  {game.metadata.keyboardShortcut}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Game Area */}
      <div className={styles.gameArea}>
        {selectedGame ? (
          <div className={styles.gameContainer}>
            <selectedGame.component
              date={new Date()}
              onGameComplete={handleGameComplete}
            />
          </div>
        ) : (
          <div className={styles.placeholder}>
            <h2>Select a game to play</h2>
            <p>Choose from the list on the left or use number keys 1-9</p>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className={styles.leaderboard}>
        <h2>Leaderboard</h2>
        <div className={styles.leaderboardList}>
          {leaderboard.map((entry) => (
            <div key={entry.rank} className={styles.leaderboardEntry}>
              <span className={styles.leaderboardRank}>#{entry.rank}</span>
              <span>{entry.name}</span>
              <span className={styles.leaderboardScore}>{entry.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Score Display */}
      {score !== null && (
        <div
          className={styles.scoreOverlay}
          onClick={() => setScore(null)}
          style={{ cursor: "pointer" }}
        >
          <h2>Game Complete!</h2>
          <p>Score: {score}</p>
        </div>
      )}
    </div>
  );
};
