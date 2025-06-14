import { FC, useEffect, useRef, useState } from "react";
import { DailyGameProps } from "../registry/DailyGamesRegistry";
import styles from "./DailyShapeFit.module.css";

interface Shape {
  points: [number, number][];
  type: string;
}

interface Wall {
  y: number;
  holeShape: Shape;
  speed: number;
}

interface GameState {
  score: number;
  currentWall: Wall | null;
  availableShapes: Shape[];
  selectedShapeIndex: number;
  isGameOver: boolean;
  speed: number;
  hasStarted: boolean;
}

// Basic shapes defined by their points (normalized to 0-1 range)
const SHAPES = {
  square: {
    points: [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ] as [number, number][],
  },
  triangle: {
    points: [
      [0.5, 0],
      [1, 1],
      [0, 1],
    ] as [number, number][],
  },
  circle: {
    points: Array.from({ length: 32 }).map((_, i) => {
      const angle = (i / 32) * Math.PI * 2;
      return [0.5 + Math.cos(angle) * 0.5, 0.5 + Math.sin(angle) * 0.5] as [
        number,
        number,
      ];
    }),
  },
  star: {
    points: Array.from({ length: 10 }).map((_, i) => {
      const angle = (i / 5) * Math.PI * 2;
      const radius = i % 2 === 0 ? 0.5 : 0.25;
      return [
        0.5 + Math.cos(angle) * radius,
        0.5 + Math.sin(angle) * radius,
      ] as [number, number];
    }),
  },
  hexagon: {
    points: Array.from({ length: 6 }).map((_, i) => {
      const angle = (i / 6) * Math.PI * 2;
      return [0.5 + Math.cos(angle) * 0.5, 0.5 + Math.sin(angle) * 0.5] as [
        number,
        number,
      ];
    }),
  },
};

// Adjustments for Decision Line and Initial Speed
const DECISION_LINE = 0.75;
const INITIAL_SPEED = 0.0004;

// Adjustments for canvas dimensions
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 800;

