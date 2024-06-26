import { describe, expect, it } from 'vitest'
import { expandCell, getRandomMinePositions, getSurroundingPositions, initializeGame, updateGame } from './logic'
import { Board, GameState, GameStatus, Position } from './types';

describe('initializeGame', () => {
    it('initializes game with given board size', () => {
        const N = 10;
        const { board, minePositions: bombPositions, status } = initializeGame(N)
        expect(status).toBe('UNSTARTED')
        expect(bombPositions).toStrictEqual([])
        expect(board.length).toBe(N)
        expect(board.every(row => row.length === N)).toBe(true)
        expect(board.every(row => row.every(col => col == 'UNOPENED'))).toBe(true)
    })
})

describe('updateGame', () => {
    describe('OPEN_CELL action', () => {
        it.each([['WIN'], ['LOSE']])('does not do anything if game is in state WIN OR LOSE', (invalidStatus) => {
            const N = 10;
            const state = initializeGame(N);
            state.status = invalidStatus as GameStatus
            const { status, minePositions, board } = updateGame(state, { type: 'OPEN_CELL', position: [0, 0] })
            expect(status).toEqual(invalidStatus)
            expect(minePositions.length).toEqual(0)
            expect(board.every(row => row.every(cell => cell === 'UNOPENED')))
        })

        it('place mines on first action', () => {
            const N = 10;
            const state = initializeGame(N);
            const { status, minePositions } = updateGame(state, { type: 'OPEN_CELL', position: [0, 0] })
            // the first cell opened should not be a mine
            expect(minePositions.filter(([row, col]) => row == 0 && col == 0).length).toBe(0)
            // random mines should've been placed
            expect(minePositions.length).toBeGreaterThan(0)
            // status should be updated to ongoing
            expect(status).toEqual('ONGOING')
        })

        it('game is lost if a position with a mine is opened', () => {
            const N = 10;
            let state = initializeGame(N);
            state = updateGame(state, { type: 'OPEN_CELL', position: [0, 0] })
            state = updateGame(state, { type: 'OPEN_CELL', position: state.minePositions[0] as Position })
            expect(state.status).toEqual('LOSE')
            const [row, col] = state.minePositions[0]
            expect(state.board[row][col]).toEqual('MINE')
        })

        it('game is won if all cells are opened and all mines flagged', () => {
            const board: Board = [
                [0, 0],
                [1, 1],
                ['UNOPENED', 'UNOPENED'],
            ]
            let gameState: GameState = { board, status: 'ONGOING', minePositions: [[2, 1]]}
            gameState = updateGame(gameState, { type: 'OPEN_CELL', position: [2, 0] })
            gameState = updateGame(gameState, { type: 'PLACE_FLAG', position: [2, 1] })
            expect(gameState.status).toEqual('WIN')
            expect(gameState.board).toEqual([
                [0, 0],
                [1, 1],
                [1, 'FLAG']
            ])
        })

        it('game is not won if all cells are opened but not all mines flagged', () => {
            const board: Board = [
                [0, 0],
                [1, 1],
                [1, 'UNOPENED'],
            ]
            let gameState: GameState = { board, status: 'ONGOING', minePositions: [[2, 1]]}
            gameState = updateGame(gameState, { type: 'OPEN_CELL', position: [2, 0] })
            expect(gameState.status).toEqual('ONGOING')
            expect(gameState.board).toEqual([
                [0, 0],
                [1, 1],
                [1, 'UNOPENED']
            ])
        })

        it('game is not won if not all cells are opened and all mines flagged', () => {
            const board: Board = [
                [0, 0],
                [1, 1],
                ['UNOPENED', 'UNOPENED'],
            ]
            let gameState: GameState = { board, status: 'ONGOING', minePositions: [[2, 1]]}
            gameState = updateGame(gameState, { type: 'PLACE_FLAG', position: [2, 1] })
            expect(gameState.status).toEqual('ONGOING')
            expect(gameState.board).toEqual([
                [0, 0],
                [1, 1],
                ['UNOPENED', 'FLAG']
            ])
        })
    })
    describe('PLACE_FLAG action', () => {
        it('places flag if cell is UNOPENED', () => {
            const N = 10;
            let state = initializeGame(N);
            state.status = 'ONGOING'
            expect(state.board[1][1]).toEqual('UNOPENED')
            state = updateGame(state, { type: 'PLACE_FLAG', position: [1, 1] })
            expect(state.board[1][1]).toEqual('FLAG')
        })

        it('removes flag if cell has FLAG', () => {
            const N = 10;
            let state = initializeGame(N);
            state.status = 'ONGOING'
            state.board[1][1] = 'FLAG'
            state = updateGame(state, { type: 'PLACE_FLAG', position: [1, 1] })
            expect(state.board[1][1]).toEqual('UNOPENED')
        })

        it.each([['UNSTARTED'], ['WIN'], ['LOSE']])('does not do anything if game is in state UNSTARTED, WIN OR LOSE', (status) => {
            const N = 10;
            let state = initializeGame(N);
            state.status = status as GameStatus
            expect(state.board[1][1]).toEqual('UNOPENED')
            state = updateGame(state, { type: 'PLACE_FLAG', position: [1, 1] })
            // board doesn't change as game is unstarted, win or lose
            expect(state.board[1][1]).toEqual('UNOPENED')
        })
    })
})

