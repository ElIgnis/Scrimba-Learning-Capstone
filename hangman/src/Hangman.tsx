import './Hangman.css'
import { languages } from './languages'
import { getFarewellText } from './utils'
import { words } from './words'
import { useState, useEffect } from "react";
import clsx from 'clsx';
import Confetti from 'react-confetti';

export default function Hangman() {

    const [currentWord, setCurrentWord] = useState(() => getRandomWord());
    const [guessedLetters, setGuessedLetters] = useState([]);

    const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length;
    const isGameWon = currentWord.split('').every(letter => guessedLetters.includes(letter));
    const isGameLost = wrongGuessCount >= languages.length - 1;
    const isGameOver = isGameWon || isGameLost;
    const lastGuessedLetter = guessedLetters.at(guessedLetters.length - 1);
    const numGuessesLeft = (languages.length - 1) - wrongGuessCount;
    const lastGuessIsIncorrect = lastGuessedLetter && !currentWord.includes(guessedLetters.at(guessedLetters.length - 1));

    const languagesElements = languages.map((lang, index) => {
        const langStyle = {
            backgroundColor: lang.backgroundColor,
            color: lang.color
        }

        const isLanguageLost = index < wrongGuessCount;

        return (
            <span
                key={lang.name}
                className={clsx("language-chips", isLanguageLost && "lost")}
                style={langStyle}>
                {lang.name}
            </span>
        );
    });

    const wordLetters = currentWord.split('').map((letter, index) => {
        const shouldRevealLetter = isGameLost || guessedLetters.includes(letter);
        const revealType = clsx({incorrect: isGameLost && !guessedLetters.includes(letter) && "incorrect"});
        return(
        <span
            className={revealType} 
            key={index}>
            {shouldRevealLetter ? letter.toUpperCase() : ' '}
        </span>);
        });

    const alphabets = "abcdefghijklmnopqrstuvwxyz"
    const alphabetKeyboard = alphabets.split('').map((letter, index) => {
        const isGuessed = guessedLetters.includes(letter);
        const isCorrect = isGuessed && currentWord.includes(letter);
        const isIncorrect = isGuessed && !currentWord.includes(letter);
        const resultClassName = clsx({ correct: isCorrect, incorrect: isIncorrect });

        return (<button
            key={index}
            className={resultClassName}
            disabled={isGameOver}
            onClick={() => handleGuessLetter(letter)}
            aria-disabled={guessedLetters.includes(letter)}
            aria-label={`Letter ${letter}`}>
            {letter.toUpperCase()}
        </button>)
    });

    function handleGuessLetter(letter) {
        setGuessedLetters(prevGuessedLetters => prevGuessedLetters.includes(letter) ? prevGuessedLetters : [...prevGuessedLetters, letter]);
    }

    const gameStatusClassName = clsx("game-status", {
        farewell: lastGuessIsIncorrect && !isGameOver,
        won: isGameWon,
        lost: isGameLost
    });

    function handleGameStatusBanner() {

        if (!isGameOver && lastGuessIsIncorrect) {
            return (<p>{getFarewellText(languages[wrongGuessCount - 1].name)}</p>);
        }

        if (isGameWon) {
            return (
                <>
                    <h2>You Win!</h2>
                    <p>Well Done!</p>
                </>
            );
        }
        else if (isGameLost) {
            return (
                <>
                    <h2>You Lost!</h2>
                    <p>The word was {currentWord.toUpperCase()}</p>
                </>
            );
        }

        return null;
    }

    console.log("rerender");

    function getRandomWord() {
        const randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex];
    }

    function resetGame() {
        setCurrentWord(getRandomWord());
        setGuessedLetters([]);
    }

    return (
        <main className="main-container">
            {isGameWon && <Confetti confettiSource={ {x: window.innerWidth / 2 - 300, y: window.innerHeight / 2 - 300, w:500, h: -500} }/>}
            <header>
                <h1>Assembly Endgame</h1>
                <p>Guess the word within {languages.length - 1} attempts to keep the programming world safe from Assembly</p>
            </header>

            <section
                aria-live="polite"
                role="status"
                className={gameStatusClassName}>
                {handleGameStatusBanner()}
            </section>

            <section className="languages-chips-container">
                {languagesElements}
            </section>

            <section className="current-word-container">
                {wordLetters}
            </section>

            {/* Combined visually-hidden aria-live region for status updates */}
            <section
                className="sr-only"
                aria-live="polite"
                role="status"
            >
                <p>
                    {
                        currentWord.includes(lastGuessedLetter) ? `Correct! The letter ${lastGuessedLetter} is in the word.` :
                            `Sorry! The letter ${lastGuessedLetter} is not in the word.`
                    }
                    You have {numGuessesLeft} attempts left.
                </p>
                <p>Current word: {currentWord.split("").map(letter =>
                    guessedLetters.includes(letter) ? letter + "." : "blank.").join(" ")}</p>
            </section>

            <section className="alphabet-keyboard-container">
                {alphabetKeyboard}
            </section>

            {isGameOver && <button className="new-game" onClick={()=> resetGame()}>New Game</button>}
        </main>
    )
}