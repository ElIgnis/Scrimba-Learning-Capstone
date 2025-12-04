export default function Die(props) {
    return (
        <button
            onClick={props.callbackFunc}
            aria-pressed={props.isHeld}
            aria-label={`Die with value ${props.value}, ${props.isHeld ? "held" : "not held"}`}
            style={{backgroundColor: props.isHeld ? '#59E391' : 'white'}}>{props.value}
        </button>
    )
}