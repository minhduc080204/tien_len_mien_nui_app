import { Component } from "react";
import Card from "./Card"
import { Fade } from "react-bootstrap";

class HandCard extends Component {
    render() {

        const { renderCard, hand } = this.props

        return (
            <>
                <div className="cards">
                    {
                        hand && (hand.map((card) => {
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
                            return (<>
                                <Card
                                    rank={rank}
                                    suit={card.suit}
                                    suit_ic={suit_ic}
                                ></Card>

                            </>)

                        }))
                    }
                </div>
            </>
        );
    }
}

export default HandCard