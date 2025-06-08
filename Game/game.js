// Game constants
const CELL_SIZE = 60;
const PEAR_RADIUS = 20;
const LINE_WIDTH = 6;

// Game variables
let canvas, ctx;
let currentLevel = 0;
let gameState = {
    grid: [],
    connections: [],
    selectedPear: null,
    isComplete: false,
    startTime: 0,
    elapsedTime: 0,
    timerInterval: null,
    soundEnabled: true
};

// Colors
const COLORS = {
    background: '#fcfcfc',
    grid: '#e0f2e0',
    normalPear: '#9ccc65',
    selectedPear: '#7cb342',
    pearOutline: '#4b7b33',
    connection: '#ff7043',
    connectionShadow: 'rgba(255, 112, 67, 0.4)',
    highlight: '#ffeb3b'
};

// Audio elements
let connectSound, completeSound, errorSound;

// Initialize the game
window.onload = function() {
    // Get canvas
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    
    // Get audio elements
    connectSound = document.getElementById('connect-sound');
    completeSound = document.getElementById('complete-sound');
    errorSound = document.getElementById('error-sound');
    
    // Setup event listeners
    document.getElementById('reset-btn').addEventListener('click', resetLevel);
    document.getElementById('next-btn').addEventListener('click', loadNextLevel);
    document.getElementById('next-level-btn').addEventListener('click', loadNextLevel);
    document.getElementById('sound-toggle').addEventListener('click', toggleSound);
    document.getElementById('instructions-toggle').addEventListener('click', toggleInstructions);
    
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart, {passive: false});
    canvas.addEventListener('touchmove', handleTouchMove, {passive: false});
    canvas.addEventListener('touchend', handleTouchEnd);
    
    // Keyboard navigation
    canvas.addEventListener('keydown', handleKeyDown);
    
    // Load first level
    loadLevel(currentLevel);
};

// Load a specific level
function loadLevel(levelIndex) {
    if (levelIndex >= LEVELS.length) {
        showCompletionMessage("Congratulations! You completed all levels!");
        levelIndex = 0;
    }
    
    currentLevel = levelIndex;
    const level = LEVELS[levelIndex];
    const gridHeight = level.grid.length;
    const gridWidth = level.grid[0].length;
    
    // Set canvas size
    canvas.width = gridWidth * CELL_SIZE;
    canvas.height = gridHeight * CELL_SIZE;
    
    // Reset game state
    gameState = {
        grid: level.grid,
        connections: [],
        selectedPear: null,
        isComplete: false,
        startTime: Date.now(),
        elapsedTime: 0,
        timerInterval: null,
        soundEnabled: gameState.soundEnabled !== undefined ? gameState.soundEnabled : true
    };
    
    // Update level indicator
    document.getElementById('level-number').textContent = levelIndex + 1;
    document.getElementById('next-btn').disabled = true;
    
    // Hide completion modal if visible
    document.getElementById('completion-modal').hidden = true;
    
    // Start timer
    startTimer();
    
    // Set initial focus to canvas for keyboard navigation
    canvas.focus();
    
    // Draw initial state
    draw();
}

// Start the level timer
function startTimer() {
    // Clear any existing interval
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    gameState.startTime = Date.now();
    gameState.timerInterval = setInterval(updateTimer, 1000);
    updateTimer(); // Update immediately
}

// Update the timer display
function updateTimer() {
    if (gameState.isComplete) return;
    
    gameState.elapsedTime = Math.floor((Date.now() - gameState.startTime) / 1000);
    const minutes = Math.floor(gameState.elapsedTime / 60);
    const seconds = gameState.elapsedTime % 60;
    
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Reset the current level
function resetLevel() {
    loadLevel(currentLevel);
    playSound(errorSound);
}

// Load the next level
function loadNextLevel() {
    loadLevel(currentLevel + 1);
}

// Toggle sound effects
function toggleSound() {
    const soundButton = document.getElementById('sound-toggle');
    gameState.soundEnabled = !gameState.soundEnabled;
    
    if (gameState.soundEnabled) {
        soundButton.textContent = '🔊';
        soundButton.classList.remove('sound-off');
        soundButton.classList.add('sound-on');
    } else {
        soundButton.textContent = '🔇';
        soundButton.classList.remove('sound-on');
        soundButton.classList.add('sound-off');
    }
}

// Toggle instructions panel visibility
function toggleInstructions() {
    const button = document.getElementById('instructions-toggle');
    const panel = document.getElementById('instructions-panel');
    const icon = button.querySelector('.toggle-icon');
    
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !isExpanded);
    panel.hidden = isExpanded;
    
    icon.textContent = isExpanded ? '▼' : '▲';
}

