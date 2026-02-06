document.addEventListener('DOMContentLoaded', () => {
    // 1. Pobieramy elementy po załadowaniu HTML
    const canvas = document.getElementById('gameCanvas');
    const scoreElement = document.getElementById('score');

    if (!canvas || !scoreElement) {
        console.error("Błąd: Nie znaleziono elementu Canvas lub Score.");
        return;
    }

    const ctx = canvas.getContext('2d');
    
    // 2. Ładowanie obrazka
    const headImage = new Image();
    headImage.src = 'images/snake_head.svg';

    // 3. Sprawdzenie motywu na starcie
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }

    // --- ZMIENNE GRY ---
    const gridSize = 20;
    let tileCountX = 20;
    let tileCountY = 20;
    
    const BASE_DELAY = 120;     
    const MIN_DELAY = 40;       
    const SPEED_UNIT = 5;       
    const SPEED_UP_INTERVAL = 10000; 

    let currentDelay = BASE_DELAY;
    let lastSpeedUpTime = Date.now();

    let playerX = 10;
    let playerY = 10;
    let velocityX = 0;
    let velocityY = 0;

    let trail = [];
    let tailLength = 5;

    let foodX = 5; 
    let foodY = 5;
    let score = 0;

    // --- ZMIENNE JOYSTICKA ---
    const joyBase = document.getElementById('joystick-base');
    const joyStick = document.getElementById('joystick-stick');
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouching = false;

    // --- FUNKCJE POMOCNICZE ---

    function safeGetText(key) {
        if (typeof getText === 'function') {
            return getText(key);
        }
        return "Loading...";
    }

    function resizeGame() {
        const isMobile = window.innerWidth <= 768;
        let size;

        if (isMobile) {
            let maxWidth = window.innerWidth * 0.95;
            let maxHeight = window.innerHeight * 0.80;
            size = Math.min(maxWidth, maxHeight);
        } else {
            size = Math.min(window.innerWidth, window.innerHeight) * 0.58;
        }

        size = Math.floor(size / gridSize) * gridSize;
        
        canvas.width = size;
        canvas.height = size;
        
        tileCountX = canvas.width / gridSize;
        tileCountY = canvas.height / gridSize;

        if (foodX >= tileCountX || foodY >= tileCountY) {
            foodX = Math.floor(Math.random() * tileCountX);
            foodY = Math.floor(Math.random() * tileCountY);
        }
    }

    function handleGameOver() {
        if (score > 0) {
            let message = safeGetText('gameOverMsg') + score + ". " + safeGetText('enterNick');
            let defaultNick = safeGetText('defaultNick');
            
            setTimeout(() => {
                let name = prompt(message, defaultNick);
                if (name) {
                    saveHighScore(score, name.trim());
                    updateScoreboard();
                }
                resetGame();
                gameLoop();
            }, 50);
        } else {
            resetGame();
            gameLoop();
        }
    }

    function resetGame() {
        tailLength = 5;
        score = 0;
        currentDelay = BASE_DELAY;
        lastSpeedUpTime = Date.now();
        playerX = 10;
        playerY = 10;
        velocityX = 0;
        velocityY = 0;
        scoreElement.innerText = safeGetText('scorePrefix') + score;
        trail = [];
        foodX = Math.floor(Math.random() * tileCountX);
        foodY = Math.floor(Math.random() * tileCountY);
    }

    function saveHighScore(score, name) {
        let scores = JSON.parse(localStorage.getItem('snakeHighScores')) || [];
        scores.push({ score: score, name: name, date: new Date().toLocaleDateString() });
        scores.sort((a, b) => b.score - a.score);
        scores = scores.slice(0, 10);
        localStorage.setItem('snakeHighScores', JSON.stringify(scores));
    }

    function updateScoreboard() {
        const scores = JSON.parse(localStorage.getItem('snakeHighScores')) || [];
        const list = document.getElementById('scoreList');
        if(list) {
            list.innerHTML = scores.map(s => `<li><span>${s.name || s.date}</span> <span>${s.score}</span></li>`).join('');
        }
    }

    function gameLoop() {
        playerX += velocityX;
        playerY += velocityY;

        if (velocityX !== 0 || velocityY !== 0) {
            const now = Date.now();
            if (now - lastSpeedUpTime > SPEED_UP_INTERVAL) {
                if (currentDelay > MIN_DELAY) {
                    currentDelay -= SPEED_UNIT; 
                    if (currentDelay < MIN_DELAY) currentDelay = MIN_DELAY;
                }
                lastSpeedUpTime = now;
            }
        } else {
            lastSpeedUpTime = Date.now();
        }

        if (playerX < 0) playerX = tileCountX - 1;
        if (playerX >= tileCountX) playerX = 0;
        if (playerY < 0) playerY = tileCountY - 1;
        if (playerY >= tileCountY) playerY = 0;

        const isLight = document.body.classList.contains('light-mode');
        ctx.fillStyle = isLight ? '#f0f0f0' : '#080808';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = isLight ? '#d0d0d0' : '#1a1a1a';
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += gridSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
        }
        for (let y = 0; y <= canvas.height; y += gridSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }
        ctx.stroke();

        ctx.fillStyle = '#8a8a8a';
        for (let i = 0; i < trail.length; i++) {
            ctx.fillRect(trail[i].x * gridSize, trail[i].y * gridSize, gridSize - 2, gridSize - 2);
            if (trail[i].x === playerX && trail[i].y === playerY && (velocityX !== 0 || velocityY !== 0)) {
                handleGameOver();
                return;
            }
        }

        ctx.save();
        ctx.translate(playerX * gridSize + gridSize / 2, playerY * gridSize + gridSize / 2);
        let angle = 0;
        if (velocityX === 1) angle = Math.PI / 2;
        else if (velocityX === -1) angle = -Math.PI / 2;
        else if (velocityY === 1) angle = Math.PI;
        ctx.rotate(angle);
        
        if (headImage.complete && headImage.naturalHeight !== 0) {
            ctx.drawImage(headImage, -gridSize / 2, -gridSize / 2, gridSize, gridSize);
        } else {
            ctx.fillStyle = '#fff'; 
            ctx.fillRect(-gridSize / 2, -gridSize / 2, gridSize, gridSize);
        }
        ctx.restore();

        trail.push({x: playerX, y: playerY});
        while (trail.length > tailLength) {
            trail.shift();
        }

        if (foodX === playerX && foodY === playerY) {
            tailLength++;
            score += 100;
            currentDelay += (SPEED_UNIT * 2);
            if (currentDelay > BASE_DELAY) currentDelay = BASE_DELAY;
            lastSpeedUpTime = Date.now();
            scoreElement.innerText = safeGetText('scorePrefix') + score;
            foodX = Math.floor(Math.random() * tileCountX);
            foodY = Math.floor(Math.random() * tileCountY);
        }

        ctx.fillStyle = '#8a0f0f';
        ctx.fillRect(foodX * gridSize, foodY * gridSize, gridSize - 2, gridSize - 2);

        setTimeout(gameLoop, currentDelay);
    }

    function keyPush(evt) {
        switch(evt.keyCode) {
            case 37: if (velocityX !== 1) { velocityX = -1; velocityY = 0; } break;
            case 38: if (velocityY !== 1) { velocityX = 0; velocityY = -1; } break;
            case 39: if (velocityX !== -1) { velocityX = 1; velocityY = 0; } break;
            case 40: if (velocityY !== -1) { velocityX = 0; velocityY = 1; } break;
        }
    }
    document.addEventListener('keydown', keyPush);

    function handleJoystickMove(deltaX, deltaY) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0 && velocityX !== -1) { velocityX = 1; velocityY = 0; } 
            else if (deltaX < 0 && velocityX !== 1) { velocityX = -1; velocityY = 0; } 
        } else {
            if (deltaY > 0 && velocityY !== -1) { velocityX = 0; velocityY = 1; } 
            else if (deltaY < 0 && velocityY !== 1) { velocityX = 0; velocityY = -1; } 
        }
    }

    window.addEventListener('touchstart', (e) => {
        if (e.target.closest('button') || e.target.closest('.theme-switch') || e.target.closest('.back-button')) {
            return;
        }
        
        isTouching = true;
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;

        joyBase.style.display = 'block';
        joyBase.style.left = touchStartX + 'px';
        joyBase.style.top = touchStartY + 'px';
        joyStick.style.transform = `translate(-50%, -50%)`;
    }, {passive: false});

    window.addEventListener('touchmove', (e) => {
        if (!isTouching) return;
        e.preventDefault(); 
        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        const distance = Math.min(Math.sqrt(deltaX*deltaX + deltaY*deltaY), 40); 
        const angle = Math.atan2(deltaY, deltaX);
        const stickX = Math.cos(angle) * distance;
        const stickY = Math.sin(angle) * distance;
        joyStick.style.transform = `translate(calc(-50% + ${stickX}px), calc(-50% + ${stickY}px))`;
        handleJoystickMove(deltaX, deltaY);
    }, {passive: false});

    window.addEventListener('touchend', () => {
        isTouching = false;
        joyBase.style.display = 'none';
    });

    // --- OBSŁUGA MOTYWU ---
    function toggleTheme() {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        ctx.fillStyle = isLight ? '#f0f0f0' : '#080808';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Ważne: Odświeżamy napisy, żeby przycisk zmienił tekst
        if (typeof applyTranslations === 'function') {
            applyTranslations();
        }
    }

    const themeBtn = document.querySelector('.theme-switch');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }

    window.addEventListener('resize', resizeGame);
    resizeGame();
    updateScoreboard();
    scoreElement.innerText = safeGetText('scorePrefix') + score;
    gameLoop();
});