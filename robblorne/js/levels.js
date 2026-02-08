const Levels = [
    // --- LEVEL 1: Awakening (Tutorial) ---
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

    // --- LEVEL 2: Double Threat ---
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

    // --- LEVEL 3: Corridor of Darkness ---
    {
        id: 3,
        map: [
            "###############",
            "#R.....S.....K#", // Top: Start -> Blood -> Key (Safe)
            "#######.#######", // Separating wall
            "#.....S.......#", // Middle: Spider patrol (Wide)
            "#######.#######", // Separating wall
            "#S....D......E#", // Bottom: Blood -> Door (Block) -> Exit
            "###############"
        ],
        enemies: [
            // One spider walking left-right in the middle corridor.
            // You have time to run from top to bottom when it is far away.
            { x: 1, y: 3, dir: 1, icon: "🕷️", axis: 'x' }
        ]
    },

    // --- LEVEL 4: Blood Warehouse (Box Puzzle) ---
    {
        id: 4,
        map: [
            "###########",
            "#R.......S#",
            "###.#####.#",
            "#S..B.....#", // This box blocks access to the lower part
            "###.###.###",
            "#K..B...S.#", // You must push this box to get to K
            "#######.###",
            "#S....D..E#",
            "###########"
        ],
        enemies: [
            { x: 7, y: 4, dir: 1, icon: "🕷️", axis: 'y' }
        ] // Focusing on logic
    },

    // --- LEVEL 5: Zigzag of Death ---
    {
        id: 5,
        map: [
            "#############",
            "#R..........#",
            "#######.#####",
            "#S...E#.....#", // Spider 1 here (left side)
            "#.##.##.###.##",
            "#..S.......K#", // Spider 2 here (middle)
            "#.#########.##",
            "#S....D..S..#", // Bottom: Doors and Exit
            "#############"
        ],
        enemies: [
            // Spiders now have limited routes, they don't block the whole map
            { x: 1, y: 3, dir: 1, icon: "🕷️", axis: 'x' },
            { x: 4, y: 5, dir: 1, icon: "🕷️", axis: 'x' },
            { x: 7, y: 3, dir: 1, icon: "🕷️", axis: 'y' }
        ]
    },

    // --- LEVEL 6: Enclosed Garden ---
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
            { x: 1, y: 3, dir: 1, icon: "🕷️", axis: 'x' }, // Spider passes through the middle (through R)
            { x: 9, y: 3, dir: -1, icon: "🕷️", axis: 'x' }
        ]
    },

    // --- LEVEL 7: Labyrinth of Boxes ---
    {
        id: 7,
        map: [
            "#############",
            "#R..B..S..B.#",
            "#...#..#..#.#",
            "#B..B..K..B.#", // Many boxes to move
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

    // --- LEVEL 8: Arena ---
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
            "#K...........E#", // No doors, but need to collect blood while escaping
            "###############"
        ],
        enemies: [
            { x: 1, y: 2, dir: 1, icon: "🕷️", axis: 'x' },
            { x: 13, y: 3, dir: -1, icon: "🕷️", axis: 'x' },
            { x: 1, y: 5, dir: 1, icon: "🕷️", axis: 'x' },
            { x: 13, y: 6, dir: -1, icon: "🕷️", axis: 'x' }
        ]
    },

    // --- LEVEL 9: Bottleneck ---
    {
        id: 9,
        map: [
            "#############",
            "#R.S#S.S#S.K#",
            "###.#.#.#.###",
            "#...........#", // Very dangerous corridor
            "###.#.#.#.###",
            "#S.S#S#S#S.E#",
            "#############"
        ],
        enemies: [
            { x: 1, y: 3, dir: 1, icon: "🕷️", axis: 'x' },
            { x: 6, y: 3, dir: 1, icon: "🕷️", axis: 'x' }, // Two spiders in one row
            { x: 11, y: 3, dir: -1, icon: "🕷️", axis: 'x' }
        ]
    },

    // --- LEVEL 10: Halfway (Larger map) ---
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

    // --- LEVEL 11: Chessboard ---
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

    // --- LEVEL 12: Trap ---
    {
        id: 12,
        map: [
            "#########",
            "#K.....S#",
            "#.#####.#",
            "#.#R..#.#", // Player in the middle
            "#.#.#.#.#",
            "#.#D#D#.#",
            "#S..E..S#",
            "#########"
        ],
        enemies: [
            { x: 2, y: 1, dir: 1, icon: "🕷️", axis: 'x' }
        ]
    },

    // --- LEVEL 13: The Long March ---
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

    // --- LEVEL 14: Symmetry ---
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

    // --- LEVEL 15: Caves (Large map) ---
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

    // --- LEVEL 16: Four Chambers ---
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

    // --- LEVEL 17: Hellish Labyrinth ---
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

    // --- LEVEL 18: Bridge Guardians ---
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

    // --- LEVEL 19: The Crypt ---
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
            { x: 7, y: 5, dir: 1, icon: "🕷️", axis: 'x' }, // Spider guarding the middle
            { x: 1, y: 7, dir: 1, icon: "🕷️", axis: 'x' }, // Lower patrol
            { x: 13, y: 7, dir: -1, icon: "🕷️", axis: 'x' }
        ]
    },

    // --- LEVEL 20: Nightmare Cathedral (Finale) ---
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
            { x: 1, y: 2, dir: 1, icon: "🕷️", axis: 'x' },  // Top row
            { x: 17, y: 2, dir: -1, icon: "🕷️", axis: 'x' },
            
            { x: 5, y: 6, dir: 1, icon: "🕷️", axis: 'x' },  // Middle
            { x: 13, y: 6, dir: -1, icon: "🕷️", axis: 'x' },

            { x: 1, y: 9, dir: 1, icon: "🕷️", axis: 'x' },  // Bottom
            { x: 17, y: 9, dir: -1, icon: "🕷️", axis: 'x' }
        ]
    }
];