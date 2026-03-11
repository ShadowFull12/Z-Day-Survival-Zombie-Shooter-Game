"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sky, Cloud, Stars } from "@react-three/drei";
import * as THREE from "three";

const MAP_SIZE = 150;

export function GameWorld() {
  return (
    <>
      {/* Apocalyptic sky */}
      <ApocalypticSky />
      
      {/* Stars */}
      <Stars
        radius={300}
        depth={60}
        count={1000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Ground */}
      <Ground />

      {/* Streets */}
      <Streets />

      {/* Buildings */}
      <Buildings />

      {/* Trees */}
      <DeadTrees />

      {/* Atmospheric fog */}
      <fog attach="fog" args={["#1a0a0a", 30, 150]} />

      {/* Lighting */}
      <Lighting />
    </>
  );
}

function ApocalypticSky() {
  return (
    <>
      <Sky
        distance={450000}
        sunPosition={[100, 10, 100]}
        inclination={0.1}
        azimuth={0.25}
        rayleigh={3}
        turbidity={10}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      
      {/* Dark clouds */}
      <Cloud
        position={[-40, 40, -40]}
        speed={0.2}
        opacity={0.8}
        color="#1a1a1a"
        segments={40}
      />
      <Cloud
        position={[30, 35, 30]}
        speed={0.15}
        opacity={0.6}
        color="#2a1a1a"
        segments={30}
      />
      <Cloud
        position={[0, 45, -20]}
        speed={0.1}
        opacity={0.7}
        color="#1a0a0a"
        segments={35}
      />
    </>
  );
}

