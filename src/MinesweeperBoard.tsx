import { useRef, useState } from 'react'
import './MinesweeperBoard.css'
import { CellContent } from './logic'

interface MinesweeperBoardProps {
    board: CellContent[][];
    onClick: (row: number, col: number, clickType: ClickType) => void;
}

export type ClickType = 'CLICK' | 'RIGHT-CLICK'

export default function MinesweeperBoard({ board, onClick }: MinesweeperBoardProps): JSX.Element {
    const LONG_PRESS_THRESHOLD = 400
    const [longPressStart, setLongPressStart] = useState<number | null>(null)
    const isTouchRef = useRef<boolean>(false)

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

    const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        isTouchRef.current = true
        const { row, col } = (e.target as HTMLElement).dataset
        console.log("onLongPressStart", row, col)
        if (row && col) {
            setLongPressStart(Date.now())
        }
        setLongPressStart(Date.now())
    }

    const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        const { row, col } = (e.target as HTMLElement).dataset
        const now = Date.now()
        if (row && col && longPressStart) {
            if (now - longPressStart >= LONG_PRESS_THRESHOLD) {
                onClick(parseInt(row), parseInt(col), 'RIGHT-CLICK')
            } else {
                onClick(parseInt(row), parseInt(col), 'CLICK')
            }
        }
        setTimeout(() => isTouchRef.current = false, 300)
    }

    const onCellClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isTouchRef.current) {
            return
        }
        const { row, col } = (e.target as HTMLElement).dataset
        if (row && col) {
            onClick(parseInt(row), parseInt(col), 'CLICK')
        }
    }

    const onRightClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isTouchRef.current) {
            return
        }
        e.preventDefault()
        const { row, col } = (e.target as HTMLElement).dataset
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
                            {row.map((value, colNum) => {
                                const cellValue = renderCellValue(value)
                                let className = "cell";
                                if (typeof(cellValue) == "number") {
                                    if (cellValue == 0) {
                                        className = "cell open"
                                    } else if (cellValue == 1) {
                                        className = "cell blue open"
                                    } else if (cellValue == 2) {
                                        className = "cell green open"
                                    } else {
                                        className = "cell red open"
                                    }
                                }
                                return (<div
                                    className={className}
                                    data-row={rowNum}
                                    data-col={colNum}
                                    key={`${rowNum},${colNum}`}
                                    onContextMenu={onRightClick}
                                    onTouchStart={onTouchStart}
                                    onTouchEnd={onTouchEnd}
                                    onClick={onCellClick}>
                                    {cellValue !== 0 ? cellValue : ""}
                                </div>)
                            }
                            )}
                        </div>
                    )
                }
            )}
        </div>
    )
}