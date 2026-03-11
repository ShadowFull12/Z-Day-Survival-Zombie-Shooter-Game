"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/lib/store";

export function AudioManager() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isMuted, volume, gameState } = useGameStore();
  const hasInteractedRef = useRef(false);

  // Initialize audio on first user interaction
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteractedRef.current && audioRef.current) {
        hasInteractedRef.current = true;
        audioRef.current.play().catch(console.error);
      }
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  // Update audio state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      audioRef.current.volume = volume / 100;
    }
  }, [isMuted, volume]);

  // Pause/resume based on game state
  useEffect(() => {
    if (audioRef.current) {
      if (gameState === "playing" || gameState === "menu") {
        if (hasInteractedRef.current) {
          audioRef.current.play().catch(console.error);
        }
      }
    }
  }, [gameState]);

  return (
    <audio
      ref={audioRef}
      src="/Haunting Echoes.mp3"
      loop
      preload="auto"
    />
  );
}
