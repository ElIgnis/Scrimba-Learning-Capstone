import { useEffect, useState, useRef } from "react";

export function CountdownTimer(props){

    const TimerState = {
        Running: 0,
        Finished: 1
    } as const;

    const derivedTimerState = props.duration > 0 ? TimerState.Running : TimerState.Finished;
    const [remainingTimeInSeconds, setRemainingTimeInSeconds] = useState<number>(props.duration);
    const [currentState, setCurrentState] = useState<number>(derivedTimerState);
    const intervalIDRef = useRef<number | null>(null);
    function CountStep(interval: number)
    {
        setRemainingTimeInSeconds(prevTime => {
            const updatedTime = prevTime - interval

            if(updatedTime <= 0)
                setCurrentState(TimerState.Finished);

            return updatedTime;
        });
    }

    useEffect(() => {

        switch(currentState){
            case TimerState.Running:
                intervalIDRef.current = setInterval(()=> CountStep(0.1), 100);
            break;
        }

         return ()=> {
            if(intervalIDRef.current !== null)
                clearInterval(intervalIDRef.current);
        };
    }, [props.duration, props.status, currentState])

    
    return (
        <p>{currentState == TimerState.Running ? `Remaining Duration: ${remainingTimeInSeconds.toFixed(2)}` : 'Time Up'}</p>
    );
}