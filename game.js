// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');

// Game state
let score = 0;
let highScore = localStorage.getItem('spaceDefenderHighScore') || 0;
let gameRunning = true;
let playerX = canvas.width / 2;
let playerY = canvas.height - 50;
let playerSize = 30;
let enemies = [];
let bullets = [];
let particles = [];
let enemySpeed = 2;
let bulletSpeed = 6;
let enemySpawnRate = 60; // frames between enemy spawns
let frameCount = 0;
let difficultyLevel = 1;

// Audio context for sound effects
let audioContext;

// Initialize audio
function initAudio() {
    try {
        // Create audio context on first user interaction
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a simple click sound
        document.body.addEventListener('touchstart', createAudioContext, { once: true });
        document.body.addEventListener('mousedown', createAudioContext, { once: true });
    } catch (e) {
        console.log('Web Audio API is not supported in this browser');
    }
}

function createAudioContext() {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    } else if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Play sound effect
function playSound(frequency, duration, type = 'sine') {
    if (!audioContext) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Update high score
function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('spaceDefenderHighScore', highScore);
    }
}

// Touch/mouse handling for mobile
let touchX = 0;
let isTouching = false;

// Initialize audio
initAudio();

// Initialize score display
scoreElement.textContent = `Score: ${score} | High Score: ${highScore}`;

// Event listeners
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);
canvas.addEventListener('touchend', handleTouchEnd);
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);
restartBtn.addEventListener('click', restartGame);

// Touch handling functions
function handleTouchStart(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    touchX = e.touches[0].clientX - rect.left;
    isTouching = true;
}

function handleTouchMove(e) {
    e.preventDefault();
    if (isTouching) {
        const rect = canvas.getBoundingClientRect();
        touchX = e.touches[0].clientX - rect.left;
    }
}

function handleTouchEnd(e) {
    e.preventDefault();
    isTouching = false;
}

// Mouse handling functions
function handleMouseDown(e) {
    const rect = canvas.getBoundingClientRect();
    touchX = e.clientX - rect.left;
    isTouching = true;
}

function handleMouseMove(e) {
    if (isTouching) {
        const rect = canvas.getBoundingClientRect();
        touchX = e.clientX - rect.left;
    }
}

function handleMouseUp(e) {
    isTouching = false;
}

// Player movement
function updatePlayer() {
    if (isTouching) {
        playerX = touchX;
        // Keep player within canvas bounds
        if (playerX < playerSize/2) playerX = playerSize/2;
        if (playerX > canvas.width - playerSize/2) playerX = canvas.width - playerSize/2;
    }
}

// Create explosion particles
function createExplosion(x, y, color) {
    const particleCount = 10;
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        const size = Math.random() * 3 + 1;
        const life = Math.random() * 30 + 20;
        
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: size,
            color: color,
            life: life,
            maxLife: life
        });
    }
}

// Draw Patrick Star character
function drawPatrick(x, y, size) {
    const halfSize = size / 2;
    
    // Draw pink body
    ctx.fillStyle = '#FFB6C1'; // Pink color for Patrick
    ctx.beginPath();
    ctx.moveTo(x, y - halfSize); // Top point
    ctx.lineTo(x - halfSize, y + halfSize); // Bottom left
    ctx.lineTo(x + halfSize, y + halfSize); // Bottom right
    ctx.closePath();
    ctx.fill();
    
    // Draw outline
    ctx.strokeStyle = '#CC9999';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw eyes
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x - halfSize/3, y - halfSize/4, halfSize/6, 0, Math.PI * 2); // Left eye
    ctx.arc(x + halfSize/3, y - halfSize/4, halfSize/6, 0, Math.PI * 2); // Right eye
    ctx.fill();
    
    // Draw pupils
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x - halfSize/3, y - halfSize/4, halfSize/12, 0, Math.PI * 2); // Left pupil
    ctx.arc(x + halfSize/3, y - halfSize/4, halfSize/12, 0, Math.PI * 2); // Right pupil
    ctx.fill();
    
    // Draw mouth (smile)
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y + halfSize/6, halfSize/4, 0.2, Math.PI - 0.2);
    ctx.stroke();
}

