import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// High-resolution SVG of the 9 Taş board icon from the splash/auth screen
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFDF9" />
      <stop offset="80%" stop-color="#FAF6F0" />
      <stop offset="100%" stop-color="#F2EAE0" />
    </radialGradient>
    <filter id="shadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#7A4219" flood-opacity="0.18" />
    </filter>
    <filter id="stoneShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.25" />
    </filter>
  </defs>

  <!-- Background Base (Squircle rounded app icon) -->
  <rect width="512" height="512" rx="112" fill="url(#bgGlow)" />
  <rect width="504" height="504" x="4" y="4" rx="108" fill="none" stroke="#D4C3B3" stroke-width="4" opacity="0.6" />

  <!-- Board Elements Group -->
  <g filter="url(#shadow)">
    <!-- Outer Square -->
    <rect x="76" y="76" width="360" height="360" rx="28" fill="none" stroke="#7A4219" stroke-width="12" />

    <!-- Middle Square -->
    <rect x="146" y="146" width="220" height="220" rx="20" fill="none" stroke="#A06836" stroke-width="9" />

    <!-- Inner Square -->
    <rect x="214" y="214" width="84" height="84" rx="12" fill="none" stroke="#B8860B" stroke-width="7" />

    <!-- Connection Lines -->
    <!-- Top line -->
    <line x1="256" y1="76" x2="256" y2="214" stroke="#A06836" stroke-width="9" stroke-linecap="round" />
    <!-- Right line -->
    <line x1="436" y1="256" x2="298" y2="256" stroke="#A06836" stroke-width="9" stroke-linecap="round" />
    <!-- Bottom line -->
    <line x1="256" y1="436" x2="256" y2="298" stroke="#A06836" stroke-width="9" stroke-linecap="round" />
    <!-- Left line -->
    <line x1="76" y1="256" x2="214" y2="256" stroke="#A06836" stroke-width="9" stroke-linecap="round" />
  </g>

  <!-- Stones around the perimeter (Matching the Splash Screen Layout) -->
  <g filter="url(#stoneShadow)">
    <!-- Top-Left (Gold) -->
    <circle cx="76" cy="76" r="22" fill="#D4AF37" stroke="#FFFFFF" stroke-width="4" />

    <!-- Top-Center (Dark Chocolate) -->
    <circle cx="256" cy="76" r="22" fill="#2C1810" stroke="#D4AF37" stroke-width="4" />

    <!-- Top-Right (Gold) -->
    <circle cx="436" cy="76" r="22" fill="#D4AF37" stroke="#FFFFFF" stroke-width="4" />

    <!-- Right-Center (Dark Chocolate) -->
    <circle cx="436" cy="256" r="22" fill="#2C1810" stroke="#D4AF37" stroke-width="4" />

    <!-- Bottom-Right (Gold) -->
    <circle cx="436" cy="436" r="22" fill="#D4AF37" stroke="#FFFFFF" stroke-width="4" />

    <!-- Bottom-Center (Dark Chocolate) -->
    <circle cx="256" cy="436" r="22" fill="#2C1810" stroke="#D4AF37" stroke-width="4" />

    <!-- Bottom-Left (Gold) -->
    <circle cx="76" cy="436" r="22" fill="#D4AF37" stroke="#FFFFFF" stroke-width="4" />

    <!-- Left-Center (Dark Chocolate) -->
    <circle cx="76" cy="256" r="22" fill="#2C1810" stroke="#D4AF37" stroke-width="4" />
  </g>
</svg>
`;

async function generate() {
  const publicDir = path.resolve(process.cwd(), 'public');

  // Save SVG
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent.trim());
  console.log('Saved icon.svg');

  // Generate PNG 512x512
  await sharp(Buffer.from(svgContent))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon512.png'));
  console.log('Generated icon512.png');

  // Generate PNG 192x192
  await sharp(Buffer.from(svgContent))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon192.png'));
  console.log('Generated icon192.png');

  // Generate Apple Touch Icon 180x180
  await sharp(Buffer.from(svgContent))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');
}

generate().catch(console.error);
