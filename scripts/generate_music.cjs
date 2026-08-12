const { execSync } = require('child_process');
const path = require('path');

const outputMp3 = path.join(__dirname, '../public/assets/3stone.mp3');

// Simple sine expression with no problematic characters for ffmpeg
const ffmpegCmd = `ffmpeg -y -f lavfi -i "sine=frequency=220:sample_rate=44100:duration=10" -af "volume=0.2" -b:a 128k "${outputMp3}"`;

try {
  console.log('Generating 3stone.mp3 ambient audio loop via ffmpeg...');
  execSync(ffmpegCmd, { stdio: 'inherit' });
  console.log('Successfully created /public/assets/3stone.mp3!');
} catch (err) {
  console.error('Error generating audio:', err);
}
