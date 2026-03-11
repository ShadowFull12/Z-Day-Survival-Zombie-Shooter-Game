import { create } from "zustand";

export type GameState = "menu" | "playing" | "paused" | "shop" | "gameover" | "levelComplete" | "instructions" | "options";

export interface Weapon {
  id: string;
  name: string;
  shortcut: string;
  price: number;
  damage: number;
  ammo: number;
  maxAmmo: number;
  fireRate: number;
  spread: number;
  bought: boolean;
  equipped: boolean;
  bulletsPerShot?: number;
}

export interface Powerup {
  id: string;
  name: string;
  description: string;
  levels: { price: number; boost: number }[];
  currentLevel: number;
}

export interface Enemy {
  id: string;
  position: [number, number, number];
  health: number;
  maxHealth: number;
  type: "normal" | "fast" | "tank";
  speed: number;
}

interface GameStore {
  // Game state
  gameState: GameState;
  setGameState: (state: GameState) => void;

  // Player stats
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  shield: number;
  maxShield: number;
  money: number;
  level: number;
  kills: number;

  // Player upgrades
  staminaRegenRate: number;
  moveSpeed: number;

  // Inventory
  healthPacks: number;
  grenades: number;

  // Weapons
  weapons: Weapon[];
  currentWeaponId: string;
  getCurrentWeapon: () => Weapon | undefined;
  switchWeapon: (weaponId: string) => void;
  shoot: () => boolean;
  buyWeapon: (weaponId: string) => boolean;
  refillAmmo: (weaponId: string) => boolean;

  // Powerups
  powerups: Powerup[];
  buyPowerup: (powerupId: string) => boolean;

  // Enemies
  enemies: Enemy[];
  addEnemy: (enemy: Enemy) => void;
  removeEnemy: (enemyId: string) => void;
  damageEnemy: (enemyId: string, damage: number) => void;
  clearEnemies: () => void;

  // Actions
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
  useHealthPack: () => boolean;
  addMoney: (amount: number) => void;
  spendMoney: (amount: number) => boolean;
  buyItem: (itemType: "healthPack" | "grenade" | "armor", price: number) => boolean;
  useStamina: (amount: number) => boolean;
  regenerateStamina: (deltaTime: number) => void;
  nextLevel: () => void;
  resetGame: () => void;

  // Audio
  isMuted: boolean;
  volume: number;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
}

const initialWeapons: Weapon[] = [
  {
    id: "pistol",
    name: "Pistol",
    shortcut: "1",
    price: 0,
    damage: 1,
    ammo: 30,
    maxAmmo: 30,
    fireRate: 400,
    spread: 0.02,
    bought: true,
    equipped: true,
  },
  {
    id: "shotgun",
    name: "Shotgun",
    shortcut: "2",
    price: 500,
    damage: 2,
    ammo: 30,
    maxAmmo: 30,
    fireRate: 500,
    spread: 0.08,
    bought: false,
    equipped: false,
    bulletsPerShot: 5,
  },
  {
    id: "smg",
    name: "SMG",
    shortcut: "3",
    price: 800,
    damage: 2,
    ammo: 50,
    maxAmmo: 50,
    fireRate: 150,
    spread: 0.04,
    bought: false,
    equipped: false,
  },
  {
    id: "ak47",
    name: "AK-47",
    shortcut: "4",
    price: 1000,
    damage: 3,
    ammo: 40,
    maxAmmo: 40,
    fireRate: 180,
    spread: 0.03,
    bought: false,
    equipped: false,
  },
  {
    id: "sniper",
    name: "Sniper",
    shortcut: "5",
    price: 1500,
    damage: 10,
    ammo: 10,
    maxAmmo: 10,
    fireRate: 1200,
    spread: 0.005,
    bought: false,
    equipped: false,
  },
  {
    id: "minigun",
    name: "Minigun",
    shortcut: "6",
    price: 2500,
    damage: 4,
    ammo: 200,
    maxAmmo: 200,
    fireRate: 80,
    spread: 0.06,
    bought: false,
    equipped: false,
    bulletsPerShot: 2,
  },
];

