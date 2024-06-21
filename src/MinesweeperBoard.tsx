import './MinesweeperBoard.css'
import { CellContent } from './logic'

interface MinesweeperBoardProps {
    board: CellContent[][];
    onClick: (row: number, col: number, clickType: ClickType) => void;
}

export type ClickType = 'CLICK' | 'RIGHT-CLICK'

export default function MinesweeperBoard({ board, onClick }: MinesweeperBoardProps): JSX.Element {
    const renderCellValue = (value: CellContent): string | number => {
        if (value === 'FLAG') {
            return '⛳️'
        } else if (value === 'MINE') {
            return '💣'
        } else if (value === 'UNOPENED') {
            return ''
        }
        return value
    }

    const onCellClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const {row, col} = (e.target as HTMLElement).dataset
        if (row && col) {
            onClick(parseInt(row), parseInt(col), 'CLICK')
        }
    }

    const onRightClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        const {row, col} = (e.target as HTMLElement).dataset
        if (row && col) {
            onClick(parseInt(row), parseInt(col), 'RIGHT-CLICK')
        }
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
                                    key={`${rowNum},${colNum}`}
                                    onContextMenu={onRightClick}
                                    onClick={onCellClick}>
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