// Play sound if enabled
function playSound(sound) {
    if (gameState.soundEnabled) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Audio play failed:", e));
    }
}

// Draw the game
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid background
    drawGrid();
    
    // Draw connections
    drawConnections();
    
    // Draw the pears
    drawPears();
}

// Draw the background grid
function drawGrid() {
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, width, height);
    
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let x = 0; x <= width; x += CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= height; y += CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
}

// Draw all pears on the grid
function drawPears() {
    for (let y = 0; y < gameState.grid.length; y++) {
        for (let x = 0; x < gameState.grid[y].length; x++) {
            if (gameState.grid[y][x] === 1) {
                // Determine if this pear is the selected one
                const isSelected = gameState.selectedPear && 
                                  gameState.selectedPear.x === x && 
                                  gameState.selectedPear.y === y;
                
                drawPear(x, y, isSelected);
            }
        }
    }
}

// Draw a single pear at the specified grid position
function drawPear(x, y, isSelected = false) {
    const centerX = x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = y * CELL_SIZE + CELL_SIZE / 2;
    
    // Draw pear shadow
    ctx.beginPath();
    ctx.arc(centerX + 2, centerY + 2, PEAR_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fill();
    
    // Draw the pear body
    ctx.beginPath();
    ctx.arc(centerX, centerY, PEAR_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = isSelected ? COLORS.selectedPear : COLORS.normalPear;
    ctx.fill();
    
    // Draw outline
    ctx.lineWidth = 2;
    ctx.strokeStyle = COLORS.pearOutline;
    ctx.stroke();
    
    // Draw the stem
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - PEAR_RADIUS);
    ctx.quadraticCurveTo(
        centerX + 5, centerY - PEAR_RADIUS - 5,
        centerX, centerY - PEAR_RADIUS - 10
    );
    ctx.lineWidth = 2;
    ctx.strokeStyle = COLORS.pearOutline;
    ctx.stroke();
    
    // Draw leaf
    ctx.beginPath();
    ctx.ellipse(
        centerX - 3, centerY - PEAR_RADIUS - 8,
        4, 2, Math.PI / 4, 0, Math.PI * 2
    );
    ctx.fillStyle = '#81c784';
    ctx.fill();
    
    // Highlight selected pear
    if (isSelected) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, PEAR_RADIUS + 5, 0, Math.PI * 2);
        ctx.strokeStyle = COLORS.highlight;
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}

// Draw connections between pears
function drawConnections() {
    ctx.lineWidth = LINE_WIDTH;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    for (const conn of gameState.connections) {
        const startX = conn.start.x * CELL_SIZE + CELL_SIZE / 2;
        const startY = conn.start.y * CELL_SIZE + CELL_SIZE / 2;
        const endX = conn.end.x * CELL_SIZE + CELL_SIZE / 2;
        const endY = conn.end.y * CELL_SIZE + CELL_SIZE / 2;
        
        // Draw connection shadow
        ctx.beginPath();
        ctx.moveTo(startX + 2, startY + 2);
        ctx.lineTo(endX + 2, endY + 2);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.stroke();
        
        // Draw main connection
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = COLORS.connection;
        ctx.stroke();
    }
    
    // If there's a selected pear, draw a line to mouse position
    if (gameState.selectedPear && gameState.mousePosition) {
        const startX = gameState.selectedPear.x * CELL_SIZE + CELL_SIZE / 2;
        const startY = gameState.selectedPear.y * CELL_SIZE + CELL_SIZE / 2;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(gameState.mousePosition.x, gameState.mousePosition.y);
        ctx.strokeStyle = COLORS.connectionShadow;
        ctx.stroke();
    }
}

