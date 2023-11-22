import React from "react"

export default function Timer(props) {
    return(
        <div>
            {props.finished 
                ? <span className="stopwatch--seconds">{String(props.totalSeconds)} SECONDS</span>
                : <span className="stopwatch--seconds">FINISHED IN {
                    String(props.totalSeconds)} SECONDS | HIGHSCORE: {Math.min(...props.scores)} SECONDS</span>
            }
        </div>
        
    )
}