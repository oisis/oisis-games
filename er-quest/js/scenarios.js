const SVGs = {
    hold: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#050505"/><circle cx="200" cy="180" r="80" fill="none" stroke="#5e4b2a" stroke-width="2"/><path d="M200 150 Q210 170 200 190 Q190 170 200 150" fill="#ffcc00"><animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" /></path></svg>`,
    varre: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#1a0000"/><path d="M200 80 Q250 80 260 150 Q260 220 200 240 Q140 220 140 150 Q150 80 200 80" fill="#e0e0e0"/><path d="M0 280 Q200 260 400 280 L400 300 L0 300 Z" fill="#8a0f0f"/></svg>`,
    melina: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#0a0a05"/><path d="M200 280 L200 100" stroke="#c5a059" stroke-width="4"/><circle cx="200" cy="80" r="40" fill="#ffcc00" opacity="0.6"><animate attributeName="r" values="35;45;35" dur="4s" repeatCount="indefinite" /></circle></svg>`,
    ranni: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#000510"/><circle cx="250" cy="100" r="50" fill="#88ccff"/><circle cx="230" cy="90" r="50" fill="#000510"/></svg>`,
    success: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#000"/><circle cx="200" cy="150" r="70" fill="none" stroke="#c5a059" stroke-width="10"/><text x="200" y="160" font-family="Cinzel" font-size="20" fill="#c5a059" text-anchor="middle">RESTORED</text></svg>`,
    fail: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#100"/><text x="200" y="160" font-family="Cinzel" font-size="40" fill="#8a0f0f" text-anchor="middle">YOU DIED</text></svg>`,
    broke: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#000"/><text x="200" y="120" font-family="Cinzel" font-size="25" fill="#555" text-anchor="middle">RUNELESS</text></svg>`,
    chaos: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#221100"/><path d="M200 150 L220 100 L180 120 L200 150" fill="#ff6600" opacity="0.8"/></svg>`
};

