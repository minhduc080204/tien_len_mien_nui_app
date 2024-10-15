import { Component } from "react";
import { Fade } from "react-bootstrap";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

class PlayerArea extends Component {
    render() {
        const { isPlayer1, player, onEndOfTime } = this.props;
        return (
            <Fade in={player.isIn}>
                <div className={isPlayer1 ? "player player1" : "player"}>

                    <div>
                        <h1>{player.name}</h1>
                        <CountdownCircleTimer
                            key={player.isTurn && player.isTurn}
                            size={130}
                            isPlaying={player.isTurn && player.isTurn}
                            duration={3}
                            colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                            colorsTime={[10, 6, 3, 0]}
                            onComplete={() => { onEndOfTime() }}
                        >
                        </CountdownCircleTimer>
                    </div>

                    <div className="backcard">
                        <h1>{player.number && player.number}</h1>
                    </div>
                </div>
            </Fade>
        )
    }
}

export default PlayerArea;