document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const scoreElement = document.getElementById('score');

    if (!canvas || !scoreElement) return;

    const ctx = canvas.getContext('2d');

    // Motyw na starcie
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }

    // --- ZMIENNE GRY ---
    const ROW = 20;
    const COL = 10;
    let SQ = 20;
    let VACANT = "#080808"; // Domyślny ciemny, zmieni się przy rysowaniu
    let score = 0;
    let gameOver = false;

    // --- FUNKCJE POMOCNICZE ---
    function safeGetText(key) {
        if (typeof getText === 'function') {
            return getText(key);
        }
        return "Loading...";
    }

    function resizeGame() {
        const isMobile = window.innerWidth <= 768;
        // Na mobile: 65% wysokości ekranu, na desktopie 60%
        let factor = isMobile ? 0.65 : 0.6;
        let availableHeight = window.innerHeight * factor;
        
        SQ = Math.floor(availableHeight / ROW);
        canvas.height = SQ * ROW;
        canvas.width = SQ * COL;
        drawBoard();
    }

    // Shapes
    const PIECES = [
        [Z, "#a93226"],
        [S, "#1e8449"],
        [T, "#6c3483"],
        [O, "#b7950b"],
        [L, "#af601a"],
        [I, "#117864"],
        [J, "#21618c"]
    ];

    function I() { return [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]]; }
    function J() { return [[1,0,0],[1,1,1],[0,0,0]]; }
    function L() { return [[0,0,1],[1,1,1],[0,0,0]]; }
    function O() { return [[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]]; }
    function S() { return [[0,1,1],[1,1,0],[0,0,0]]; }
    function T() { return [[0,1,0],[1,1,1],[0,0,0]]; }
    function Z() { return [[1,1,0],[0,1,1],[0,0,0]]; }

    // Board Init
    let board = [];
    for(let r = 0; r < ROW; r++){
        board[r] = [];
        for(let c = 0; c < COL; c++){
            board[r][c] = "VACANT"; // Używamy znacznika tekstowego, nie koloru
        }
    }

    function drawSquare(x, y, color){
        ctx.fillStyle = color;
        ctx.fillRect(x*SQ, y*SQ, SQ, SQ);
        ctx.strokeStyle = "rgba(120, 160, 160, 0.1)";
        ctx.strokeRect(x*SQ, y*SQ, SQ, SQ);
    }

    function drawBoard(){
        const isLight = document.body.classList.contains('light-mode');
        // Aktualizujemy kolor tła w zależności od motywu
        let currentVacantColor = isLight ? "#f0f0f0" : "#080808";
        
        for(let r = 0; r < ROW; r++){
            for(let c = 0; c < COL; c++){
                let colorToDraw = board[r][c];
                if (colorToDraw === "VACANT") {
                    colorToDraw = currentVacantColor;
                }
                drawSquare(c, r, colorToDraw);
            }
        }
    }

    function randomPiece(){
        let r = Math.floor(Math.random() * PIECES.length);
        return new Piece(PIECES[r][0], PIECES[r][1]);
    }

    function Piece(tetromino,color){
        this.tetromino = tetromino();
        this.color = color;
        this.tetrominoN = 0;
        this.activeTetromino = this.tetromino;
        this.x = 3;
        this.y = -2;
    }

    Piece.prototype.fill = function(color){
        for(let r = 0; r < this.activeTetromino.length; r++){
            for(let c = 0; c < this.activeTetromino.length; c++){
                if(this.activeTetromino[r][c]){
                    drawSquare(this.x + c, this.y + r, color);
                }
            }
        }
    }

    Piece.prototype.draw = function(){
        this.fill(this.color);
    }

    Piece.prototype.unDraw = function(){
        const isLight = document.body.classList.contains('light-mode');
        let currentVacantColor = isLight ? "#f0f0f0" : "#080808";
        this.fill(currentVacantColor);
    }

    Piece.prototype.moveDown = function(){
        if(!this.collision(0, 1, this.activeTetromino)){
            this.unDraw();
            this.y++;
            this.draw();
        } else {
            this.lock();
            if(!gameOver) {
                p = randomPiece();
            }
        }
    }

    Piece.prototype.moveRight = function(){
        if(!this.collision(1, 0, this.activeTetromino)){
            this.unDraw();
            this.x++;
            this.draw();
        }
    }

    Piece.prototype.moveLeft = function(){
        if(!this.collision(-1, 0, this.activeTetromino)){
            this.unDraw();
            this.x--;
            this.draw();
        }
    }

    Piece.prototype.rotate = function(){
        let nextPattern = this.tetromino;
        let N = this.activeTetromino.length;
        let newPattern = [];
        for(let i=0; i<N; i++) { newPattern.push(new Array(N).fill(0)); }
        for(let y=0; y<N; y++) {
            for(let x=0; x<N; x++) {
                newPattern[x][N-1-y] = this.activeTetromino[y][x];
            }
        }
        
        if(!this.collision(0, 0, newPattern)){
            this.unDraw();
            this.activeTetromino = newPattern;
            this.draw();
        }
    }

    Piece.prototype.lock = function(){
        for(let r = 0; r < this.activeTetromino.length; r++){
            for(let c = 0; c < this.activeTetromino.length; c++){
                if(!this.activeTetromino[r][c]){ continue; }
                if(this.y + r < 0){
                    handleGameOver();
                    return;
                }
                board[this.y+r][this.x+c] = this.color;
            }
        }
        
        // Remove full rows
        for(let r = 0; r < ROW; r++){
            let isRowFull = true;
            for(let c = 0; c < COL; c++){
                if (board[r][c] === "VACANT") {
                    isRowFull = false;
                    break;
                }
            }
            if(isRowFull){
                for(let y = r; y > 1; y--){
                    for(let c = 0; c < COL; c++){
                        board[y][c] = board[y-1][c];
                    }
                }
                for(let c = 0; c < COL; c++){
                    board[0][c] = "VACANT";
                }
                score += 10;
                // Speed up
                let level = Math.floor(score / 50);
                dropInterval = Math.max(100, 1000 - (level * 50));
                scoreElement.innerText = safeGetText('scorePrefix') + score;
            }
        }
        drawBoard();
    }

    Piece.prototype.collision = function(x,y,piece){
        for(let r = 0; r < piece.length; r++){
            for(let c = 0; c < piece.length; c++){
                if(!piece[r][c]){ continue; }
                let newX = this.x + c + x;
                let newY = this.y + r + y;
                if(newX < 0 || newX >= COL || newY >= ROW){ return true; }
                if(newY < 0){ continue; }
                if(board[newY][newX] !== "VACANT"){ return true; }
            }
        }
        return false;
    }

    // --- LOGIKA GRY ---
    let p = randomPiece();
    let dropInterval = 1000;
    let dropStart = Date.now();

    function drop(){
        if(gameOver) return;
        let now = Date.now();
        let delta = now - dropStart;
        if(delta > dropInterval){
            p.moveDown();
            dropStart = Date.now();
        }
        requestAnimationFrame(drop);
    }

    function handleGameOver() {
        gameOver = true;
        let message = safeGetText('gameOverMsg') + score + ". " + safeGetText('enterNick');
        let defaultNick = safeGetText('defaultNick');

        setTimeout(() => {
            let name = prompt(message, defaultNick);
            if (name) {
                saveHighScore(score, name.trim());
                updateScoreboard();
            }
            resetGame();
        }, 50);
    }

    function resetGame() {
        for(let r = 0; r < ROW; r++){
            for(let c = 0; c < COL; c++){
                board[r][c] = "VACANT";
            }
        }
        score = 0;
        dropInterval = 1000;
        scoreElement.innerText = safeGetText('scorePrefix') + score;
        gameOver = false;
        p = randomPiece();
        drawBoard();
        drop();
    }

    function saveHighScore(score, name) {
        let scores = JSON.parse(localStorage.getItem('tetrisHighScores')) || [];
        scores.push({ score: score, name: name, date: new Date().toLocaleDateString() });
        scores.sort((a, b) => b.score - a.score);
        scores = scores.slice(0, 10);
        localStorage.setItem('tetrisHighScores', JSON.stringify(scores));
    }

    function updateScoreboard() {
        const scores = JSON.parse(localStorage.getItem('tetrisHighScores')) || [];
        const list = document.getElementById('scoreList');
        if(list) {
            list.innerHTML = scores.map(s => `<li><span>${s.name || s.date}</span> <span>${s.score}</span></li>`).join('');
        }
    }

    // --- STEROWANIE ---
    document.addEventListener("keydown", (event) => {
        if(gameOver) return;
        if(event.keyCode == 37){ p.moveLeft(); dropStart = Date.now(); }
        else if(event.keyCode == 38){ p.rotate(); dropStart = Date.now(); }
        else if(event.keyCode == 39){ p.moveRight(); dropStart = Date.now(); }
        else if(event.keyCode == 40){ p.moveDown(); }
    });

    // Mobilne
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    const rotateBtn = document.getElementById('rotate-btn');
    const downBtn = document.getElementById('down-btn');

    if(leftBtn) {
        const handleTouch = (action, e) => {
            if(e) e.preventDefault();
            if(!gameOver) {
                action();
                dropStart = Date.now();
            }
        };

        leftBtn.addEventListener('touchstart', (e) => handleTouch(() => p.moveLeft(), e));
        rightBtn.addEventListener('touchstart', (e) => handleTouch(() => p.moveRight(), e));
        rotateBtn.addEventListener('touchstart', (e) => handleTouch(() => p.rotate(), e));
        downBtn.addEventListener('touchstart', (e) => handleTouch(() => p.moveDown(), e));
        
        // Obsługa kliknięć (dla hybrydowych/desktop testów)
        leftBtn.addEventListener('click', () => handleTouch(() => p.moveLeft()));
        rightBtn.addEventListener('click', () => handleTouch(() => p.moveRight()));
        rotateBtn.addEventListener('click', () => handleTouch(() => p.rotate()));
        downBtn.addEventListener('click', () => handleTouch(() => p.moveDown()));
    }

    // --- MOTYW ---
    function toggleTheme() {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        // Odśwież planszę i napisy
        drawBoard(); 
        if(!gameOver) p.draw();
        
        if (typeof applyTranslations === 'function') {
            applyTranslations();
        }
    }

    const themeBtn = document.querySelector('.theme-switch');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }

    // --- START ---
    window.addEventListener('resize', resizeGame);
    resizeGame();
    updateScoreboard();
    scoreElement.innerText = safeGetText('scorePrefix') + score;
    drop();
});