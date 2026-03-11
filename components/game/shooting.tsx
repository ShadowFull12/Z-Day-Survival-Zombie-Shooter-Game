"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/lib/store";

interface Bullet {
  id: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  createdAt: number;
}

const BULLET_SPEED = 100;
const BULLET_LIFETIME = 2000;
const MAX_BULLETS = 50;

export function ShootingSystem() {
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const lastShotRef = useRef(0);
  const isShootingRef = useRef(false);
  const { camera } = useThree();
  
  const {
    gameState,
    shoot,
    getCurrentWeapon,
    enemies,
    damageEnemy,
  } = useGameStore();

  // Handle mouse events
  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      if (event.button === 0) {
        // Left click
        isShootingRef.current = true;
      }
    },
    []
  );

  const handleMouseUp = useCallback(
    (event: MouseEvent) => {
      if (event.button === 0) {
        isShootingRef.current = false;
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseDown, handleMouseUp]);

  // Shooting logic in game loop
  useFrame(({ clock }) => {
    if (gameState !== "playing") return;

    const now = Date.now();
    const weapon = getCurrentWeapon();

    // Handle shooting
    if (isShootingRef.current && weapon) {
      const timeSinceLastShot = now - lastShotRef.current;

      if (timeSinceLastShot >= weapon.fireRate) {
        const canShoot = shoot();
        if (canShoot) {
          lastShotRef.current = now;

          // Create bullets
          const direction = new THREE.Vector3();
          camera.getWorldDirection(direction);

          const bulletsToCreate = weapon.bulletsPerShot || 1;

          for (let i = 0; i < bulletsToCreate; i++) {
            // Add spread
            const spreadDirection = direction.clone();
            spreadDirection.x += (Math.random() - 0.5) * weapon.spread;
            spreadDirection.y += (Math.random() - 0.5) * weapon.spread;
            spreadDirection.z += (Math.random() - 0.5) * weapon.spread;
            spreadDirection.normalize();

            const bulletPosition = camera.position.clone();
            // Offset bullet start position slightly forward
            bulletPosition.add(spreadDirection.clone().multiplyScalar(0.5));

            const newBullet: Bullet = {
              id: `bullet-${now}-${i}-${Math.random()}`,
              position: bulletPosition,
              velocity: spreadDirection.multiplyScalar(BULLET_SPEED * 0.016),
              createdAt: now,
            };

            setBullets((prev) => {
              const updated = [...prev, newBullet];
              // Limit max bullets
              if (updated.length > MAX_BULLETS) {
                return updated.slice(-MAX_BULLETS);
              }
              return updated;
            });
          }
        }
      }
    }

    // Update bullets and check collisions
    setBullets((prevBullets) => {
      return prevBullets
        .filter((bullet) => now - bullet.createdAt < BULLET_LIFETIME)
        .map((bullet) => {
          // Update position
          bullet.position.add(bullet.velocity);

          // Check collision with enemies
          for (const enemy of enemies) {
            const enemyPosition = new THREE.Vector3(...enemy.position);
            enemyPosition.y = 1.5; // Center of enemy

            const distance = bullet.position.distanceTo(enemyPosition);

            if (distance < 1.5) {
              // Hit!
              const weapon = getCurrentWeapon();
              if (weapon) {
                damageEnemy(enemy.id, weapon.damage);
              }
              // Remove bullet by returning null (filtered out)
              bullet.createdAt = 0;
            }
          }

          return bullet;
        })
        .filter((bullet) => bullet.createdAt > 0);
    });
  });

  return (
    <group>
      {bullets.map((bullet) => (
        <BulletMesh key={bullet.id} position={bullet.position} />
      ))}
    </group>
  );
}

function BulletMesh({ position }: { position: THREE.Vector3 }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#ffff00" />
      {/* Bullet trail/glow */}
      <pointLight color="#ffff00" intensity={0.5} distance={3} />
    </mesh>
  );
}

// Muzzle flash component
export function MuzzleFlash() {
  const flashRef = useRef<THREE.PointLight>(null);
  const [isVisible, setIsVisible] = useState(false);
  const lastShotTimeRef = useRef(0);
  const { getCurrentWeapon, gameState } = useGameStore();

  useFrame(() => {
    if (gameState !== "playing") return;

    const weapon = getCurrentWeapon();
    if (!weapon) return;

    const now = Date.now();
    const timeSinceLastShot = now - lastShotTimeRef.current;

    // Show flash for 50ms after shot
    if (timeSinceLastShot < 50) {
      setIsVisible(true);
      if (flashRef.current) {
        flashRef.current.intensity = 2 * (1 - timeSinceLastShot / 50);
      }
    } else {
      setIsVisible(false);
    }
  });

  if (!isVisible) return null;

  return (
    <pointLight
      ref={flashRef}
      position={[0, 0, -0.5]}
      color="#ff8800"
      intensity={2}
      distance={10}
    />
  );
}
