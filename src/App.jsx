import { useState } from 'react';
import './styles/App.css';
import Interface from './components/Interface';

function App() {
  const [currentScore, setCurrentScore] = useState(0);
  const [topScore, setTopScore] = useState(0);

  return (
    <>
    <h1 className='title'>Monster Cards</h1>
    {<Interface currentScore={currentScore} topScore={topScore} setCurrentScore={setCurrentScore} setTopScore={setTopScore}></Interface>}
    </>
  )
}


export default App