function Ground() {
  const groundTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    // Dark base
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, 512, 512);

    // Add some texture variation
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const radius = Math.random() * 20 + 5;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, "#252525");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }

    // Add dead grass patches
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const radius = Math.random() * 15 + 5;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(40, 30, 20, ${Math.random() * 0.5 + 0.2})`;
      ctx.fill();
    }

    // Add cracks
    ctx.strokeStyle = "#0a0a0a";
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      let x = Math.random() * 512;
      let y = Math.random() * 512;
      ctx.moveTo(x, y);
      for (let j = 0; j < 5; j++) {
        x += (Math.random() - 0.5) * 60;
        y += (Math.random() - 0.5) * 60;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(MAP_SIZE / 20, MAP_SIZE / 20);
    return texture;
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
      <planeGeometry args={[MAP_SIZE * 2, MAP_SIZE * 2]} />
      <meshStandardMaterial
        map={groundTexture}
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
}

function Streets() {
  const streetMaterial = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;

    // Asphalt base
    ctx.fillStyle = "#222222";
    ctx.fillRect(0, 0, 256, 256);

    // Add texture
    for (let i = 0; i < 500; i++) {
      ctx.fillStyle = `rgba(${30 + Math.random() * 20}, ${
        30 + Math.random() * 20
      }, ${30 + Math.random() * 20}, 0.5)`;
      ctx.fillRect(
        Math.random() * 256,
        Math.random() * 256,
        Math.random() * 3,
        Math.random() * 3
      );
    }

    // Center line
    ctx.strokeStyle = "#444444";
    ctx.lineWidth = 4;
    ctx.setLineDash([20, 10]);
    ctx.beginPath();
    ctx.moveTo(128, 0);
    ctx.lineTo(128, 256);
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(10, 1);
    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.85,
    });
  }, []);

  const streetWidth = 12;

  return (
    <group>
      {/* Main street (horizontal) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
        receiveShadow
      >
        <planeGeometry args={[MAP_SIZE * 1.5, streetWidth]} />
        <primitive object={streetMaterial} attach="material" />
      </mesh>

      {/* Cross street (vertical) */}
      <mesh
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        position={[0, 0.02, 0]}
        receiveShadow
      >
        <planeGeometry args={[MAP_SIZE * 1.5, streetWidth]} />
        <primitive object={streetMaterial.clone()} attach="material" />
      </mesh>
    </group>
  );
}

function Buildings() {
  const buildings = useMemo(() => {
    const positions: Array<{
      position: [number, number, number];
      scale: [number, number, number];
      rotation: number;
    }> = [];

    const gridSize = 40;
    const streetBuffer = 15;

    for (let x = -2; x <= 2; x++) {
      for (let z = -2; z <= 2; z++) {
        // Skip center area and street crossings
        if (
          (Math.abs(x) <= 0 && Math.abs(z) <= 0) ||
          (x === 0 && Math.abs(z) <= 1) ||
          (z === 0 && Math.abs(x) <= 1)
        ) {
          continue;
        }

        const baseX = x * gridSize;
        const baseZ = z * gridSize;

        // Add slight randomness
        const offsetX = (Math.random() - 0.5) * 10;
        const offsetZ = (Math.random() - 0.5) * 10;

        const height = 8 + Math.random() * 20;
        const width = 6 + Math.random() * 8;
        const depth = 6 + Math.random() * 8;

        positions.push({
          position: [baseX + offsetX, height / 2, baseZ + offsetZ],
          scale: [width, height, depth],
          rotation: Math.random() * 0.2,
        });
      }
    }

    return positions;
  }, []);

  return (
    <group>
      {buildings.map((building, index) => (
        <Building key={index} {...building} />
      ))}
    </group>
  );
}

function Building({
  position,
  scale,
  rotation,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  rotation: number;
}) {
  const buildingColor = useMemo(() => {
    const colors = ["#2a2a2a", "#333333", "#252525", "#1f1f1f"];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  const windowTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;

    // Building wall
    ctx.fillStyle = buildingColor;
    ctx.fillRect(0, 0, 128, 256);

    // Windows
    const windowRows = Math.floor(Math.random() * 4) + 3;
    const windowCols = 3;
    const windowWidth = 15;
    const windowHeight = 20;
    const paddingX = (128 - windowCols * windowWidth) / (windowCols + 1);
    const paddingY = (256 - windowRows * windowHeight) / (windowRows + 1);

    for (let row = 0; row < windowRows; row++) {
      for (let col = 0; col < windowCols; col++) {
        const x = paddingX + col * (windowWidth + paddingX);
        const y = paddingY + row * (windowHeight + paddingY);

        // Window is either dark or has faint light
        const hasLight = Math.random() > 0.7;
        ctx.fillStyle = hasLight ? "#4a3a20" : "#0a0a0a";
        ctx.fillRect(x, y, windowWidth, windowHeight);

        // Window frame
        ctx.strokeStyle = "#1a1a1a";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, windowWidth, windowHeight);
      }
    }

    return new THREE.CanvasTexture(canvas);
  }, [buildingColor]);

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={scale} />
        <meshStandardMaterial
          map={windowTexture}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

function DeadTrees() {
  const treePositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const count = 20;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 30 + Math.random() * 50;
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 20;
      const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 20;

      // Avoid streets
      if (Math.abs(x) > 8 && Math.abs(z) > 8) {
        positions.push([x, 0, z]);
      }
    }

    return positions;
  }, []);

  return (
    <group>
      {treePositions.map((position, index) => (
        <DeadTree key={index} position={position} />
      ))}
    </group>
  );
}

function DeadTree({ position }: { position: [number, number, number] }) {
  const height = 5 + Math.random() * 8;
  const rotation = Math.random() * Math.PI * 2;
  const tilt = (Math.random() - 0.5) * 0.2;

  return (
    <group position={position} rotation={[tilt, rotation, tilt * 0.5]}>
      {/* Trunk */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.4, height, 8]} />
        <meshStandardMaterial color="#2a1a0a" roughness={1} />
      </mesh>

      {/* Branches */}
      {[...Array(4)].map((_, i) => {
        const branchHeight = height * 0.4 + (i / 4) * height * 0.5;
        const branchLength = 1 + Math.random() * 2;
        const branchAngle = (i / 4) * Math.PI * 2 + Math.random() * 0.5;

        return (
          <mesh
            key={i}
            position={[
              Math.cos(branchAngle) * 0.5,
              branchHeight,
              Math.sin(branchAngle) * 0.5,
            ]}
            rotation={[
              Math.sin(branchAngle) * 0.5,
              branchAngle,
              Math.PI / 3 + Math.random() * 0.3,
            ]}
            castShadow
          >
            <cylinderGeometry args={[0.05, 0.1, branchLength, 6]} />
            <meshStandardMaterial color="#1f1008" roughness={1} />
          </mesh>
        );
      })}
    </group>
  );
}

function Lighting() {
  const lightRef = useRef<THREE.DirectionalLight>(null);

  useFrame(({ clock }) => {
    if (lightRef.current) {
      // Subtle light flicker for atmosphere
      const intensity = 0.3 + Math.sin(clock.elapsedTime * 0.5) * 0.05;
      lightRef.current.intensity = intensity;
    }
  });

  return (
    <>
      {/* Ambient light - very dim for apocalyptic feel */}
      <ambientLight intensity={0.15} color="#332222" />

      {/* Main directional light - dim sun through clouds */}
      <directionalLight
        ref={lightRef}
        position={[50, 50, 30]}
        intensity={0.3}
        color="#ff8844"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* Rim light for dramatic effect */}
      <directionalLight
        position={[-30, 20, -30]}
        intensity={0.1}
        color="#ff4422"
      />

      {/* Fill light */}
      <hemisphereLight
        intensity={0.2}
        color="#554433"
        groundColor="#110808"
      />
    </>
  );
}