// Handle mouse down event
function handleMouseDown(e) {
    if (gameState.isComplete) return;
    
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    handleInteractionStart(mouseX, mouseY);
}

// Handle touch start event
function handleTouchStart(e) {
    if (gameState.isComplete) return;
    
    e.preventDefault();
    if (e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        
        handleInteractionStart(touchX, touchY);
    }
}

// Common handler for starting an interaction (mouse or touch)
function handleInteractionStart(x, y) {
    const gridPos = screenToGrid(x, y);
    
    // Check if there's a pear at this position
    if (isValidGridPosition(gridPos) && gameState.grid[gridPos.y][gridPos.x] === 1) {
        gameState.selectedPear = { x: gridPos.x, y: gridPos.y };
        gameState.mousePosition = { x, y };
        draw();
    }
}

// Handle mouse move event
function handleMouseMove(e) {
    if (!gameState.selectedPear || gameState.isComplete) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    gameState.mousePosition = { x: mouseX, y: mouseY };
    draw();
}

// Handle touch move event
function handleTouchMove(e) {
    if (!gameState.selectedPear || gameState.isComplete) return;
    e.preventDefault();
    
    if (e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        
        gameState.mousePosition = { x: touchX, y: touchY };
        draw();
    }
}

// Handle mouse up event
function handleMouseUp(e) {
    if (!gameState.selectedPear || gameState.isComplete) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    handleInteractionEnd(mouseX, mouseY);
}

// Handle touch end event
function handleTouchEnd(e) {
    if (!gameState.selectedPear || gameState.isComplete) return;
    
    // Use the last known touch position
    if (gameState.mousePosition) {
        handleInteractionEnd(gameState.mousePosition.x, gameState.mousePosition.y);
    }
}

// Common handler for ending an interaction (mouse or touch)
function handleInteractionEnd(x, y) {
    const gridPos = screenToGrid(x, y);
    
    // Check if there's a pear at the end position
    if (isValidGridPosition(gridPos) && gameState.grid[gridPos.y][gridPos.x] === 1) {
        // Check if it's a valid move
        if (isValidConnection(gameState.selectedPear, gridPos)) {
            // Add the connection
            gameState.connections.push({
                start: { ...gameState.selectedPear },
                end: { x: gridPos.x, y: gridPos.y }
            });
            
            playSound(connectSound);
            
            // Check if level is complete
            checkLevelComplete();
        } else {
            playSound(errorSound);
        }
    }
    
    gameState.selectedPear = null;
    gameState.mousePosition = null;
    draw();
}

// Handle keyboard navigation
function handleKeyDown(e) {
    if (gameState.isComplete) return;
    
    // If no pear is selected, select the starting position
    if (!gameState.selectedPear && LEVELS[currentLevel].startPosition) {
        const startPos = LEVELS[currentLevel].startPosition;
        gameState.selectedPear = { ...startPos };
        draw();
        return;
    }
    
    if (!gameState.selectedPear) return;
    
    let targetX = gameState.selectedPear.x;
    let targetY = gameState.selectedPear.y;
    
    switch (e.key) {
        case 'ArrowUp':
            targetY--;
            break;
        case 'ArrowDown':
            targetY++;
            break;
        case 'ArrowLeft':
            targetX--;
            break;
        case 'ArrowRight':
            targetX++;
            break;
        case 'Enter':
        case ' ':
            // Submit current selection if another pear is selected
            if (gameState.tempTarget && 
                isValidConnection(gameState.selectedPear, gameState.tempTarget)) {
                
                gameState.connections.push({
                    start: { ...gameState.selectedPear },
                    end: { ...gameState.tempTarget }
                });
                
                playSound(connectSound);
                gameState.selectedPear = { ...gameState.tempTarget };
                gameState.tempTarget = null;
                
                // Check if level is complete
                checkLevelComplete();
            }
            draw();
            return;
        case 'Escape':
            // Cancel selection
            gameState.selectedPear = null;
            gameState.tempTarget = null;
            draw();
            return;
        default:
            return;
    }
    
    // Prevent default scrolling behavior with arrow keys
    e.preventDefault();
    
    // Check if the target position is valid
    if (isValidGridPosition({x: targetX, y: targetY}) && 
        gameState.grid[targetY][targetX] === 1) {
        
        if (isValidConnection(gameState.selectedPear, {x: targetX, y: targetY})) {
            gameState.tempTarget = {x: targetX, y: targetY};
            // Highlight the potential connection
            draw();
            
            // Draw temporary connection line
            const startX = gameState.selectedPear.x * CELL_SIZE + CELL_SIZE / 2;
            const startY = gameState.selectedPear.y * CELL_SIZE + CELL_SIZE / 2;
            const endX = targetX * CELL_SIZE + CELL_SIZE / 2;
            const endY = targetY * CELL_SIZE + CELL_SIZE / 2;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = COLORS.connectionShadow;
            ctx.lineWidth = LINE_WIDTH;
            ctx.stroke();
        }
    }
}

