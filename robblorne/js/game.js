document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const titleElem = document.getElementById('game-title');
    const bloodValElem = document.getElementById('blood-val');
    const totalPointsElem = document.getElementById('total-points');
    const levelValElem = document.getElementById('level-val');

    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }

    const TILE_SIZE = 64;

    // --- ZMIENNE STANU GRY ---
    let grid, player, bloodTotal, bloodCollected, keys, frame, isGameOver;
    
    // Punkt 2: Wczytywanie zapisanego poziomu z pamięci
    let currentLevelIndex = parseInt(localStorage.getItem('currentLevel')) || 0; 
    let totalScore = parseInt(localStorage.getItem('totalScore')) || 0;
    
    let enemies = [];
    let enemyUpdateTick = 0;

    // Zmienne do płynnego ruchu mobilnego
    let moveInterval = null;
    let lastDirection = { dx: 0, dy: 0 };

    function safeGetText(key) {
        if (typeof getText === 'function') return getText(key);
        return "";
    }

    function resizeCanvas() {
        if (!grid) return;
        canvas.width = grid[0].length * TILE_SIZE;
        canvas.height = grid.length * TILE_SIZE;
    }

    function triggerReset(fullReset = false) {
        isGameOver = false;
        stopContinuousMove(); // Zatrzymaj ruch przy restarcie
        
        // Punkt 1: Zerowanie wszystkiego przy starcie od zera
        if (fullReset) {
            currentLevelIndex = 0;
            totalScore = 0;
            localStorage.setItem('totalScore', 0);
            localStorage.setItem('currentLevel', 0);
        }

        const levelData = Levels[currentLevelIndex];
        if (!levelData) return;

        grid = levelData.map.map(row => row.split(''));
        enemies = JSON.parse(JSON.stringify(levelData.enemies));
        bloodCollected = 0; 
        keys = 0; 
        frame = 0;
        
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
        
        // Zapisywanie stanu
        localStorage.setItem('totalScore', totalScore);
        localStorage.setItem('currentLevel', currentLevelIndex);
    }

    // --- RYSOWANIE (Bez zmian w logice grafiki) ---
    function drawHunter(px, py) {
        ctx.save();
        ctx.fillStyle = "#1a1a22";
        ctx.beginPath(); ctx.moveTo(px + 18, py + 42); ctx.lineTo(px + 46, py + 42);
        ctx.lineTo(px + 52, py + 62); ctx.lineTo(px + 12, py + 62); ctx.fill();
        ctx.fillStyle = "#3a0a0a"; ctx.fillRect(px + 26, py + 42, 12, 6);
        ctx.font = "42px serif"; ctx.textAlign = "center"; ctx.fillText("🧛", px + 32, py + 46);
        ctx.strokeStyle = "#5a4a3a"; ctx.lineWidth = 3; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(px + 44, py + 35); ctx.lineTo(px + 48, py + 58); ctx.stroke();
        const shine = Math.abs(Math.sin(frame * 0.1)) * 255;
        ctx.strokeStyle = `rgb(${shine}, ${shine}, ${shine})`; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(px + 45, py + 40); ctx.lineTo(px + 47, py + 54); ctx.stroke();
        ctx.restore();
    }

    function drawTile(x, y, type) {
        const px = x * TILE_SIZE; const py = y * TILE_SIZE;
        const isLight = document.body.classList.contains('light-mode');
        ctx.fillStyle = isLight ? "#e0e0e0" : "#0c0d11"; ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = isLight ? "#ccc" : "#1a1a1a"; ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);
        if (type === '#') {
            ctx.fillStyle = isLight ? "#bbb" : "#1a1e26"; ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
            ctx.strokeStyle = isLight ? "#999" : "#333"; ctx.strokeRect(px + 8, py + 8, TILE_SIZE - 16, TILE_SIZE - 16);
        } else if (type === 'R') { drawHunter(px, py); player = { x, y }; }
        else if (type === 'S') {
            const pulse = Math.sin(frame * 0.1) * 3;
            ctx.font = `${32 + pulse}px serif`; ctx.shadowBlur = 15; ctx.shadowColor = "red";
            ctx.fillText("🩸", px + 15 - pulse/2, py + 45 + pulse/2); ctx.shadowBlur = 0;
        } else if (type === 'B') {
            ctx.fillStyle = "#2a1515"; ctx.fillRect(px + 10, py + 8, TILE_SIZE - 20, TILE_SIZE - 16);
            ctx.strokeStyle = "#444"; ctx.strokeRect(px + 14, py + 12, TILE_SIZE - 28, TILE_SIZE - 24);
        } else if (type === 'K') { ctx.font = "30px serif"; ctx.fillText("🗝️", px + 15, py + 45); }
        else if (type === 'D') {
            ctx.fillStyle = "#3a0000"; ctx.fillRect(px + 10, py + 10, 20, TILE_SIZE - 20); ctx.fillRect(px + 34, py + 10, 20, TILE_SIZE - 20);
            ctx.strokeStyle = "#c5a059"; ctx.lineWidth = 2; ctx.strokeRect(px + 12, py + 12, 16, TILE_SIZE - 24); ctx.strokeRect(px + 36, py + 12, 16, TILE_SIZE - 24);
        } else if (type === 'E' && bloodCollected >= bloodTotal) {
            ctx.font = "45px serif"; ctx.shadowBlur = 20; ctx.shadowColor = "#c5a059"; ctx.fillText("⛪", px + 10, py + 50); ctx.shadowBlur = 0;
        }
    }

    function updateEnemies() {
        if (isGameOver) return;
        enemyUpdateTick++;
        if (enemyUpdateTick % 20 === 0) {
            enemies.forEach(en => {
                let nextX = en.x + en.dir;
                if (nextX < 0 || nextX >= grid[0].length) { en.dir *= -1; return; }
                let target = grid[en.y][nextX];
                if (target === '#' || target === 'B' || target === 'D' || target === 'E' || target === 'K') {
                    en.dir *= -1; nextX = en.x + en.dir;
                }
                if (grid[en.y][nextX] !== '#' && grid[en.y][nextX] !== 'B') en.x = nextX;
                if (en.x === player.x && en.y === player.y) die();
            });
        }
    }

    function die() { 
        isGameOver = true; 
        stopContinuousMove();
        titleElem.innerText = safeGetText('msgDeath'); 
        titleElem.style.color = "red"; 
        setTimeout(() => triggerReset(false), 1500); 
    }
    
    function levelComplete() {
        if (currentLevelIndex + 1 < Levels.length) {
            currentLevelIndex++;
            triggerReset(false);
        } else {
            winGame();
        }
    }

    function winGame() { 
        isGameOver = true; 
        stopContinuousMove();
        titleElem.innerText = safeGetText('msgWin'); 
        titleElem.style.color = "#c5a059"; 
        setTimeout(() => triggerReset(true), 3000); 
    }

    function update() {
        if (!grid) return;
        updateEnemies();
        grid.forEach((row, y) => { row.forEach((tile, x) => drawTile(x, y, tile)); });
        enemies.forEach(en => { ctx.font = "40px serif"; ctx.fillText(en.icon, en.x * TILE_SIZE + 12, en.y * TILE_SIZE + 48); });
        updateUI(); frame++; requestAnimationFrame(update);
    }

    // --- LOGIKA RUCHU ---
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
        } else if (target === 'D' && keys > 0) { 
            keys--; grid[player.y][player.x] = '.'; grid[ny][nx] = 'R';
            player.x = nx; player.y = ny;
        } else if (target === 'E' && bloodCollected >= bloodTotal) {
            levelComplete();
        }
    }

    // --- PUNKT 3: PŁYNNY RUCH MOBILNY ---
    function startContinuousMove(dx, dy) {
        if (lastDirection.dx === dx && lastDirection.dy === dy) return;
        stopContinuousMove();
        lastDirection = { dx, dy };
        movePlayer(dx, dy); // Pierwszy krok natychmiast
        moveInterval = setInterval(() => {
            movePlayer(dx, dy);
        }, 200); // Prędkość "biegu" - co 200ms krok
    }

    function stopContinuousMove() {
        if (moveInterval) {
            clearInterval(moveInterval);
            moveInterval = null;
        }
        lastDirection = { dx: 0, dy: 0 };
    }

    // Sterowanie Klawiaturą
    window.onkeydown = (e) => {
        if (e.key.toLowerCase() === 'r') { triggerReset(false); return; }
        // Blokada powtarzania klawiszy systemowych, używamy movePlayer raz
        if (e.repeat) return; 
        if (e.key === "ArrowUp") movePlayer(0, -1);
        if (e.key === "ArrowDown") movePlayer(0, 1);
        if (e.key === "ArrowLeft") movePlayer(-1, 0);
        if (e.key === "ArrowRight") movePlayer(1, 0);
    };

    // Sterowanie Dotykowe (Swipe + Hold)
    let touchStartX = 0;
    let touchStartY = 0;
    const SWIPE_THRESHOLD = 30; 

    document.body.addEventListener('touchstart', (e) => {
        if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.theme-switch')) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, {passive: false});

    document.body.addEventListener('touchmove', (e) => {
        if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.theme-switch')) return;
        e.preventDefault(); 

        let diffX = e.touches[0].clientX - touchStartX;
        let diffY = e.touches[0].clientY - touchStartY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) > SWIPE_THRESHOLD) {
                startContinuousMove(diffX > 0 ? 1 : -1, 0);
            }
        } else {
            if (Math.abs(diffY) > SWIPE_THRESHOLD) {
                startContinuousMove(0, diffY > 0 ? 1 : -1);
            }
        }
    }, {passive: false});

    document.body.addEventListener('touchend', stopContinuousMove);
    document.body.addEventListener('touchcancel', stopContinuousMove);

    const restartBtn = document.getElementById('restartBtn');
    if(restartBtn) restartBtn.addEventListener('click', () => triggerReset(false));

    const themeBtn = document.querySelector('.theme-switch');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
            if (typeof applyTranslations === 'function') applyTranslations();
        });
    }

    triggerReset(false); // Ładuje level z localStorage lub 0
    update();
});