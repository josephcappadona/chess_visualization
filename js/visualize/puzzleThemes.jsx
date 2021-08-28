
const matesInX = [
    {
        "value": "mateIn1",
        "label": "Mate in 1",
        "group": "Mates in X"
    },
    {
        "value": "mateIn2",
        "label": "Mate in 2",
        "group": "Mates in X"
    },
    {
        "value": "mateIn3",
        "label": "Mate in 3",
        "group": "Mates in X"
    },
    {
        "value": "mateIn4",
        "label": "Mate in 4",
        "group": "Mates in X"
    },
    {
        "value": "mateIn5",
        "label": "Mate in 5 or more",
        "group": "Mates in X"
    },
];

const basicTactics = [
    {
       "value": "fork",
       "label": "Fork",
       "group": "Fundamental Tactics"
    },
    {
       "value": "pin",
       "label": "Pin",
       "group": "Fundamental Tactics"
    },
    {
       "value": "capturingDefender",
       "label": "Capture the defender",
       "group": "Fundamental Tactics"
    },
    {
       "value": "attraction",
       "label": "Attraction",
       "group": "Fundamental Tactics"
    },
    {
       "value": "deflection",
       "label": "Deflection",
       "group": "Fundamental Tactics"
    },
    {
       "value": "discoveredAttack",
       "label": "Discovered attack",
       "group": "Fundamental Tactics"
    },
    {
       "value": "doubleCheck",
       "label": "Double check",
       "group": "Fundamental Tactics"
    },
    {
       "value": "skewer",
       "label": "Skewer",
       "group": "Fundamental Tactics"
    },
    {
       "value": "xRayAttack",
       "label": "X-Ray attack",
       "group": "Fundamental Tactics"
    },
    {
       "value": "hangingPiece",
       "label": "Hanging piece",
       "group": "Fundamental Tactics"
    },
    {
       "value": "trappedPiece",
       "label": "Trapped piece",
       "group": "Fundamental Tactics"
    },
    {
       "value": "zugzwang",
       "label": "Zugzwang",
       "group": "Fundamental Tactics"
    }
];

const mates = [
    {
       "value": "anastasiaMate",
       "label": "Anastasia's mate",
       "group": "Mates"
    },
    {
       "value": "arabianMate",
       "label": "Arabian mate",
       "group": "Mates"
    },
    {
       "value": "backRankMate",
       "label": "Back rank mate",
       "group": "Mates"
    },
    {
       "value": "bodenMate",
       "label": "Boden's mate",
       "group": "Mates"
    },
    {
       "value": "dovetailMate",
       "label": "Dovetail mate",
       "group": "Mates"
    },
    {
       "value": "hookMate",
       "label": "Hook mate",
       "group": "Mates"
    },
    {
       "value": "smotheredMate",
       "label": "Smothered mate",
       "group": "Mates"
    },
];

const endgames = [
    {
       "value": "pawnEndgame",
       "label": "Pawn endgame",
       "group": "Endgames"
    },
    {
       "value": "knightEndgame",
       "label": "Knight endgame",
       "group": "Endgames"
    },
    {
       "value": "bishopEndgame",
       "label": "Bishop endgame",
       "group": "Endgames"
    },
    {
       "value": "rookEndgame",
       "label": "Rook endgame",
       "group": "Endgames"
    },
    {
       "value": "queenEndgame",
       "label": "Queen endgame",
       "group": "Endgames"
    },
    {
       "value": "queenRookEndgame",
       "label": "Queen and Rook Endgame",
       "group": "Endgames"
    },

];

const stagesOfGame = [
    {
        "value": "opening",
        "label": "Opening",
        "group": "Stages of Game"
    },
    {
        "value": "middlegame",
        "label": "Middlegame",
        "group": "Stages of Game"
    },
    {
       "value": "endgame",
       "label": "Endgame",
       "group": "Stages of Game"
    },
    {
        "value": "mate",
        "label": "Checkmate",
        "group": "Stages of Game"
     },
];

const typesOfMoves = [
    {
        "value": "sacrifice",
        "label": "Sacrifice",
        "group": "Types of Moves"
    },
    {
        "value": "clearance",
        "label": "Clearance",
        "group": "Types of Moves"
    },
    {
        "value": "defensiveMove",
        "label": "Defensive move",
        "group": "Types of Moves"
    },
    {
        "value": "quietMove",
        "label": "Quiet move",
        "group": "Types of Moves"
    },
    {
        "value": "interference",
        "label": "Interference",
        "group": "Types of Moves"
    },
    {
        "value": "intermezzo",
        "label": "Intermezzo",
        "group": "Types of Moves"
    },
    {
        "value": "promotion",
        "label": "Promotion",
        "group": "Types of Moves"
    },
    {
        "value": "underPromotion",
        "label": "Underpromotion",
        "group": "Types of Moves"
    },
    {
        "value": "enPassant",
        "label": "En passant",
        "group": "Types of Moves"
    },
];

const attacks = [
    
    {
        "value": "kingsideAttack",
        "label": "Kingside attack",
        "group": "Types of Attack"
    },
    {
        "value": "queensideAttack",
        "label": "Queenside attack",
        "group": "Types of Attack"
    },
    {
       "value": "attackingF2F7",
       "label": "Attacking f2 or f7",
       "group": "Types of Attack"
    },
];

const miscellaneous = [
    {
        "value": "exposedKing",
        "label": "Exposed king",
        "group": "Miscellaenous"
    },
    {
        "value": "advancedPawn",
        "label": "Advanced pawn",
        "group": "Miscellaenous"
    },
];

const puzzleLength = [
    {
        "value": "oneMove",
        "label": "One-move puzzle",
        "group": "Puzzle Length"
    },
    {
        "value": "short",
        "label": "Short puzzle",
        "group": "Puzzle Length"
    },
    {
        "value": "long",
        "label": "Long puzzle",
        "group": "Puzzle Length"
    },
    {
        "value": "veryLong",
        "label": "Very long puzzle",
        "group": "Puzzle Length"
    },
];

export const puzzleThemes = matesInX.concat(basicTactics)
                                    .concat(mates)
                                    .concat(endgames)
                                    .concat(stagesOfGame)
                                    .concat(typesOfMoves)
                                    .concat(attacks)
                                    .concat(miscellaneous)
                                    .concat(puzzleLength);