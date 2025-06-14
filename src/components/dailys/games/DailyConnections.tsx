import { FC, useState, useEffect, useRef } from "react";
import { DailyGameProps } from "../registry/DailyGamesRegistry";
import styles from "./DailyConnections.module.css";
import { WordGroup } from "./connections/types";
import { getDailyGroups } from "./connections/dailyGroups";

const MAX_MISTAKES = 4;
const ANIMATION_DURATION = 500; // 500ms for the animation

// Fallback groups in case daily groups fail to load
const FALLBACK_GROUPS: WordGroup[] = [
  {
    id: 1,
    category: "COLORS",
    words: ["RED", "BLUE", "GREEN", "YELLOW"],
    color: "#2563eb",
    difficulty: "easy",
  },
  {
    id: 2,
    category: "ANIMALS",
    words: ["LION", "TIGER", "BEAR", "WOLF"],
    color: "#16a34a",
    difficulty: "medium",
  },
  {
    id: 3,
    category: "FRUITS",
    words: ["APPLE", "BANANA", "ORANGE", "GRAPE"],
    color: "#ca8a04",
    difficulty: "hard",
  },
  {
    id: 4,
    category: "ELEMENTS",
    words: ["WATER", "EARTH", "FIRE", "AIR"],
    color: "#dc2626",
    difficulty: "very hard",
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const DailyConnections: FC<DailyGameProps> = ({ onGameComplete }) => {
  const [error, setError] = useState<string | null>(null);
  const [removingWords, setRemovingWords] = useState<string[]>([]);
  const [gameState, setGameState] = useState<{
    wordGroups: WordGroup[];
    shuffledWords: string[];
    selectedWords: string[];
    foundGroups: WordGroup[];
    mistakes: number;
    isGameOver: boolean;
    focusedWordIndex: number;
  }>(() => {
    try {
      const dailyGroups = getDailyGroups();
      const shuffled = shuffleArray(
        dailyGroups.flatMap((group) => group.words)
      );
      return {
        wordGroups: dailyGroups,
        shuffledWords: shuffled,
        selectedWords: [],
        foundGroups: [],
        mistakes: 0,
        isGameOver: false,
        focusedWordIndex: 0,
      };
    } catch (error) {
      console.error("Failed to load daily groups:", error);
      // Use fallback groups but show an error message
      const shuffled = shuffleArray(
        FALLBACK_GROUPS.flatMap((group) => group.words)
      );
      setError("Could not load today's puzzle. Using a backup puzzle instead.");
      return {
        wordGroups: FALLBACK_GROUPS,
        shuffledWords: shuffled,
        selectedWords: [],
        foundGroups: [],
        mistakes: 0,
        isGameOver: false,
        focusedWordIndex: 0,
      };
    }
  });

  const gridRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation
  useEffect(() => {
    if (gameState.isGameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        // Get the currently focused word
        const focusedWord = gameState.shuffledWords[gameState.focusedWordIndex];
        if (focusedWord) {
          const isFound = gameState.foundGroups.some((group) =>
            group.words.includes(focusedWord)
          );
          if (!isFound) {
            handleWordClick(focusedWord);
          }
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (gameState.selectedWords.length === 4) {
          handleSubmit();
        }
      } else if (e.key === "Tab" && e.shiftKey) {
        e.preventDefault();
        moveFocus("backward");
      } else if (e.key === "Tab") {
        e.preventDefault();
        moveFocus("forward");
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        moveFocus("backward");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        moveFocus("forward");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        moveFocus("up");
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        moveFocus("down");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    gameState.isGameOver,
    gameState.shuffledWords,
    gameState.foundGroups,
    gameState.focusedWordIndex,
    gameState.selectedWords,
  ]);

  // Helper function to move focus to the next available word
  const moveFocus = (direction: "forward" | "backward" | "up" | "down") => {
    const GRID_WIDTH = 4;
    const GRID_HEIGHT = 4;
    const TOTAL_CELLS = GRID_WIDTH * GRID_HEIGHT;

    // Get the visible words (words that haven't been found yet)
    const visibleWords = gameState.shuffledWords.filter(
      (word) =>
        !gameState.foundGroups.some((group) => group.words.includes(word))
    );

    // Find the current word and its position in the visible grid
    const currentWord = gameState.shuffledWords[gameState.focusedWordIndex];
    const visibleIndex = visibleWords.indexOf(currentWord);

    // Calculate current position in the visible grid
    const visibleRow = Math.floor(visibleIndex / GRID_WIDTH);
    const visibleCol = visibleIndex % GRID_WIDTH;

    // Calculate new position
    let newVisibleRow = visibleRow;
    let newVisibleCol = visibleCol;
    let newVisibleIndex = visibleIndex;

    switch (direction) {
      case "up":
        newVisibleRow =
          (visibleRow - 1 + Math.ceil(visibleWords.length / GRID_WIDTH)) %
          Math.ceil(visibleWords.length / GRID_WIDTH);
        newVisibleIndex =
          (newVisibleRow * GRID_WIDTH + visibleCol) % visibleWords.length;
        break;
      case "down":
        newVisibleRow =
          (visibleRow + 1) % Math.ceil(visibleWords.length / GRID_WIDTH);
        newVisibleIndex =
          (newVisibleRow * GRID_WIDTH + visibleCol) % visibleWords.length;
        break;
      case "forward":
        newVisibleIndex = (visibleIndex + 1) % visibleWords.length;
        break;
      case "backward":
        newVisibleIndex =
          (visibleIndex - 1 + visibleWords.length) % visibleWords.length;
        break;
    }

    // Get the word at the new position
    const newWord = visibleWords[newVisibleIndex];

    // Find this word's index in the original shuffledWords array
    const newIndex = gameState.shuffledWords.indexOf(newWord);

    // Update focus
    setGameState((prev) => ({
      ...prev,
      focusedWordIndex: newIndex,
    }));

    // Ensure the new focused element gets focus in the DOM
    requestAnimationFrame(() => {
      const buttons = gridRef.current?.querySelectorAll("button");
      if (buttons) {
        // Find the button that corresponds to our target word
        const buttonToFocus = Array.from(buttons).find(
          (button) => button.textContent === newWord
        );
        buttonToFocus?.focus();
      }
    });
  };

  // Focus management
  useEffect(() => {
    if (!gameState.isGameOver) {
      const buttons = gridRef.current?.querySelectorAll("button");
      if (buttons) {
        buttons[gameState.focusedWordIndex]?.focus();
      }
    }
  }, [gameState.focusedWordIndex, gameState.isGameOver]);

  const handleWordClick = (word: string) => {
    if (gameState.isGameOver) return;

    setGameState((prev) => {
      const isSelected = prev.selectedWords.includes(word);
      let newSelectedWords: string[];

      if (isSelected) {
        newSelectedWords = prev.selectedWords.filter((w) => w !== word);
      } else if (prev.selectedWords.length < 4) {
        newSelectedWords = [...prev.selectedWords, word];
      } else {
        return prev;
      }

      return {
        ...prev,
        selectedWords: newSelectedWords,
      };
    });
  };

  const handleSubmit = () => {
    if (gameState.selectedWords.length !== 4) return;

    const selectedSet = new Set(gameState.selectedWords);
    const matchingGroup = gameState.wordGroups.find(
      (group) =>
        group.words.every((word) => selectedSet.has(word)) &&
        !gameState.foundGroups.includes(group)
    );

    if (matchingGroup) {
      // Start removal animation
      setRemovingWords(matchingGroup.words);

      // Wait for animation to complete before updating state
      setTimeout(() => {
        const newFoundGroups = [...gameState.foundGroups, matchingGroup];
        const isGameWon = newFoundGroups.length === gameState.wordGroups.length;

        setGameState((prev) => ({
          ...prev,
          foundGroups: newFoundGroups,
          selectedWords: [],
          isGameOver: isGameWon,
          // Update focusedWordIndex to the first non-found word
          focusedWordIndex: prev.shuffledWords.findIndex(
            (word) =>
              !newFoundGroups.some((group) => group.words.includes(word))
          ),
        }));

        setRemovingWords([]);

        if (isGameWon) {
          onGameComplete?.(calculateScore(gameState.mistakes));
        }
      }, ANIMATION_DURATION);
    } else {
      const newMistakes = gameState.mistakes + 1;
      setGameState((prev) => ({
        ...prev,
        mistakes: newMistakes,
        selectedWords: [],
        isGameOver: newMistakes >= MAX_MISTAKES,
      }));

      if (newMistakes >= MAX_MISTAKES) {
        onGameComplete?.(0);
      }
    }
  };

  const calculateScore = (mistakes: number): number => {
    // Base score 1000, subtract 200 per mistake
    return Math.max(1000 - mistakes * 200, 0);
  };

  if (!gameState.isGameOver) {
    return (
      <div className={styles.container}>
        <div className={styles.gameContent}>
          {/* Found groups */}
          <div
            className={styles.foundGroups}
            role="log"
            aria-label="Found word groups"
          >
            {gameState.foundGroups.map((group) => (
              <div
                key={group.id}
                className={styles.foundGroup}
                style={{ backgroundColor: group.color }}
              >
                <div className={styles.category}>{group.category}</div>
                <div className={styles.words}>
                  {group.words.map((word) => (
                    <span key={word} className={styles.word}>
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Word grid */}
          <div
            ref={gridRef}
            className={styles.wordGrid}
            role="grid"
            aria-label="Word selection grid"
          >
            {gameState.shuffledWords.map((word, index) => {
              const isSelected = gameState.selectedWords.includes(word);
              const isFound = gameState.foundGroups.some((group) =>
                group.words.includes(word)
              );
              const isFocused = index === gameState.focusedWordIndex;
              const isRemoving = removingWords.includes(word);

              if (isFound && !isRemoving) return null;

              return (
                <button
                  key={word}
                  className={`${styles.wordButton} 
                    ${isSelected ? styles.selected : ""} 
                    ${isFound ? styles.found : ""} 
                    ${isFocused ? styles.focused : ""} 
                    ${isRemoving ? styles.removing : ""}`}
                  onClick={() => handleWordClick(word)}
                  disabled={isFound || gameState.isGameOver}
                  aria-pressed={isSelected}
                  aria-disabled={isFound || gameState.isGameOver}
                  tabIndex={isFocused ? 0 : -1}
                >
                  {word}
                </button>
              );
            })}
          </div>

          {/* Submit button */}
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={
              gameState.selectedWords.length !== 4 || gameState.isGameOver
            }
            aria-label="Submit selected words"
          >
            Submit
          </button>

          {/* Instructions and mistakes counter */}
          <div className={styles.gameInfo}>
            <div className={styles.instructions}>
              <p>Find groups of four words that share a common theme.</p>
              <p>Categories range from easy (blue) to very hard (red)</p>
              <br />
              <p>
                Select words by clicking or using the spacebar. Press Enter to
                submit your selection.{" "}
              </p>
              {error && <p className={styles.errorMessage}>{error}</p>}
            </div>

            <div
              className={styles.mistakesCounter}
              role="status"
              aria-live="polite"
            >
              Mistakes: {gameState.mistakes} / {MAX_MISTAKES}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.gameContent}>
        {/* Found groups */}
        <div
          className={styles.foundGroups}
          role="log"
          aria-label="Found word groups"
        >
          {gameState.foundGroups.map((group) => (
            <div
              key={group.id}
              className={styles.foundGroup}
              style={{ backgroundColor: group.color }}
            >
              <div className={styles.category}>{group.category}</div>
              <div className={styles.words}>
                {group.words.map((word) => (
                  <span key={word} className={styles.word}>
                    {word}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Word grid */}
        <div
          ref={gridRef}
          className={styles.wordGrid}
          role="grid"
          aria-label="Word selection grid"
        >
          {gameState.shuffledWords.map((word, index) => {
            const isSelected = gameState.selectedWords.includes(word);
            const isFound = gameState.foundGroups.some((group) =>
              group.words.includes(word)
            );
            const isFocused = index === gameState.focusedWordIndex;
            const isRemoving = removingWords.includes(word);

            if (isFound && !isRemoving) return null;

            return (
              <button
                key={word}
                className={`${styles.wordButton} 
                  ${isSelected ? styles.selected : ""} 
                  ${isFound ? styles.found : ""} 
                  ${isFocused ? styles.focused : ""} 
                  ${isRemoving ? styles.removing : ""}`}
                onClick={() => handleWordClick(word)}
                disabled={isFound || gameState.isGameOver}
                aria-pressed={isSelected}
                aria-disabled={isFound || gameState.isGameOver}
                tabIndex={isFocused ? 0 : -1}
              >
                {word}
              </button>
            );
          })}
        </div>

        {/* Submit button */}
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={
            gameState.selectedWords.length !== 4 || gameState.isGameOver
          }
          aria-label="Submit selected words"
        >
          Submit
        </button>

        {/* Instructions and mistakes counter */}
        <div className={styles.gameInfo}>
          <div className={styles.instructions}>
            <p>Find groups of four words that share a common theme.</p>
            <p>Categories range from easy (blue) to very hard (red)</p>
            {error && <p className={styles.errorMessage}>{error}</p>}
          </div>

          <div
            className={styles.mistakesCounter}
            role="status"
            aria-live="polite"
          >
            Mistakes: {gameState.mistakes} / {MAX_MISTAKES}
          </div>
        </div>

        {/* Game over state */}
        {gameState.isGameOver && (
          <div className={styles.gameOver}>
            <h2>
              {gameState.foundGroups.length === gameState.wordGroups.length
                ? "Congratulations! 🎉"
                : "Game Over"}
            </h2>
            <p>
              {gameState.foundGroups.length === gameState.wordGroups.length
                ? `Score: ${calculateScore(gameState.mistakes)}`
                : "Better luck next time!"}
            </p>
            {/* Show remaining groups if player lost */}
            {gameState.foundGroups.length !== gameState.wordGroups.length && (
              <div className={styles.remainingGroups}>
                <h3>Remaining Groups:</h3>
                {gameState.wordGroups
                  .filter((group) => !gameState.foundGroups.includes(group))
                  .map((group) => (
                    <div
                      key={group.id}
                      className={styles.foundGroup}
                      style={{ backgroundColor: group.color }}
                    >
                      <div className={styles.category}>{group.category}</div>
                      <div className={styles.words}>
                        {group.words.map((word) => (
                          <span key={word} className={styles.word}>
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Export game configuration separately
export const gameConfig = {
  component: DailyConnections,
  name: "Connections",
  description: "Group words by their hidden connections",
  icon: "🔤",
};
