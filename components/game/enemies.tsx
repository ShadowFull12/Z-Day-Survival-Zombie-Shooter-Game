"use client";

import { useRef, useEffect, useMemo, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore, type Enemy } from "@/lib/store";

const ENEMY_SPEED_NORMAL = 2;
const ENEMY_SPEED_FAST = 4;
const ENEMY_DAMAGE = 10;
const ATTACK_RANGE = 2;
const ATTACK_COOLDOWN = 1;

export function Enemies() {
  const { enemies, level, gameState, addEnemy, setGameState, clearEnemies } = useGameStore();
  const spawnedRef = useRef(false);
  const { camera } = useThree();

  // Spawn enemies for the level
  useEffect(() => {
    if (gameState === "playing" && !spawnedRef.current) {
      spawnedRef.current = true;
      clearEnemies();

      const enemyCount = Math.min(5 + level * 2, 25);
      const spawnRadius = 30;

      for (let i = 0; i < enemyCount; i++) {
        const angle = (i / enemyCount) * Math.PI * 2;
        const radius = spawnRadius + Math.random() * 20;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const type: Enemy["type"] =
          level > 3 && Math.random() > 0.7
            ? Math.random() > 0.5
              ? "fast"
              : "tank"
            : "normal";

        const baseHealth = 3 + Math.floor(level / 2);
        const healthMultiplier = type === "tank" ? 3 : type === "fast" ? 0.7 : 1;

        const enemy: Enemy = {
          id: `enemy-${i}-${Date.now()}`,
          position: [x, 0, z],
          health: Math.floor(baseHealth * healthMultiplier),
          maxHealth: Math.floor(baseHealth * healthMultiplier),
          type,
          speed: type === "fast" ? ENEMY_SPEED_FAST : type === "tank" ? 1.5 : ENEMY_SPEED_NORMAL,
        };

        addEnemy(enemy);
      }
    }

    // Reset spawn flag when returning to menu
    if (gameState === "menu") {
      spawnedRef.current = false;
    }
  }, [gameState, level, addEnemy, clearEnemies]);

  // Check for level completion
  useEffect(() => {
    if (gameState === "playing" && enemies.length === 0 && spawnedRef.current) {
      setGameState("levelComplete");
      spawnedRef.current = false;
    }
  }, [enemies.length, gameState, setGameState]);

  return (
    <group>
      {enemies.map((enemy) => (
        <EnemyMesh
          key={enemy.id}
          enemy={enemy}
          playerPosition={camera.position}
        />
      ))}
    </group>
  );
}

