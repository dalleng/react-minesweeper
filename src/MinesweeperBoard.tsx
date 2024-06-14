import './MinesweeperBoard.css'
import { CellContent } from './logic'

interface MinesweeperBoardProps {
    board: CellContent[][]
}

export default function MinesweeperBoard({ board }: MinesweeperBoardProps): JSX.Element {
    const renderCellValue = (value: CellContent): string | number => {
        if (value === 'FLAG') {
            return '⛳️'
        } else if (value === 'BOMB') {
            return '💣'
        } else if (value === 'UNOPENED') {
            return ''
        }
        return value
    }

    return (
        <div id="board">
            {board.map(
                (row: CellContent[], rowNum: number) => {
                    return (
                        <div key={`${rowNum}`}>
                            {row.map((value, colNum) =>
                                <div
                                    className="cell"
                                    data-row={rowNum}
                                    data-col={colNum}
                                    key={`${rowNum}${colNum}`}>
                                    {renderCellValue(value)}
                                </div>
                            )}
                        </div>
                    )
                }
            )}
        </div>
    )
}