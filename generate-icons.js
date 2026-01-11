const fs = require('fs');
const { createCanvas } = require('canvas');
const { registerFont } = require('canvas');

// This script is optional and for development only.
// It requires Node.js and the 'canvas' package.

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Draw background circle with gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#512DA8');
  gradient.addColorStop(1, '#7B1FA2');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
  ctx.fill();

  // Draw green diamond shape
  ctx.fillStyle = '#388E3C';
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.moveTo(size*0.39, size*0.39);
  ctx.quadraticCurveTo(size/2, size*0.29, size*0.61, size*0.39);
  ctx.lineTo(size*0.61, size*0.61);
  ctx.quadraticCurveTo(size/2, size*0.71, size*0.39, size*0.61);
  ctx.closePath();
  ctx.fill();

  // Draw orange circle
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = '#F57C00';
  ctx.beginPath();
  ctx.arc(size/2, size/2, size*0.15625, 0, Math.PI * 2);
  ctx.fill();

  // Draw MP text
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#FFF3E0';
  ctx.font = `bold ${size*0.15625}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('MP', size/2, size/2);

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`assets/images/icons/icon-${size}x${size}.png`, buffer);
  console.log(`Generated icon-${size}x${size}.png`);
});