// Create game icons for different Android densities
const fs = require('fs');
const { createCanvas } = require('canvas');

// Ensure directories exist
const densities = ['ldpi', 'mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];
const sizes = [36, 48, 72, 96, 144, 192];

// Create directories if they don't exist
densities.forEach(density => {
    const dir = `res/icon/android/${density}-icon.png`;
    const pathParts = dir.split('/').slice(0, -1);
    let currentPath = '';
    
    pathParts.forEach(part => {
        currentPath += part + '/';
        if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath);
        }
    });
});

// Function to create icon for specific size
function createIcon(size, outputPath) {
    // Create canvas
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Draw background (green)
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#4CAF50');
    gradient.addColorStop(1, '#2E7D32');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Draw triangle (spaceship) - blue
    ctx.fillStyle = '#2196F3';
    ctx.beginPath();
    ctx.moveTo(size/2, size/6);
    ctx.lineTo(size/4, size - size/6);
    ctx.lineTo(size - size/4, size - size/6);
    ctx.closePath();
    ctx.fill();
    
    // Draw circle (enemy) - red
    ctx.fillStyle = '#F44336';
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/6, 0, Math.PI * 2);
    ctx.fill();
    
    // Save to file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Created ${size}x${size} icon: ${outputPath}`);
}

// Create icons for all densities
for (let i = 0; i < densities.length; i++) {
    const density = densities[i];
    const size = sizes[i];
    const outputPath = `res/icon/android/${density}-icon.png`;
    createIcon(size, outputPath);
}

console.log('All app icons created successfully!');