const Translations = {
    pl: {
        backButton: "Powrót",
        locationLabel: "LOKACJA",
        scoreLabel: "RUNY",
        restartBtn: "NOWA GRA (RESET)",
        challengeBtn: "⚡ WYZWANIE LORE (+1/-2)",
        nextBtn: "KONTYNUUJ >>",
        menuBtn: "↩ ZMIEŃ WĄTEK",
        noRunes: "Brak Run na najazd!",
        winLabel: "WYGRANA",
        correctMsg: "Dobrze! +1 Runa.",
        wrongMsg: "Błąd! Tracisz 2 Runy.",
        themeToLight: "JASNY",
        themeToDark: "CIEMNY"
    },
    en: {
        backButton: "Back",
        locationLabel: "LOCATION",
        scoreLabel: "RUNES",
        restartBtn: "NEW GAME (RESET)",
        challengeBtn: "⚡ LORE CHALLENGE (+1/-2)",
        nextBtn: "CONTINUE >>",
        menuBtn: "↩ CHANGE QUEST",
        noRunes: "No Runes for invasion!",
        winLabel: "VICTORY",
        correctMsg: "Correct! +1 Rune.",
        wrongMsg: "Wrong! -2 Runes.",
        themeToLight: "LIGHT",
        themeToDark: "DARK"
    }
};

function getText(key) {
    const lang = localStorage.getItem('lang') || 'pl';
    return Translations[lang][key] || key;
}

function applyTranslations() {
    // Tłumaczenie elementów z atrybutem data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.innerText = getText(el.getAttribute('data-i18n'));
    });

    // Dynamiczna aktualizacja tekstu przycisku motywu
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        const isLight = document.body.classList.contains('light-mode');
        themeBtn.innerText = isLight ? getText('themeToDark') : getText('themeToLight');
    }
}