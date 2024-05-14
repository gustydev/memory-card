import './styles/App.css';

const response = await fetch('https://maplestory.io/api/gms/28/mob?count=32');
const mobs = await response.json();

const imgUrls = [];

mobs.forEach(async (m) => {
  const mobId = m.id;
  const resp = await fetch(`https://maplestory.io/api/gms/28/mob/${mobId}/icon`);
  const img = resp.url;
  imgUrls.push(img);
})

console.log(imgUrls)

function App() {
  return (
    <>
    <h1>Memory Cards</h1>
    <p>Click the cards to raise your score, but don't click the same card twice!</p>
    </>
  )
}


export default App
