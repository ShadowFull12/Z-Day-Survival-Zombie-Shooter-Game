"use client";

import dynamic from "next/dynamic";

// Dynamic import with SSR disabled for Three.js components
const Game = dynamic(
  () => import("@/components/game/game").then((mod) => mod.Game),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <h1 className="text-6xl font-black uppercase tracking-tighter text-foreground">
              Z-Day
            </h1>
            <p className="text-xl text-muted-foreground tracking-[0.3em] uppercase">
              Survival
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary loading-bar" />
            </div>
            <p className="text-sm text-muted-foreground animate-pulse">
              Loading game assets...
            </p>
          </div>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  return <Game />;
}
