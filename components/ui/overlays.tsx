"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store";
import {
  RotateCcw,
  Home,
  ArrowRight,
  Trophy,
  Skull,
  Volume2,
  ArrowLeft,
} from "lucide-react";

export function GameOverOverlay() {
  const { gameState, setGameState, resetGame, kills, level, money } =
    useGameStore();

  if (gameState !== "gameover") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Blood vignette effect */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-red-950/50 to-background" />
        <div className="absolute inset-0 bg-black/60" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-center"
        >
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="mb-8"
          >
            <Skull className="w-24 h-24 mx-auto text-destructive mb-4" />
            <h1 className="text-6xl font-black uppercase tracking-tighter text-destructive text-glow">
              Game Over
            </h1>
          </motion.div>

          <div className="glass rounded-2xl p-8 mb-8 max-w-md mx-auto">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-accent">{kills}</div>
                <div className="text-sm text-muted-foreground">Kills</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary">{level}</div>
                <div className="text-sm text-muted-foreground">Level</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-500">
                  ${money}
                </div>
                <div className="text-sm text-muted-foreground">Money</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                resetGame();
                setGameState("playing");
              }}
              className="btn-primary flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                resetGame();
              }}
              className="btn-ghost flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Main Menu
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function LevelCompleteOverlay() {
  const { gameState, setGameState, nextLevel, kills, level, money } =
    useGameStore();

  if (gameState !== "levelComplete") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-gradient-radial from-secondary/20 via-background/90 to-background" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-center"
        >
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="mb-8"
          >
            <Trophy className="w-24 h-24 mx-auto text-accent mb-4" />
            <h1 className="text-5xl font-black uppercase tracking-tighter">
              Level <span className="text-secondary">{level}</span> Complete!
            </h1>
          </motion.div>

          <div className="glass rounded-2xl p-8 mb-8 max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-accent">{kills}</div>
                <div className="text-sm text-muted-foreground">Total Kills</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-500">
                  ${money}
                </div>
                <div className="text-sm text-muted-foreground">Money</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGameState("shop")}
              className="btn-secondary flex items-center gap-2"
            >
              Visit Shop
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextLevel}
              className="btn-primary flex items-center gap-2"
            >
              Next Level
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function InstructionsOverlay() {
  const { gameState, setGameState } = useGameStore();

  if (gameState !== "instructions") return null;

  const controls = [
    { key: "W A S D", action: "Move" },
    { key: "Mouse", action: "Look around" },
    { key: "Left Click", action: "Shoot" },
    { key: "Shift", action: "Sprint" },
    { key: "Space", action: "Prime grenade" },
    { key: "H", action: "Use health pack" },
    { key: "Enter", action: "Open shop" },
    { key: "Escape", action: "Pause / Close menu" },
    { key: "1-6", action: "Quick weapon switch" },
    { key: "M", action: "Toggle mute" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-8"
      >
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 w-full max-w-3xl max-h-[80vh] overflow-y-auto"
        >
          <div className="glass rounded-2xl p-8">
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-8 text-center">
              How to Play
            </h1>

            {/* Story */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-primary mb-3">Story</h2>
              <p className="text-muted-foreground leading-relaxed">
                A mysterious virus has turned most of humanity into flesh-eating
                zombies. You are one of the few survivors, fighting to stay
                alive in this post-apocalyptic world. Your mission: eliminate
                the undead, gather resources, and become humanity{"'"}s last hope.
              </p>
            </div>

            {/* Controls */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-primary mb-3">Controls</h2>
              <div className="grid grid-cols-2 gap-3">
                {controls.map(({ key, action }) => (
                  <div
                    key={key}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <kbd className="px-3 py-1.5 rounded bg-background border border-border font-mono text-sm min-w-[80px] text-center">
                      {key}
                    </kbd>
                    <span className="text-muted-foreground">{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pickups */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-primary mb-3">Pickups</h2>
              <div className="grid grid-cols-2 gap-3">
                <PickupInfo color="bg-red-500" label="Health" />
                <PickupInfo color="bg-green-500" label="Stamina" />
                <PickupInfo color="bg-blue-500" label="Shield" />
                <PickupInfo color="bg-yellow-500" label="Ammo" />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setGameState("menu")}
              className="btn-ghost w-full flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Menu
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function PickupInfo({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
      <div className={`w-4 h-4 rounded-full ${color} shadow-lg`} />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

export function OptionsOverlay() {
  const { gameState, setGameState, isMuted, toggleMute, volume, setVolume } =
    useGameStore();

  if (gameState !== "options") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-8"
      >
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="glass rounded-2xl p-8">
            <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 text-center">
              Options
            </h1>

            <div className="space-y-6">
              {/* Music toggle */}
              <div className="flex items-center justify-between">
                <span className="text-lg">Music</span>
                <button
                  onClick={toggleMute}
                  className={`
                    relative w-14 h-8 rounded-full transition-colors
                    ${isMuted ? "bg-muted" : "bg-primary"}
                  `}
                >
                  <div
                    className={`
                      absolute top-1 w-6 h-6 rounded-full bg-white transition-transform
                      ${isMuted ? "left-1" : "left-7"}
                    `}
                  />
                </button>
              </div>

              {/* Volume slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg">Volume</span>
                  <span className="text-muted-foreground font-mono">
                    {volume}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-2 rounded-full bg-muted appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-primary
                    [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setGameState("menu")}
              className="btn-primary w-full mt-8 flex items-center justify-center gap-2"
            >
              <Volume2 className="w-5 h-5" />
              Save & Close
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function PauseOverlay() {
  const { gameState, setGameState, resetGame } = useGameStore();

  if (gameState !== "paused") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 text-center"
        >
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-8">
            Paused
          </h1>

          <div className="flex flex-col gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGameState("playing")}
              className="btn-primary"
            >
              Resume
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGameState("shop")}
              className="btn-secondary"
            >
              Shop
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetGame}
              className="btn-ghost"
            >
              Main Menu
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function DamageOverlay() {
  const { health, maxHealth, gameState } = useGameStore();

  if (gameState !== "playing") return null;

  const healthPercentage = health / maxHealth;
  const showDamage = healthPercentage < 0.5;
  const intensity = Math.max(0, 1 - healthPercentage * 2);

  if (!showDamage) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-40 transition-opacity duration-300"
      style={{
        boxShadow: `inset 0 0 ${100 + intensity * 100}px ${
          30 + intensity * 50
        }px rgba(220, 38, 38, ${intensity * 0.6})`,
      }}
    />
  );
}
