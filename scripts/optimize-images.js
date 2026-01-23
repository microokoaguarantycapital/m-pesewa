// scripts/optimize-images.js
const fs = require('fs');
const path = require('path');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');

console.log('🖼️  Optimizing images for M-PESEWA...');

async function optimizeImages() {
  try {
    // Optimize PNG icons
    await imagemin(['assets/images/icons/*.png'], {
      destination: 'assets/images/icons',
      plugins: [
        imageminPngquant({
          quality: [0.6, 0.8]
        })
      ]
    });
    
    console.log('✅ PNG icons optimized');
    
    // Optimize SVGs
    await imagemin(['assets/images/**/*.svg'], {
      destination: 'assets/images',
      plugins: [
        imageminSvgo({
          plugins: [
            { name: 'removeViewBox', active: false },
            { name: 'removeDimensions', active: true },
            { name: 'cleanupIDs', active: true },
            { name: 'removeComments', active: true },
            { name: 'removeEmptyContainers', active: true }
          ]
        })
      ]
    });
    
    console.log('✅ SVG files optimized');
    
    // Create optimized directory for other images
    const optimizedDir = 'assets/images/optimized';
    if (!fs.existsSync(optimizedDir)) {
      fs.mkdirSync(optimizedDir, { recursive: true });
    }
    
    console.log('✨ Image optimization complete!');
    
  } catch (error) {
    console.error('❌ Optimization failed:', error.message);
  }
}

optimizeImages();