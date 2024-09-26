import { Component } from "react";

class Card extends Component {
    render() {
        const { rank, suit, suit_ic } = this.props
        const h1class = "suit" + suit
        const id = rank + suit * 10
        return (<>
            <div className="card" key={id}>
                <input type="checkbox" id={id} className="card_input" value={id} />
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
    }
}

export default Card;