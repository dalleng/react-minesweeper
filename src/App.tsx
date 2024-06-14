import './App.css'
import MinesweeperBoard, { type CellContent } from './MinesweeperBoard'

function App() {
  const board: CellContent[][] = [['FLAG', 2], ['BOMB', 0]]
  return (
    <MinesweeperBoard board={board} />
  )
}

export default App
