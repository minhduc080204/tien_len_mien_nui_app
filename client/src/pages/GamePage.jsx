import React, { Component } from "react";
import { Fade } from "react-bootstrap";
import { PacmanLoader } from "react-spinners";
import ChatRoom from "../components/ChatRoom";
import PlayArea from "../components/playarea/PlayArea";
import BackCard from "../components/playarea/components/BackCard";

class GamePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hand: [],
            card: [],
            messages: [],
            message: "",
            onMic: false,
            stompClient: null,
            loading: true,
        }

    }

    componentDidMount() {
        if (this.props.roomId) {            
            this.setState({ loading: false })

            window.api.onTCPData((data) => { 

                if(data.hand){
                    this.setState({
                        hand: data.hand
                    })
                    return;
                }

                if(data.card){
                    this.setState({
                        card: data.card.reverse()
                    })
                    return;
                }

                this.setState((prevState) => ({
                    messages: [...prevState.messages, data]
                }));
            });
        }                
    }

    handleGetHand = () => {
        const mess = {
            roomId: this.props.roomId,
            name: this.props.userName,
            message: this.state.message,
            type: 'START',
        }
        window.api.sendTCP(JSON.stringify(mess));
    }

    handleSendMessage = () => {
        if (this.state.message.trim()) {
            const mess = {
                roomId: this.props.roomId,
                name: this.props.userName,
                message: this.state.message,
                type: 'CHAT',
            }
            window.api.sendTCP(JSON.stringify(mess));
            this.setState({
                message: ""
            })
        }
    }

    handleChangeMessage = () => (event) => {
        this.setState({
            message: event.target.value
        });
    }



    handleSortCart = () => {
        this.setState({
            hand: this.state.hand.sort((a, b) => a.rank - b.rank)
        })
    }

    handleAttack = () => {
        const inputs = document.getElementsByClassName("card_input");
        this.state.card = [];
        for (let i = inputs.length - 1; i >= 0; i--) {
            if (inputs[i].checked) {
                this.state.card.push(this.state.hand.splice(i, 1)[0])
            }
        }
        const mess = {
            roomId: this.props.roomId,
            name: this.props.userName,
            hand: this.state.hand,
            card: this.state.card,
            type: 'ATTACK',
        }
        window.api.sendTCP(JSON.stringify(mess));

        this.setState({
            hand: this.state.hand,
        })
    }

    renderCard = (card) => {
        // if (card) {
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

    handleMicClick = () => {
        this.setState({
            onMic: !this.state.onMic
        });
    }

    render() {
        const {
            roomId,
            userName,
            onLogout,
            visible,
        } = this.props
        if (this.state.loading) {
            return (
                <div className="loading">
                    <PacmanLoader
                        color={'green'}
                        loading={true}
                        // cssOverride={override}
                        size={50}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
            )
        }

        return (<Fade in={true}>
            <div style={{ display: visible ? '' : 'none' }}>
                <h2 style={{ color: "white" }}>Table ID: {roomId}</h2>
                <ChatRoom
                    message={this.state.message}
                    onSendMessage={() => { this.handleSendMessage() }}
                    onChangeMessage={() => this.handleChangeMessage()}
                    onMic={this.state.onMic}
                    messages={this.state.messages}
                    onMicClick={() => { this.handleMicClick() }}
                ></ChatRoom>
                <button onClick={() => {
                    onLogout();
                    this.setState({
                        hand: [],
                        card: [],
                    })
                }}>Logout</button>
                <BackCard
                    renderCard={(card) => this.renderCard(card)}
                    card={this.state.card}
                ></BackCard>
                <PlayArea
                    hand={this.state.hand}
                    onGetHand={() => this.handleGetHand()}
                    onSortCart={() => this.handleSortCart()}
                    onAttack={() => this.handleAttack()}
                    renderCard={(card) => this.renderCard(card)}
                ></PlayArea>
            </div>
        </Fade>)
    };
}

export default GamePage;