let currentQuestions = [];
let currentIdx = 0;
let lives = 3;
let score = 0;
let correctCount = 0;
let wrongCount = 0;
const TOTAL_QUESTIONS = 20;

function fisherYatesShuffle(array) {
    let m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m]; array[m] = array[i]; array[i] = t;
    }
    return array;
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    applyTranslations();
}

function startNewGame() {
    lives = 3;
    score = 0;
    currentIdx = 0;
    correctCount = 0;
    wrongCount = 0;

    const lang = localStorage.getItem('lang') || 'pl';
    const db = (lang === 'pl') ? QuestionDatabasePL : QuestionDatabaseEN;
    
    let easy = fisherYatesShuffle([...db.filter(q => q.difficulty === 1)]);
    let medium = fisherYatesShuffle([...db.filter(q => q.difficulty === 2)]);
    let hard = fisherYatesShuffle([...db.filter(q => q.difficulty === 3)]);

    currentQuestions = [
        ...easy.slice(0, 7),
        ...medium.slice(0, 7),
        ...hard.slice(0, 6)
    ];

    if (currentQuestions.length < TOTAL_QUESTIONS) {
        let remaining = db.filter(q => !currentQuestions.includes(q));
        currentQuestions = [...currentQuestions, ...fisherYatesShuffle(remaining).slice(0, TOTAL_QUESTIONS - currentQuestions.length)];
    }
    
    document.getElementById('restart-btn').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('message-box').innerText = "";
    
    if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-mode');
    else document.body.classList.remove('light-mode');
    
    updateUI();
    showQuestion();
    applyTranslations();
}

function showQuestion() {
    const q = currentQuestions[currentIdx];
    document.getElementById('question-text').innerText = q.q;
    const container = document.getElementById('options-container');
    container.innerHTML = "";
    document.getElementById('next-btn').style.display = 'none';

    let options = q.a.map((text, index) => ({ text, index }));
    options = fisherYatesShuffle(options);

    options.forEach((opt) => {
        const btn = document.createElement('button');
        btn.innerText = opt.text;
        btn.className = "option-btn";
        btn.onclick = () => checkAnswer(opt.index, btn);
        container.appendChild(btn);
    });
}

function checkAnswer(choice, clickedBtn) {
    const q = currentQuestions[currentIdx];
    const msg = document.getElementById('message-box');
    const allBtns = document.querySelectorAll('.option-btn');

    allBtns.forEach(b => b.style.pointerEvents = "none");

    if (choice === q.correct) {
        score += (q.difficulty * 100);
        correctCount++;
        msg.innerText = getText('msgCorrect');
        msg.style.color = "#c5a059";
        clickedBtn.style.borderColor = "#00ff00";
        clickedBtn.style.color = "#00ff00";
    } else {
        lives--;
        wrongCount++;
        msg.innerText = getText('msgWrong');
        msg.style.color = "#8a0f0f";
        clickedBtn.style.borderColor = "#ff0000";
        clickedBtn.style.color = "#ff0000";
        
        allBtns.forEach(b => {
            if(b.innerText === q.a[q.correct]) {
                b.style.borderColor = "#00ff00";
                b.style.color = "#00ff00";
            }
        });
    }
    
    updateUI();

    if (lives <= 0) {
        setTimeout(() => gameOver(false), 1000);
    } else {
        // Pokaż przycisk "Następne" zamiast automatycznego przejścia
        document.getElementById('next-btn').style.display = 'inline-block';
    }
}

function proceedToNext() {
    if (currentIdx === currentQuestions.length - 1) {
        gameOver(true);
    } else {
        document.getElementById('message-box').innerText = "";
        currentIdx++;
        updateUI();
        showQuestion();
    }
}

function updateUI() {
    document.getElementById('lives-val').innerText = "❤️".repeat(Math.max(0, lives));
    document.getElementById('score-val').innerText = score;
    document.getElementById('question-count').innerText = `${currentIdx + 1}/${currentQuestions.length}`;
    document.getElementById('correct-counter').innerText = correctCount;
    document.getElementById('wrong-counter').innerText = wrongCount;
}

function gameOver(win) {
    document.getElementById('options-container').innerHTML = "";
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('question-text').innerText = win ? getText('msgWin') : getText('msgLose');
    document.getElementById('restart-btn').style.display = 'inline-block';
    updateUI();
}

window.onload = startNewGame;