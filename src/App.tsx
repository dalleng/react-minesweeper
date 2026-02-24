import { useState } from 'react'
import './App.css'
import MinesweeperBoard, { type ClickType } from './MinesweeperBoard'
import { Action, GameState, initializeGame, updateGame } from './logic'

function App() {
  const N = 10
  const [gameState, setGameState] = useState(initializeGame(N))

  function onClickBoard(row: number, col: number, clickType: ClickType) {
    const actionType: Action['type'] = clickType === 'CLICK' ? 'OPEN_CELL' : 'PLACE_FLAG'
    const gs = updateGame(gameState, { type: actionType, position: [row, col] })
    setGameState(gs)
  }

  function renderStatus(gameState: GameState) {
    if (gameState.status === 'LOSE') {
      return 'YOU LOST 😭'
    } else if (gameState.status === 'WIN') {
      return 'YOU WON 🏆'
    }
    return gameState.status
  }

  function resetGame() {
    setGameState(initializeGame(N))
  }

  return (
    <div>
      <h1>{`Status: ${renderStatus(gameState)}`}</h1>
      {gameState.status !== 'UNSTARTED' && 
        <button onClick={resetGame}>Reset</button>
      }
      <MinesweeperBoard board={gameState.board} onClick={onClickBoard} />
      <p>
        <h2>How To Play?</h2>
        <h3>On Mobile:</h3>
        <ul>
          <li>Tap to open a cell</li>
          <li>Long Press to place a flag</li>
        </ul>
        <h3>On Desktop:</h3>
        <ul>
          <li>Click to open a cell</li>
          <li>Long Press to place a flag</li>
        </ul>
      </p>
    </div>
  )
}

export default App
