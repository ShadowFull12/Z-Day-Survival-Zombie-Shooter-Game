"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, BookOpen, Settings, Volume2, VolumeX } from "lucide-react";
import { useGameStore, type GameState } from "@/lib/store";

export function MainMenu() {
  const { gameState, setGameState, isMuted, toggleMute } = useGameStore();

  if (gameState !== "menu") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-red-950/20" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-destructive/3 rounded-full blur-3xl" />
        </div>

        {/* Scanlines overlay */}
        <div className="absolute inset-0 scanlines pointer-events-none opacity-30" />

        {/* Beta warning */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-8 left-1/2 -translate-x-1/2"
        >
          <div className="px-6 py-2 rounded-full bg-destructive/20 border border-destructive/50">
            <span className="text-destructive text-sm font-medium uppercase tracking-wider animate-pulse">
              Beta Version
            </span>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center gap-8">
          {/* Title */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="text-center"
          >
            <h1 className="text-7xl md:text-8xl font-black uppercase tracking-tighter">
              <span className="bg-gradient-to-b from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                Z-Day
              </span>
            </h1>
            <div className="flex items-center justify-center gap-4 mt-2">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary" />
              <h2 className="text-xl md:text-2xl font-light uppercase tracking-[0.3em] text-muted-foreground">
                Survival
              </h2>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary" />
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground text-center max-w-md"
          >
            Survive the apocalypse. Fight the undead. Become the last hope.
          </motion.p>

          {/* Menu buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col gap-4 w-72"
          >
            <MenuButton
              icon={<Play className="w-5 h-5" />}
              label="Start Game"
              onClick={() => setGameState("playing")}
              primary
            />
            <MenuButton
              icon={<BookOpen className="w-5 h-5" />}
              label="Instructions"
              onClick={() => setGameState("instructions")}
            />
            <MenuButton
              icon={<Settings className="w-5 h-5" />}
              label="Options"
              onClick={() => setGameState("options")}
            />
          </motion.div>
        </div>

        {/* Mute button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={toggleMute}
          className="absolute bottom-8 right-8 p-3 rounded-full glass hover:bg-muted transition-colors"
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-muted-foreground" />
          ) : (
            <Volume2 className="w-6 h-6 text-foreground" />
          )}
        </motion.button>

        {/* Credits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground text-sm"
        >
          Made by Aritra Mukherjee
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function MenuButton({
  icon,
  label,
  onClick,
  primary = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative group flex items-center justify-center gap-3 w-full py-4 px-6 rounded-lg
        font-semibold uppercase tracking-wider transition-all duration-300
        ${
          primary
            ? "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/30"
            : "glass text-foreground hover:bg-muted border border-border"
        }
      `}
    >
      {primary && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary to-red-600 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl" />
      )}
      {icon}
      <span>{label}</span>
    </motion.button>
  );
}
