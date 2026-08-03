export interface SceneImageOptions {
  from: string
  via: string
  to: string
  glow?: string
  emoji?: string
  label?: string
  ring?: boolean
}

function buildSceneSvg(options: SceneImageOptions) {
  const { from, via, to, glow = "#ffffff", emoji, label, ring = true } = options

  const rings = ring
    ? `
      <circle cx="400" cy="400" r="150" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="1.5"/>
      <circle cx="400" cy="400" r="196" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <circle cx="400" cy="400" r="248" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>`
    : ""

  const glyph = emoji
    ? `<text x="400" y="438" text-anchor="middle" dominant-baseline="middle" font-size="300" style="font-family:'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','Twemoji Mozilla',sans-serif">${emoji}</text>`
    : ""

  const caption = label
    ? `<text x="400" y="668" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="34" font-weight="600" letter-spacing="6" fill="rgba(255,255,255,0.55)" text-transform="uppercase">${label}</text>`
    : ""

  const grain = `
    <rect x="0" y="0" width="800" height="800" filter="url(#grain)" opacity="0.5"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="50%" stop-color="${via}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="38%" r="55%">
      <stop offset="0%" stop-color="${glow}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${glow}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
      <stop offset="60%" stop-color="rgba(0,0,0,0)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.22)"/>
    </radialGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 0.09"/>
      </feComponentTransfer>
    </filter>
    <filter id="soft">
      <feGaussianBlur stdDeviation="6"/>
    </filter>
  </defs>
  <rect width="800" height="800" fill="url(#bg)"/>
  <rect width="800" height="800" fill="url(#glow)"/>
  <circle cx="400" cy="330" r="180" fill="#ffffff" opacity="0.12" filter="url(#soft)"/>
  ${grain}
  ${rings}
  ${glyph}
  ${caption}
  <rect width="800" height="800" fill="url(#vignette)"/>
</svg>`
}

export function createSceneImage(options: SceneImageOptions) {
  const svg = buildSceneSvg(options)
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export interface AvatarImageOptions {
  from: string
  to: string
  label: string
  seed?: number
}

export function createAvatarImage(options: AvatarImageOptions) {
  const { from, to, label } = options
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" fill="url(#g)"/>
  <text x="100" y="108" text-anchor="middle" dominant-baseline="middle" font-family="Inter,system-ui,sans-serif" font-size="64" font-weight="600" fill="rgba(255,255,255,0.95)">${label}</text>
</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
