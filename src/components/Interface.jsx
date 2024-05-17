import { useState, useEffect } from 'react';

function Card({ cardIcon, cardName, onClick }) {
    return (
        <button className='card'>
            <img className='card-image' src={cardIcon} alt={cardName}></img>
            <div className="card-title">{cardName}</div>
        </button>
    )
}

export default function Interface({ currentScore, setCurrentScore, topScore, setTopScore }) {
    const [cards, setCards] = useState([]);
    const [mobData, setMobData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;

        async function fetchData() {
            try {
                const response = await fetch('https://maplestory.io/api/gms/30/mob');
                const data = await response.json();
                setMobData(data);
            } catch (error) {
                console.error('Error fetching mob data:', error);
            }
        }

        if (!ignore) {
            fetchData();
        }

        return () => {
            ignore = true;
        };
    }, []);

    useEffect(() => {
        let ignore = false;

        async function fetchIcons(cards) {
            try {
                await Promise.all(cards.map(async (card) => {
                    const response = await fetch(`https://maplestory.io/api/gms/30/mob/${card.id}/icon`);
                    const icon = response.url;
                    card.icon = icon;
                }));
            } catch (error) {
                console.error('Error fetching icons:', error);
            }
        }

        async function initializeCards() {
            if (mobData && cards.length === 0) {
                let newCards = [];

                while (newCards.length < 10) {
                    const random = Math.floor(Math.random() * mobData.length);
                    if (!newCards.find((c) => c.name === mobData[random].name) && mobData[random].name.match(/^[a-zA-Z]+$/)) {
                        newCards.push({ name: mobData[random].name, id: mobData[random].id, clicked: false });
                    }
                }

                await fetchIcons(newCards);
                setCards(newCards);
                setLoading(false);
            }
        }

        if (!ignore) {
            initializeCards();
        }

        return () => {
            ignore = true;
        };
    }, [mobData, cards]);

    console.log(cards)

    if (loading) {
        return 'Loading...';
    } else {
        return (
        <>
            <div className="game-info">
                <p>Click the cards to raise your score, but don't click the same card twice!</p>
                <p>Current score: {currentScore}</p>
                <p>Top score: {topScore}</p>
            </div>
            <div className='card-container'>
                {cards.map((c) => { return <Card key={c.id} cardName={c.name} cardIcon={c.icon}></Card> })}
            </div>
        </>
        );
    }
}
