import { useState, useEffect } from 'react';

function Card({ cardIcon, cardName, cardId, clickFun }) {
    return (
        <button className='card' id={cardId} onClick={(e) => clickFun(e)}>
            <img className='card-image' src={cardIcon} alt={cardName}></img>
            <div className="card-title">{cardName}</div>
        </button>
    )
}

export default function Game() {
    const [cards, setCards] = useState([]);
    const [mobData, setMobData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentScore, setCurrentScore] = useState(0);
    const [topScore, setTopScore] = useState(0);
    const [cardNumber, setCardNumber] = useState(3);

    function shuffleCards() {
        const newCards = cards;

        let currentIndex = newCards.length;
        
        while (currentIndex !== 0) {
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [newCards[currentIndex], newCards[randomIndex]] = [newCards[randomIndex], newCards[currentIndex]];
        }

        setCards(newCards);
    }

    function resetCardClicks() {
        const newCards = cards;

        newCards.forEach((card) => {
            card.clicked = false;
        })

        setCards(newCards);
    } 

    function handleScores(e) {
        const newCards = cards;
        const card = newCards.find(c => c.id === Number(e.target.id));
        let newScore = currentScore;
        let newTopScore = topScore;

        if (card.clicked) {
            newScore = 0;
            resetCardClicks();
            setCardNumber(3);
        } else if (!card.clicked) {
            newScore += 1;
            card.clicked = true;
            if (!newCards.find(c => !c.clicked)) {
                setCards([]);
                setCardNumber(n => n + 1);
            } else {
                setCards(newCards);
            }
        }

        setCurrentScore(newScore);

        if (newScore >= topScore) {
            newTopScore = newScore;
            setTopScore(newTopScore);
        }

        shuffleCards();
    }

    useEffect(() => {
        let ignore = false;

        async function fetchData() {
            try {
                const response = await fetch('https://maplestory.io/api/gms/28/mob');
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
                    if (response.ok) {
                        card.icon = response.url;
                    } else {
                        card.icon = 'https://maplestory.io/api/gms/250/item/3800088/icon' // Placeholder if icon cannot be fetched
                    }
                }));
            } catch (error) {
                console.error('Error fetching icons:', error);
            }
        }

        async function initializeCards() {
            if (mobData && (cards.length === 0 || cards.length !== cardNumber)) {
                let newCards = [];

                while (newCards.length < cardNumber) {
                    const randomMob = mobData[Math.floor(Math.random() * mobData.length)];
                    if (!newCards.find((c) => c.name === randomMob.name) && randomMob.name.match(/^[a-zA-Z]+$/)) {
                        newCards.push({ name: randomMob.name, id: randomMob.id, clicked: false });
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
        }
    }, [mobData, cards, cardNumber]);

    if (loading) {
        return 'Loading...';
    } else {
        return (
        <>
            <div className="game-info">
                <p>Click the cards to raise your score, but don't click the same card twice! The game gets increasingly harder as you go on.</p>
                <p className='scores'>Current score: {currentScore} | Top score: {topScore}</p>
            </div>
            <div className='card-container'>
                {cards.map((c) => { return <Card key={c.id} cardName={c.name} cardIcon={c.icon} cardId={c.id} clickFun={handleScores}></Card> })}
            </div>
        </>
        );
    }
}
