"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { GameWorld } from "./world";
import { Player } from "./player";
import { Enemies } from "./enemies";
import { ShootingSystem } from "./shooting";
import { PickupSystem, InitialPickups } from "./pickups";
import { useGameStore } from "@/lib/store";

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#333" wireframe />
    </mesh>
  );
}

export function GameScene() {
  const { gameState } = useGameStore();

  // Only render 3D scene when in game-related states
  const shouldRenderScene = ["playing", "paused", "shop", "levelComplete", "gameover"].includes(
    gameState
  );

  if (!shouldRenderScene) return null;

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 1.7, 0] }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: false,
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Game world environment */}
          <GameWorld />

          {/* Player controls */}
          <Player />

          {/* Enemies */}
          <Enemies />

          {/* Shooting system */}
          <ShootingSystem />

          {/* Pickups */}
          <PickupSystem />
          <InitialPickups />

          {/* Preload assets */}
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
