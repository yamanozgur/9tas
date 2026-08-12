const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

if (!fs.existsSync(path.join(__dirname, '../public/assets'))) {
  fs.mkdirSync(path.join(__dirname, '../public/assets'), { recursive: true });
}

try {
  require.resolve('sharp');
} catch (e) {
  console.log('Installing sharp...');
  execSync('npm install --no-save sharp', { stdio: 'inherit' });
}

const sharp = require('sharp');

const whiteStoneSvg = `<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="wGrad" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="40%" stop-color="#F5F2EC" />
      <stop offset="85%" stop-color="#D9CFC1" />
      <stop offset="100%" stop-color="#B8A995" />
    </radialGradient>
  </defs>
  <circle cx="128" cy="128" r="110" fill="url(#wGrad)" stroke="#432C0B" stroke-width="8" />
  <ellipse cx="96" cy="84" rx="38" ry="22" fill="#FFFFFF" opacity="0.8" transform="rotate(-25 96 84)"/>
</svg>`;

const blackStoneSvg = `<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bGrad" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#5B5B5B" />
      <stop offset="35%" stop-color="#2D2D2D" />
      <stop offset="80%" stop-color="#181818" />
      <stop offset="100%" stop-color="#0A0A0A" />
    </radialGradient>
  </defs>
  <circle cx="128" cy="128" r="110" fill="url(#bGrad)" stroke="#432C0B" stroke-width="8" />
  <ellipse cx="96" cy="84" rx="38" ry="22" fill="#FFFFFF" opacity="0.35" transform="rotate(-25 96 84)"/>
</svg>`;

async function generate() {
  await sharp(Buffer.from(whiteStoneSvg)).webp({ quality: 95 }).toFile(path.join(__dirname, '../public/assets/wht_stn.webp'));
  await sharp(Buffer.from(blackStoneSvg)).webp({ quality: 95 }).toFile(path.join(__dirname, '../public/assets/blck_stn.webp'));
  console.log('Successfully generated wht_stn.webp and blck_stn.webp in /public/assets!');
}

generate().catch(console.error);