function EnemyMesh({
  enemy,
  playerPosition,
}: {
  enemy: Enemy;
  playerPosition: THREE.Vector3;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const lastAttackRef = useRef(0);
  const { takeDamage, removeEnemy, addMoney, level, gameState } = useGameStore();

  // Create face texture
  const faceTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;

    // Face background based on type
    const faceColor =
      enemy.type === "fast"
        ? "#ff3300"
        : enemy.type === "tank"
        ? "#990000"
        : "#006400";
    ctx.fillStyle = faceColor;
    ctx.fillRect(0, 0, 64, 64);

    // Eyes
    ctx.fillStyle = "#fff";
    ctx.fillRect(16, 20, 10, 10);
    ctx.fillRect(38, 20, 10, 10);

    // Pupils
    ctx.fillStyle = "#000";
    ctx.fillRect(19, 23, 4, 4);
    ctx.fillRect(41, 23, 4, 4);

    // Angry eyebrows
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(12, 18);
    ctx.lineTo(28, 12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(36, 12);
    ctx.lineTo(52, 18);
    ctx.stroke();

    // Mouth
    ctx.fillStyle = "#400";
    ctx.beginPath();
    ctx.moveTo(20, 48);
    ctx.lineTo(32, 54);
    ctx.lineTo(44, 48);
    ctx.closePath();
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }, [enemy.type]);

  // Enemy colors based on type
  const colors = useMemo(() => {
    switch (enemy.type) {
      case "fast":
        return { body: "#ff3300", head: "#ff3300", shirt: "#00cccc" };
      case "tank":
        return { body: "#990000", head: "#990000", shirt: "#333333" };
      default:
        return { body: "#006400", head: "#006400", shirt: "#00cccc" };
    }
  }, [enemy.type]);

  // Update enemy position and handle attacks
  useFrame(({ clock }) => {
    if (!groupRef.current || gameState !== "playing") return;

    const group = groupRef.current;
    const position = new THREE.Vector3(...enemy.position);

    // Move towards player
    const direction = new THREE.Vector3()
      .copy(playerPosition)
      .sub(position)
      .setY(0)
      .normalize();

    const distance = position.distanceTo(
      new THREE.Vector3(playerPosition.x, 0, playerPosition.z)
    );

    if (distance > ATTACK_RANGE) {
      // Move towards player
      const movement = direction.multiplyScalar(enemy.speed * 0.016);
      group.position.add(movement);

      // Update enemy position in store
      enemy.position = [
        group.position.x,
        group.position.y,
        group.position.z,
      ];
    } else {
      // Attack player
      const now = clock.elapsedTime;
      if (now - lastAttackRef.current > ATTACK_COOLDOWN) {
        lastAttackRef.current = now;
        takeDamage(ENEMY_DAMAGE);
      }
    }

    // Face player
    group.lookAt(playerPosition.x, group.position.y, playerPosition.z);

    // Bobbing animation while walking
    if (distance > ATTACK_RANGE) {
      group.position.y = Math.sin(clock.elapsedTime * 10) * 0.05;
    }
  });

  // Check if enemy should be removed
  useEffect(() => {
    if (enemy.health <= 0) {
      removeEnemy(enemy.id);
      const moneyReward = 50 + Math.floor(level / 2) * 25;
      addMoney(moneyReward * (enemy.type === "tank" ? 2 : enemy.type === "fast" ? 1.5 : 1));
    }
  }, [enemy.health, enemy.id, enemy.type, removeEnemy, addMoney, level]);

  const healthPercentage = enemy.health / enemy.maxHealth;

  return (
    <group ref={groupRef} position={enemy.position}>
      {/* Legs */}
      <mesh position={[-0.15, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 1, 8]} />
        <meshStandardMaterial color="#4a0080" roughness={0.8} />
      </mesh>
      <mesh position={[0.15, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 1, 8]} />
        <meshStandardMaterial color="#4a0080" roughness={0.8} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.3, 0.9, 8]} />
        <meshStandardMaterial color={colors.shirt} roughness={0.7} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 2.1, 0]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={colors.head} roughness={0.9} />
      </mesh>

      {/* Face */}
      <mesh position={[0, 2.1, 0.26]}>
        <planeGeometry args={[0.4, 0.4]} />
        <meshBasicMaterial map={faceTexture} transparent />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.45, 1.4, 0]} rotation={[0.3, 0, 0.3]} castShadow>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial color={colors.body} roughness={0.9} />
      </mesh>
      <mesh position={[0.45, 1.4, 0]} rotation={[0.3, 0, -0.3]} castShadow>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshStandardMaterial color={colors.body} roughness={0.9} />
      </mesh>

      {/* Health bar background */}
      <mesh position={[0, 2.8, 0]}>
        <planeGeometry args={[1, 0.12]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>

      {/* Health bar fill */}
      <mesh position={[-(1 - healthPercentage) / 2, 2.8, 0.01]}>
        <planeGeometry args={[healthPercentage, 0.08]} />
        <meshBasicMaterial
          color={
            enemy.type === "fast"
              ? "#ff6600"
              : enemy.type === "tank"
              ? "#cc0000"
              : "#00ff00"
          }
        />
      </mesh>
    </group>
  );
}
