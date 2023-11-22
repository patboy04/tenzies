import React, { useState, useEffect } from "react"
import Dice from "./components/Dice.jsx"
import Stopwatch from "./components/Stopwatch.jsx"
import { useStopwatch  } from 'react-timer-hook';
import { nanoid } from "nanoid"
import Confetti from 'react-confetti'
import "./style.css"
import 'reactjs-popup/dist/index.css';

export default function App() {

    const {
        totalSeconds,
        isRunning,
        start,
        pause,
        reset,
    } = useStopwatch({autoStart: false})

    const [arrayDice, setArrayDice] = useState(generateRandomDice());
    const [scores, setScores] = useState(                       //gets scores from localstorage
        JSON.parse(localStorage.getItem("scores"))
        || []
    )
    const [time, setTime] = useState(0);
    const [tenzies, setTenzies] = useState(false);


    useEffect(() => {
        let value = arrayDice[0].number;
        // let winningCondition = true;
        // for(let i = 0; i < arrayDice.length; i++) {
        //     if(!arrayDice[i].isHeld || !arrayDice[i].number === value) {
        //         winningCondition = false
        //     }
        // }
        setTenzies(arrayDice.every(dice => dice.number === value && dice.isHeld))
    }, [arrayDice])   

    useEffect(() => { //changes time state everytime totalseconds changes
        setTime(totalSeconds)
    }, [totalSeconds])  

    useEffect(() => { //pauses the timer when tenzies state changes (you've won the game)
        pause()
        if(tenzies) {
            setScores(prevScores => ([...prevScores, totalSeconds]))
        }
    }, [tenzies])

    useEffect(() => {
        localStorage.setItem("scores", JSON.stringify(scores))    //anytime scores array changes, saves it to local storage
    }, [scores])

    function generateRandomDice() {
        let diceArray = [];
        for(let i = 0; i < 10; i++) {
            diceArray.push({
                id: nanoid(),
                number: Math.floor(Math.random()*7),
                isHeld: false
            });
        }
        return diceArray
    } 

    function rollDice() {
        if(!tenzies) {
            setArrayDice(prevDice => {
                return prevDice.map(dice => {
                    return dice.isHeld ? dice : {...dice, number: Math.floor(Math.random()*7)}
                })
            })
        } else {
            setTime(0)    //does this once you've won the game and starts a new game
            setTenzies(false)
            setArrayDice(generateRandomDice())
        }
        
    }

    function holdDice(id) {
        if(!tenzies) { //checks if the game is not complete, else this function won't work
            setArrayDice(prevDice => {
                return prevDice.map(dice => {
                    return id === dice.id ? {...dice, isHeld: !dice.isHeld} : dice
                })
            })
        }
        if(!isRunning) { //runs the stopwatch if it isn't running
            reset()
            start()
        }
    }

    const diceElements = arrayDice.map((dice) => (
        <Dice 
            key={dice.id} 
            id={dice.id}
            number={dice.number} 
            isHeld={dice.isHeld}
            handleClick={holdDice}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1>WELCOME TO THE GAME!</h1>
            <h3>Roll until all dice are the same. 
                Click each die to freeze it at its current value between rolls.</h3>
            <div className="dice--container">
                {diceElements}
            </div>
            {!tenzies 
                ? <Stopwatch totalSeconds={time} finished={true} scores={scores}/> 
                : <Stopwatch totalSeconds={time} finished={false} scores={scores}/>}
            <button 
                className="dice--rollButton" 
                onClick={rollDice}
            >
                {tenzies 
                ? ("NEW GAME") 
                : "ROLL"}
            </button>
        </main>
    )
}