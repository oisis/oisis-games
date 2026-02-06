const Translations = {
    pl: {
        pageTitle: "Robblorne",
        backButton: "Powrót",
        themeToLight: "JASNY",
        themeToDark: "CIEMNY",
        gameTitle: "Robblorne",
        dropsLabel: "KROPLE:",
        totalBloodLabel: "ZEBRANA KREW:",
        controlsHint: "Strzałki: Ruch | R: Restart",
        mobileHint: "Przesuń i przytrzymaj, aby biec",
        restartBtn: "Restart Levelu [R]",
        labelLives: "Życia",
        msgDeath: "STRACONO ŻYCIE!",
        msgGameOver: "KONIEC GRY",
        msgWin: "KOSZMAR PRZEZWYCIĘŻONY"
    },
    en: {
        pageTitle: "Robblorne",
        backButton: "Back",
        themeToLight: "LIGHT",
        themeToDark: "DARK",
        gameTitle: "Robblorne",
        dropsLabel: "DROPS:",
        totalBloodLabel: "TOTAL BLOOD:",
        controlsHint: "Arrows: Move | R: Restart",
        mobileHint: "Swipe and hold to run",
        restartBtn: "Restart Level [R]",
        labelLives: "Lives",
        msgDeath: "LIFE LOST!",
        msgGameOver: "GAME OVER",
        msgWin: "NIGHTMARE VANQUISHED"
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
        if (Translations[currentLang][key]) el.innerText = getText(key);
    });

    const themeBtn = document.querySelector('.theme-switch');
    if (themeBtn) {
        const isLight = document.body.classList.contains('light-mode');
        themeBtn.innerText = isLight ? getText('themeToDark') : getText('themeToLight');
    }
}

window.addEventListener('DOMContentLoaded', applyTranslations);