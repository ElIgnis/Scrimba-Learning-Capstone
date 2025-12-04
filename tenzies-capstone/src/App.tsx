import './App.css'
import Die from "./components/Die.tsx";
import {useState, useEffect, useRef} from "react";
import {nanoid} from "nanoid";
import Confetti from 'react-confetti';
import {CountdownTimer} from "./components/CountdownTimer.tsx";
import {CountUpTimer} from "./components/CountUpTimer.tsx";

export default function App() {

    const diceCount = 10;
    const maxDieNum = 6;
    const [diceArr, setDiceArr] = useState(()=> GenerateAllNewDie(diceCount));
    const [gameWon, setGameWon] = useState<boolean>(false);
    const ctaButton = useRef(null);

    function GenerateAllNewDie(numDice: number) {

        return Array.from({ length: numDice }, () => ({
                id: nanoid(),
                value: Math.ceil(Math.random() * maxDieNum),
                isHeld: false
            }
        ));
    }

    const generatedDiceElements = diceArr.map(dieObj =>
        <Die
            key={dieObj.id}
            value={dieObj.value}
            isHeld={dieObj.isHeld}
            callbackFunc={()=> {Hold(dieObj.id)}}
        />);

    function RollDice(){
        if(gameWon)
        {
            setGameWon(false);
            setDiceArr(GenerateAllNewDie(diceCount));
        }
        else
        {
            setDiceArr(prevArr =>
                prevArr.map(dieObj =>
                    dieObj.isHeld ? dieObj: {...dieObj, value: Math.ceil(Math.random() * maxDieNum)}
                )
            );
        }
    }

    function Hold(diceID: string){
        setDiceArr(prevArr => {
            const updatedArr = prevArr.map(dieObj =>
                dieObj.id === diceID ? {...dieObj, isHeld: !dieObj.isHeld} : dieObj
            )

            const allHeld = (updatedArr.every(die=> die.isHeld) &&
                updatedArr.every(die=> die.value === diceArr[0].value));

            if(allHeld)
                setGameWon(true);

            return updatedArr;
        });
    }

    useEffect(()=>{
        if(ctaButton.current != null && gameWon)
        {
            ctaButton.current.focus();
        }
    }, [gameWon]);

    const midPointX = window.innerWidth / 2;
    const midPointY = window.innerHeight / 2;

    return (
        <main>
            {gameWon && <Confetti confettiSource={ {x: midPointX - 300, y: midPointY - 300, w:500, h: -500} }/>}
            <div aria-live="polite" className="sr-only">
                {gameWon && <p>Congratulations! You won!</p>}
            </div>
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {generatedDiceElements}
            </div>
            <button className="roll-dice" onClick={RollDice} ref={ctaButton}>{gameWon ? "New Game" : "Roll Dice"}</button>
        </main>
    )
}