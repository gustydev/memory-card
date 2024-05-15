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
    const [cards, setCards] = useState([]);
    const [mobData, setData] = useState(null);

    useEffect(() => {
        let ignore = false;

        async function fetchData() {
            const response = await fetch('https://maplestory.io/api/gms/28/mob?count=34');
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

    useEffect(() => {
        let newCards = [];
        if (mobData) {
            while (newCards.length < 10) {
                const random = Math.floor(Math.random() * mobData.length);
                if (!newCards.find((c) => c.name === mobData[random].name)) {
                    newCards.push({name: mobData[random].name, id: mobData[random].id})
                }
            }
            setCards(newCards);
        }
    }, [mobData])

    useEffect(() => {
        let ignore = false;

        async function fetchIcon(id) {
            const response = await fetch(`https://maplestory.io/api/gms/28/mob/${id}/icon`);
            const icon = response.url;
            return icon;
        }

        const newCards = cards;

        if (newCards.length === 10) {
            newCards.forEach(async (card) => {
                const icon = await fetchIcon(card.id);
                card.icon = icon;
            })
        }
        if (!ignore) {
            setCards(newCards);
        }

        return () => {
            ignore = true;
        }
    }, [cards])

    return (
        cards ? <div>yay</div> : 'error fetching api'
    )
}