// Convert screen coordinates to grid coordinates
function screenToGrid(x, y) {
    return {
        x: Math.floor(x / CELL_SIZE),
        y: Math.floor(y / CELL_SIZE)
    };
}

// Check if a grid position is within bounds
function isValidGridPosition(pos) {
    return pos.x >= 0 && pos.x < gameState.grid[0].length && 
           pos.y >= 0 && pos.y < gameState.grid.length;
}

// Check if a connection between two pears is valid
function isValidConnection(start, end) {
    // Must be different pears
    if (start.x === end.x && start.y === end.y) {
        return false;
    }
    
    // Must be in same row or column (no diagonals)
    if (start.x !== end.x && start.y !== end.y) {
        return false;
    }
    
    // Check if there's already a connection between these pears
    for (const conn of gameState.connections) {
        if ((conn.start.x === start.x && conn.start.y === start.y && 
             conn.end.x === end.x && conn.end.y === end.y) ||
            (conn.start.x === end.x && conn.start.y === end.y && 
             conn.end.x === start.x && conn.end.y === start.y)) {
            return false;
        }
    }
    
    // Check if the path is clear (no pears in between)
    if (start.x === end.x) {  // Vertical line
        const minY = Math.min(start.y, end.y);
        const maxY = Math.max(start.y, end.y);
        
        for (let y = minY + 1; y < maxY; y++) {
            if (gameState.grid[y][start.x] === 1) {
                return false;
            }
        }
    } else {  // Horizontal line
        const minX = Math.min(start.x, end.x);
        const maxX = Math.max(start.x, end.x);
        
        for (let x = minX + 1; x < maxX; x++) {
            if (gameState.grid[start.y][x] === 1) {
                return false;
            }
        }
    }
    
    return true;
}

// Check if the level is complete
function checkLevelComplete() {
    // Create a set of all connected pears
    const connectedPears = new Set();
    
    for (const conn of gameState.connections) {
        connectedPears.add(`${conn.start.x},${conn.start.y}`);
        connectedPears.add(`${conn.end.x},${conn.end.y}`);
    }
    
    // Count total pears in the grid
    let totalPears = 0;
    for (let y = 0; y < gameState.grid.length; y++) {
        for (let x = 0; x < gameState.grid[y].length; x++) {
            if (gameState.grid[y][x] === 1) {
                totalPears++;
            }
        }
    }
    
    // Level is complete if all pears are connected
    if (connectedPears.size === totalPears) {
        gameState.isComplete = true;
        clearInterval(gameState.timerInterval);
        
        // Update next level button state
        document.getElementById('next-btn').disabled = false;
        
        // Show completion message
        playSound(completeSound);
        showLevelComplete();
    }
}

// Show level completion modal
function showLevelComplete() {
    const modal = document.getElementById('completion-modal');
    const timeElement = document.getElementById('completion-time');
    
    // Format elapsed time
    const minutes = Math.floor(gameState.elapsedTime / 60);
    const seconds = gameState.elapsedTime % 60;
    timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Show the modal
    modal.hidden = false;
}

// Show game completion message
function showCompletionMessage(message) {
    const modal = document.getElementById('completion-modal');
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.innerHTML = `
        <h2>Game Complete!</h2>
        <p>${message}</p>
        <button id="restart-btn">Play Again</button>
    `;
    
    document.getElementById('restart-btn').addEventListener('click', () => {
        loadLevel(0);
    });
    
    modal.hidden = false;
}
