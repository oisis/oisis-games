const Translations = {
    pl: {
        pageTitle: "Tetris - The Old Builder",
        backButton: "Powrót",
        themeToLight: "JASNY",
        themeToDark: "CIEMNY",
        mainTitle: "Tetris",
        scorePrefix: "Echa Krwi: ",
        controlsHint: "Strzałki: Ruch / Góra: Obrót",
        mobileHint: "Tap: Obrót | Przesuń: Ruch", // Nowy tekst
        scoreboardTitle: "Tablica Wyników",
        gameOverMsg: "Koniec warty! Twój wynik: ",
        enterNick: "Podaj swój nick:",
        defaultNick: "Budowniczy"
    },
    en: {
        pageTitle: "Tetris - The Old Builder",
        backButton: "Back",
        themeToLight: "LIGHT",
        themeToDark: "DARK",
        mainTitle: "Tetris",
        scorePrefix: "Echoes of Blood: ",
        controlsHint: "Arrows: Move / Up: Rotate",
        mobileHint: "Tap: Rotate | Swipe: Move", // Nowy tekst
        scoreboardTitle: "Scoreboard",
        gameOverMsg: "Watch ended! Your score: ",
        enterNick: "Enter your name:",
        defaultNick: "Builder"
    }
};

let currentLang = localStorage.getItem('lang') || 'pl';

function getText(key) {
    return Translations[currentLang][key];
}

function applyTranslations() {
    document.title = getText('pageTitle');

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key === 'themeSwitch') return; 
        if (Translations[currentLang][key]) {
            el.innerText = getText(key);
        }
    });

    const themeBtn = document.querySelector('.theme-switch');
    if (themeBtn) {
        const isLight = document.body.classList.contains('light-mode');
        if (isLight) {
            themeBtn.innerText = Translations[currentLang].themeToDark;
        } else {
            themeBtn.innerText = Translations[currentLang].themeToLight;
        }
    }

    const scoreEl = document.getElementById('score');
    if (scoreEl) {
        const currentScoreText = scoreEl.innerText;
        const scoreMatch = currentScoreText.match(/\d+/); 
        const scoreVal = scoreMatch ? scoreMatch[0] : 0;
        scoreEl.innerText = getText('scorePrefix') + scoreVal;
    }
}

window.addEventListener('DOMContentLoaded', applyTranslations);