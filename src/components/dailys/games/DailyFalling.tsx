import { FC, useEffect, useRef, useState } from "react";
import { DailyGameProps } from "../registry/DailyGamesRegistry";
import styles from "./DailyFalling.module.css";

interface GameObject {
  type: "tree" | "stone" | "log" | "mountain" | "pass" | "jump" | "yeti";
  x: number;
  y: number;
  width: number;
  height: number;
}

interface GameState {
  playerX: number;
  playerY: number;
  speed: number;
  distance: number;
  obstacles: GameObject[];
  isGameOver: boolean;
  yetiChance: number;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 30;
const INITIAL_SPEED = 5; // øk startfart
const SPEED_INCREMENT = 0.002; // øk akselerasjon
const MOVEMENT_SPEED = 7; // gjør spilleren raskere

export const FallingSquare: FC<DailyGameProps> = ({ onGameComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    playerX: CANVAS_WIDTH / 2,
    playerY: CANVAS_HEIGHT / 4,
    speed: INITIAL_SPEED,
    distance: 0,
    obstacles: [],
    isGameOver: false,
    yetiChance: 0,
  });
  const animationFrameRef = useRef<number>();
  const keysPressed = useRef<Set<string>>(new Set());

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle keyboard input
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState.isGameOver) return;

    const generateObstacle = () => {
      const types: GameObject["type"][] = [
        "tree",
        "stone",
        "log",
        "mountain",
        "pass",
        "jump",
      ];
      const type = types[Math.floor(Math.random() * types.length)];

      // Øk sannsynlighet for obstacle
      if (Math.random() < 0.03 + gameState.speed * 0.003) {
        if (Math.random() < gameState.yetiChance) {
          return {
            type: "yeti" as const,
            x: Math.random() * (CANVAS_WIDTH - 40),
            y: CANVAS_HEIGHT,
            width: 40,
            height: 60,
          };
        }
        return {
          type: type as GameObject["type"],
          x: Math.random() * (CANVAS_WIDTH - 30),
          y: CANVAS_HEIGHT,
          width: type === "mountain" ? 100 : 30,
          height: type === "mountain" ? 80 : 30,
        };
      }
      return null;
    };

    const gameLoop = () => {
      setGameState((prevState) => {
        if (prevState.isGameOver) return prevState;

        // Update player position based on input
        let newX = prevState.playerX;
        if (keysPressed.current.has("ArrowLeft")) {
          newX = Math.max(0, prevState.playerX - MOVEMENT_SPEED);
        }
        if (keysPressed.current.has("ArrowRight")) {
          newX = Math.min(
            CANVAS_WIDTH - PLAYER_WIDTH,
            prevState.playerX + MOVEMENT_SPEED
          );
        }

        // Update speed and distance
        const newSpeed = prevState.speed + SPEED_INCREMENT;
        const newDistance = prevState.distance + newSpeed;

        // Generate new obstacles
        const newObstacles = [...prevState.obstacles];
        const newObstacle = generateObstacle();
        if (newObstacle) {
          newObstacles.push(newObstacle);
        }

        // Update obstacles positions and remove off-screen ones
        const updatedObstacles = newObstacles
          .map((obs) => ({ ...obs, y: obs.y - newSpeed * 2 }))
          .filter((obs) => obs.y + obs.height > 0);

        // Check collisions
        const playerHitbox = {
          x: newX,
          y: prevState.playerY,
          width: PLAYER_WIDTH,
          height: PLAYER_HEIGHT,
        };

        const collision = updatedObstacles.some(
          (obs) =>
            newX < obs.x + obs.width &&
            newX + PLAYER_WIDTH > obs.x &&
            prevState.playerY < obs.y + obs.height &&
            prevState.playerY + PLAYER_HEIGHT > obs.y
        );

        if (collision) {
          onGameComplete?.(Math.floor(newDistance));
          return { ...prevState, isGameOver: true };
        }

        return {
          ...prevState,
          playerX: newX,
          speed: newSpeed,
          distance: newDistance,
          obstacles: updatedObstacles,
          yetiChance: Math.min(0.001 + newDistance / 100000, 0.01),
        };
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.isGameOver, onGameComplete]);

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw snow background
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw obstacles
    gameState.obstacles.forEach((obstacle) => {
      switch (obstacle.type) {
        case "tree":
          ctx.fillStyle = "#2d5a27";
          break;
        case "stone":
          ctx.fillStyle = "#666";
          break;
        case "log":
          ctx.fillStyle = "#8b4513";
          break;
        case "mountain":
          ctx.fillStyle = "#666";
          break;
        case "pass":
          ctx.fillStyle = "#444";
          break;
        case "jump":
          ctx.fillStyle = "#fff";
          ctx.strokeStyle = "#666";
          break;
        case "yeti":
          ctx.fillStyle = "#fff";
          break;
      }
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      if (obstacle.type === "jump") {
        ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      }
    });

    // Draw player
    ctx.fillStyle = "#00f";
    ctx.fillRect(
      gameState.playerX,
      gameState.playerY,
      PLAYER_WIDTH,
      PLAYER_HEIGHT
    );

    // Draw score
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText(`Distance: ${Math.floor(gameState.distance)}m`, 10, 30);
    ctx.fillText(`Speed: ${gameState.speed.toFixed(1)}x`, 10, 60);

    if (gameState.isGameOver) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = "#fff";
      ctx.font = "48px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Game Over!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.font = "24px Arial";
      ctx.fillText(
        `Final Distance: ${Math.floor(gameState.distance)}m`,
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2 + 40
      );
    }
  }, [gameState]);

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className={styles.canvas}
        tabIndex={0}
      />
      <div className={styles.controls}>
        <p>Use ← → arrow keys to move</p>
        <p>Avoid obstacles and survive as long as possible!</p>
        <p>Watch out for the Yeti...</p>
      </div>
    </div>
  );
};

// Export game configuration
export const gameConfig = {
  component: FallingSquare,
  name: "Falling Square",
  description: "Navigate through obstacles as a falling square.",
  icon: "⬛",
};
