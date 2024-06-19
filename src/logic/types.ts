export type CellContent = 'FLAG' | 'MINE' | 'UNOPENED' | number
export type GameStatus = 'UNSTARTED' | 'ONGOING' | 'WIN' | 'LOSE'

export type Position = [number, number]
export type Board = CellContent[][]

export interface GameState {
    board: Board;
    bombPositions: number[][];
    status: GameStatus;
}

export interface Action {
    type: 'PLACE_FLAG' | 'OPEN_CELL';
    position: Position;
}