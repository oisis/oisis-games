const Levels = [
    // --- POZIOM 1: Przebudzenie (Tutorial) ---
    {
        id: 1,
        map: [
            "#############", 
            "#R..B......S#", 
            "###.B..######", 
            "#..........K#", 
            "#####D#######", 
            "#S..........#", 
            "#######..S..#", 
            "#S#.....#####", 
            "#...B......E#", 
            "#############"
        ],
        enemies: [
            { x: 10, y: 3, dir: -1, icon: "🕷️", axis: 'x' },
            { x: 7, y: 6, dir: -1, icon: "🕷️", axis: 'y' }
        ]
    },

    // --- POZIOM 2: Podwójne zagrożenie ---
    {
        id: 2,
        map: [
            "#############",
            "#S....#..B.S#",
            "#..B..D..B..#",
            "###.#####.###",
            "#.....R....K#",
            "###.#####.###",
            "#...B.E.B...#",
            "#S....#....S#",
            "#############"
        ],
        enemies: [
            { x: 1, y: 1, dir: 1, icon: "🕷️", axis: 'x' },
            { x: 11, y: 7, dir: -1, icon: "🕷️", axis: 'x' }
        ]
    },

    // --- POZIOM 3: Korytarz Ciemności ---
    {
        id: 3,
        map: [
            "###############",
            "#R.....S.....K#", // Góra: Start -> Krew -> Klucz (Bezpiecznie)
            "#######.#######", // Ściana oddzielająca
            "#.....S.......#", // Środek: Patrol pająka (Szeroko)
            "#######.#######", // Ściana oddzielająca
            "#S....D......E#", // Dół: Krew -> Drzwi (Blokada) -> Wyjście
            "###############"
        ],
        enemies: [
            // Jeden pająk chodzący po środkowym korytarzu lewo-prawo.
            // Masz czas, żeby przebiec z góry na dół, gdy on jest daleko.
            { x: 1, y: 3, dir: 1, icon: "🕷️", axis: 'x' }
        ]
    },

    // --- POZIOM 4: Magazyn Krwi (Puzzle ze skrzyniami) ---
    {
        id: 4,
        map: [
            "###########",
            "#R.......S#",
            "###.#####.#",
            "#S..B.....#", // Ta skrzynia blokuje dostęp do dolnej części
            "###.###.###",
            "#K..B...S.#", // Musisz przepchnąć tę skrzynię, by dostać się do K
            "###.###.###",
            "#S....D..E#",
            "###########"
        ],
        enemies: [
            { x: 7, y: 4, dir: 1, icon: "🕷️", axis: 'y' }
        ] // Skupiamy się na logice
    },

    // --- POZIOM 5: Zygzak Śmierci ---
    {
        id: 5,
        map: [
            "#############",
            "#R..........#",
            "#######.#####",
            "#S...E#.....#", // Tutaj pająk 1 (lewa strona)
            "#.##.##.###.##",
            "#..S.......K#", // Tutaj pająk 2 (środek)
            "#.#########.##",
            "#S....D..S..#", // Dół: Drzwi i Wyjście
            "#############"
        ],
        enemies: [
            // Pająki mają teraz ograniczone trasy, nie blokują całej mapy
            { x: 1, y: 3, dir: 1, icon: "🕷️", axis: 'x' },
            { x: 4, y: 5, dir: 1, icon: "🕷️", axis: 'x' },
            { x: 7, y: 3, dir: 1, icon: "🕷️", axis: 'y' }
        ]
    },

    // --- POZIOM 6: Zamknięty Ogród ---
    {
        id: 6,
        map: [
            "###########",
            "#K..S#S..K#",
            "#.##.#.##.#",
            "#....R....#",
            "#.##.#.##.#",
            "#S..D#D..S#",
            "#####E#####"
        ],
        enemies: [
            { x: 1, y: 3, dir: 1, icon: "🕷️", axis: 'x' }, // Pająk przechodzi przez środek (przez R)
            { x: 9, y: 3, dir: -1, icon: "🕷️", axis: 'x' }
        ]
    },

    // --- POZIOM 7: Labirynt Skrzyń ---
    {
        id: 7,
        map: [
            "#############",
            "#R..B..S..B.#",
            "#...#..#..#.#",
            "#B..B..K..B.#", // Dużo skrzyń do przesunięcia
            "#######D#####",
            "#S..........#",
            "#######.#####",
            "#E..........#",
            "#############"
        ],
        enemies: [
            { x: 10, y: 5, dir: -1, icon: "🕷️", axis: 'x' }
        ]
    },

    // --- POZIOM 8: Arena ---
    {
        id: 8,
        map: [
            "###############",
            "#S...........S#",
            "#.............#",
            "#.............#",
            "#..S...R...S..#",
            "#.............#",
            "#.............#",
            "#K...........E#", // Bez drzwi, ale trzeba zebrać krew uciekając
            "###############"
        ],
        enemies: [
            { x: 1, y: 2, dir: 1, icon: "🕷️", axis: 'x' },
            { x: 13, y: 3, dir: -1, icon: "🕷️", axis: 'x' },
            { x: 1, y: 5, dir: 1, icon: "🕷️", axis: 'x' },
            { x: 13, y: 6, dir: -1, icon: "🕷️", axis: 'x' }
        ]
    },

    // --- POZIOM 9: Wąskie Gardło ---
    {
        id: 9,
        map: [
            "#############",
            "#R.S#S.S#S.K#",
            "###.#.#.#.###",
            "#...........#", // Bardzo niebezpieczny korytarz
            "###.#.#.#.###",
            "#S.S#S#S#S.E#",
            "#############"
        ],
        enemies: [
            { x: 1, y: 3, dir: 1, icon: "🕷️", axis: 'x' },
            { x: 6, y: 3, dir: 1, icon: "🕷️", axis: 'x' }, // Dwa pająki w jednym rzędzie
            { x: 11, y: 3, dir: -1, icon: "🕷️", axis: 'x' }
        ]
    },

    // --- POZIOM 10: Połowa Drogi (Większa mapa) ---
    {
        id: 10,
        map: [
            "#################",
            "#R......#......K#",
            "#######.D.#######",
            "#S......#......S#",
            "#.#####...#####.#",
            "#B.....S.S.....B#",
            "#.#####...#####.#",
            "#S......#......S#",
            "#######.E.#######",
            "#################"
        ],
        enemies: [
            { x: 2, y: 5, dir: 1, icon: "🕷️", axis: 'x' },
            { x: 14, y: 5, dir: -1, icon: "🕷️", axis: 'x' }
        ]
    },

    // --- POZIOM 11: Szachownica ---
    {
        id: 11,
        map: [
            "###########",
            "#R.S.B.S.K#",
            "#.#######.#",
            "#B.S...S.B#",
            "#.#######.#",
            "#S.......S#",
            "#####D#####",
            "#....E....#",
            "###########"
        ],
        enemies: [
            { x: 2, y: 5, dir: 1, icon: "🕷️", axis: 'x' },
            { x: 8, y: 5, dir: -1, icon: "🕷️", axis: 'x' }
        ]
    },

    // --- POZIOM 12: Pułapka ---
    {
        id: 12,
        map: [
            "#########",
            "#K.....S#",
            "#.#####.#",
            "#.#R..#.#", // Gracz w środku
            "#.#.#.#.#",
            "#.#D#D#.#",
            "#S..E..S#",
            "#########"
        ],
        enemies: [
            { x: 2, y: 1, dir: 1, icon: "🕷️", axis: 'x' }
        ]
    },

    // --- POZIOM 13: Długi Marsz ---
    {
        id: 13,
        map: [
            "###################",
            "#R...............K#",
            "#################.#",
            "#S..............#.#",
            "#.###############.#",
            "#...............#.#",
            "#.#############.#.#",
            "#E.D..........S.#S#",
            "###################"
        ],
        enemies: [
            { x: 2, y: 1, dir: 1, icon: "🕷️", axis: 'x' },
            { x: 14, y: 3, dir: -1, icon: "🕷️", axis: 'x' },
            { x: 2, y: 5, dir: 1, icon: "🕷️", axis: 'x' },
            { x: 14, y: 7, dir: -1, icon: "🕷️", axis: 'x' }
        ]
    },

    // --- POZIOM 14: Symetria ---
    {
        id: 14,
        map: [
            "#############",
            "#K.S..B..S.K#",
            "#.###.#.###.#",
            "#.....R.....#",
            "#.###.#.###.#",
            "#S....D....S#",
            "#####.E.#####",
            "#############"
        ],
        enemies: [
            { x: 1, y: 3, dir: 1, icon: "🕷️", axis: 'x'}
        ]
    },

    // --- POZIOM 15: Jaskinie (Duża mapa) ---
    {
        id: 15,
        map: [
            "################",
            "#R..#...S...#..#",
            "###.B.#####.B.##",
            "#S..#...K...#..#",
            "#.##############",
            "#.......S......#",
            "##############.#",
            "#K..#...S...#..#",
            "###.B.#####.B.##",
            "#S..#.D.E.D.#..#",
            "################"
        ],
        enemies: [
            { x: 5, y: 5, dir: 1, icon: "🕷️", axis: 'x' },
            { x: 10, y: 5, dir: -1, icon: "🕷️", axis: 'x' }
        ]
    },

    // --- POZIOM 16: Cztery Komnaty ---
    {
        id: 16,
        map: [
            "#############",
            "#K.S#R#S.B.K#",
            "#...D.D.....#",
            "#####.#######",
            "#S..#.#...S.#",
            "#...#.#.....#",
            "#####.#####.#",
            "#E..........#",
            "#############"
        ],
        enemies: [
            { x: 1, y: 2, dir: 1, icon: "🕷️", axis: 'x' },
            { x: 10, y: 5, dir: -1, icon: "🕷️", axis: 'x' },
            { x: 1, y: 7, dir: 1, icon: "🕷️", axis: 'x' }
        ]
    },

    // --- POZIOM 17: Piekielny Labirynt ---
    {
        id: 17,
        map: [
            "#################",
            "#R.B.....S.....K#",
            "#####.#########.#",
            "#K....#S.....S#.#",
            "#.#####.#####.#.#",
            "#S....#.#...#.#.#",
            "#####.#.#.#.#.#.#",
            "#E..D.D.D.#.D.D.#",
            "#################"
        ],
        enemies: [
            { x: 5, y: 1, dir: 1, icon: "🕷️", axis: 'x' },
            { x: 6, y: 3, dir: 1, icon: "🕷️", axis: 'x' }
        ]
    },

    // --- POZIOM 18: Strażnicy Mostu ---
    {
        id: 18,
        map: [
            "###########",
            "#S.......S#",
            "#.#######.#",
            "#....R....#",
            "#.#######.#",
            "#....K....#",
            "#.#######.#",
            "#D...E...D#",
            "###########"
        ],
        enemies: [
            { x: 1, y: 1, dir: 1, icon: "🕷️", axis: 'x' },
            { x: 1, y: 3, dir: 1, icon: "🕷️", axis: 'x' },
            { x: 9, y: 5, dir: -1, icon: "🕷️", axis: 'x' }
        ]
    },

    // --- POZIOM 19: Krypta ---
    {
        id: 19,
        map: [
            "###############",
            "#K.S..#E#..S.K#",
            "#####.D#D.#####",
            "#S....#.#....S#",
            "#.#####.#####.#",
            "#R.....B.....B#",
            "#.#####.#####.#",
            "#S...........S#",
            "###############"
        ],
        enemies: [
            { x: 7, y: 5, dir: 1, icon: "🕷️", axis: 'x' }, // Pająk pilnujący środka
            { x: 1, y: 7, dir: 1, icon: "🕷️", axis: 'x' }, // Dolny patrol
            { x: 13, y: 7, dir: -1, icon: "🕷️", axis: 'x' }
        ]
    },

    // --- POZIOM 20: Katedra Koszmaru (Finał) ---
    {
        id: 20,
        map: [
            "###################",
            "#K.S.S.S.R.S.S.S.K#",
            "#.................#",
            "#####.#######.#####",
            "#S...B...S...B...S#",
            "#.###############.#",
            "#.................#",
            "#####.#######.#####",
            "#K...B...S...B...K#",
            "#.................#",
            "#####D#######D#####",
            "#........E........#",
            "###################"
        ],
        enemies: [
            { x: 1, y: 2, dir: 1, icon: "🕷️", axis: 'x' },  // Górny rząd
            { x: 17, y: 2, dir: -1, icon: "🕷️", axis: 'x' },
            
            { x: 5, y: 6, dir: 1, icon: "🕷️", axis: 'x' },  // Środek
            { x: 13, y: 6, dir: -1, icon: "🕷️", axis: 'x' },

            { x: 1, y: 9, dir: 1, icon: "🕷️", axis: 'x' },  // Dół
            { x: 17, y: 9, dir: -1, icon: "🕷️", axis: 'x' }
        ]
    }
];