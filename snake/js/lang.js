const Translations = {
    pl: {
        pageTitle: "Snake - The Old Hunter",
        backButton: "Powrót",
        // Tekst, który się pojawia, gdy chcemy przełączyć:
        themeToLight: "JASNY", // Gdy jest ciemno -> proponujemy Jasny
        themeToDark: "CIEMNY", // Gdy jest jasno -> proponujemy Ciemny
        mainTitle: "Snake",
        scorePrefix: "Echa Krwi: ",
        controlsHint: "Im dłużej głodujesz, tym szybciej pędzisz...",
        scoreboardTitle: "Tablica Wyników",
        gameOverMsg: "Koniec polowania! Twój wynik: ",
        enterNick: "Podaj swój nick:",
        defaultNick: "Łowca"
    },
    en: {
        pageTitle: "Snake - The Old Hunter",
        backButton: "Back",
        themeToLight: "LIGHT",
        themeToDark: "DARK",
        mainTitle: "Snake",
        scorePrefix: "Echoes of Blood: ",
        controlsHint: "The longer you starve, the faster you rush...",
        scoreboardTitle: "Scoreboard",
        gameOverMsg: "Hunt ended! Your score: ",
        enterNick: "Enter your name:",
        defaultNick: "Hunter"
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
        // Pomijamy themeSwitch, bo obsługujemy go dynamicznie
        if (key === 'themeSwitch') return;

        if (Translations[currentLang][key]) {
            el.innerText = getText(key);
        }
    });

    // Dynamiczna zmiana napisu na przycisku motywu
    const themeBtn = document.querySelector('.theme-switch');
    if (themeBtn) {
        const isLight = document.body.classList.contains('light-mode');
        // Jeśli jest jasno -> napis CIEMNY/DARK
        // Jeśli jest ciemno -> napis JASNY/LIGHT
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