const Translations = {
    pl: {
        quizTitle: "ELDEN QUIZ",
        backButton: "Powrót",
        themeToLight: "JASNY",
        themeToDark: "CIEMNY",
        livesLabel: "ŻYCIA",
        scoreLabel: "PUNKTY",
        questionLabel: "PYTANIE",
        nextBtn: "NASTĘPNE",
        restartBtn: "ZAGRAJ PONOWNIE",
        msgWin: "ZOSTAŁEŚ ELDEŃSKIM LORDEM!",
        msgLose: "YOU DIED",
        msgCorrect: "DOBRZE!",
        msgWrong: "BŁĄD! STRACONO ŻYCIE"
    },
    en: {
        quizTitle: "ELDEN QUIZ",
        backButton: "Back",
        themeToLight: "LIGHT",
        themeToDark: "DARK",
        livesLabel: "LIVES",
        scoreLabel: "SCORE",
        questionLabel: "QUESTION",
        nextBtn: "NEXT",
        restartBtn: "PLAY AGAIN",
        msgWin: "YOU BECAME ELDEN LORD!",
        msgLose: "YOU DIED",
        msgCorrect: "CORRECT!",
        msgWrong: "WRONG! LIFE LOST"
    }
};

let currentLang = localStorage.getItem('lang') || 'pl';

function getText(key) {
    return Translations[currentLang][key];
}

function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (Translations[currentLang][key]) el.innerText = getText(key);
    });

    document.getElementById('quiz-title').innerText = getText('quizTitle');
    
    const themeBtn = document.getElementById('theme-btn');
    const isLight = document.body.classList.contains('light-mode');
    themeBtn.innerText = isLight ? getText('themeToDark') : getText('themeToLight');
}