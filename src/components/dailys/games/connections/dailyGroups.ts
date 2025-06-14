import { WordGroup } from "./types";
import { WORD_GROUPS } from "./wordGroups";

function getTodaysSeed(): string {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function seededRandom(seed: string): () => number {
  let state = Array.from(seed).reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) >>> 0;
  }, 0);

  return () => {
    state = (state * 1597 + 51749) % 244944;
    return state / 244944;
  };
}

function shuffleArray<T>(array: T[], random: () => number): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getDailyGroups(): WordGroup[] {
  const seed = getTodaysSeed();
  const random = seededRandom(seed);

  // Group words by difficulty
  const groupsByDifficulty = WORD_GROUPS.reduce((acc, group) => {
    if (!acc[group.difficulty]) {
      acc[group.difficulty] = [];
    }
    acc[group.difficulty].push(group);
    return acc;
  }, {} as Record<string, WordGroup[]>);

  // Validate we have enough groups for each difficulty
  const difficulties = ["easy", "medium", "hard", "very hard"] as const;
  difficulties.forEach((difficulty) => {
    const groups = groupsByDifficulty[difficulty];
    if (!groups || groups.length === 0) {
      throw new Error(`No word groups found for difficulty: ${difficulty}`);
    }
  });

  // Select one group from each difficulty level
  const selectedGroups = difficulties.map((difficulty) => {
    const availableGroups = groupsByDifficulty[difficulty];
    const index = Math.floor(random() * availableGroups.length);
    return availableGroups[index];
  });

  // Validate we have exactly 4 groups
  if (selectedGroups.length !== 4) {
    throw new Error(`Expected 4 groups but got ${selectedGroups.length}`);
  }

  // Shuffle the selected groups
  return shuffleArray(selectedGroups, random);
}
