import { useState, useCallback, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export interface League {
  id: string;
  name: string;
}

export interface LeagueScore {
  leagueId: string;
  gameId: string;
  score: number;
}

export const useLeagues = () => {
  const { user, isSignedIn } = useUser();
  const [userLeagues, setUserLeagues] = useState<League[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showScoreSubmitted, setShowScoreSubmitted] = useState(false);

  // Fetch user's leagues
  const fetchUserLeagues = useCallback(async () => {
    if (!isSignedIn) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/leagues");
      if (!response.ok) throw new Error("Failed to fetch leagues");
      const data = await response.json();
      setUserLeagues(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leagues");
      console.error("Failed to load leagues:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn]);

  // Submit score to all user's leagues
  const submitScore = useCallback(
    async (gameId: string, score: number) => {
      if (!isSignedIn || !user || userLeagues.length === 0) return;

      try {
        setIsSubmitting(true);
        setError(null);

        // Submit score to each league the user is part of
        const submissions = userLeagues.map((league) =>
          fetch("/api/leagues/scores", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              leagueId: league.id,
              gameId,
              score,
            }),
          })
        );

        await Promise.all(submissions);
        setShowScoreSubmitted(true);
        setTimeout(() => setShowScoreSubmitted(false), 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to submit score");
        console.error("Failed to submit score:", err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSignedIn, user, userLeagues]
  );

  // Load leagues when user signs in
  useEffect(() => {
    if (isSignedIn) {
      fetchUserLeagues();
    } else {
      setUserLeagues([]);
    }
  }, [isSignedIn, fetchUserLeagues]);

  return {
    userLeagues,
    isLoading,
    error,
    isSubmitting,
    showScoreSubmitted,
    submitScore,
    refetchLeagues: fetchUserLeagues,
  };
};
