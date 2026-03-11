"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, Zap, Shield, DollarSign, Target, Package } from "lucide-react";
import { useGameStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function GameHUD() {
  const {
    gameState,
    health,
    maxHealth,
    stamina,
    maxStamina,
    shield,
    maxShield,
    money,
    level,
    kills,
    healthPacks,
    grenades,
    weapons,
    currentWeaponId,
  } = useGameStore();

  const currentWeapon = weapons.find((w) => w.id === currentWeaponId);

  if (gameState !== "playing") return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Crosshair />
      </div>

      {/* Player Stats Panel - Top Left */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="absolute top-6 left-6 w-72"
      >
        <div className="hud-panel space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Player Stats
            </span>
            <span className="text-xs font-mono text-accent">LVL {level}</span>
          </div>

          {/* Health */}
          <StatBar
            icon={<Heart className="w-4 h-4 text-destructive" />}
            label="Health"
            value={health}
            max={maxHealth}
            color="health"
          />

          {/* Stamina */}
          <StatBar
            icon={<Zap className="w-4 h-4 text-emerald-500" />}
            label="Stamina"
            value={stamina}
            max={maxStamina}
            color="stamina"
          />

          {/* Shield */}
          <StatBar
            icon={<Shield className="w-4 h-4 text-blue-500" />}
            label="Shield"
            value={shield}
            max={maxShield}
            color="shield"
          />
        </div>
      </motion.div>

      {/* Money & Stats - Top Right */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="absolute top-6 right-6"
      >
        <div className="hud-panel flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-accent" />
            <span className="text-2xl font-bold font-mono text-accent">
              {money.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="w-4 h-4" />
            <span>{kills} kills</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-xs">Enter</kbd> for Shop
          </div>
        </div>
      </motion.div>

      {/* Weapon HUD - Bottom Right */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-6 right-6"
      >
        <div className="hud-panel">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
            Weapons
          </div>
          <div className="space-y-2">
            {weapons
              .filter((w) => w.bought)
              .map((weapon) => (
                <WeaponSlot
                  key={weapon.id}
                  weapon={weapon}
                  isActive={weapon.id === currentWeaponId}
                />
              ))}
          </div>
        </div>
      </motion.div>

      {/* Inventory - Bottom Left */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-6 left-6"
      >
        <div className="hud-panel">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
            Inventory
          </div>
          <div className="flex gap-4">
            <InventoryItem
              icon={<Package className="w-4 h-4" />}
              label="Health Pack"
              count={healthPacks}
              hotkey="H"
            />
            <InventoryItem
              icon={
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="12" r="8" />
                </svg>
              }
              label="Grenade"
              count={grenades}
              hotkey="G"
            />
          </div>
        </div>
      </motion.div>

      {/* Current weapon ammo display - Bottom Center */}
      {currentWeapon && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <div className="hud-panel flex items-center gap-4">
            <span className="text-lg font-bold">{currentWeapon.name}</span>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-2xl font-mono font-bold",
                  currentWeapon.ammo <= currentWeapon.maxAmmo * 0.2
                    ? "text-destructive animate-pulse"
                    : "text-accent"
                )}
              >
                {currentWeapon.ammo}
              </span>
              <span className="text-muted-foreground">
                / {currentWeapon.maxAmmo}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Crosshair() {
  return (
    <div className="relative w-8 h-8">
      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white shadow-lg shadow-white/50" />
      
      {/* Crosshair lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-white/80" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-white/80" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-0.5 bg-white/80" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-0.5 bg-white/80" />
    </div>
  );
}

function StatBar({
  icon,
  label,
  value,
  max,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  max: number;
  color: "health" | "stamina" | "shield";
}) {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className="flex items-center gap-3">
      {icon}
      <div className="flex-1">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-mono">
            {Math.round(value)}/{max}
          </span>
        </div>
        <div className={cn("progress-bar", `progress-${color}`)}>
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ type: "spring", stiffness: 100 }}
          />
        </div>
      </div>
    </div>
  );
}

function WeaponSlot({
  weapon,
  isActive,
}: {
  weapon: ReturnType<typeof useGameStore>["weapons"][0];
  isActive: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        isActive ? "bg-primary/20 border border-primary/50" : "bg-muted/50"
      )}
    >
      <span
        className={cn(
          "w-5 h-5 flex items-center justify-center rounded text-xs font-bold",
          isActive ? "bg-primary text-primary-foreground" : "bg-muted-foreground/30"
        )}
      >
        {weapon.shortcut}
      </span>
      <span className={cn("text-sm", isActive ? "text-foreground" : "text-muted-foreground")}>
        {weapon.name}
      </span>
      <span className="ml-auto text-xs font-mono text-muted-foreground">
        {weapon.ammo}/{weapon.maxAmmo}
      </span>
    </div>
  );
}

function InventoryItem({
  icon,
  label,
  count,
  hotkey,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  hotkey: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center relative",
          count > 0 ? "bg-secondary/20 border border-secondary/50" : "bg-muted/50 border border-muted"
        )}
      >
        {icon}
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
          {count}
        </span>
      </div>
      <span className="text-xs text-muted-foreground">{hotkey}</span>
    </div>
  );
}
