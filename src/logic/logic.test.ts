import { describe, expect, it } from 'vitest'
import { expandCell, getRandomMinePositions, getSurroundingPositions, initializeGame, updateGame } from './logic'
import { Board, GameState, Position } from './types';

describe('initializeGame', () => {
    it('initializes game with given board size', () => {
        const N = 10;
        const { board, bombPositions, status } = initializeGame(N)
        expect(status).toBe('UNSTARTED')
        expect(bombPositions).toStrictEqual([])
        expect(board.length).toBe(N)
        expect(board.every(row => row.length === N)).toBe(true)
        expect(board.every(row => row.every(col => col == 'UNOPENED'))).toBe(true)
    })
})

describe('updateGame', () => {
    it('place mines on first OPEN_CELL action', () => {
        const N = 10;
        const state = initializeGame(N);
        const { board, status, bombPositions } = updateGame(state, { type: 'OPEN_CELL', position: [0, 0] })
        // the first cell opened should not be a mine
        expect(board[0][0]).not.toEqual('BOMB')
        // random mines should've been placed
        expect(bombPositions.length).toBeGreaterThan(0)
        // status should be updated to ongoing
        expect(status).toEqual('ONGOING')
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
        const excluded: Position[] =  [[0, 0], [2, 2], [9, 9]]
        const positions = getRandomMinePositions(board, nMines, excluded)
        // excluded positions should not be used
        excluded.forEach(ex => expect(positions.includes(ex)).toBeFalsy())
    })
})

describe('expandCell', () => {
    it('expands surrounding cells without bombs', () => {
        const board: Board = [
            ['UNOPENED', 'UNOPENED'],
            ['UNOPENED', 'UNOPENED'],
        ]
        const gameState: GameState = { board, status: 'ONGOING', bombPositions: []}
        const updatedBoard = expandCell(gameState, [0, 0])
        console.log(updatedBoard)
        expect(updatedBoard.every(row => row.every(col => col === 0))).toBeTruthy()
    })

    it('does not expand flagged cells', () => {
        const board: Board = [
            ['UNOPENED', 'UNOPENED'],
            ['UNOPENED', 'FLAG'],
        ]
        const gameState: GameState = { board, status: 'ONGOING', bombPositions: []}
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
        const gameState: GameState = { board, status: 'ONGOING', bombPositions: [[2, 1]]}
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
        const gameState: GameState = { board, status: 'ONGOING', bombPositions: []}
        const expectedPositions = JSON.stringify([[0, 1], [1, 0], [1, 1]])
        const actualPositions = getSurroundingPositions(gameState, [0, 0])
        expect(JSON.stringify(actualPositions)).toEqual(expectedPositions)
    })

    it('returns all surrounding positions', () => {
        const board: Board = [
            ['UNOPENED', 'UNOPENED', 'UNOPENED'],
            ['UNOPENED', 'UNOPENED', 'UNOPENED'],
            ['UNOPENED', 'UNOPENED', 'UNOPENED'],
        ]
        const gameState: GameState = { board, status: 'ONGOING', bombPositions: []}
        const expectedPositions = JSON.stringify([[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]])
        const actualPositions = getSurroundingPositions(gameState, [1, 1])
        expect(JSON.stringify(actualPositions)).toEqual(expectedPositions)
    })
})