// scripts/generate-fallback-icons.js
const fs = require('fs');
const path = require('path');

console.log('🎨 Creating fallback icons...');

const iconsDir = path.join(__dirname, '../assets/images/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create minimal required icons as SVGs
const icons = [
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 16, name: 'favicon-16x16.png' }
];

icons.forEach(({ size, name }) => {
  const svg = createIconSVG(size);
  fs.writeFileSync(path.join(iconsDir, name), svg);
  console.log(`  ✓ ${name}`);
});

console.log('✅ Fallback icons created!');

function createIconSVG(size) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#2B1D4F"/>
  <circle cx="50%" cy="50%" r="40%" fill="#FFC107"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size/4}" 
        font-weight="bold" fill="#2B1D4F" text-anchor="middle" dy=".3em">M</text>
</svg>`;
}