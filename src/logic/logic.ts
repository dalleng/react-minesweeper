import { GameState, CellContent, GameStatus, Action, Position, Board } from "./types";


const FREE_TO_MINE_RATIO = 0.2


export function initializeGame(boardSize: number): GameState {
    const gameState: GameState = { status: 'UNSTARTED' as GameStatus, minePositions: [], board: [] }
    for (let i = 0; i < boardSize; i++) {
        const row: CellContent[] = []
        for (let j = 0; j < boardSize; j++) {
            row.push('UNOPENED')
        }
        gameState.board.push(row)
    }
    return gameState
}

export function getRandomMinePositions(board: Board, numberOfMines: number, exclude: Position[]): Position[] {
    const positions: Position[] = []
    const seen = new Set()
    const excludeSet = new Set(exclude.map(pos => pos.toString()))

    while (numberOfMines > 0) {
        const row = Math.floor(Math.random() * board.length)
        const col = Math.floor(Math.random() * board.length)
        if (!seen.has([row, col].toString()) && !excludeSet.has([row, col].toString())) {
            positions.push([row, col])
            seen.add([row, col].toString())
            numberOfMines--
        }
    }
    return positions
}

export function getSurroundingPositions(gameState: GameState, start: Position): Position[] {
    const positions: Position[] = []
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const row = start[0] + i
            const col = start[1] + j
            if (row >= 0 && row < gameState.board.length && col >= 0 && col < gameState.board[0].length) {
                if (row != start[0] || col != start[1]) {
                    positions.push([row, col])
                }
            }
        }
    }
    return positions
}

export function expandCell(gameState: GameState, start: Position): Board  {
    const frontier = [start]
    const seen = new Set()
    const newBoard = gameState.board.map(row => [...row])
    const minePositionsSet = new Set(gameState.minePositions.map(([row, col]) => `${row},${col}`))

    while (frontier.length > 0) {
        const current = frontier.pop() as Position
        seen.add(`${current[0]},${current[1]}`)

        // check if there are surrounding mines
        const surroundingMines = getSurroundingPositions(gameState, current).filter(
            ([row, col]) => minePositionsSet.has(`${row},${col}`)
        ).length
        newBoard[current[0]][current[1]] = surroundingMines

        if (surroundingMines == 0) {
            for (const [nextRow, nextCol] of getSurroundingPositions(gameState, current)) {
                if (!seen.has(`${nextRow},${nextCol}`) && gameState.board[nextRow][nextCol] === 'UNOPENED') {
                    frontier.push([nextRow, nextCol])
                }
            }
        }
    }

    return newBoard
}

export function isGameWon(gameState: GameState): boolean {
    const unopenedPositions = gameState.board.flat().filter(cell => cell === 'UNOPENED').length
    const allMinesFlagged = gameState.minePositions.every(([row, col]) => gameState.board[row][col] === 'FLAG')
    return allMinesFlagged && unopenedPositions == 0
}

export function updateGame(gameState: GameState, action: Action): GameState {
    const newGameState: GameState = { ...gameState }
    newGameState.board = gameState.board.map(row => [...row])
    switch (action.type) {
        case 'OPEN_CELL': {
            // Don't do anything if game is already lost or won
            if (['WIN', 'LOSE'].includes(gameState.status)) {
                break
            }

            // Set the status to lose if a mine cell is opened
            if (gameState.minePositions.filter(([row, col]) => row == action.position[0] && col == action.position[1]).length) {
                newGameState.status = 'LOSE'
                // reveal all mines
                gameState.minePositions.forEach(([row, col]) => {
                    newGameState.board[row][col] = 'MINE'
                })
                break
            }

            // Place initial mines if game is 'UNSTARTED'
            if (gameState.status === 'UNSTARTED') {
                const nMines = Math.floor(gameState.board.length ** 2 * FREE_TO_MINE_RATIO)
                const positions = getRandomMinePositions(gameState.board, nMines, [action.position])
                newGameState.status = 'ONGOING'
                newGameState.minePositions = positions
            }

            newGameState.board = expandCell(newGameState, action.position)
            break
        }
        case 'PLACE_FLAG': {
            if (['UNSTARTED', 'WIN', 'LOSE'].includes(gameState.status)) {
                break
            }
            const [row, col] = action.position
            if (newGameState.board[row][col] === 'FLAG') {
                newGameState.board[row][col] = 'UNOPENED'
            } else {
                newGameState.board[row][col] = 'FLAG'
            }
            break
        }
        default: {
            break
        }
    }

    if (isGameWon(newGameState)) {
        newGameState.status = 'WIN'
    }


    return newGameState
}