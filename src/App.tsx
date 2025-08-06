import React, { useState, useEffect } from "react";
import type { CardType } from "./types/Card";
import { generateShuffledCards } from "./utils/generateCards";
import "./App.css";

const App: React.FC = () => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [firstCard, setFirstCard] = useState<CardType | null>(null);
  const [secondCard, setSecondCard] = useState<CardType | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const matchSound = new Audio("/sounds/match.mp3");
  const winSound = new Audio("/sounds/win.mp3");

  useEffect(() => {
    setCards(generateShuffledCards());
  }, []);

  useEffect(() => {
    if (firstCard && secondCard) {
      setDisabled(true);
      if (firstCard.image === secondCard.image) {
        matchSound.play();
        setCards(prev =>
          prev.map(card =>
            card.image === firstCard.image
              ? { ...card, matched: true }
              : card
          )
        );
        resetTurn();
      } else {
        setTimeout(() => {
          setCards(prev =>
            prev.map(card =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, flipped: false }
                : card
            )
          );
          resetTurn();
        }, 1000);
      }
    }
  }, [secondCard]);

  const handleClick = (card: CardType) => {
    if (disabled || card.flipped || card.matched) return;

    const flippedCard = { ...card, flipped: true };
    setCards(prev =>
      prev.map(c => (c.id === card.id ? flippedCard : c))
    );

    if (!firstCard) {
      setFirstCard(flippedCard);
    } else {
      setSecondCard(flippedCard);
    }
  };

  const resetTurn = () => {
    setFirstCard(null);
    setSecondCard(null);
    setDisabled(false);
  };

  const handleRestart = () => {
    setCards(generateShuffledCards());
    resetTurn();
  };

  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.matched)) {
      setTimeout(() => {
         winSound.play();
        setGameWon(true);
      }, 500);
    }
  }, [cards]);


  return (
  <div className="container">
    <h1>JUEGO DE MEMORIA</h1>
    <button onClick={handleRestart}>Reiniciar</button>

    <div className="game-board">
      {cards.map(card => (
        <div
          key={card.id}
          className={`card ${card.flipped || card.matched ? "flipped" : ""}`}
          onClick={() => handleClick(card)}
        >
          <div className="card-inner">
            <div className="card-front">
              <img
                src={card.image}
                alt="carta"
              />
            </div>
            <div className="card-back">❓</div>
          </div>
        </div>
      ))}
    </div>

    {gameWon && (
      <div className="victory-message">
        <h2>🎉 ¡Ganaste! 🎉</h2>
        <button onClick={handleRestart}>Jugar otra vez</button>
      </div>
    )}
  </div>
);

};

export default App;
