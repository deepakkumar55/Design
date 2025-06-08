const LEVELS = [
    // Level 1 - Simple introduction
    {
        grid: [
            [0, 1, 0, 1, 0],
            [1, 0, 0, 0, 1],
            [0, 0, 1, 0, 0],
            [1, 0, 0, 0, 1],
            [0, 1, 0, 1, 0]
        ],
        startPosition: {x: 2, y: 2},
        par: 8, // Par time in seconds
        difficulty: "easy"
    },
    
    // Level 2 - Slightly more complex
    {
        grid: [
            [1, 0, 1, 0, 1],
            [0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1],
            [0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1]
        ],
        startPosition: {x: 2, y: 2},
        par: 12,
        difficulty: "easy"
    },
    
    // Level 3 - More challenging pattern
    {
        grid: [
            [1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 1, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1]
        ],
        startPosition: {x: 2, y: 2},
        par: 15,
        difficulty: "medium"
    },
    
    // Level 4 - Complex pattern
    {
        grid: [
            [1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 0, 1],
            [1, 0, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1]
        ],
        startPosition: {x: 2, y: 3},
        par: 20,
        difficulty: "medium"
    },
    
    // Level 5 - Advanced challenge
    {
        grid: [
            [1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 1, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 1],
            [1, 1, 1, 0, 1, 1, 1],
            [1, 0, 1, 1, 1, 0, 1],
            [1, 0, 0, 1, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1]
        ],
        startPosition: {x: 3, y: 3},
        par: 30,
        difficulty: "hard"
    }
];