export const DailyShapeFit: FC<DailyGameProps> = ({ onGameComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastUpdateRef = useRef(Date.now());
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    currentWall: null,
    availableShapes: generateShapes(),
    selectedShapeIndex: 0,
    isGameOver: false,
    speed: INITIAL_SPEED,
    hasStarted: false,
  });
  const animationFrameRef = useRef<number>();
  const gameStateRef = useRef(gameState);

  function generateShapes() {
    const shapeKeys = Object.keys(SHAPES) as (keyof typeof SHAPES)[];
    return [0, 1, 2, 3].map((i) => ({
      ...SHAPES[shapeKeys[i]],
      type: shapeKeys[i],
    }));
  }

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  function createWall(): Wall {
    const shapeIndex = Math.floor(
      Math.random() * gameStateRef.current.availableShapes.length
    );
    return {
      y: 0,
      holeShape: gameStateRef.current.availableShapes[shapeIndex],
      speed: gameStateRef.current.speed,
    };
  }

  function checkMatch() {
    const state = gameStateRef.current;
    if (!state.currentWall) return;
    const selectedShape = state.availableShapes[state.selectedShapeIndex];
    const matches = selectedShape.type === state.currentWall.holeShape.type;
    if (matches) {
      // Update score and speed
      setGameState((prev) => ({
        ...prev,
        score: prev.score + 1,
        currentWall: null,
        speed: prev.speed * 1.04,
        availableShapes: prev.availableShapes,
      }));
    } else {
      setGameState((prev) => ({ ...prev, isGameOver: true }));
      onGameComplete?.(state.score);
    }
  }

  // Game loop effect (runs once)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const state = gameStateRef.current;

      if (!state.hasStarted) {
        if (e.key === " " || e.key === "Spacebar") {
          e.preventDefault();
          setGameState((prev) => ({ ...prev, hasStarted: true }));
        }
        return;
      }
      if (state.isGameOver) {
        if (e.key === "Enter") {
          setGameState({
            score: 0,
            currentWall: null,
            availableShapes: generateShapes(),
            selectedShapeIndex: 0,
            isGameOver: false,
            speed: INITIAL_SPEED,
            hasStarted: true,
          });
        }
        return;
      }
      // Velg form med piltast og forhindre scroll
      const keyToIndex: Record<string, number> = {
        ArrowLeft: 0,
        ArrowUp: 1,
        ArrowRight: 2,
        ArrowDown: 3,
      };
      if (keyToIndex[e.key] !== undefined) {
        e.preventDefault();
        setGameState((prev) => ({
          ...prev,
          selectedShapeIndex: keyToIndex[e.key],
        }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    function gameLoop() {
      const state = gameStateRef.current;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const now = Date.now();
      const deltaTime = now - lastUpdateRef.current;
      lastUpdateRef.current = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!state.hasStarted) {
        // Draw start screen
        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw game instructions
        ctx.fillStyle = "#1e293b";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          "Use ← ↑ → ↓ arrow keys to select shapes",
          canvas.width / 2,
          canvas.height / 2 - 40
        );
        ctx.fillText(
          "Match the shape with the hole before it reaches the line",
          canvas.width / 2,
          canvas.height / 2
        );

        animationFrameRef.current = requestAnimationFrame(gameLoop);
        return;
      }
      if (state.isGameOver) {
        // Draw game over screen
        ctx.fillStyle = "rgba(30, 41, 59, 0.9)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 48px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);

        ctx.font = "32px Arial";
        ctx.fillText(
          `Final Score: ${state.score}`,
          canvas.width / 2,
          canvas.height / 2 + 60
        );

        ctx.font = "24px Arial";
        ctx.fillText(
          "Press Enter to restart",
          canvas.width / 2,
          canvas.height / 2 + 120
        );

        animationFrameRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      // Draw decision line
      ctx.strokeStyle = "#e2e8f0";
      ctx.setLineDash([10, 10]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * DECISION_LINE);
      ctx.lineTo(canvas.width, canvas.height * DECISION_LINE);
      ctx.stroke();
      ctx.setLineDash([]);

      // Update and draw current wall
      if (state.currentWall) {
        const wall = state.currentWall;
        const newY = wall.y + deltaTime * wall.speed;

        // Check if wall has passed decision line
        if (newY >= DECISION_LINE) {
          checkMatch();
        } else {
          // Only update wall position, not whole gameState
          setGameState((prev) => ({
            ...prev,
            currentWall: { ...wall, y: newY },
          }));
        }

        // Draw wall
        const wallHeight = canvas.height * 0.15;
        const y = wall.y * canvas.height;

        // Draw wall background with gradient
        const gradient = ctx.createLinearGradient(
          0,
          y - wallHeight / 2,
          0,
          y + wallHeight / 2
        );
        gradient.addColorStop(0, "#1e293b");
        gradient.addColorStop(1, "#334155");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, y - wallHeight / 2, canvas.width, wallHeight);

        // Draw hole
        ctx.save();
        ctx.translate(canvas.width / 2, y);

        ctx.strokeStyle = "#94a3b8";
        ctx.fillStyle = "#1e293b";
        ctx.lineWidth = 3;
        ctx.beginPath();
        wall.holeShape.points.forEach((point, i) => {
          const [x, y] = point;
          const scaledX = (x - 0.5) * wallHeight;
          const scaledY = (y - 0.5) * wallHeight;
          if (i === 0) ctx.moveTo(scaledX, scaledY);
          else ctx.lineTo(scaledX, scaledY);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      } else {
        // Create new wall if none exists
        setGameState((prev) => ({
          ...prev,
          currentWall: createWall(),
        }));
      }

      // Draw available shapes at bottom
      const shapeSize = canvas.height * 0.1;
      const spacing = canvas.width / 5;
      const arrowLabels = ["←", "↑", "→", "↓"];
      state.availableShapes.forEach((shape, i) => {
        const x = spacing * (i + 1);
        const y = canvas.height - shapeSize - 40;

        // Draw selection box
        if (i === state.selectedShapeIndex) {
          // Draw highlight
          ctx.fillStyle = "#3b82f6";
          ctx.globalAlpha = 0.1;
          ctx.fillRect(
            x - shapeSize * 0.7,
            y - shapeSize * 0.7,
            shapeSize * 1.4,
            shapeSize * 1.4
          );
          ctx.globalAlpha = 1;

          // Draw selection box
          ctx.strokeStyle = "#3b82f6";
          ctx.lineWidth = 2;
          ctx.strokeRect(
            x - shapeSize * 0.7,
            y - shapeSize * 0.7,
            shapeSize * 1.4,
            shapeSize * 1.4
          );
        }

        // Draw shape
        ctx.save();
        ctx.translate(x, y);

        ctx.strokeStyle =
          i === state.selectedShapeIndex ? "#3b82f6" : "#64748b";
        ctx.fillStyle = i === state.selectedShapeIndex ? "#bfdbfe" : "#f1f5f9";
        ctx.lineWidth = 2;
        ctx.beginPath();
        shape.points.forEach((point, j) => {
          const [px, py] = point;
          const scaledX = (px - 0.5) * shapeSize;
          const scaledY = (py - 0.5) * shapeSize;
          if (j === 0) ctx.moveTo(scaledX, scaledY);
          else ctx.lineTo(scaledX, scaledY);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Draw arrow under each shape
        ctx.save();
        ctx.font = "bold 24px Arial";
        ctx.fillStyle = i === state.selectedShapeIndex ? "#222" : "#888";
        ctx.textAlign = "center";
        ctx.fillText(arrowLabels[i], x, y + shapeSize * 1.04); // Arrow Distance from Shape
        ctx.restore();
      });

      // Draw score Top Left
      ctx.save();
      ctx.font = "bold 28px Arial";
      ctx.fillStyle = "#222";
      ctx.textAlign = "left";
      ctx.fillText(`Score: ${state.score}`, 24, 40);
      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
    gameLoop();
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleStartClick = () => {
    setGameState((prev) => ({ ...prev, hasStarted: true }));
  };

  return (
    <div
      className={styles.gameContainer}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />

      {!gameState.hasStarted && (
        <button className={styles.startButton} onClick={handleStartClick}>
          Start Game (Space)
        </button>
      )}
    </div>
  );
};

// Export game configuration
export const gameConfig = {
  component: DailyShapeFit,
  name: "Shape Fit",
  description: "Fit shapes into a grid",
  icon: "🔲",
};
