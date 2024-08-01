import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function Card({ cardIcon, cardName, cardId, clickFun }) {
    return (
        <button className='card' id={cardId} onClick={(e) => clickFun(e)}>
            <img className='card-image' src={cardIcon} alt={cardName}></img>
            <div className="card-title">{cardName}</div>
        </button>
    )
}

Card.propTypes = {
    cardIcon: PropTypes.string,
    cardName: PropTypes.string,
    cardId: PropTypes.number,
    clickFun: PropTypes.func
};

export default function Game() {
    const [cards, setCards] = useState([]);
    const [mobData, setMobData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentScore, setCurrentScore] = useState(0);
    const [topScore, setTopScore] = useState(0);
    const [cardNumber, setCardNumber] = useState(2);
    const [version, setVersion] = useState('252');

    async function versionSwitch() {
        const ver = prompt('Type a valid game version for the monster data (list available at https://maplestory.wiki/GMS):')
        if (!ver) {
            return;
        }

        try {
            const response = await fetch(`https://maplestory.io/api/gms/${ver}/mob?count=1`);
            if (!response.ok) {
                alert('Invalid game version')
                throw new Error('Invalid game version')
            } else {
                setVersion(ver);
                setCurrentScore(0);
                setCards([]);
                setCardNumber(2);
            }
        } catch (err) {
            console.error(err);
        }
    }

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

    function handleGame(e) {
        const newCards = cards;
        const card = newCards.find(c => c.id === Number(e.target.id));
        let newScore = currentScore;
        let newTopScore = topScore;

        if (card.clicked) {
            newScore = 0;
            if (cardNumber > 2) {
                setLoading(true)
            }
            setCards([])
            resetCardClicks();
            setCardNumber(2);
        } else if (!card.clicked) {
            newScore += 1;
            card.clicked = true;
            if (!newCards.find(c => !c.clicked)) {
                setLoading(true);
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
                const response = await fetch(`https://maplestory.io/api/gms/${version}/mob`);
                const data = await response.json();
                if (!response.ok) {
                    throw new Error('Error fetching mob data (status ', response.status, ')')
                }
                setMobData(data);
            } catch (error) {
                console.error(error);
            }
        }

        if (!ignore) {
            fetchData();
        }

        return () => {
            ignore = true;
        };
    }, [version]);

    useEffect(() => {
        let ignore = false;

        async function fetchIcon(mobId) {
            try {
                const response = await fetch(`https://maplestory.io/api/gms/${version}/mob/${mobId}/icon`);
                if (!response.ok) {
                    throw new Error(`Could not fetch icon for mob ID ${mobId} (status ${response.status})`)
                }

                const url = response.url;

                const img = new Image();
                img.src = url;

                return await img.decode().then(() => {
                    if (img.width < 5) {
                        return null;
                    }
                    return url;
                });

            } catch (error) {
                console.error(error)
            }
        }

        async function createCards(cards) {
            let newCards = cards;
            while (newCards.length < cardNumber) {
                const randomMob = mobData[Math.floor(Math.random() * mobData.length)];
                if (!newCards.find((c) => c.name === randomMob.name)) {
                    newCards.push({ name: randomMob.name, id: randomMob.id, clicked: false, icon: undefined });
                }
            }

            await Promise.all(newCards.map(async (card) => {
                if (!card.icon) {
                    const icon = await fetchIcon(card.id);
                    if (!icon) {
                        newCards = newCards.filter(c => c !== card);
                        return;
                    }
                    card.icon = icon;
                } else {
                    return;
                }
            }));

            if (newCards.length < cardNumber) {
                return createCards(newCards);
            } else {
                setLoading(false);
                return newCards;
            }
        }

        async function initializeCards() {
            if (mobData && (cards.length === 0 || cards.length !== cardNumber)) {
                const newCards = await createCards([]);
                setCards(newCards);
            }
        }
        if (!ignore) {
            initializeCards();
        }

        return () => {
            ignore = true;
        }
    }, [mobData, cards, cardNumber, version]);

    return (
    <>
        <div className="version-manage">
            <div>v{version}</div>
            <button onClick={() => versionSwitch()}>Switch version</button>
        </div>
        <div className="game-info">
            <p>Click the cards to raise your score, but don&apos;t click the same card twice! The game gets increasingly harder as you go on.</p>
            <p className='scores'>Current score: {currentScore} | Top score: {topScore}</p>
        </div>
        {loading ? 'Loading...' : (
            <div className='card-container'>
                {cards.map((c) => { return <Card key={c.id} cardName={c.name} cardIcon={c.icon} cardId={c.id} clickFun={handleGame}></Card> })}
            </div>
        )}
    </>
    )
}
