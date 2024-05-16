import { useState, useEffect } from 'react';

function Card({ cardIcon, cardName }) {
    return (
        <div className='card'>
            <img className='card-image' src={cardIcon} alt={cardName}></img>
            <div className="card-title">{cardName}</div>
        </div>
    )
}

export default function Game({ currentScore, setCurrentScore, topScore, setTopScore }) {
    const [cards, setCards] = useState([]);
    const [mobData, setMobData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;

        async function fetchData() {
            try {
                const response = await fetch('https://maplestory.io/api/gms/28/mob?count=34');
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
                    const response = await fetch(`https://maplestory.io/api/gms/28/mob/${card.id}/icon`);
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
                    if (!newCards.find((c) => c.name === mobData[random].name)) {
                        newCards.push({ name: mobData[random].name, id: mobData[random].id });
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

    if (loading) {
        return 'Loading...';
    } else {
        return cards.map((c) => { return <Card key={c.id} cardName={c.name} cardIcon={c.icon}></Card> });
    }
}
