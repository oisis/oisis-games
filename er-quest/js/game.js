let currentStep = "menu";
let totalRunes = 0;
let varreInvasionsDone = 0;

function initGame() {
    currentStep = localStorage.getItem('currentStep') || "menu";
    varreInvasionsDone = parseInt(localStorage.getItem('varreInvasionsDone')) || 0;
    
    const savedRunes = localStorage.getItem('questRunes');
    totalRunes = (savedRunes !== null) ? parseInt(savedRunes) : 10;

    if (totalRunes < 0) currentStep = "rune_death";

    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }

    document.getElementById('restart-btn').style.display = 'none';
    
    // Najpierw tłumaczenia, potem strona
    applyTranslations();
    updatePage();
}

function updatePage() {
    const lang = localStorage.getItem('lang') || 'pl';
    const db = Scenarios[lang] || Scenarios['pl'];
    const stepData = db[currentStep];
    
    if (!stepData) return;

    localStorage.setItem('currentStep', currentStep);

    document.getElementById('story-text').innerText = stepData.text;
    document.getElementById('location-val').innerText = stepData.location;
    document.getElementById('score-val').innerText = totalRunes;
    document.getElementById('img-container').innerHTML = stepData.image;

    const statusVal = document.getElementById('status-val');
    statusVal.innerText = stepData.status || "ACTIVE";
    statusVal.style.background = (stepData.status === "SUCCESS") ? "#c5a059" : (stepData.status ? "#8a0f0f" : "#5e4b2a");

    const container = document.getElementById('choices-container');
    container.innerHTML = ""; 

    if (currentStep === "rune_death" || stepData.status === "SUCCESS" || stepData.status === "FAILED") {
        document.getElementById('restart-btn').style.display = 'inline-block';
        if (currentStep === "rune_death") return; 
    }

    if (stepData.choices) {
        stepData.choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.innerText = choice.text;
            btn.className = "choice-btn";
            btn.onclick = () => {
                if (choice.action === "invade" && totalRunes < 1) {
                    alert(getText('noRunes')); return;
                }
                showConsequence(choice);
            };
            container.appendChild(btn);
        });
    }

    if (currentStep === "menu") {
        const resetBtn = document.createElement('button');
        resetBtn.innerText = "🔥 " + getText('restartBtn');
        resetBtn.className = "choice-btn";
        resetBtn.style.background = "#3d0b0b";
        resetBtn.onclick = resetGame;
        container.appendChild(resetBtn);
    }

    if (currentStep !== "menu" && currentStep !== "rune_death") {
        const menuBtn = document.createElement('button');
        menuBtn.innerText = getText('menuBtn');
        menuBtn.className = "choice-btn";
        menuBtn.style.opacity = "0.6";
        menuBtn.style.marginTop = "20px";
        menuBtn.onclick = () => {
            currentStep = "menu";
            updatePage();
        };
        container.appendChild(menuBtn);
    }
}

function showConsequence(choice) {
    const container = document.getElementById('choices-container');
    container.innerHTML = ""; 

    let change = choice.points || 0;
    if (choice.action === "invade") {
        totalRunes -= 1;
        varreInvasionsDone++;
        localStorage.setItem('varreInvasionsDone', varreInvasionsDone);
        change = 1; 
    }

    totalRunes += change;
    localStorage.setItem('questRunes', totalRunes);
    document.getElementById('score-val').innerText = totalRunes;

    if (totalRunes < 0) {
        currentStep = "rune_death";
        updatePage();
        return;
    }

    document.getElementById('story-text').innerText = choice.consequence;

    const nextBtn = document.createElement('button');
    let target = choice.next;
    
    if (choice.action === "invade") {
        nextBtn.innerText = `${getText('winLabel')} (${varreInvasionsDone}/3) >>`;
        target = (varreInvasionsDone < 3) ? "varre_hub" : "varre_finished";
    } else {
        nextBtn.innerText = getText('nextBtn');
    }

    nextBtn.className = "choice-btn";
    nextBtn.onclick = () => {
        currentStep = target;
        updatePage();
    };
    container.appendChild(nextBtn);
}

function resetGame() {
    const confirmText = localStorage.getItem('lang') === 'en' ? "Start new game?" : "Zacząć nową grę?";
    if (confirm(confirmText)) {
        localStorage.removeItem('questRunes');
        localStorage.removeItem('currentStep');
        localStorage.removeItem('varreInvasionsDone');
        totalRunes = 10;
        currentStep = "menu";
        varreInvasionsDone = 0;
        initGame();
    }
}

function startLoreChallenge() {
    const lang = localStorage.getItem('lang') || 'pl';
    const pool = LoreChallenges[lang] || LoreChallenges['pl'];
    const q = pool[Math.floor(Math.random() * pool.length)];
    const container = document.getElementById('choices-container');
    
    document.getElementById('story-text').innerText = q.q;
    container.innerHTML = "";

    q.a.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = "choice-btn";
        btn.onclick = () => {
            if (idx === q.correct) {
                totalRunes += 1;
                alert(getText('correctMsg'));
            } else {
                totalRunes -= 2;
                alert(getText('wrongMsg'));
            }
            localStorage.setItem('questRunes', totalRunes);
            if (totalRunes < 0) currentStep = "rune_death";
            updatePage();
        };
        container.appendChild(btn);
    });
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    
    // Ta funkcja teraz automatycznie zmieni napis na przycisku
    applyTranslations();
}

document.addEventListener('DOMContentLoaded', initGame);