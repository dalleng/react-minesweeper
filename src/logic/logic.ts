import { GameState, CellContent, GameStatus } from "./types";

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