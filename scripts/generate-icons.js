// scripts/generate-icons.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Generating PWA icons for M-PESEWA...');

// Ensure directories exist
const iconsDir = path.join(__dirname, '../assets/images/icons');
const placeholdersDir = path.join(__dirname, '../assets/images/placeholders');

[iconsDir, placeholdersDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Check if logo exists
const logoPath = path.join(__dirname, '../assets/images/logo.svg');
if (!fs.existsSync(logoPath)) {
  console.log('⚠️  Logo not found. Creating a temporary SVG logo...');
  
  const tempLogo = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#2B1D4F" rx="25%"/>
  <circle cx="256" cy="256" r="180" fill="#FFC107"/>
  <text x="256" y="256" font-family="Arial, Helvetica, sans-serif" font-size="96" 
        font-weight="bold" fill="#2B1D4F" text-anchor="middle" dy=".3em">M</text>
  <text x="256" y="380" font-family="Arial, Helvetica, sans-serif" font-size="48" 
        font-weight="600" fill="#FFFFFF" text-anchor="middle">PESEWA</text>
</svg>`;
  
  fs.writeFileSync(logoPath, tempLogo);
  console.log('✅ Created temporary logo');
}

// Try to use ImageMagick if available
try {
  execSync('convert --version', { stdio: 'pipe' });
  console.log('🖼️  Using ImageMagick to generate icons...');
  
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  const faviconSizes = [16, 32, 64];
  const appleSizes = [57, 60, 72, 76, 114, 120, 144, 152, 167, 180];
  
  // Generate main icons
  sizes.forEach(size => {
    const output = path.join(iconsDir, `icon-${size}x${size}.png`);
    execSync(`convert "${logoPath}" -resize ${size}x${size} "${output}"`);
    console.log(`  ✓ Generated ${size}x${size}`);
  });
  
  // Generate favicons
  faviconSizes.forEach(size => {
    const output = path.join(iconsDir, `favicon-${size}x${size}.png`);
    execSync(`convert "${logoPath}" -resize ${size}x${size} "${output}"`);
    console.log(`  ✓ Generated favicon ${size}x${size}`);
  });
  
  // Generate Apple touch icons
  appleSizes.forEach(size => {
    const output = path.join(iconsDir, `apple-touch-icon-${size}x${size}.png`);
    execSync(`convert "${logoPath}" -resize ${size}x${size} "${output}"`);
  });
  
  // Generate main Apple touch icon
  execSync(`convert "${logoPath}" -resize 180x180 "${path.join(iconsDir, 'apple-touch-icon.png')}"`);
  
  console.log('✅ All icons generated successfully!');
  
} catch (error) {
  console.log('❌ ImageMagick not available. Using fallback method...');
  
  // Create minimal required icons using Node.js canvas alternative
  const requiredIcons = [
    { size: 192, name: 'icon-192x192.png' },
    { size: 512, name: 'icon-512x512.png' },
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 16, name: 'favicon-16x16.png' }
  ];
  
  // Create simple colored squares as placeholders
  requiredIcons.forEach(({ size, name }) => {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#2B1D4F"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size/3}" fill="#FFC107"/>
  <text x="${size/2}" y="${size/2}" font-family="Arial" font-size="${size/5}" 
        font-weight="bold" fill="#2B1D4F" text-anchor="middle" dy=".3em">M</text>
</svg>`;
    
    fs.writeFileSync(path.join(iconsDir, name), svg);
    console.log(`  ✓ Created placeholder ${name}`);
  });
  
  console.log('⚠️  Install ImageMagick for better quality icons:');
  console.log('   - macOS: brew install imagemagick');
  console.log('   - Ubuntu: sudo apt install imagemagick');
  console.log('   - Windows: https://imagemagick.org/script/download.php');
}

// Generate group placeholder SVG
const groupPlaceholder = path.join(placeholdersDir, 'group-default.svg');
if (!fs.existsSync(groupPlaceholder)) {
  const groupSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <circle cx="200" cy="200" r="180" fill="#2B1D4F" opacity="0.95"/>
  <circle cx="200" cy="200" r="190" fill="none" stroke="#FFC107" stroke-width="3" stroke-dasharray="5,5"/>
  
  <!-- Group silhouette -->
  <g fill="#FFC107">
    <circle cx="200" cy="120" r="25"/>
    <circle cx="140" cy="180" r="18" opacity="0.9"/>
    <circle cx="260" cy="180" r="18" opacity="0.9"/>
    <circle cx="200" cy="240" r="15" opacity="0.8"/>
  </g>
  
  <!-- Connecting lines -->
  <g stroke="#FFC107" stroke-width="3" stroke-linecap="round" opacity="0.7">
    <line x1="175" y1="145" x2="165" y2="170"/>
    <line x1="225" y1="145" x2="235" y2="170"/>
    <line x1="185" y1="195" x2="195" y2="225"/>
    <line x1="215" y1="195" x2="205" y2="225"/>
  </g>
  
  <!-- Text -->
  <text x="200" y="330" font-family="Arial" font-size="28" font-weight="600" 
        fill="#FFC107" text-anchor="middle" opacity="0.8">GROUP</text>
</svg>`;
  
  fs.writeFileSync(groupPlaceholder, groupSvg);
  console.log('✅ Created group placeholder');
}

console.log('\n📋 Next steps:');
console.log('1. Run: npm start (to start development server)');
console.log('2. For production icons, use: npm run generate-icons:magick');
console.log('3. Test PWA: npm run test:lighthouse');
console.log('\n✨ Icon generation complete!');