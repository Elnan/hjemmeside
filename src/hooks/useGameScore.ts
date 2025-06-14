import { useState, useCallback, useRef, useEffect } from "react";

const BASE_SCORE = 1000;
const TIME_PENALTY = 10; // Points deducted per second

export const useGameScore = (isGameActive: boolean) => {
  const [finalScore, setFinalScore] = useState<number>(0);
  const startTimeRef = useRef<Date | null>(null);

  // Initialize start time when game becomes active
  useEffect(() => {
    if (isGameActive && !startTimeRef.current) {
      startTimeRef.current = new Date();
    }
  }, [isGameActive]);

  // Calculate current score based on time elapsed
  const calculateCurrentScore = useCallback(() => {
    if (!startTimeRef.current) return BASE_SCORE;

    const timeElapsed = Math.floor(
      (new Date().getTime() - startTimeRef.current.getTime()) / 1000
    );
    return Math.max(0, BASE_SCORE - timeElapsed * TIME_PENALTY);
  }, []);

  // Finalize score when game ends
  const finalizeScore = useCallback(() => {
    const score = calculateCurrentScore();
    setFinalScore(score);
    return score;
  }, [calculateCurrentScore]);

  // Reset scoring
  const resetScore = useCallback(() => {
    startTimeRef.current = null;
    setFinalScore(0);
  }, []);

  return {
    currentScore: finalScore || calculateCurrentScore(),
    finalizeScore,
    resetScore,
  };
};
