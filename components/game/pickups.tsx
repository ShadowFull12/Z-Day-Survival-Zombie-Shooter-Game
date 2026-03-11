"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/lib/store";

type PickupType = "health" | "stamina" | "shield" | "ammo";

interface Pickup {
  id: string;
  position: [number, number, number];
  type: PickupType;
}

const PICKUP_COLORS: Record<PickupType, string> = {
  health: "#ff4136",
  stamina: "#2ecc40",
  shield: "#0074d9",
  ammo: "#ffdc00",
};

const PICKUP_VALUES: Record<PickupType, number> = {
  health: 25,
  stamina: 25,
  shield: 25,
  ammo: 10,
};

const SPAWN_INTERVAL = 15000; // 15 seconds
const MAX_PICKUPS = 10;
const SPAWN_RADIUS = 40;

export function PickupSystem() {
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const lastSpawnRef = useRef(Date.now());
  const { camera } = useThree();
  const {
    gameState,
    heal,
    health,
    maxHealth,
    stamina,
    maxStamina,
    shield,
    maxShield,
    weapons,
    currentWeaponId,
  } = useGameStore();

  // Spawn pickups periodically
  useFrame(() => {
    if (gameState !== "playing") return;

    const now = Date.now();
    if (now - lastSpawnRef.current > SPAWN_INTERVAL && pickups.length < MAX_PICKUPS) {
      lastSpawnRef.current = now;

      // Random position within spawn radius
      const angle = Math.random() * Math.PI * 2;
      const radius = 10 + Math.random() * SPAWN_RADIUS;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Random pickup type
      const types: PickupType[] = ["health", "stamina", "shield", "ammo"];
      const type = types[Math.floor(Math.random() * types.length)];

      const newPickup: Pickup = {
        id: `pickup-${now}-${Math.random()}`,
        position: [x, 0.5, z],
        type,
      };

      setPickups((prev) => [...prev, newPickup]);
    }
  });

  // Check for pickup collection
  const collectPickup = (pickup: Pickup) => {
    const store = useGameStore.getState();

    switch (pickup.type) {
      case "health":
        if (store.health < store.maxHealth) {
          store.heal(PICKUP_VALUES.health);
          return true;
        }
        break;
      case "stamina":
        if (store.stamina < store.maxStamina) {
          useGameStore.setState({
            stamina: Math.min(store.maxStamina, store.stamina + PICKUP_VALUES.stamina),
          });
          return true;
        }
        break;
      case "shield":
        if (store.shield < store.maxShield) {
          useGameStore.setState({
            shield: Math.min(store.maxShield, store.shield + PICKUP_VALUES.shield),
          });
          return true;
        }
        break;
      case "ammo":
        const weapon = store.weapons.find((w) => w.id === store.currentWeaponId);
        if (weapon && weapon.ammo < weapon.maxAmmo) {
          useGameStore.setState({
            weapons: store.weapons.map((w) =>
              w.id === store.currentWeaponId
                ? { ...w, ammo: Math.min(w.maxAmmo, w.ammo + PICKUP_VALUES.ammo) }
                : w
            ),
          });
          return true;
        }
        break;
    }
    return false;
  };

  return (
    <group>
      {pickups.map((pickup) => (
        <PickupMesh
          key={pickup.id}
          pickup={pickup}
          playerPosition={camera.position}
          onCollect={() => {
            if (collectPickup(pickup)) {
              setPickups((prev) => prev.filter((p) => p.id !== pickup.id));
            }
          }}
        />
      ))}
    </group>
  );
}

function PickupMesh({
  pickup,
  playerPosition,
  onCollect,
}: {
  pickup: Pickup;
  playerPosition: THREE.Vector3;
  onCollect: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const color = PICKUP_COLORS[pickup.type];

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    // Floating animation
    meshRef.current.position.y =
      pickup.position[1] + Math.sin(clock.elapsedTime * 3) * 0.2;

    // Rotation
    meshRef.current.rotation.y = clock.elapsedTime * 2;

    // Pulsing glow
    if (glowRef.current) {
      glowRef.current.intensity = 1 + Math.sin(clock.elapsedTime * 5) * 0.5;
    }

    // Check collection
    const pickupPos = new THREE.Vector3(...pickup.position);
    const distance = pickupPos.distanceTo(
      new THREE.Vector3(playerPosition.x, 0.5, playerPosition.z)
    );

    if (distance < 2) {
      onCollect();
    }
  });

  return (
    <group position={[pickup.position[0], 0, pickup.position[2]]}>
      {/* Pickup orb */}
      <mesh ref={meshRef} position={[0, pickup.position[1], 0]}>
        <icosahedronGeometry args={[0.4, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Inner glow */}
      <pointLight
        ref={glowRef}
        position={[0, pickup.position[1], 0]}
        color={color}
        intensity={1}
        distance={5}
      />

      {/* Ground glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[1.5, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

// Initial pickups spawn
export function InitialPickups() {
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const { camera } = useThree();
  const { gameState } = useGameStore();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (gameState === "playing" && !initializedRef.current) {
      initializedRef.current = true;

      // Spawn some initial pickups
      const initialPickups: Pickup[] = [];
      const types: PickupType[] = ["health", "stamina", "shield", "ammo"];

      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 15 + Math.random() * 15;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        initialPickups.push({
          id: `initial-pickup-${i}`,
          position: [x, 0.5, z],
          type: types[Math.floor(Math.random() * types.length)],
        });
      }

      setPickups(initialPickups);
    }

    if (gameState === "menu") {
      initializedRef.current = false;
      setPickups([]);
    }
  }, [gameState]);

  const collectPickup = (pickup: Pickup) => {
    const store = useGameStore.getState();

    switch (pickup.type) {
      case "health":
        if (store.health < store.maxHealth) {
          store.heal(PICKUP_VALUES.health);
          return true;
        }
        break;
      case "stamina":
        if (store.stamina < store.maxStamina) {
          useGameStore.setState({
            stamina: Math.min(store.maxStamina, store.stamina + PICKUP_VALUES.stamina),
          });
          return true;
        }
        break;
      case "shield":
        if (store.shield < store.maxShield) {
          useGameStore.setState({
            shield: Math.min(store.maxShield, store.shield + PICKUP_VALUES.shield),
          });
          return true;
        }
        break;
      case "ammo":
        const weapon = store.weapons.find((w) => w.id === store.currentWeaponId);
        if (weapon && weapon.ammo < weapon.maxAmmo) {
          useGameStore.setState({
            weapons: store.weapons.map((w) =>
              w.id === store.currentWeaponId
                ? { ...w, ammo: Math.min(w.maxAmmo, w.ammo + PICKUP_VALUES.ammo) }
                : w
            ),
          });
          return true;
        }
        break;
    }
    return false;
  };

  return (
    <group>
      {pickups.map((pickup) => (
        <PickupMesh
          key={pickup.id}
          pickup={pickup}
          playerPosition={camera.position}
          onCollect={() => {
            if (collectPickup(pickup)) {
              setPickups((prev) => prev.filter((p) => p.id !== pickup.id));
            }
          }}
        />
      ))}
    </group>
  );
}
