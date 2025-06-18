import { FC, useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import styles from "./DailyMinesweeper.module.css";
import { registry, DailyGameProps } from "../registry/DailyGamesRegistry";

// Get today's date in YYYY-MM-DD format for the seed
const getTodaysSeed = () => new Date().toISOString().split("T")[0];

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

interface GameState {
  board: Cell[][];
  mineCount: number;
  gameOver: boolean;
  isWon: boolean;
  startTime: number | null;
  endTime: number | null;
  currentPosition: [number, number];
  hasPlayedToday: boolean;
  todayScore: number | null;
  todayTime: string | null;
}

interface DailyMinesweeperProps {
  onGameComplete?: (score: number) => void;
}

const DIFFICULTY_SETTINGS = {
  easy: { size: 9, mines: 10 },
  medium: { size: 16, mines: 40 },
  hard: { size: 22, mines: 99 },
};

export const DailyMinesweeper: FC<DailyGameProps> = ({ onGameComplete }) => {
  const { user } = useUser();
  const [gameState, setGameState] = useState<GameState>(() => initializeGame());
  const boardRef = useRef<HTMLDivElement>(null);
  const [keyboardActive, setKeyboardActive] = useState(false);

  // Check if the user has already played today
  useEffect(() => {
    const lastPlayedDate = localStorage.getItem("minesweeper_last_played");
    const todaysSeed = getTodaysSeed();

    if (lastPlayedDate === todaysSeed) {
      const score = localStorage.getItem("minesweeper_today_score");
      const time = localStorage.getItem("minesweeper_today_time");

      setGameState((prev) => ({
        ...prev,
        hasPlayedToday: true,
        todayScore: score ? parseInt(score) : null,
        todayTime: time,
      }));
    }
  }, []);

  function initializeGame(): GameState {
    const { size, mines } = DIFFICULTY_SETTINGS["medium"];
    const board = Array(size)
      .fill(null)
      .map(() =>
        Array(size)
          .fill(null)
          .map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            neighborMines: 0,
          }))
      );

    // Use today's date as seed
    const seed = getTodaysSeed();
    const seededRandom = createSeededRandom(seed);
    let remainingMines = mines;

    while (remainingMines > 0) {
      const x = Math.floor(seededRandom() * size);
      const y = Math.floor(seededRandom() * size);

      if (!board[y][x].isMine) {
        board[y][x].isMine = true;
        remainingMines--;
      }
    }

    // Calculate neighbor mines
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (!board[y][x].isMine) {
          board[y][x].neighborMines = countNeighborMines(board, x, y);
        }
      }
    }

    return {
      board,
      mineCount: mines,
      gameOver: false,
      isWon: false,
      startTime: null,
      endTime: null,
      currentPosition: [0, 0],
      hasPlayedToday: false,
      todayScore: null,
      todayTime: null,
    };
  }

  // Auto-focus the board when the game is selected
  useEffect(() => {
    boardRef.current?.focus();
  }, []);

  // Track if keyboard navigation is used
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        [
          "Tab",
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          " ",
          "Enter",
          "f",
          "F",
        ].includes(e.key)
      ) {
        setKeyboardActive(true);
      }
    };
    const handleMouseDown = () => {
      setKeyboardActive(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameOver) return;

      const [currentY, currentX] = gameState.currentPosition;
      const size = gameState.board.length;
      let newX = currentX;
      let newY = currentY;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          newY = Math.max(0, currentY - 1);
          break;
        case "ArrowDown":
          e.preventDefault();
          newY = Math.min(size - 1, currentY + 1);
          break;
        case "ArrowLeft":
          e.preventDefault();
          newX = Math.max(0, currentX - 1);
          break;
        case "ArrowRight":
          e.preventDefault();
          newX = Math.min(size - 1, currentX + 1);
          break;
        case " ":
        case "Enter":
          e.preventDefault();
          handleCellClick(currentX, currentY);
          return;
        case "f":
        case "F":
          e.preventDefault();
          handleRightClick(e, currentX, currentY);
          return;
        default:
          return;
      }

      setGameState((prev) => ({
        ...prev,
        currentPosition: [newY, newX],
      }));
    };

    const board = boardRef.current;
    if (board) {
      board.addEventListener("keydown", handleKeyDown);
      return () => board.removeEventListener("keydown", handleKeyDown);
    }
  }, [gameState.currentPosition, gameState.gameOver]);

  // Focus management
  useEffect(() => {
    if (!gameState.gameOver && keyboardActive) {
      const board = boardRef.current;
      if (board) {
        const buttons = board.querySelectorAll("button");
        const [currentY, currentX] = gameState.currentPosition;
        const size = gameState.board.length;
        const index = currentY * size + currentX;
        buttons[index]?.focus();
      }
    }
  }, [
    gameState.currentPosition,
    gameState.gameOver,
    keyboardActive,
    gameState.board,
  ]);

  function createSeededRandom(seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash = hash & hash;
    }

    return function () {
      hash = (hash * 16807) % 2147483647;
      return (hash - 1) / 2147483646;
    };
  }

  function countNeighborMines(board: Cell[][], x: number, y: number): number {
    let count = 0;
    const size = board.length;

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const newY = y + dy;
        const newX = x + dx;

        if (
          newY >= 0 &&
          newY < size &&
          newX >= 0 &&
          newX < size &&
          board[newY][newX].isMine
        ) {
          count++;
        }
      }
    }

    return count;
  }

  function handleCellClick(x: number, y: number) {
    if (gameState.gameOver || gameState.board[y][x].isFlagged) {
      return;
    }

    if (!gameState.startTime) {
      setGameState((prev) => ({ ...prev, startTime: Date.now() }));
    }

    const newBoard = [...gameState.board.map((row) => [...row])];

    if (newBoard[y][x].isMine) {
      // Game Over
      revealAllMines(newBoard);
      setGameState((prev) => ({
        ...prev,
        board: newBoard,
        gameOver: true,
        endTime: Date.now(),
      }));
      return;
    }

    revealCell(newBoard, x, y);

    // Check for win
    const isWon = checkWinCondition(newBoard);
    if (isWon) {
      const endTime = Date.now();
      const score = calculateScore(gameState.startTime!, endTime);
      setGameState((prev) => ({
        ...prev,
        board: newBoard,
        isWon: true,
        gameOver: true,
        endTime,
      }));
      onGameComplete?.(score);
    } else {
      setGameState((prev) => ({
        ...prev,
        board: newBoard,
      }));
    }
  }

  function handleRightClick(
    e: React.MouseEvent | KeyboardEvent,
    x: number,
    y: number
  ) {
    e.preventDefault();
    if (gameState.gameOver || gameState.board[y][x].isRevealed) {
      return;
    }

    const newBoard = [...gameState.board.map((row) => [...row])];
    newBoard[y][x].isFlagged = !newBoard[y][x].isFlagged;

    setGameState((prev) => ({
      ...prev,
      board: newBoard,
    }));
  }

  function revealCell(board: Cell[][], x: number, y: number) {
    if (
      x < 0 ||
      x >= board.length ||
      y < 0 ||
      y >= board.length ||
      board[y][x].isRevealed ||
      board[y][x].isFlagged
    ) {
      return;
    }

    board[y][x].isRevealed = true;

    if (board[y][x].neighborMines === 0) {
      // Reveal all adjacent cells
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          revealCell(board, x + dx, y + dy);
        }
      }
    }
  }

  function revealAllMines(board: Cell[][]) {
    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell.isMine) {
          cell.isRevealed = true;
        }
      });
    });
  }

  function checkWinCondition(board: Cell[][]): boolean {
    return board.every((row) =>
      row.every((cell) => (cell.isMine ? !cell.isRevealed : cell.isRevealed))
    );
  }

  function calculateScore(startTime: number, endTime: number): number {
    const timeInSeconds = Math.floor((endTime - startTime) / 1000);
    const { size, mines } = DIFFICULTY_SETTINGS["medium"];
    const maxScore = size * size * 10;
    const timeDeduction = Math.floor(timeInSeconds / 10);
    return Math.max(0, maxScore - timeDeduction);
  }

  function getDisplayTime(): string {
    if (!gameState.startTime) return "00:00";
    const endTime = gameState.endTime || Date.now();
    const timeInSeconds = Math.floor((endTime - gameState.startTime) / 1000);
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.mineCount}>💣 {gameState.mineCount}</div>
        <div className={styles.timer}>⏱️ {getDisplayTime()}</div>
      </div>

      <div
        ref={boardRef}
        className={styles.board}
        tabIndex={0}
        role="grid"
        aria-label="Minesweeper board"
      >
        {gameState.board.map((row, y) => (
          <div key={y} className={styles.row} role="row">
            {row.map((cell, x) => {
              const isCurrent =
                keyboardActive &&
                y === gameState.currentPosition[0] &&
                x === gameState.currentPosition[1];
              return (
                <button
                  key={`${x}-${y}`}
                  className={`${styles.cell} ${
                    cell.isRevealed ? styles.revealed : ""
                  } ${cell.isFlagged ? styles.flagged : ""} ${
                    isCurrent ? styles.current : ""
                  }`}
                  onClick={() => handleCellClick(x, y)}
                  onContextMenu={(e) => handleRightClick(e, x, y)}
                  disabled={gameState.gameOver}
                  data-mines={cell.isRevealed ? cell.neighborMines : undefined}
                  aria-label={`Cell at row ${y + 1}, column ${x + 1}${
                    cell.isRevealed
                      ? cell.isMine
                        ? ", mine"
                        : cell.neighborMines > 0
                          ? `, ${cell.neighborMines} nearby mines`
                          : ", empty"
                      : ""
                  }${cell.isFlagged ? ", flagged" : ""}`}
                  tabIndex={keyboardActive && isCurrent ? 0 : -1}
                >
                  {cell.isRevealed
                    ? cell.isMine
                      ? "💥"
                      : cell.neighborMines > 0
                        ? cell.neighborMines
                        : ""
                    : cell.isFlagged
                      ? "🚩"
                      : ""}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {gameState.gameOver && (
        <div className={styles.gameOver}>
          {gameState.isWon ? (
            <div className={styles.victory}>
              <h3>Victory! 🎉</h3>
              <p>Time: {getDisplayTime()}</p>
              <p>
                Score:{" "}
                {calculateScore(gameState.startTime!, gameState.endTime!)}
              </p>
            </div>
          ) : (
            <div className={styles.defeat}>
              <h3>Game Over 💥</h3>
              <p>Better luck next time!</p>
            </div>
          )}
          <button
            className={styles.restartButton}
            onClick={() => setGameState(initializeGame())}
          >
            Play Again
          </button>
        </div>
      )}

      <div className={styles.controls}>
        <h3>Keyboard Controls:</h3>
        <ul>
          <li>
            <kbd>↑</kbd>
            <kbd>↓</kbd>
            <kbd>←</kbd>
            <kbd>→</kbd> Move selection
          </li>
          <li>
            <kbd>Space</kbd> or <kbd>Enter</kbd> Reveal cell
          </li>
          <li>
            <kbd>F</kbd> Flag cell
          </li>
          <li>
            <kbd>1-9</kbd> Switch games
          </li>
        </ul>
      </div>
    </div>
  );
};

// Export game configuration
export const gameConfig = {
  component: DailyMinesweeper,
  name: "Minesweeper",
  description: "Classic minesweeper game",
  icon: "💣",
};