const Scenarios = {
    pl: {
        "menu": {
            text: "Witaj w Twierdzy Okrągłego Stołu. Wybierz wątek, który chcesz śledzić. Pamiętaj: każda pomyłka kosztuje 2 Runy, sukces daje 1. Jeśli Twoje Runy spadną poniżej zera, gra się kończy.",
            location: "Twierdza Okrągłego Stołu",
            image: SVGs.hold,
            choices: [
                { text: "Wątek Białej Maski Varre", consequence: "Wyruszasz na spotkanie z Varre przy Pierwszym Kroku.", next: "varre_start" },
                { text: "Wątek Meliny", consequence: "Postanawiasz podążać za światłem łaski u boku Meliny.", next: "melina_start" },
                { text: "Wątek Wiedźmy Ranni", consequence: "Kierujesz się do wież w Liurnii, by służyć Pani Księżyca.", next: "ranni_start" }
            ]
        },
        // --- VARRE ---
        "varre_start": {
            text: "'Och, spójrzcie na to. Zmatowiec bez dziewicy.' – Varre kpi z Twojego stanu. Musisz pokonać Godricka, by dowieść swej siły. Gdzie on rezyduje?",
            location: "Pogrobno",
            image: SVGs.varre,
            choices: [
                { text: "W Zamku Burzowego Całunu", consequence: "Wkraczasz do zamku i pokonujesz Godricka Zszywańca!", next: "varre_hub", points: 1 },
                { text: "W Akademii Raya Lucaria", consequence: "To dom Rennali. Błądzisz w labiryncie magii, tracąc siły.", next: "fail_quest", points: -2 },
                { text: "W Zamku Czerwonej Grzywy", consequence: "Tam włada Radahn. Ledwo uchodzisz z życiem.", next: "fail_quest", points: -2 }
            ]
        },
        "varre_hub": {
            text: "Odnajdujesz Varre w Kościele Róż. Daje Ci Krwawe Palce. 'Musisz najechać 3 światy innych Zmatowieńców. Każdy najazd kosztuje 1 Runę'.",
            location: "Kościół Róż",
            image: SVGs.varre,
            choices: [
                { text: "PRZEPROWADŹ NAJAZD (1 Runa)", action: "invade", consequence: "Wkraczasz jako najeźdźca. Walka jest krwawa, ale wygrywasz!", next: "varre_hub" },
                { text: "Odrzuć drogę przemocy", consequence: "Varre uznaje Cię za słabeusza.", next: "fail_quest", points: -2 },
                { text: "Wróć do Menu", consequence: "Postanawiasz zdobyć więcej Run gdzie indziej.", next: "menu", points: 0 }
            ]
        },
        "varre_finished": {
            text: "Najazdy ukończone. Teraz musisz nasączyć płótno krwią dziewicy. Gdzie szukasz jej ciała?",
            location: "Liurnia",
            image: SVGs.varre,
            choices: [
                { text: "W Kościele Zahamowania", consequence: "Odnajdujesz martwą dziewicę. Płótno staje się szkarłatne.", next: "varre_final", points: 1 },
                { text: "W Kaplicy Zgliszcz", consequence: "Wracasz tam, gdzie zacząłeś. Inicjacja udana!", next: "varre_final", points: 1 },
                { text: "W Wiosce Albinauryków", consequence: "Błąd. Tam nie ma dziewicy palców.", next: "fail_quest", points: -2 }
            ]
        },
        "varre_final": {
            text: "Varre odcina Ci palec i daje Medalion Rycerza Czystej Krwi. 'Mój Pan, Mohg, czeka'. Czy użyjesz go, by przenieść się do Mauzoleum?",
            location: "Pałac Mohgwyn",
            image: SVGs.varre,
            choices: [
                { text: "Używam medalionu i idę do Mohga", consequence: "Lądujesz w sercu krwawej dynastii. Quest ukończony!", next: "quest_complete", points: 1 },
                { text: "Zostawiam go na później", consequence: "Odkładasz to na inny czas.", next: "menu", points: 0 },
                { text: "Wrzucam go do jeziora", consequence: "Varre Cię przeklina.", next: "fail_quest", points: -2 }
            ]
        },
        // --- MELINA ---
        "melina_start": {
            text: "Melina oferuje układ. Aby dotrzeć do Erdtree, musicie aktywować Wielką Windę Dectus. Gdzie szukasz lewej części medalionu?",
            location: "Pogrobno",
            image: SVGs.melina,
            choices: [
                { text: "W Forcie Haight", consequence: "Odnajdujesz medalion na szczycie wieży.", next: "melina_med_2", points: 1 },
                { text: "W Forcie Faroth", consequence: "To miejsce skrywa prawą połowę, nie lewą.", next: "fail_quest", points: -2 },
                { text: "W Zamku Morne", consequence: "Nie znajdujesz tam medalionu.", next: "fail_quest", points: -2 }
            ]
        },
        "melina_med_2": {
            text: "Masz lewą połowę. Druga spoczywa w Caelid. Gdzie dokładnie musisz się udać?",
            location: "Caelid",
            image: SVGs.melina,
            choices: [
                { text: "Do Fortu Faroth", consequence: "Unikasz smoków i zdobywasz prawą część. Winda działa!", next: "melina_elevator", points: 1 },
                { text: "Do Fortu Gael", consequence: "W tym forcie nie ma medalionu.", next: "fail_quest", points: -2 },
                { text: "Do Miasta Sellia", consequence: "Zostajesz osaczony przez widma.", next: "fail_quest", points: -2 }
            ]
        },
        "melina_elevator": {
            text: "Winda zabiera Cię na Płaskowyż Altus. Melina pyta: 'Kto pilnuje wejścia do Stolicy Leyndell?'",
            location: "Płaskowyż Altus",
            image: SVGs.melina,
            choices: [
                { text: "Smoczy Strażnik Drzewa", consequence: "Pokonujesz go. Złote bramy stolicy stają otworem.", next: "melina_capital", points: 1 },
                { text: "Margit, Upadły Omen", consequence: "To zły boss.", next: "fail_quest", points: -2 },
                { text: "Radahn Gwiezdny Konający", consequence: "On jest w Caelid!", next: "fail_quest", points: -2 }
            ]
        },
        "melina_capital": {
            text: "Jesteś w Leyndell. Melina prosi o 'Grzech Kardynalny' – spalenie Erdtree. Co zrobisz?",
            location: "Szczyty Olbrzymów",
            image: SVGs.melina,
            choices: [
                { text: "Pozwalam Melinie spłonąć w Kuźni", consequence: "Drzewo płonie! Droga do finału otwarta.", next: "quest_complete", points: 1 },
                { text: "Przyjmuję Oszalały Płomień", consequence: "Melina przeklina Cię i odchodzi.", next: "melina_chaos", points: -2 },
                { text: "Odmawiam i wracam", consequence: "Wracasz do huba.", next: "menu", points: 0 }
            ]
        },
        // --- RANNI ---
        "ranni_start": {
            text: "Ranni szuka drogi do Nokronu. Gdzie wysyłasz Blaidda na zwiad?",
            location: "Trzy Wieże",
            image: SVGs.ranni,
            choices: [
                { text: "Do Rzeki Siofra", consequence: "Blaidd czeka pod ziemią.", next: "ranni_radahn", points: 1 },
                { text: "Do Rzeki Ainsel", consequence: "Błędny kierunek.", next: "fail_quest", points: -2 },
                { text: "Do Akademii", consequence: "Błąd.", next: "fail_quest", points: -2 }
            ]
        },
        "ranni_radahn": {
            text: "Blaidd mówi, że gwiazdy zatrzymał Radahn. Kto organizuje jego festiwal?",
            location: "Caelid",
            image: SVGs.ranni,
            choices: [
                { text: "Kasztelan Jerren", consequence: "Festiwal się zaczyna. Radahn pada!", next: "ranni_crater", points: 1 },
                { text: "Seluvis", consequence: "On knuje spiski.", next: "fail_quest", points: -2 },
                { text: "Iji", consequence: "To kowal.", next: "fail_quest", points: -2 }
            ]
        },
        "ranni_crater": {
            text: "Gwiazda uderzyła w ziemię. Gdzie szukasz krateru do Nokronu?",
            location: "Pogrobno",
            image: SVGs.ranni,
            choices: [
                { text: "W Limgrave (Mistwood)", consequence: "Schodzisz do krateru. Nokron ukazuje swe wieże.", next: "ranni_treasure", points: 1 },
                { text: "W Liurnii", consequence: "To tylko mgła.", next: "fail_quest", points: -2 },
                { text: "W Caelid", consequence: "Pomyłka.", next: "fail_quest", points: -2 }
            ]
        },
        "ranni_treasure": {
            text: "W Nokronie szukasz Ostrza Pogromcy Palców. Gdzie ono jest?",
            location: "Nokron",
            image: SVGs.ranni,
            choices: [
                { text: "Pod gigantycznym tronem", consequence: "Masz ostrze! Ranni dziękuje Ci.", next: "quest_complete", points: 1 },
                { text: "U Mimic Tear", consequence: "Błąd.", next: "fail_quest", points: -2 },
                { text: "W wieży Seluvisa", consequence: "Błąd.", next: "fail_quest", points: -2 }
            ]
        },
        // --- STATUSY ---
        "quest_complete": { text: "Sukces! Wątek zakończony.", location: "Zwycięstwo", image: SVGs.success, status: "SUCCESS", choices: [{ text: "Powrót do Menu", consequence: "Wracasz do Twierdzy.", next: "menu" }] },
        "fail_quest": { text: "Porażka. Twoje Runy topnieją.", location: "Porażka", image: SVGs.fail, status: "FAILED", choices: [{ text: "Spróbuj ponownie", consequence: "Wracasz do menu.", next: "menu" }] },
        "rune_death": { text: "Zbankrutowałeś. Bez Run jesteś tylko cieniem. Gra skończona.", location: "Otchłań", image: SVGs.broke, status: "GAME OVER", choices: [] },
        "melina_chaos": { text: "Zostałeś Panem Chaosu.", location: "Płomień Chaosu", image: SVGs.chaos, status: "BETRAYAL", choices: [{ text: "Menu", next: "menu" }] }
    },
    en: {
        "menu": {
            text: "The Lands Between await. Success +1 Rune, Error -2 Runes. If Runes drop below zero, the game ends.",
            location: "Roundtable Hold",
            image: SVGs.hold,
            choices: [
                { text: "Varre's Questline", consequence: "Heading to the First Step.", next: "varre_start" },
                { text: "Melina's Accord", consequence: "Following the guidance of grace.", next: "melina_start" },
                { text: "Ranni's Service", consequence: "Journeying to Ranni's Rise.", next: "ranni_start" }
            ]
        },
        "varre_start": {
            text: "Varre mocks you. Slay Godrick to prove your worth. Where is he?",
            location: "Limgrave",
            image: SVGs.varre,
            choices: [
                { text: "Stormveil Castle", consequence: "Godrick the Grafted falls!", next: "varre_hub", points: 1 },
                { text: "Raya Lucaria Academy", consequence: "Wrong castle.", next: "fail_quest", points: -2 },
                { text: "Redmane Castle", consequence: "Wrong place.", next: "fail_quest", points: -2 }
            ]
        },
        "varre_hub": {
            text: "Perform 3 invasions. Cost: 1 Rune each.",
            location: "Rose Church",
            image: SVGs.varre,
            choices: [
                { text: "PERFORM INVASION (1 Rune)", action: "invade", consequence: "Victory in another world!", next: "varre_hub" },
                { text: "Give up", consequence: "Varre deems you weak.", next: "fail_quest", points: -2 },
                { text: "Menu", consequence: "Changing plans.", next: "menu", points: 0 }
            ]
        },
        "varre_finished": {
            text: "Where is the maiden's blood?",
            location: "Liurnia",
            image: SVGs.varre,
            choices: [
                { text: "Church of Inhibition", consequence: "Cloth soaked in blood!", next: "varre_final", points: 1 },
                { text: "Academy", consequence: "Error.", next: "fail_quest", points: -2 },
                { text: "Village of Albinaurics", consequence: "Error.", next: "fail_quest", points: -2 }
            ]
        },
        "varre_final": {
            text: "Go to Mohgwyn?",
            location: "Mohgwyn Palace",
            image: SVGs.varre,
            choices: [
                { text: "Use Medallion", consequence: "Quest complete!", next: "quest_complete", points: 1 },
                { text: "Wait", consequence: "Not now.", next: "menu", points: 0 },
                { text: "Discard", consequence: "Varre curses you.", next: "fail_quest", points: -2 }
            ]
        },
        "melina_start": {
            text: "Where is the left Dectus Medallion?",
            location: "Limgrave",
            image: SVGs.melina,
            choices: [
                { text: "Fort Haight", consequence: "You found it!", next: "melina_med_2", points: 1 },
                { text: "Fort Faroth", consequence: "Wrong half.", next: "fail_quest", points: -2 },
                { text: "Castle Morne", consequence: "Error.", next: "fail_quest", points: -2 }
            ]
        },
        "melina_med_2": {
            text: "Where is the right half?",
            location: "Caelid",
            image: SVGs.melina,
            choices: [
                { text: "Fort Faroth", consequence: "Lift is ready!", next: "melina_elevator", points: 1 },
                { text: "Fort Gael", consequence: "Error.", next: "fail_quest", points: -2 },
                { text: "Sellia", consequence: "Error.", next: "fail_quest", points: -2 }
            ]
        },
        "melina_elevator": {
            text: "Who guards Leyndell?",
            location: "Altus Plateau",
            image: SVGs.melina,
            choices: [
                { text: "Draconic Tree Sentinel", consequence: "Victory!", next: "melina_capital", points: 1 },
                { text: "Margit", consequence: "Error.", next: "fail_quest", points: -2 },
                { text: "Radahn", consequence: "Error.", next: "fail_quest", points: -2 }
            ]
        },
        "melina_capital": {
            text: "Burn the Erdtree?",
            location: "Mountaintops",
            image: SVGs.melina,
            choices: [
                { text: "Let Melina burn", consequence: "It burns!", next: "quest_complete", points: 1 },
                { text: "Frenzied Flame", consequence: "Betrayal.", next: "melina_chaos", points: -2 },
                { text: "Refuse", consequence: "Stuck.", next: "fail_quest", points: -2 }
            ]
        },
        "ranni_start": {
            text: "Where is Blaidd?",
            location: "Three Sisters",
            image: SVGs.ranni,
            choices: [
                { text: "Siofra River", consequence: "Found him.", next: "ranni_radahn", points: 1 },
                { text: "Ainsel River", consequence: "Error.", next: "fail_quest", points: -2 },
                { text: "Academy", consequence: "Error.", next: "fail_quest", points: -2 }
            ]
        },
        "ranni_radahn": {
            text: "Who holds the festival?",
            location: "Caelid",
            image: SVGs.ranni,
            choices: [
                { text: "Castellan Jerren", consequence: "Festival starts!", next: "ranni_crater", points: 1 },
                { text: "Seluvis", consequence: "Error.", next: "fail_quest", points: -2 },
                { text: "Iji", consequence: "Error.", next: "fail_quest", points: -2 }
            ]
        },
        "ranni_crater": {
            text: "Where is the crater?",
            location: "Limgrave",
            image: SVGs.ranni,
            choices: [
                { text: "Mistwood", consequence: "Found Nokron entrance!", next: "ranni_treasure", points: 1 },
                { text: "Liurnia", consequence: "Error.", next: "fail_quest", points: -2 },
                { text: "Caelid", consequence: "Error.", next: "fail_quest", points: -2 }
            ]
        },
        "ranni_treasure": {
            text: "Where is the Blade?",
            location: "Nokron",
            image: SVGs.ranni,
            choices: [
                { text: "Under giant throne", consequence: "Acquired!", next: "quest_complete", points: 1 },
                { text: "Mimic Tear", consequence: "Error.", next: "fail_quest", points: -2 },
                { text: "Seluvis Rise", consequence: "Error.", next: "fail_quest", points: -2 }
            ]
        },
        "quest_complete": { text: "Success!", location: "Victory", image: SVGs.success, status: "SUCCESS", choices: [{ text: "Menu", next: "menu" }] },
        "fail_quest": { text: "Failed.", location: "Fail", image: SVGs.fail, status: "FAILED", choices: [{ text: "Menu", next: "menu" }] },
        "rune_death": { text: "Penniless. Game Over.", location: "Abyss", image: SVGs.broke, status: "GAME OVER", choices: [] },
        "melina_chaos": { text: "Lord of Chaos.", location: "Flame", image: SVGs.chaos, status: "BETRAYAL", choices: [{ text: "Menu", next: "menu" }] }
    }
};

const LoreChallenges = {
    pl: [
        { q: "Kto jest ojcem Ranni?", a: ["Radagon", "Godfrey", "Morgott"], correct: 0 },
        { q: "Jak nazywa się koń Radahna?", a: ["Torrent", "Leonard", "Serosh"], correct: 1 },
        { q: "Kto uknuł Noc Czarnych Noży?", a: ["Marika", "Ranni", "Melina"], correct: 1 },
        { q: "Kto władał Zamkiem Cieni w DLC?", a: ["Messmer", "Miquella", "Gaius"], correct: 0 },
        { q: "Jak nazywa się kowal w Twierdzy?", a: ["Iji", "Hewg", "Andre"], correct: 1 }
    ],
    en: [
        { q: "Who is Ranni's father?", a: ["Radagon", "Godfrey", "Morgott"], correct: 0 },
        { q: "What is Radahn's horse's name?", a: ["Torrent", "Leonard", "Serosh"], correct: 1 },
        { q: "Who plotted the Night of Black Knives?", a: ["Marika", "Ranni", "Melina"], correct: 1 }
    ]
};