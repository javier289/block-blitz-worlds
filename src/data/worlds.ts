import { World } from '@/types/game';
import worldWoodImage from '@/assets/world-wood.jpg';
import worldBrickImage from '@/assets/world-brick.jpg';
import worldWaterImage from '@/assets/world-water.jpg';
import worldFireImage from '@/assets/world-fire.jpg';
import worldIceImage from '@/assets/world-ice.jpg';
import worldSpaceImage from '@/assets/world-space.jpg';
import worldTropicalImage from '@/assets/world-tropical.jpg';

export const WORLDS: World[] = [
  {
    id: 1,
    name: "Bosque Místico",
    theme: "wood",
    image: worldWoodImage,
    unlocked: true,
    completed: false,
    levels: Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      worldId: 1,
      number: i + 1,
      targetLines: Math.min(5 + Math.floor(i / 3), 20),
      timeLimit: i > 10 ? 300 - (i - 10) * 30 : undefined,
      unlocked: i === 0,
      completed: false,
      stars: 0
    }))
  },
  {
    id: 2,
    name: "Ciudad de Ladrillos",
    theme: "brick",
    image: worldBrickImage,
    unlocked: false,
    completed: false,
    levels: Array.from({ length: 15 }, (_, i) => ({
      id: i + 16,
      worldId: 2,
      number: i + 1,
      targetLines: Math.min(8 + Math.floor(i / 2), 25),
      timeLimit: i > 8 ? 270 - (i - 8) * 25 : undefined,
      unlocked: false,
      completed: false,
      stars: 0
    }))
  },
  {
    id: 3,
    name: "Océano Profundo",
    theme: "water",
    image: worldWaterImage,
    unlocked: false,
    completed: false,
    levels: Array.from({ length: 15 }, (_, i) => ({
      id: i + 31,
      worldId: 3,
      number: i + 1,
      targetLines: Math.min(12 + Math.floor(i / 2), 30),
      timeLimit: i > 5 ? 240 - (i - 5) * 20 : undefined,
      unlocked: false,
      completed: false,
      stars: 0
    }))
  },
  {
    id: 4,
    name: "Volcán Ardiente",
    theme: "fire",
    image: worldFireImage,
    unlocked: false,
    completed: false,
    levels: Array.from({ length: 15 }, (_, i) => ({
      id: i + 46,
      worldId: 4,
      number: i + 1,
      targetLines: Math.min(15 + Math.floor(i / 1.5), 35),
      timeLimit: i > 3 ? 210 - (i - 3) * 15 : undefined,
      unlocked: false,
      completed: false,
      stars: 0
    }))
  },
  {
    id: 5,
    name: "Picos Helados",
    theme: "ice",
    image: worldIceImage,
    unlocked: false,
    completed: false,
    levels: Array.from({ length: 15 }, (_, i) => ({
      id: i + 61,
      worldId: 5,
      number: i + 1,
      targetLines: Math.min(20 + i, 40),
      timeLimit: 180 - i * 10,
      unlocked: false,
      completed: false,
      stars: 0
    }))
  },
  {
    id: 6,
    name: "Galaxia Neón",
    theme: "space",
    image: worldSpaceImage,
    unlocked: false,
    completed: false,
    levels: Array.from({ length: 15 }, (_, i) => ({
      id: i + 76,
      worldId: 6,
      number: i + 1,
      targetLines: Math.min(25 + i * 2, 50),
      timeLimit: 150 - i * 8,
      unlocked: false,
      completed: false,
      stars: 0
    }))
  },
  {
    id: 7,
    name: "Paraíso Tropical",
    theme: "tropical",
    image: worldTropicalImage,
    unlocked: false,
    completed: false,
    levels: Array.from({ length: 15 }, (_, i) => ({
      id: i + 91,
      worldId: 7,
      number: i + 1,
      targetLines: Math.min(30 + i * 3, 60),
      timeLimit: 120 - i * 5,
      unlocked: false,
      completed: false,
      stars: 0
    }))
  }
];