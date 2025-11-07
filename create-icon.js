// Create a simple game icon programmatically
const fs = require('fs');
const { createCanvas } = require('canvas');

// Create canvas
const canvas = createCanvas(192, 192);
const ctx = canvas.getContext('2d');

// Draw background
ctx.fillStyle = '#4CAF50';
ctx.fillRect(0, 0, 192, 192);

// Draw triangle (spaceship)
ctx.fillStyle = '#2196F3';
ctx.beginPath();
ctx.moveTo(96, 32);
ctx.lineTo(48, 160);
ctx.lineTo(144, 160);
ctx.closePath();
ctx.fill();

// Draw circle (enemy)
ctx.fillStyle = '#F44336';
ctx.beginPath();
ctx.arc(96, 96, 24, 0, Math.PI * 2);
ctx.fill();

// Save to file
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('res/icon/android/app-icon.png', buffer);

console.log('App icon created successfully!');