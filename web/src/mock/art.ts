import { createSceneImage, createAvatarImage } from "@/utils/art"

export interface Palette {
  from: string
  via: string
  to: string
  glow: string
}

export const CATEGORY_PALETTES: Record<string, { base: Palette; view: Palette; warm: Palette }> = {
  cattle: {
    base: { from: "#2f5d3f", via: "#4d7c58", to: "#27432f", glow: "#a8d5b0" },
    view: { from: "#3a6b49", via: "#5b8f68", to: "#2c4c37", glow: "#c4e8cb" },
    warm: { from: "#55663f", via: "#7d8f4d", to: "#3f4a2c", glow: "#e0e8b0" },
  },
  "goats-sheep": {
    base: { from: "#b07d3f", via: "#c99a5b", to: "#8a5a2b", glow: "#f4d9a0" },
    view: { from: "#a36f35", via: "#bd8f4f", to: "#7d5026", glow: "#f0cf96" },
    warm: { from: "#8a6a3f", via: "#a8895b", to: "#66502b", glow: "#ece0b0" },
  },
  pigs: {
    base: { from: "#b05a4a", via: "#c97a5b", to: "#8a3f32", glow: "#f2b8a0" },
    view: { from: "#a34f40", via: "#bc6f52", to: "#7d382d", glow: "#eeae95" },
    warm: { from: "#a05a3f", via: "#c07f5b", to: "#7a422b", glow: "#f0cdb0" },
  },
  poultry: {
    base: { from: "#9a6a2f", via: "#c08a4a", to: "#7a4f20", glow: "#f7d9a0" },
    view: { from: "#8f602a", via: "#b48042", to: "#6f481d", glow: "#f2cf95" },
    warm: { from: "#8a5f2f", via: "#b08a55", to: "#664520", glow: "#f0e0b0" },
  },
  horses: {
    base: { from: "#2f5f66", via: "#3f7a82", to: "#21464b", glow: "#a8dbe0" },
    view: { from: "#35686f", via: "#46868e", to: "#264d52", glow: "#bde5e8" },
    warm: { from: "#4a6260", via: "#6a807c", to: "#33453f", glow: "#d0e0d8" },
  },
  rabbits: {
    base: { from: "#6a4a7a", via: "#8a5f99", to: "#4a3557", glow: "#d8b8e8" },
    view: { from: "#5f4370", via: "#7d5490", to: "#443051", glow: "#cfaedd" },
    warm: { from: "#7a5a6a", via: "#99759a", to: "#57405a", glow: "#e0c8d8" },
  },
  supplies: {
    base: { from: "#8a7a3f", via: "#b09a55", to: "#6a5a2b", glow: "#eee0a0" },
    view: { from: "#7f702f", via: "#a58f4d", to: "#605126", glow: "#e8d89a" },
    warm: { from: "#7a6a35", via: "#a08a4d", to: "#5c4e26", glow: "#ece0b0" },
  },
  "eggs-dairy": {
    base: { from: "#b08a55", via: "#d0aa6a", to: "#8a643f", glow: "#fff0d0" },
    view: { from: "#a57f4a", via: "#c59f5f", to: "#7f5c38", glow: "#f7e7c4" },
    warm: { from: "#b0955f", via: "#d0b57f", to: "#8a7545", glow: "#f8f0d8" },
  },
  misc: {
    base: { from: "#3f5d55", via: "#5b7a6a", to: "#2b4540", glow: "#c0e0d0" },
    view: { from: "#46563f", via: "#6a7f58", to: "#333f2c", glow: "#d8e8c4" },
    warm: { from: "#5d5540", via: "#7f744d", to: "#45402c", glow: "#e8e0c0" },
  },
}

export function scene(
  emoji: string,
  palette: Palette,
  label?: string,
  ring = true
) {
  return createSceneImage({
    from: palette.from,
    via: palette.via,
    to: palette.to,
    glow: palette.glow,
    emoji,
    label,
    ring,
  })
}

export function productImages(
  emoji: string,
  palettes: { base: Palette; view: Palette; warm: Palette },
  label?: string
) {
  return [
    scene(emoji, palettes.base, label),
    scene(emoji, palettes.view, label, false),
    scene(emoji, palettes.warm, label, false),
  ]
}

export function avatar(from: string, to: string, label: string) {
  return createAvatarImage({ from, to, label })
}
