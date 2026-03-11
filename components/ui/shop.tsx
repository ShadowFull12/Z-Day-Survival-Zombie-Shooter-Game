"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, Check, Lock, Crosshair, Shield, Zap } from "lucide-react";
import { useGameStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type ShopTab = "weapons" | "equipment" | "powerups";

export function Shop() {
  const { gameState, setGameState, money } = useGameStore();
  const [activeTab, setActiveTab] = useState<ShopTab>("weapons");

  if (gameState !== "shop") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-8"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />

        {/* Shop panel */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-4xl max-h-[80vh] overflow-hidden rounded-2xl border border-border bg-card"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-2xl font-bold uppercase tracking-wider">Shop</h2>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-accent" />
                <span className="text-xl font-bold font-mono text-accent">
                  {money.toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setGameState("playing")}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            {(["weapons", "equipment", "powerups"] as ShopTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 py-3 text-sm uppercase tracking-wider transition-colors",
                  activeTab === tab
                    ? "bg-muted text-foreground border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-6 max-h-[calc(80vh-140px)]">
            {activeTab === "weapons" && <WeaponsSection />}
            {activeTab === "equipment" && <EquipmentSection />}
            {activeTab === "powerups" && <PowerupsSection />}
          </div>

          {/* Footer hint */}
          <div className="px-6 py-3 border-t border-border text-center text-sm text-muted-foreground">
            Press <kbd className="px-2 py-1 rounded bg-muted font-mono">Escape</kbd> to close
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function WeaponsSection() {
  const { weapons, money, buyWeapon, refillAmmo, currentWeaponId, switchWeapon } =
    useGameStore();

  return (
    <div className="grid gap-4">
      {weapons.map((weapon) => {
        const refillCost = Math.floor(weapon.price / 4);
        const canBuy = !weapon.bought && money >= weapon.price;
        const canRefill =
          weapon.bought && weapon.ammo < weapon.maxAmmo && money >= refillCost;

        return (
          <motion.div
            key={weapon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border transition-all",
              weapon.bought
                ? weapon.id === currentWeaponId
                  ? "border-primary/50 bg-primary/10"
                  : "border-secondary/30 bg-secondary/5"
                : "border-border bg-card hover:bg-muted/50"
            )}
          >
            {/* Weapon icon placeholder */}
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
              <Crosshair className="w-8 h-8 text-muted-foreground" />
            </div>

            {/* Weapon info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{weapon.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-muted font-mono">
                  {weapon.shortcut}
                </span>
                {weapon.bought && (
                  <span className="text-xs px-2 py-0.5 rounded bg-secondary/20 text-secondary">
                    Owned
                  </span>
                )}
              </div>
              <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                <span>DMG: {weapon.damage}</span>
                <span>RPM: {Math.round(60000 / weapon.fireRate)}</span>
                {weapon.bulletsPerShot && <span>x{weapon.bulletsPerShot}</span>}
              </div>
              {weapon.bought && (
                <div className="mt-2 text-sm">
                  <span className="text-muted-foreground">Ammo: </span>
                  <span className="font-mono">
                    {weapon.ammo}/{weapon.maxAmmo}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              {!weapon.bought ? (
                <button
                  onClick={() => buyWeapon(weapon.id)}
                  disabled={!canBuy}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2",
                    canBuy
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {canBuy ? (
                    <>
                      <DollarSign className="w-4 h-4" />
                      {weapon.price}
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      {weapon.price}
                    </>
                  )}
                </button>
              ) : (
                <>
                  {weapon.id !== currentWeaponId && (
                    <button
                      onClick={() => switchWeapon(weapon.id)}
                      className="px-4 py-2 rounded-lg font-medium bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all"
                    >
                      Equip
                    </button>
                  )}
                  <button
                    onClick={() => refillAmmo(weapon.id)}
                    disabled={!canRefill}
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2",
                      canRefill
                        ? "bg-accent text-accent-foreground hover:bg-accent/90"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    <DollarSign className="w-4 h-4" />
                    {refillCost} Refill
                  </button>
                </>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function EquipmentSection() {
  const { money, buyItem, healthPacks, grenades, shield, maxShield } =
    useGameStore();

  const equipment = [
    {
      id: "healthPack",
      name: "Health Pack",
      description: "Restores 50 health when used",
      price: 50,
      owned: healthPacks,
      type: "healthPack" as const,
    },
    {
      id: "grenade",
      name: "Grenade",
      description: "Explosive that deals 50 damage in an area",
      price: 200,
      owned: grenades,
      type: "grenade" as const,
    },
    {
      id: "armor",
      name: "Body Armor",
      description: `Adds 50 shield (Current: ${shield}/${maxShield})`,
      price: 300,
      owned: null,
      type: "armor" as const,
      disabled: shield >= maxShield,
    },
  ];

  return (
    <div className="grid gap-4">
      {equipment.map((item) => {
        const canBuy = money >= item.price && !item.disabled;

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-all"
          >
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
              {item.type === "healthPack" && (
                <span className="text-3xl text-destructive">+</span>
              )}
              {item.type === "grenade" && (
                <span className="text-2xl">💣</span>
              )}
              {item.type === "armor" && (
                <Shield className="w-8 h-8 text-blue-500" />
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
              {item.owned !== null && (
                <p className="text-sm mt-1">
                  <span className="text-muted-foreground">Owned: </span>
                  <span className="font-mono text-accent">{item.owned}</span>
                </p>
              )}
            </div>

            <button
              onClick={() => buyItem(item.type, item.price)}
              disabled={!canBuy}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2",
                canBuy
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              <DollarSign className="w-4 h-4" />
              {item.price}
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}

function PowerupsSection() {
  const { powerups, money, buyPowerup } = useGameStore();

  return (
    <div className="grid gap-4">
      {powerups.map((powerup) => {
        const isMaxLevel = powerup.currentLevel >= powerup.levels.length;
        const currentLevelData = powerup.levels[powerup.currentLevel];
        const canBuy = !isMaxLevel && money >= currentLevelData?.price;

        return (
          <motion.div
            key={powerup.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-all"
          >
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
              <Zap className="w-8 h-8 text-accent" />
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-lg">{powerup.name}</h3>
              <p className="text-sm text-muted-foreground">
                {powerup.description}
              </p>

              {/* Level indicators */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">Level:</span>
                <div className="flex gap-1">
                  {powerup.levels.map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "w-3 h-3 rounded-full transition-colors",
                        index < powerup.currentLevel
                          ? "bg-accent"
                          : "bg-muted"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => buyPowerup(powerup.id)}
              disabled={!canBuy}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2",
                isMaxLevel
                  ? "bg-secondary/20 text-secondary cursor-default"
                  : canBuy
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {isMaxLevel ? (
                <>
                  <Check className="w-4 h-4" />
                  MAX
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4" />
                  {currentLevelData?.price}
                </>
              )}
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
