import { WordGroup } from "./types";

const DIFFICULTY_COLORS = {
  easy: "#2563eb", // Blue
  medium: "#16a34a", // Green
  hard: "#ca8a04", // Yellow
  "very hard": "#dc2626", // Red
};

export const WORD_GROUPS: WordGroup[] = [
  // Easy (Blue) Groups
  {
    id: 1,
    category: "BIRDS OF PREY",
    words: ["EAGLE", "HAWK", "OWL", "FALCON"],
    color: DIFFICULTY_COLORS.easy,
    difficulty: "easy",
  },
  {
    id: 2,
    category: "WEATHER CONDITIONS",
    words: ["SUNNY", "CLOUDY", "RAINY", "FOGGY"],
    color: DIFFICULTY_COLORS.easy,
    difficulty: "easy",
  },
  {
    id: 3,
    category: "PRIMARY COLORS",
    words: ["RED", "BLUE", "YELLOW", "GREEN"],
    color: DIFFICULTY_COLORS.easy,
    difficulty: "easy",
  },
  {
    id: 4,
    category: "SEASONS",
    words: ["WINTER", "SPRING", "SUMMER", "FALL"],
    color: DIFFICULTY_COLORS.easy,
    difficulty: "easy",
  },

  // Medium (Green) Groups
  {
    id: 5,
    category: "CARD GAMES",
    words: ["POKER", "BRIDGE", "HEARTS", "SOLITAIRE"],
    color: DIFFICULTY_COLORS.medium,
    difficulty: "medium",
  },
  {
    id: 6,
    category: "COMPUTER PARTS",
    words: ["MOUSE", "KEYBOARD", "MONITOR", "PRINTER"],
    color: DIFFICULTY_COLORS.medium,
    difficulty: "medium",
  },
  {
    id: 7,
    category: "KITCHEN APPLIANCES",
    words: ["TOASTER", "BLENDER", "MICROWAVE", "MIXER"],
    color: DIFFICULTY_COLORS.medium,
    difficulty: "medium",
  },
  {
    id: 8,
    category: "SCHOOL SUBJECTS",
    words: ["MATH", "SCIENCE", "HISTORY", "ENGLISH"],
    color: DIFFICULTY_COLORS.medium,
    difficulty: "medium",
  },

  // Hard (Yellow) Groups
  {
    id: 9,
    category: "GREEK LETTERS",
    words: ["ALPHA", "DELTA", "OMEGA", "SIGMA"],
    color: DIFFICULTY_COLORS.hard,
    difficulty: "hard",
  },
  {
    id: 10,
    category: "TYPES OF DOCTORS",
    words: ["PEDIATRICIAN", "CARDIOLOGIST", "NEUROLOGIST", "DERMATOLOGIST"],
    color: DIFFICULTY_COLORS.hard,
    difficulty: "hard",
  },
  {
    id: 11,
    category: "SHAKESPEARE PLAYS",
    words: ["HAMLET", "MACBETH", "OTHELLO", "ROMEO"],
    color: DIFFICULTY_COLORS.hard,
    difficulty: "hard",
  },
  {
    id: 12,
    category: "CHEMICAL ELEMENTS",
    words: ["HYDROGEN", "HELIUM", "LITHIUM", "CARBON"],
    color: DIFFICULTY_COLORS.hard,
    difficulty: "hard",
  },

  // Very Hard (Red) Groups
  {
    id: 13,
    category: "WORDS ENDING IN 'OLOGY'",
    words: ["BIOLOGY", "PSYCHOLOGY", "SOCIOLOGY", "GEOLOGY"],
    color: DIFFICULTY_COLORS["very hard"],
    difficulty: "very hard",
  },
  {
    id: 14,
    category: "WORDS WITH 'MINI' PREFIX",
    words: ["MINIATURE", "MINIMAL", "MINIVAN", "MINIBAR"],
    color: DIFFICULTY_COLORS["very hard"],
    difficulty: "very hard",
  },
  {
    id: 15,
    category: "WORDS CONTAINING COLORS",
    words: ["BLUEPRINT", "REDHEAD", "BLACKMAIL", "GREENHORN"],
    color: DIFFICULTY_COLORS["very hard"],
    difficulty: "very hard",
  },
  {
    id: 16,
    category: "WORDS THAT CAN PRECEDE 'WATER'",
    words: ["SALT", "FRESH", "DEEP", "HOLY"],
    color: DIFFICULTY_COLORS["very hard"],
    difficulty: "very hard",
  },
];
