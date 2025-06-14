import { FC } from "react";
import { gameConfig as connectionsConfig } from "../games/DailyConnections";
import { gameConfig as shapeFitConfig } from "../games/DailyShapeFit";
import { gameConfig as minesweeperConfig } from "../games/DailyMinesweeper";
import { gameConfig as fallingSquareConfig } from "../games/DailyFalling";

export interface DailyGameMetadata {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  icon: string;
  keyboardShortcut?: string;
}

export interface DailyGameProps {
  date: Date;
  onGameComplete: (score: number) => void;
}

export interface DailyGameRegistration {
  metadata: DailyGameMetadata;
  component: FC<DailyGameProps>;
}

// Create the base registry with metadata
const baseRegistry: Record<string, DailyGameRegistration> = {
  connections: {
    metadata: {
      id: "connections",
      title: connectionsConfig.name,
      description: connectionsConfig.description,
      difficulty: "medium",
      icon: connectionsConfig.icon,
      keyboardShortcut: "1",
    },
    component: connectionsConfig.component,
  },
  shapeFit: {
    metadata: {
      id: "shapeFit",
      title: shapeFitConfig.name,
      description: shapeFitConfig.description,
      difficulty: "medium",
      icon: shapeFitConfig.icon,
      keyboardShortcut: "2",
    },
    component: shapeFitConfig.component,
  },
  minesweeper: {
    metadata: {
      id: "minesweeper",
      title: minesweeperConfig.name,
      description: minesweeperConfig.description,
      difficulty: "medium",
      icon: minesweeperConfig.icon,
      keyboardShortcut: "3",
    },
    component: minesweeperConfig.component,
  },
  skier: {
    metadata: {
      id: "skier",
      title: fallingSquareConfig.name,
      description: fallingSquareConfig.description,
      difficulty: "medium",
      icon: fallingSquareConfig.icon,
      keyboardShortcut: "4",
    },
    component: fallingSquareConfig.component,
  },
};

// Export the registry with utility functions
export const registry = {
  ...baseRegistry,

  // Get all registered games
  getAllGames: () => Object.values(baseRegistry),

  // Get a specific game by ID
  getGame: (id: string) => baseRegistry[id],

  // Get all game IDs
  getGameIds: () => Object.keys(baseRegistry),

  // Check if a game exists
  hasGame: (id: string) => id in baseRegistry,
};
