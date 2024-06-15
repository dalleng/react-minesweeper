import { GameState, CellContent, GameStatus, Action, Position } from "./types";


const FREE_TO_MINE_RATIO = 0.2


export function initializeGame(boardSize: number): GameState {
    const gameState: GameState = { status: 'UNSTARTED' as GameStatus, bombPositions: [], board: [] }
    for (let i = 0; i < boardSize; i++) {
        const row: CellContent[] = []
        for (let j = 0; j < boardSize; j++) {
            row.push('UNOPENED')
        }
        gameState.board.push(row)
    }
    return gameState
}

export function getRandomMinePositions(board: CellContent[][], numberOfMines: number, exclude: Position[]): Position[] {
    const positions: Position[] = []
    while (numberOfMines > 0) {
        const row = Math.floor(Math.random() * board.length)
        const col = Math.floor(Math.random() * board.length)
        if (!positions.includes([row, col]) && !exclude.includes([row, col])) {
            positions.push([row, col])
            numberOfMines--
        }
    }
    return positions
}

export function updateGame(gameState: GameState, action: Action): GameState {
    const newGameState: GameState = { ...gameState }
    switch (action.type) {
        case 'OPEN_CELL': {
            if (gameState.status === 'UNSTARTED') {
                const nMines = Math.floor(gameState.board.length * FREE_TO_MINE_RATIO)
                const positions = getRandomMinePositions(gameState.board, nMines, [action.position])
                newGameState.status = 'ONGOING'
                newGameState.bombPositions = positions
            }
            // expandCell
            break
        }
        default: {
            break
        }
    }
    return newGameState
}