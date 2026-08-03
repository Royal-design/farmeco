import { scene } from "@/mock/art"

export const gallery = {
  hero: scene("🌾", { from: "#1f3d2e", via: "#3f5d3f", to: "#14271e", glow: "#b5d8a8" }, "", false),
  cattle: scene("🐄", { from: "#2f5d3f", via: "#4d7c58", to: "#27432f", glow: "#a8d5b0" }, "", false),
  poultry: scene("🐔", { from: "#9a6a2f", via: "#c08a4a", to: "#7a4f20", glow: "#f7d9a0" }, "", false),
  pasture: scene("🌿", { from: "#2f5d3f", via: "#7d8f4d", to: "#243a2b", glow: "#cfe0b0" }, "", false),
  morning: scene("🌅", { from: "#b05a4a", via: "#c99a5b", to: "#4a3557", glow: "#ffd9a0" }, "", false),
} as const
