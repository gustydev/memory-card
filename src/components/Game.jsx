import { useState, useEffect } from 'react';

function Card({ cardUrl, cardTitle }) {
    return (
        <div className='card'>
            <img className='card-image' src={cardUrl} alt={cardTitle}></img>
            <div className="card-title">{cardTitle}</div>
        </div>
    )
}

export default function Game( {currentScore, setCurrentScore, topScore, setTopScore} ) {
    const [cardList, setCards] = useState([]);
    const [mobData, setData] = useState(null);

    useEffect(() => {
        let ignore = false;

        async function fetchData() {
            const response = await fetch('https://maplestory.io/api/gms/28/mob?count=22');
            const data = await response.json();
            if (!ignore) {
                setData(data);
            }
        }
        fetchData();

        return () => {
            ignore = true;
        }
    }, [])

    console.log(mobData);

    return (
        <div>lul</div>
    )
}