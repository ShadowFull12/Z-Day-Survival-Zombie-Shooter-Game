"use client";

import { useRef, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import { useGameStore } from "@/lib/store";

const MOVE_SPEED = 8;
const SPRINT_MULTIPLIER = 1.8;
const MOUSE_SENSITIVITY = 0.002;

interface KeyState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  sprint: boolean;
}

export function Player() {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const velocityRef = useRef(new THREE.Vector3());
  const directionRef = useRef(new THREE.Vector3());
  const keyStateRef = useRef<KeyState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
  });

  const {
    gameState,
    setGameState,
    stamina,
    useStamina,
    regenerateStamina,
    useHealthPack,
    switchWeapon,
    weapons,
    toggleMute,
  } = useGameStore();

  // Handle keyboard input
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (gameState !== "playing") return;

      switch (event.code) {
        case "KeyW":
          keyStateRef.current.forward = true;
          break;
        case "KeyS":
          keyStateRef.current.backward = true;
          break;
        case "KeyA":
          keyStateRef.current.left = true;
          break;
        case "KeyD":
          keyStateRef.current.right = true;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          keyStateRef.current.sprint = true;
          break;
        case "KeyH":
          useHealthPack();
          break;
        case "KeyM":
          toggleMute();
          break;
        case "Digit1":
        case "Digit2":
        case "Digit3":
        case "Digit4":
        case "Digit5":
        case "Digit6":
          const weaponIndex = parseInt(event.code.replace("Digit", "")) - 1;
          const weapon = weapons[weaponIndex];
          if (weapon && weapon.bought) {
            switchWeapon(weapon.id);
          }
          break;
        case "Enter":
          setGameState("shop");
          if (controlsRef.current) {
            controlsRef.current.unlock();
          }
          break;
        case "Escape":
          setGameState("paused");
          if (controlsRef.current) {
            controlsRef.current.unlock();
          }
          break;
      }
    },
    [gameState, setGameState, useHealthPack, switchWeapon, weapons, toggleMute]
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW":
          keyStateRef.current.forward = false;
          break;
        case "KeyS":
          keyStateRef.current.backward = false;
          break;
        case "KeyA":
          keyStateRef.current.left = false;
          break;
        case "KeyD":
          keyStateRef.current.right = false;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          keyStateRef.current.sprint = false;
          break;
      }
    },
    []
  );

  // Set up event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Set initial camera position
  useEffect(() => {
    camera.position.set(0, 1.7, 0);
  }, [camera]);

  // Game loop for movement
  useFrame((_, delta) => {
    if (gameState !== "playing") return;

    const keys = keyStateRef.current;
    const velocity = velocityRef.current;
    const direction = directionRef.current;

    // Get camera direction
    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    // Calculate right vector
    const right = new THREE.Vector3();
    right.crossVectors(direction, new THREE.Vector3(0, 1, 0)).normalize();

    // Calculate movement direction
    const moveDirection = new THREE.Vector3();

    if (keys.forward) moveDirection.add(direction);
    if (keys.backward) moveDirection.sub(direction);
    if (keys.left) moveDirection.sub(right);
    if (keys.right) moveDirection.add(right);

    moveDirection.normalize();

    // Apply sprint
    let speed = MOVE_SPEED;
    const isSprinting = keys.sprint && (keys.forward || keys.backward || keys.left || keys.right);

    if (isSprinting && stamina > 0) {
      speed *= SPRINT_MULTIPLIER;
      useStamina(15 * delta);
    } else {
      // Regenerate stamina when not sprinting
      regenerateStamina(delta);
    }

    // Apply movement
    if (moveDirection.length() > 0) {
      velocity.copy(moveDirection).multiplyScalar(speed * delta);
      camera.position.add(velocity);

      // Keep within bounds
      const boundLimit = 70;
      camera.position.x = THREE.MathUtils.clamp(
        camera.position.x,
        -boundLimit,
        boundLimit
      );
      camera.position.z = THREE.MathUtils.clamp(
        camera.position.z,
        -boundLimit,
        boundLimit
      );
    }

    // Keep camera at proper height
    camera.position.y = 1.7;
  });

  // Lock controls when playing
  useEffect(() => {
    if (gameState === "playing" && controlsRef.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        controlsRef.current?.lock();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  return (
    <PointerLockControls
      ref={controlsRef}
      pointerSpeed={MOUSE_SENSITIVITY * 500}
    />
  );
}
