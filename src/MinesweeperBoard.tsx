export type CellContent = 'FLAG' | 'BOMB' | number

interface MinesweeperBoardProps {
    board: CellContent[][]
}

export default function MinesweeperBoard({ board }: MinesweeperBoardProps): JSX.Element {
    return (
        <div id="board">
            {board.map(
                (row: CellContent[], rowNum: number) => {
                    return (
                        <div id="row">
                            {row.map((value, colNum) =>
                                <span data-row={rowNum} data-col={colNum} key={`${rowNum}${colNum}`}>{value}</span>
                            )}
                        </div>
                    )
                }
            )}
        </div>
    )
}