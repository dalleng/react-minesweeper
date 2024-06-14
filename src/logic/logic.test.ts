import { describe, expect, it } from 'vitest'
import { initializeGame } from './logic'

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