// Draw Octopus character
function drawOctopus(x, y, radius) {
    // Draw head
    ctx.fillStyle = '#8B4513'; // Brown color for octopus
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw outline
    ctx.strokeStyle = '#5D2906';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw eyes
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x - radius/3, y - radius/6, radius/4, 0, Math.PI * 2); // Left eye
    ctx.arc(x + radius/3, y - radius/6, radius/4, 0, Math.PI * 2); // Right eye
    ctx.fill();
    
    // Draw pupils
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x - radius/3, y - radius/6, radius/8, 0, Math.PI * 2); // Left pupil
    ctx.arc(x + radius/3, y - radius/6, radius/8, 0, Math.PI * 2); // Right pupil
    ctx.fill();
    
    // Draw tentacles
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = radius/6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    
    // Draw 4 tentacles
    for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI/3) + Math.PI/3;
        const startX = x + Math.cos(angle) * radius * 0.7;
        const startY = y + Math.sin(angle) * radius * 0.7;
        const endX = x + Math.cos(angle) * radius * 1.5;
        const endY = y + Math.sin(angle) * radius * 1.5;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
}

// Draw Ice Cream bullet
function drawIceCream(x, y, width, height) {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    
    // Draw cone (wafer)
    ctx.fillStyle = '#D2B48C'; // Tan color for wafer
    ctx.beginPath();
    ctx.moveTo(x, y + halfHeight); // Bottom point
    ctx.lineTo(x - halfWidth/2, y - halfHeight); // Top left
    ctx.lineTo(x + halfWidth/2, y - halfHeight); // Top right
    ctx.closePath();
    ctx.fill();
    
    // Draw ice cream scoop
    ctx.fillStyle = '#FF69B4'; // Pink color for ice cream
    ctx.beginPath();
    ctx.arc(x, y - halfHeight - 5, halfWidth, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw highlight on ice cream
    ctx.fillStyle = '#FFB6C1'; // Lighter pink
    ctx.beginPath();
    ctx.arc(x - halfWidth/3, y - halfHeight - 8, halfWidth/3, 0, Math.PI * 2);
    ctx.fill();
}

// Update particles
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].x += particles[i].vx;
        particles[i].y += particles[i].vy;
        particles[i].life--;
        
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }
}

// Enemy creation
function createEnemy() {
    const size = Math.random() * 20 + 10;
    enemies.push({
        x: Math.random() * (canvas.width - size),
        y: -size,
        size: size,
        speed: enemySpeed + Math.random() * 2
    });
}

// Shooting
function shoot() {
    bullets.push({
        x: playerX,
        y: playerY - playerSize/2,
        width: 4,
        height: 10
    });
    
    // Play shoot sound
    playSound(800, 0.1, 'square');
}

// Update bullets
function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bulletSpeed;
        
        // Remove bullets that go off screen
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
            continue;
        }
        
        // Check for collisions with enemies
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (checkCollision(bullets[i], enemies[j])) {
                // Create explosion effect
                createExplosion(bullets[i].x, bullets[i].y, '#F44336');
                
                // Remove both bullet and enemy
                bullets.splice(i, 1);
                enemies.splice(j, 1);
                score += 10;
                scoreElement.textContent = `Score: ${score} | High Score: ${highScore} | Level: ${difficultyLevel}`;
                
                // Play explosion sound
                playSound(200, 0.3, 'sawtooth');
                break;
            }
        }
    }
}

// Update difficulty based on score
function updateDifficulty() {
    difficultyLevel = Math.floor(score / 100) + 1;
    enemySpawnRate = Math.max(20, 60 - difficultyLevel * 5); // Spawn enemies faster as difficulty increases
    enemySpeed = 2 + difficultyLevel * 0.5; // Enemies move faster as difficulty increases
}

// Update enemies
function updateEnemies() {
    // Update difficulty based on score
    updateDifficulty();
    
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].y += enemies[i].speed;
        
        // Remove enemies that go off screen
        if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
            continue;
        }
        
        // Check for collision with player
        const player = {x: playerX, y: playerY, size: playerSize};
        if (checkPlayerCollision(player, enemies[i])) {
            gameOver();
        }
    }
}

// Collision detection
function checkCollision(bullet, enemy) {
    return bullet.x < enemy.x + enemy.size &&
           bullet.x + bullet.width > enemy.x &&
           bullet.y < enemy.y + enemy.size &&
           bullet.y + bullet.height > enemy.y;
}

