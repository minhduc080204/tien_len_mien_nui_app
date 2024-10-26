import React, { Component } from "react"
import HandCard from "./components/HandCard"
import { CountdownCircleTimer } from "react-countdown-circle-timer"
import { Fade } from "react-bootstrap"

class PlayArea extends Component {    
    render() {
        const {
            isPlaying,
            isTurn,
            onEndOfTime,
            onSortCart,
            onAttack,
            renderCard,
            hand,
        } = this.props
        
        return (<React.Fragment>            
            <Fade in={isPlaying}>
                <div className="playarea">
                    <div className="circletime">
                        <CountdownCircleTimer
                            key={isTurn}
                            size={130}
                            isPlaying={isTurn}
                            duration={20}
                            colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                            colorsTime={[10, 6, 3, 0]}
                            onComplete={()=>{onEndOfTime()}}
                        >
                        </CountdownCircleTimer>
                    </div>
                    <HandCard
                        renderCard = {(card)=>renderCard(card)}
                        hand={hand}
                    />
                    <div className="playbutton">
                        <button onClick={ onAttack } >Đánh bài</button>
                        <button onClick={ onSortCart }>Xếp Bài</button>                                            
                        <button className="skipTurn" onClick={ onEndOfTime }>Bỏ lượt</button>
                    </div>
                </div>
            </Fade> 
        </React.Fragment>)
    }
}

export default PlayArea