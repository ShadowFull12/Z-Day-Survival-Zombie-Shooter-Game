"use client";

import { GameScene } from "./game-scene";
import { MainMenu } from "@/components/ui/main-menu";
import { GameHUD } from "@/components/ui/game-hud";
import { Shop } from "@/components/ui/shop";
import {
  GameOverOverlay,
  LevelCompleteOverlay,
  InstructionsOverlay,
  OptionsOverlay,
  PauseOverlay,
  DamageOverlay,
} from "@/components/ui/overlays";
import { AudioManager } from "./audio-manager";

export function Game() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* 3D Game Scene */}
      <GameScene />

      {/* UI Overlays */}
      <MainMenu />
      <GameHUD />
      <Shop />
      <GameOverOverlay />
      <LevelCompleteOverlay />
      <InstructionsOverlay />
      <OptionsOverlay />
      <PauseOverlay />
      <DamageOverlay />

      {/* Audio */}
      <AudioManager />
    </div>
  );
}