describe('getRandomMinePositions', () => {
    it('returns N positions', () => {
        const N = 10;
        const { board } = initializeGame(N);
        const nMines = 30
        const positions = getRandomMinePositions(board, nMines, [])
        expect(positions.length).toEqual(30)
        // all positions are within the bounds of the board
        expect(positions.every(([row, col]) => row < N && col < N)).toBeTruthy()
    })

    it('avoids excluded positions', () => {
        const N = 10;
        const { board } = initializeGame(N);
        const nMines = 30
        const excluded: Position[] = [[0, 0], [2, 2], [9, 9]]
        const positions = getRandomMinePositions(board, nMines, excluded)
        const positionsSet = new Set(positions.map(pos => pos.toString()))
        // excluded positions should not be used
        expect(excluded.every(pos => !positionsSet.has(pos.toString())))
    })
})

describe('expandCell', () => {
    it('expands surrounding cells without bombs', () => {
        const board: Board = [
            ['UNOPENED', 'UNOPENED'],
            ['UNOPENED', 'UNOPENED'],
        ]
        const gameState: GameState = { board, status: 'ONGOING', minePositions: []}
        const updatedBoard = expandCell(gameState, [0, 0])
        expect(updatedBoard.every(row => row.every(col => col === 0))).toBeTruthy()
    })

    it('does not expand flagged cells', () => {
        const board: Board = [
            ['UNOPENED', 'UNOPENED'],
            ['UNOPENED', 'FLAG'],
        ]
        const gameState: GameState = { board, status: 'ONGOING', minePositions: []}
        const updatedBoard = expandCell(gameState, [0, 0])
        expect(updatedBoard[1][1]).toEqual('FLAG')
        expect(updatedBoard.flat().filter(e => e != 'FLAG').length).toEqual(3)
    })

    it('stops expanding when a mine is found and updates cells with number of surrounding mines', () => {
        const board: Board = [
            ['UNOPENED', 'UNOPENED'],
            ['UNOPENED', 'UNOPENED'],
            ['UNOPENED', 'UNOPENED'],
        ]
        const gameState: GameState = { board, status: 'ONGOING', minePositions: [[2, 1]]}
        const updatedBoard = expandCell(gameState, [0, 0])
        // Updates cells with the numbers of surrounding bombs
        expect(updatedBoard).toEqual([
            [0, 0],
            [1, 1],
            ['UNOPENED', 'UNOPENED'],
        ])
    })
})

describe('getSurroundingPositions', () => {
    it('does not include out of bound positions', () => {
        const board: Board = [
            ['UNOPENED', 'UNOPENED'],
            ['UNOPENED', 'UNOPENED'],
        ]
        const gameState: GameState = { board, status: 'ONGOING', minePositions: []}
        const actualPositions = getSurroundingPositions(gameState, [0, 0])
        expect(actualPositions).toEqual([[0, 1], [1, 0], [1, 1]])
    })

    it('returns all surrounding positions', () => {
        const board: Board = [
            ['UNOPENED', 'UNOPENED', 'UNOPENED'],
            ['UNOPENED', 'UNOPENED', 'UNOPENED'],
            ['UNOPENED', 'UNOPENED', 'UNOPENED'],
        ]
        const gameState: GameState = { board, status: 'ONGOING', minePositions: []}
        const actualPositions = getSurroundingPositions(gameState, [1, 1])
        expect(actualPositions).toEqual([[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]])
    })
})