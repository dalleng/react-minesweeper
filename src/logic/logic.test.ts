import { describe, expect, it } from 'vitest'
import { getRandomMinePositions, initializeGame, updateGame } from './logic'
import { Position } from './types';

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