import {useEffect, useRef, useState} from "react";

export function CountUpTimer() {

    const TimerState = {
        Running: 0,
        Paused: 1,
    } as const;

    const [currentState, setCurrentState] = useState<number>(TimerState.Paused);
    const [elapsedTimeInSeconds, setElapsedTimeInSeconds] = useState<number>(0);
    const intervalIDRef = useRef<number | null>(null);

    function CountStep(interval: number)
    {
        setElapsedTimeInSeconds(prevTime => {
            return prevTime + interval;
        });
    }

    function PlayPauseFunc() {
        switch(currentState)
        {
            case TimerState.Running:
                setCurrentState(TimerState.Paused);
                break;
            case TimerState.Paused:
                setCurrentState(TimerState.Running);
                break;
        }
    }

    useEffect(() => {
        switch(currentState)
        {
            case TimerState.Running:
                intervalIDRef.current = setInterval(()=> CountStep(0.01), 10);
                break;
            case TimerState.Paused:
                if(intervalIDRef.current !== null)
                    clearInterval(intervalIDRef.current);
                break;
        }
        return ()=> {
            if(intervalIDRef.current !== null && currentState === TimerState.Paused)
                clearInterval(intervalIDRef.current);
        };
    }, [currentState]);

    return (
        <div>
            <p>Elapsed Time: {elapsedTimeInSeconds.toFixed(2)}</p>
            <button onClick={() => {PlayPauseFunc()}}>{currentState === TimerState.Running ? 'Pause' : 'Start'}</button>
            <button onClick={() => {setElapsedTimeInSeconds(0)}}>Reset Timer</button>
        </div>
    )
}