export type CellContent = 'FLAG' | 'BOMB' | 'UNOPENED' | number
export type CellContent = 'FLAG' | 'MINE' | 'UNOPENED' | number
export type GameStatus = 'UNSTARTED' | 'ONGOING' | 'WIN' | 'LOSE'

export interface GameState {
    board: CellContent[][];
    bombPositions: number[][];
    status: GameStatus;
}