import { useState } from 'react';
import './styles/App.css';
import Game from './components/Game';

function App() {
  const [currentScore, setCurrentScore] = useState(0);
  const [topScore, setTopScore] = useState(0);

  return (
    <>
    <h1>Monster Cards</h1>
    <p>Click the cards to raise your score, but don't click the same card twice!</p>
    <p>Current score: {currentScore}</p>
    <p>Top score: {topScore}</p>
    {<Game currentScore={currentScore} topScore={topScore} setCurrentScore={setCurrentScore} setTopScore={setTopScore}></Game>}
    </>
  )
}


export default App
