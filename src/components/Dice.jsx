import React from "react"

export default function Dice(props) {

    const bgColor = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }

    return (
        <div className="dice" style={bgColor} onClick={() => props.handleClick(props.id, props.isHeld)}>
            <p className="dice--number">{props.number}</p>
        </div>
    )
}