const initialPowerups: Powerup[] = [
  {
    id: "maxStamina",
    name: "Max Stamina",
    description: "Increase maximum stamina capacity",
    levels: [
      { price: 100, boost: 20 },
      { price: 200, boost: 40 },
      { price: 400, boost: 60 },
      { price: 800, boost: 80 },
      { price: 1600, boost: 100 },
    ],
    currentLevel: 0,
  },
  {
    id: "staminaRegen",
    name: "Stamina Regen",
    description: "Faster stamina regeneration",
    levels: [
      { price: 100, boost: 5 },
      { price: 200, boost: 10 },
      { price: 400, boost: 15 },
      { price: 800, boost: 20 },
      { price: 1600, boost: 25 },
    ],
    currentLevel: 0,
  },
  {
    id: "maxHealth",
    name: "Max Health",
    description: "Increase maximum health",
    levels: [
      { price: 150, boost: 50 },
      { price: 300, boost: 100 },
      { price: 600, boost: 150 },
      { price: 1200, boost: 200 },
      { price: 2400, boost: 250 },
    ],
    currentLevel: 0,
  },
  {
    id: "maxShield",
    name: "Shield Capacity",
    description: "Increase maximum shield",
    levels: [
      { price: 200, boost: 25 },
      { price: 400, boost: 50 },
      { price: 800, boost: 75 },
      { price: 1600, boost: 100 },
      { price: 3200, boost: 125 },
    ],
    currentLevel: 0,
  },
  {
    id: "moveSpeed",
    name: "Movement Speed",
    description: "Move faster",
    levels: [
      { price: 150, boost: 10 },
      { price: 300, boost: 20 },
      { price: 600, boost: 30 },
      { price: 1200, boost: 40 },
      { price: 2400, boost: 50 },
    ],
    currentLevel: 0,
  },
];

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  gameState: "menu",
  health: 100,
  maxHealth: 100,
  stamina: 50,
  maxStamina: 50,
  shield: 0,
  maxShield: 100,
  money: 0,
  level: 1,
  kills: 0,
  staminaRegenRate: 10,
  moveSpeed: 5,
  healthPacks: 0,
  grenades: 0,
  weapons: initialWeapons,
  currentWeaponId: "pistol",
  powerups: initialPowerups,
  enemies: [],
  isMuted: false,
  volume: 50,

  // Game state
  setGameState: (state) => set({ gameState: state }),

  // Weapon functions
  getCurrentWeapon: () => {
    const state = get();
    return state.weapons.find((w) => w.id === state.currentWeaponId);
  },

  switchWeapon: (weaponId) => {
    const weapon = get().weapons.find((w) => w.id === weaponId);
    if (weapon && weapon.bought) {
      set((state) => ({
        weapons: state.weapons.map((w) => ({
          ...w,
          equipped: w.id === weaponId,
        })),
        currentWeaponId: weaponId,
      }));
    }
  },

  shoot: () => {
    const weapon = get().getCurrentWeapon();
    if (weapon && weapon.ammo > 0) {
      set((state) => ({
        weapons: state.weapons.map((w) =>
          w.id === state.currentWeaponId ? { ...w, ammo: w.ammo - 1 } : w
        ),
      }));
      return true;
    }
    return false;
  },

  buyWeapon: (weaponId) => {
    const state = get();
    const weapon = state.weapons.find((w) => w.id === weaponId);
    if (weapon && !weapon.bought && state.money >= weapon.price) {
      set((prevState) => ({
        money: prevState.money - weapon.price,
        weapons: prevState.weapons.map((w) =>
          w.id === weaponId ? { ...w, bought: true, equipped: true } : { ...w, equipped: false }
        ),
        currentWeaponId: weaponId,
      }));
      return true;
    }
    return false;
  },

  refillAmmo: (weaponId) => {
    const state = get();
    const weapon = state.weapons.find((w) => w.id === weaponId);
    const refillCost = weapon ? Math.floor(weapon.price / 4) : 0;
    if (weapon && weapon.bought && state.money >= refillCost && weapon.ammo < weapon.maxAmmo) {
      set((prevState) => ({
        money: prevState.money - refillCost,
        weapons: prevState.weapons.map((w) =>
          w.id === weaponId ? { ...w, ammo: w.maxAmmo } : w
        ),
      }));
      return true;
    }
    return false;
  },

  // Powerup functions
  buyPowerup: (powerupId) => {
    const state = get();
    const powerup = state.powerups.find((p) => p.id === powerupId);
    if (powerup && powerup.currentLevel < powerup.levels.length) {
      const level = powerup.levels[powerup.currentLevel];
      if (state.money >= level.price) {
        set((prevState) => {
          const newPowerups = prevState.powerups.map((p) =>
            p.id === powerupId ? { ...p, currentLevel: p.currentLevel + 1 } : p
          );

          // Apply powerup effect
          let updates: Partial<GameStore> = {
            money: prevState.money - level.price,
            powerups: newPowerups,
          };

          switch (powerupId) {
            case "maxStamina":
              updates.maxStamina = 50 + level.boost;
              break;
            case "staminaRegen":
              updates.staminaRegenRate = 10 + level.boost;
              break;
            case "maxHealth":
              updates.maxHealth = 100 + level.boost;
              break;
            case "maxShield":
              updates.maxShield = 100 + level.boost;
              break;
            case "moveSpeed":
              updates.moveSpeed = 5 + level.boost / 10;
              break;
          }

          return updates;
        });
        return true;
      }
    }
    return false;
  },

  // Enemy functions
  addEnemy: (enemy) => set((state) => ({ enemies: [...state.enemies, enemy] })),

  removeEnemy: (enemyId) =>
    set((state) => ({
      enemies: state.enemies.filter((e) => e.id !== enemyId),
      kills: state.kills + 1,
    })),

  damageEnemy: (enemyId, damage) =>
    set((state) => ({
      enemies: state.enemies.map((e) =>
        e.id === enemyId ? { ...e, health: e.health - damage } : e
      ),
    })),

  clearEnemies: () => set({ enemies: [] }),

  // Player actions
  takeDamage: (amount) =>
    set((state) => {
      const shieldDamage = Math.min(state.shield, amount);
      const healthDamage = amount - shieldDamage;
      const newHealth = Math.max(0, state.health - healthDamage);
      const newShield = state.shield - shieldDamage;

      if (newHealth <= 0) {
        return { health: 0, shield: newShield, gameState: "gameover" };
      }

      return { health: newHealth, shield: newShield };
    }),

  heal: (amount) =>
    set((state) => ({
      health: Math.min(state.maxHealth, state.health + amount),
    })),

  useHealthPack: () => {
    const state = get();
    if (state.healthPacks > 0 && state.health < state.maxHealth) {
      set((prevState) => ({
        healthPacks: prevState.healthPacks - 1,
        health: Math.min(prevState.maxHealth, prevState.health + 50),
      }));
      return true;
    }
    return false;
  },

  addMoney: (amount) => set((state) => ({ money: state.money + amount })),

  spendMoney: (amount) => {
    const state = get();
    if (state.money >= amount) {
      set({ money: state.money - amount });
      return true;
    }
    return false;
  },

  buyItem: (itemType, price) => {
    const state = get();
    if (state.money >= price) {
      const updates: Partial<GameStore> = { money: state.money - price };

      switch (itemType) {
        case "healthPack":
          updates.healthPacks = state.healthPacks + 1;
          break;
        case "grenade":
          updates.grenades = state.grenades + 1;
          break;
        case "armor":
          updates.shield = Math.min(state.maxShield, state.shield + 50);
          break;
      }

      set(updates);
      return true;
    }
    return false;
  },

  useStamina: (amount) => {
    const state = get();
    if (state.stamina >= amount) {
      set({ stamina: state.stamina - amount });
      return true;
    }
    return false;
  },

  regenerateStamina: (deltaTime) =>
    set((state) => ({
      stamina: Math.min(state.maxStamina, state.stamina + state.staminaRegenRate * deltaTime),
    })),

  nextLevel: () =>
    set((state) => ({
      level: state.level + 1,
      gameState: "playing",
    })),

  resetGame: () =>
    set({
      gameState: "menu",
      health: 100,
      maxHealth: 100,
      stamina: 50,
      maxStamina: 50,
      shield: 0,
      maxShield: 100,
      money: 0,
      level: 1,
      kills: 0,
      staminaRegenRate: 10,
      moveSpeed: 5,
      healthPacks: 0,
      grenades: 0,
      weapons: initialWeapons.map((w) => ({
        ...w,
        bought: w.id === "pistol",
        equipped: w.id === "pistol",
        ammo: w.maxAmmo,
      })),
      currentWeaponId: "pistol",
      powerups: initialPowerups.map((p) => ({ ...p, currentLevel: 0 })),
      enemies: [],
    }),

  // Audio
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setVolume: (volume) => set({ volume }),
}));
