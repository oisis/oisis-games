document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const titleElem = document.getElementById('game-title');
    const bloodValElem = document.getElementById('blood-val');
    const totalPointsElem = document.getElementById('total-points');
    const levelValElem = document.getElementById('level-val');
    const livesValElem = document.getElementById('lives-val');

    if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-mode');

    const TILE_SIZE = 64;
    let grid, player, bloodTotal, bloodCollected, keys, frame, isGameOver;
    
    let currentLevelIndex = parseInt(localStorage.getItem('currentLevel')) || 0; 
    let totalScore = parseInt(localStorage.getItem('totalScore')) || 0;
    let lives = 5; 
    
    let enemies = [];
    let enemyUpdateTick = 0;
    let moveInterval = null;
    let lastDirection = { dx: 0, dy: 0 };
    let activeKey = null;

    function safeGetText(key) {
        return (typeof getText === 'function') ? getText(key) : key;
    }

    function resizeCanvas() {
        if (!grid) return;
        canvas.width = grid[0].length * TILE_SIZE;
        canvas.height = grid.length * TILE_SIZE;
    }

    function triggerReset(fullReset = false) {
        isGameOver = false;
        stopContinuousMove();
        activeKey = null;
        lastDirection = { dx: 0, dy: 0 };
        
        if (fullReset) {
            currentLevelIndex = 0;
            totalScore = 0;
            lives = 5;
            localStorage.setItem('totalScore', 0);
            localStorage.setItem('currentLevel', 0);
        }

        const levelData = Levels[currentLevelIndex];
        if (!levelData) return;

        grid = levelData.map.map(row => row.split(''));
        enemies = JSON.parse(JSON.stringify(levelData.enemies));
        bloodCollected = 0; keys = 0; frame = 0;
        bloodTotal = 0;
        grid.forEach(row => row.forEach(cell => { if(cell === 'S') bloodTotal++; }));
        
        for(let y=0; y<grid.length; y++) {
            for(let x=0; x<grid[y].length; x++) {
                if(grid[y][x] === 'R') player = {x, y};
            }
        }

        titleElem.innerText = safeGetText('gameTitle'); 
        titleElem.style.color = "";
        resizeCanvas();
        updateUI();
    }

    function updateUI() {
        if(bloodValElem) bloodValElem.innerText = `${bloodCollected} / ${bloodTotal}`;
        if(totalPointsElem) totalPointsElem.innerText = totalScore;
        if(levelValElem) levelValElem.innerText = currentLevelIndex + 1;
        if(livesValElem) livesValElem.innerText = "❤️".repeat(lives);
        
        localStorage.setItem('totalScore', totalScore);
        localStorage.setItem('currentLevel', currentLevelIndex);
    }

    function drawHunter(px, py) {
        ctx.save();
        ctx.fillStyle = "#1a1a22";
        ctx.beginPath(); ctx.moveTo(px + 18, py + 42); ctx.lineTo(px + 46, py + 42);
        ctx.lineTo(px + 52, py + 62); ctx.lineTo(px + 12, py + 62); ctx.fill();
        ctx.fillStyle = "#3a0a0a"; ctx.fillRect(px + 26, py + 42, 12, 6);
        ctx.font = "42px serif"; ctx.textAlign = "center"; ctx.fillText("🧛", px + 32, py + 46);
        ctx.restore();
    }

    function drawTile(x, y, type) {
        const px = x * TILE_SIZE; const py = y * TILE_SIZE;
        const isLight = document.body.classList.contains('light-mode');
        ctx.fillStyle = isLight ? "#e0e0e0" : "#0c0d11"; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = isLight ? "#ccc" : "#1a1a1a"; ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);
        if (type === '#') {
            ctx.fillStyle = isLight ? "#bbb" : "#1a1e26"; ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
        } else if (type === 'R') { drawHunter(px, py); }
        else if (type === 'S') { ctx.font = "32px serif"; ctx.fillText("🩸", px + 15, py + 45); }
        else if (type === 'B') {
            ctx.save();
            ctx.fillStyle = "#2b1d15"; ctx.strokeStyle = "#120a06"; ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(px + 22, py + 8); ctx.lineTo(px + 42, py + 8); ctx.lineTo(px + 52, py + 24);
            ctx.lineTo(px + 44, py + 56); ctx.lineTo(px + 20, py + 56); ctx.lineTo(px + 12, py + 24);
            ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.strokeStyle = "#c5a059"; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(px + 32, py + 18); ctx.lineTo(px + 32, py + 42); 
            ctx.moveTo(px + 24, py + 28); ctx.lineTo(px + 40, py + 28); ctx.stroke();
            ctx.restore();
        } else if (type === 'K') { ctx.font = "30px serif"; ctx.fillText("🗝️", px + 15, py + 45); }
        else if (type === 'D') {
            const gateColor = isLight ? "#111" : "#eee";
            ctx.save(); ctx.strokeStyle = gateColor; ctx.lineWidth = 2; ctx.fillStyle = isLight ? "#888" : "#333";
            ctx.fillRect(px + 4, py + 4, 6, TILE_SIZE - 8); ctx.fillRect(px + TILE_SIZE - 10, py + 4, 6, TILE_SIZE - 8);
            ctx.beginPath(); ctx.arc(px + TILE_SIZE/2, py + 25, 22, Math.PI, 0); ctx.stroke();
            for(let i = 14; i <= TILE_SIZE - 14; i += 6) {
                if (i === TILE_SIZE/2 - 2 || i === TILE_SIZE/2 + 4) continue;
                ctx.beginPath(); ctx.moveTo(px + i, py + 15); ctx.lineTo(px + i, py + TILE_SIZE - 6); ctx.stroke();
            }
            ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px + TILE_SIZE/2, py + 5); ctx.lineTo(px + TILE_SIZE/2, py + TILE_SIZE - 4); ctx.stroke();
            ctx.fillStyle = "#c5a059"; ctx.beginPath(); ctx.arc(px + TILE_SIZE/2 - 6, py + TILE_SIZE/2, 4, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(px + TILE_SIZE/2 + 6, py + TILE_SIZE/2, 4, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        } else if (type === 'E' && bloodCollected >= bloodTotal) { ctx.font = "45px serif"; ctx.fillText("⛪", px + 10, py + 50); }
    }

    function updateEnemies() {
        if (isGameOver) return;
        enemyUpdateTick++;
        if (enemyUpdateTick % 20 === 0) {
            enemies.forEach(en => {
                let nextX = en.x + en.dir;
                if (nextX < 0 || nextX >= grid[0].length) { en.dir *= -1; return; }
                let target = grid[en.y][nextX];
                if (target === '#' || target === 'B' || target === 'D' || target === 'E' || target === 'K') { en.dir *= -1; nextX = en.x + en.dir; }
                if (grid[en.y][nextX] !== '#' && grid[en.y][nextX] !== 'B') en.x = nextX;
                if (en.x === player.x && en.y === player.y) die();
            });
        }
    }

    function die() { 
        if (isGameOver) return;
        lives--;
        stopContinuousMove();
        activeKey = null;
        updateUI();
        if (lives <= 0) {
            isGameOver = true;
            titleElem.innerText = safeGetText('msgGameOver');
            titleElem.style.color = "red";
            setTimeout(() => triggerReset(true), 2000);
        } else {
            isGameOver = true;
            titleElem.innerText = safeGetText('msgDeath');
            titleElem.style.color = "orange";
            setTimeout(() => triggerReset(false), 1200);
        }
    }

    function levelComplete() {
        if (currentLevelIndex + 1 < Levels.length) {
            currentLevelIndex++;
            triggerReset(false);
        } else {
            isGameOver = true;
            stopContinuousMove();
            titleElem.innerText = safeGetText('msgWin');
            titleElem.style.color = "#c5a059";
            setTimeout(() => triggerReset(true), 3000);
        }
    }

    function update() {
        if (!grid) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updateEnemies();
        grid.forEach((row, y) => { row.forEach((tile, x) => drawTile(x, y, tile)); });
        enemies.forEach(en => { ctx.font = "40px serif"; ctx.fillText(en.icon, en.x * TILE_SIZE + 12, en.y * TILE_SIZE + 48); });
        updateUI(); frame++; requestAnimationFrame(update);
    }

    function movePlayer(dx, dy) {
        if (isGameOver) return;
        const nx = player.x + dx, ny = player.y + dy;
        if (!grid[ny] || !grid[ny][nx]) return; 
        if (enemies.some(en => en.x === nx && en.y === ny)) { die(); return; }
        const target = grid[ny][nx];
        if (target === '.' || target === 'S' || target === 'K') {
            if (target === 'S') { bloodCollected++; totalScore++; }
            if (target === 'K') keys++;
            grid[player.y][player.x] = '.'; grid[ny][nx] = 'R';
            player.x = nx; player.y = ny;
        } else if (target === 'B') {
            const bx = nx + dx, by = ny + dy;
            if (grid[by] && grid[by][bx] === '.' && !enemies.some(en => en.x === bx && en.y === by)) {
                grid[by][bx] = 'B'; grid[player.y][player.x] = '.'; grid[ny][nx] = 'R';
                player.x = nx; player.y = ny;
            }
        } else if (target === 'D' && keys > 0) { keys--; grid[player.y][player.x] = '.'; grid[ny][nx] = 'R'; player.x = nx; player.y = ny; }
        else if (target === 'E' && bloodCollected >= bloodTotal) levelComplete();
    }

    function startContinuousMove(dx, dy) {
        if (lastDirection.dx === dx && lastDirection.dy === dy) return;
        stopContinuousMove();
        lastDirection = { dx, dy };
        movePlayer(dx, dy);
        moveInterval = setInterval(() => movePlayer(dx, dy), 180);
    }

    function stopContinuousMove() {
        if (moveInterval) { clearInterval(moveInterval); moveInterval = null; }
        lastDirection = { dx: 0, dy: 0 };
    }

    window.onkeydown = (e) => {
        if (isGameOver) return;
        if (e.key.toLowerCase() === 'r') { die(); return; }
        if (e.key.toLowerCase() === 'n') { triggerReset(true); return; }
        
        if (e.repeat) return; 
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
            activeKey = e.key;
            if (e.key === "ArrowUp") startContinuousMove(0, -1);
            else if (e.key === "ArrowDown") startContinuousMove(0, 1);
            else if (e.key === "ArrowLeft") startContinuousMove(-1, 0);
            else if (e.key === "ArrowRight") startContinuousMove(1, 0);
        }
    };

    window.onkeyup = (e) => {
        if (e.key === activeKey) {
            stopContinuousMove();
            activeKey = null;
        }
    };

    const restartLvlBtn = document.getElementById('restartLvlBtn');
    if(restartLvlBtn) restartLvlBtn.addEventListener('click', die);

    const restartGameBtn = document.getElementById('restartGameBtn');
    if(restartGameBtn) restartGameBtn.addEventListener('click', () => triggerReset(true));

    const themeBtn = document.querySelector('.theme-switch');
    if (themeBtn) themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
        applyTranslations();
    });

    triggerReset(false);
    update();
});