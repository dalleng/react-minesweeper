import './App.css'
import MinesweeperBoard from './MinesweeperBoard'
import { CellContent } from './logic'

function App() {
  const board: CellContent[][] = [['FLAG', 2], ['MINE', 0]]
  return (
    <MinesweeperBoard board={board} />
  )
}

export default App
