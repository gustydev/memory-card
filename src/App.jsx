import { useState } from 'react';
import './styles/App.css';
import Interface from './components/Interface';

function App() {
  return (
    <>
      <h1 className='title'>Monster Cards</h1>
      {<Interface></Interface>}
    </>
  )
}


export default App