function checkPlayerCollision(player, enemy) {
    const dx = player.x - (enemy.x + enemy.size/2);
    const dy = player.y - (enemy.y + enemy.size/2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (player.size/2 + enemy.size/2);
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw player (Patrick Star from SpongeBob)
    drawPatrick(playerX, playerY, playerSize);
    
    // Draw enemies (Octopus)
    for (let enemy of enemies) {
        drawOctopus(enemy.x + enemy.size/2, enemy.y + enemy.size/2, enemy.size/2);
    }
    
    // Draw bullets (Ice Cream)
    for (let bullet of bullets) {
        drawIceCream(bullet.x, bullet.y, bullet.width, bullet.height);
    }
    
    // Draw particles
    for (let particle of particles) {
        const alpha = particle.life / particle.maxLife;
        ctx.fillStyle = particle.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Draw Patrick Star character
function drawPatrick(x, y, size) {
    const halfSize = size / 2;
    
    // Draw pink body
    ctx.fillStyle = '#FFB6C1'; // Pink color for Patrick
    ctx.beginPath();
    ctx.moveTo(x, y - halfSize); // Top point
    ctx.lineTo(x - halfSize, y + halfSize); // Bottom left
    ctx.lineTo(x + halfSize, y + halfSize); // Bottom right
    ctx.closePath();
    ctx.fill();
    
    // Draw outline
    ctx.strokeStyle = '#CC9999';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw eyes
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x - halfSize/3, y - halfSize/4, halfSize/6, 0, Math.PI * 2); // Left eye
    ctx.arc(x + halfSize/3, y - halfSize/4, halfSize/6, 0, Math.PI * 2); // Right eye
    ctx.fill();
    
    // Draw pupils
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x - halfSize/3, y - halfSize/4, halfSize/12, 0, Math.PI * 2); // Left pupil
    ctx.arc(x + halfSize/3, y - halfSize/4, halfSize/12, 0, Math.PI * 2); // Right pupil
    ctx.fill();
    
    // Draw mouth (smile)
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y + halfSize/6, halfSize/4, 0.2, Math.PI - 0.2);
    ctx.stroke();
}

// Draw Octopus character
function drawOctopus(x, y, radius) {
    // Draw head
    ctx.fillStyle = '#8B4513'; // Brown color for octopus
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw outline
    ctx.strokeStyle = '#5D2906';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw eyes
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x - radius/3, y - radius/6, radius/4, 0, Math.PI * 2); // Left eye
    ctx.arc(x + radius/3, y - radius/6, radius/4, 0, Math.PI * 2); // Right eye
    ctx.fill();
    
    // Draw pupils
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x - radius/3, y - radius/6, radius/8, 0, Math.PI * 2); // Left pupil
    ctx.arc(x + radius/3, y - radius/6, radius/8, 0, Math.PI * 2); // Right pupil
    ctx.fill();
    
    // Draw tentacles
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = radius/6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    
    // Draw 4 tentacles
    for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI/3) + Math.PI/3;
        const startX = x + Math.cos(angle) * radius * 0.7;
        const startY = y + Math.sin(angle) * radius * 0.7;
        const endX = x + Math.cos(angle) * radius * 1.5;
        const endY = y + Math.sin(angle) * radius * 1.5;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
}

// Draw Ice Cream bullet
function drawIceCream(x, y, width, height) {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    
    // Draw cone (wafer)
    ctx.fillStyle = '#D2B48C'; // Tan color for wafer
    ctx.beginPath();
    ctx.moveTo(x, y + halfHeight); // Bottom point
    ctx.lineTo(x - halfWidth/2, y - halfHeight); // Top left
    ctx.lineTo(x + halfWidth/2, y - halfHeight); // Top right
    ctx.closePath();
    ctx.fill();
    
    // Draw ice cream scoop
    ctx.fillStyle = '#FF69B4'; // Pink color for ice cream
    ctx.beginPath();
    ctx.arc(x, y - halfHeight - 5, halfWidth, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw highlight on ice cream
    ctx.fillStyle = '#FFB6C1'; // Lighter pink
    ctx.beginPath();
    ctx.arc(x - halfWidth/3, y - halfHeight - 8, halfWidth/3, 0, Math.PI * 2);
    ctx.fill();
}

// Game over
function gameOver() {
    gameRunning = false;
    updateHighScore();
    finalScoreElement.textContent = score;
    gameOverElement.style.display = 'block';
    
    // Play game over sound
    playSound(150, 0.5, 'sine');
}

// Restart game
function restartGame() {
    score = 0;
    enemies = [];
    bullets = [];
    particles = [];
    gameRunning = true;
    gameOverElement.style.display = 'none';
    scoreElement.textContent = `Score: ${score} | High Score: ${highScore}`;
}

// Game loop
function gameLoop() {
    if (gameRunning) {
        frameCount++;
        
        // Spawn enemies
        if (frameCount % enemySpawnRate === 0) {
            createEnemy();
        }
        
        // Auto shoot every 30 frames
        if (frameCount % 30 === 0) {
            shoot();
        }
        
        updatePlayer();
        updateBullets();
        updateEnemies();
        updateParticles();
        draw();
        
        // Update score display with difficulty level
        scoreElement.textContent = `Score: ${score} | High Score: ${highScore} | Level: ${difficultyLevel}`;
    }
    
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();