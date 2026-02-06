document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const titleElem = document.getElementById('game-title');
    const bloodValElem = document.getElementById('blood-val');
    const totalPointsElem = document.getElementById('total-points');

    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }

    const TILE_SIZE = 64;
    
    const initialMap = [
        "#############", 
        "#R..B......S#", 
        "#...B..######", 
        "#..........K#", 
        "#####D#######", 
        "#S..........#", 
        "#######..S..#", 
        "#.......#####", 
        "#S..B......E#", 
        "#############"  
    ];

    let grid, player, bloodTotal, bloodCollected, keys, frame, isGameOver;
    let totalScore = parseInt(localStorage.getItem('totalScore')) || 0;
    let enemies = [];
    let enemyUpdateTick = 0;

    function safeGetText(key) {
        if (typeof getText === 'function') return getText(key);
        return "";
    }

    function resizeCanvas() {
        const mapWidth = initialMap[0].length * TILE_SIZE;
        const mapHeight = initialMap.length * TILE_SIZE;
        canvas.width = mapWidth;
        canvas.height = mapHeight;
    }

    function triggerReset() {
        isGameOver = false;
        grid = initialMap.map(row => row.split(''));
        
        bloodCollected = 0; 
        keys = 0; 
        frame = 0;
        bloodTotal = (initialMap.join('').match(/S/g) || []).length;
        
        for(let y=0; y<grid.length; y++) {
            for(let x=0; x<grid[y].length; x++) {
                if(grid[y][x] === 'R') player = {x, y};
            }
        }

        enemies = [{ x: 10, y: 3, dir: -1, icon: "🕷️" }];
        
        titleElem.innerText = safeGetText('gameTitle'); 
        titleElem.style.color = "";
        
        updateUI();
    }

    function updateUI() {
        if(bloodValElem) bloodValElem.innerText = `${bloodCollected} / ${bloodTotal}`;
        if(totalPointsElem) totalPointsElem.innerText = totalScore;
        localStorage.setItem('totalScore', totalScore);
    }

    function drawHunter(px, py) {
        ctx.save();
        ctx.fillStyle = "#1a1a22";
        ctx.beginPath();
        ctx.moveTo(px + 18, py + 42); 
        ctx.lineTo(px + 46, py + 42); 
        ctx.lineTo(px + 52, py + 62); 
        ctx.lineTo(px + 12, py + 62); 
        ctx.fill();

        ctx.fillStyle = "#3a0a0a";
        ctx.fillRect(px + 26, py + 42, 12, 6);

        ctx.font = "42px serif"; ctx.textAlign = "center";
        ctx.fillText("🧛", px + 32, py + 46);
        
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
        } else if (type === 'R') { 
            drawHunter(px, py); player = { x, y }; 
        } else if (type === 'S') {
            const pulse = Math.sin(frame * 0.1) * 3;
            ctx.font = `${32 + pulse}px serif`; ctx.shadowBlur = 15; ctx.shadowColor = "red";
            ctx.fillText("🩸", px + 15 - pulse/2, py + 45 + pulse/2); ctx.shadowBlur = 0;
        } else if (type === 'B') {
            ctx.fillStyle = "#2a1515"; ctx.fillRect(px + 10, py + 8, TILE_SIZE - 20, TILE_SIZE - 16);
            ctx.strokeStyle = "#444"; ctx.strokeRect(px + 14, py + 12, TILE_SIZE - 28, TILE_SIZE - 24);
        } else if (type === 'K') { 
            ctx.font = "30px serif"; ctx.fillText("🗝️", px + 15, py + 45); 
        } else if (type === 'D') {
            ctx.fillStyle = "#3a0000"; ctx.fillRect(px + 10, py + 10, 20, TILE_SIZE - 20); ctx.fillRect(px + 34, py + 10, 20, TILE_SIZE - 20);
            ctx.strokeStyle = "#c5a059"; ctx.lineWidth = 2; ctx.strokeRect(px + 12, py + 12, 16, TILE_SIZE - 24); ctx.strokeRect(px + 36, py + 12, 16, TILE_SIZE - 24);
        } else if (type === 'E') {
            if (bloodCollected < bloodTotal) return;
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
                    en.dir *= -1;
                    nextX = en.x + en.dir;
                }
                if (grid[en.y][nextX] !== '#' && grid[en.y][nextX] !== 'B') en.x = nextX;
                if (en.x === player.x && en.y === player.y) die();
            });
        }
    }

    function die() { 
        isGameOver = true; 
        titleElem.innerText = safeGetText('msgDeath'); 
        titleElem.style.color = "red"; 
        setTimeout(triggerReset, 1500); 
    }
    
    function win() { 
        isGameOver = true; 
        titleElem.innerText = safeGetText('msgWin'); 
        titleElem.style.color = "#c5a059"; 
        setTimeout(triggerReset, 3000); 
    }

    function update() {
        updateEnemies();
        grid.forEach((row, y) => { row.forEach((tile, x) => drawTile(x, y, tile)); });
        enemies.forEach(en => { ctx.font = "40px serif"; ctx.fillText(en.icon, en.x * TILE_SIZE + 12, en.y * TILE_SIZE + 48); });
        
        updateUI(); 
        frame++; 
        requestAnimationFrame(update);
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
            win();
        }
    }

    // --- STEROWANIE ---
    
    // Klawiatura
    window.onkeydown = (e) => {
        if (e.key.toLowerCase() === 'r') { triggerReset(); return; }
        if (e.key === "ArrowUp") movePlayer(0, -1);
        if (e.key === "ArrowDown") movePlayer(0, 1);
        if (e.key === "ArrowLeft") movePlayer(-1, 0);
        if (e.key === "ArrowRight") movePlayer(1, 0);
    };

    // Obsługa Gestów (Swipe)
    let touchStartX = 0;
    let touchStartY = 0;
    const SWIPE_THRESHOLD = 30; // Min. przesunięcie, by uznać za gest
    const touchArea = document.body; // Łapiemy gesty na całym ekranie

    touchArea.addEventListener('touchstart', (e) => {
        // Ignoruj dotyk na przyciskach
        if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.theme-switch')) return;
        
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, {passive: false});

    touchArea.addEventListener('touchmove', (e) => {
        if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.theme-switch')) return;
        e.preventDefault(); // Blokada scrollowania
    }, {passive: false});

    touchArea.addEventListener('touchend', (e) => {
        if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.theme-switch')) return;

        let endX = e.changedTouches[0].clientX;
        let endY = e.changedTouches[0].clientY;

        let diffX = endX - touchStartX;
        let diffY = endY - touchStartY;

        // Sprawdzamy, czy ruch był poziomy czy pionowy
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Ruch Poziomy
            if (Math.abs(diffX) > SWIPE_THRESHOLD) {
                if (diffX > 0) movePlayer(1, 0); // Prawo
                else movePlayer(-1, 0);          // Lewo
            }
        } else {
            // Ruch Pionowy
            if (Math.abs(diffY) > SWIPE_THRESHOLD) {
                if (diffY > 0) movePlayer(0, 1); // Dół
                else movePlayer(0, -1);          // Góra
            }
        }
    });

    const restartBtn = document.getElementById('restartBtn');
    if(restartBtn) restartBtn.addEventListener('click', triggerReset);

    // --- MOTYW ---
    function toggleTheme() {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        if (typeof applyTranslations === 'function') {
            applyTranslations();
        }
    }

    const themeBtn = document.querySelector('.theme-switch');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }

    // Start
    resizeCanvas();
    triggerReset();
    update();
});