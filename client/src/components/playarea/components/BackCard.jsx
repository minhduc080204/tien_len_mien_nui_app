import { Component } from "react";
import Card from "./Card";

class BackCard extends Component {
    render() {
        const { renderCard, card } = this.props
        if (card.length > 0) {

            return (<div className="backcardArea">

                <div className="backcardArea cards">
                    <div className="card back">
                        <img src="assets/icons/back_card.svg" alt="backcark" />
                    </div>
                    {
                        card && (card.map((card) => {
                            let suit_ic = "assets/icons/";
                            switch (card.suit) {
                                case 4:
                                    suit_ic += "heart_ic.svg"
                                    break;
                                case 3:
                                    suit_ic += "diamond_ic.svg"
                                    break;
                                case 2:
                                    suit_ic += "club_ic.svg"
                                    break;
                                case 1:
                                    suit_ic += "spade_ic.svg"
                                    break;
                            }

                            let rank;
                            switch (card.rank) {
                                case 20:
                                    rank = 2
                                    break
                                case 11:
                                    rank = "J"
                                    break
                                case 12:
                                    rank = "Q"
                                    break
                                case 13:
                                    rank = "K"
                                    break
                                case 14:
                                    rank = "A"
                                    break
                                default:
                                    rank = card.rank
                            }
                            const h1class = "suit" + card.suit
                            const id = rank + card.suit * 10
                            return (<>
                                <div className="card back" key={id}>
                                    <label className="main" for={id}>
                                        <div className="top">
                                            <div>
                                                <h1 className={h1class}>{rank}</h1>
                                                <img src={suit_ic} alt="suit" />
                                            </div>
                                        </div>
                                        <img src={suit_ic} alt="suit" />
                                        <div className="bot">
                                            <div>
                                                <h1 className={h1class}>{rank}</h1>
                                                <img src={suit_ic} alt="suit" />
                                            </div>
                                        </div>
                                    </label>
                                </div>

                            </>)

                        }))
                    }
                </div>
            </div>)
        }
        return (<></>)
    }
}

export default BackCard