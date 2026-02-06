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
        mobileHint: "Przesuń palcem, aby wykonać krok", // Nowe
        restartBtn: "Restart [R]",
        msgDeath: "POCHŁONĘŁA CIĘ CIEMNOŚĆ",
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
        mobileHint: "Swipe to take a step", // Nowe
        restartBtn: "Restart [R]",
        msgDeath: "DARKNESS CONSUMED YOU",
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
        if (Translations[currentLang][key]) {
            el.innerText = getText(key);
        }
    });

    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) restartBtn.innerText = getText('restartBtn');

    const themeBtn = document.querySelector('.theme-switch');
    if (themeBtn) {
        const isLight = document.body.classList.contains('light-mode');
        if (isLight) {
            themeBtn.innerText = Translations[currentLang].themeToDark;
        } else {
            themeBtn.innerText = Translations[currentLang].themeToLight;
        }
    }
}

window.addEventListener('DOMContentLoaded', applyTranslations);