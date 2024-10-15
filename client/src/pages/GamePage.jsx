import React, { Component } from "react";
import { Fade } from "react-bootstrap";
import { PacmanLoader } from "react-spinners";
import ChatRoom from "../components/ChatRoom";
import PlayArea from "../components/playarea/PlayArea";
import BackCard from "../components/playarea/components/BackCard";
import { toast, ToastContainer } from "react-toastify";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import PlayerArea from "../components/PlayerArea";

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
            isLoading: true,
            isPlaying: false,
            isTurn: false,
            player1: { isIn: false, isTurn: null, number: null, name: "" },
            player2: { isIn: true, isTurn: null, number: 13, name: "Duy" },
            player3: { isIn: true, isTurn: null, number: 13, name: "Châu" },
        }

    }

    componentDidMount() {
        if (this.props.roomId) {
            this.setState({ isLoading: false })

            window.api.onTCPData((data) => {

                if (data.hand) {
                    this.setState({
                        hand: data.hand
                    })
                    return;
                }

                if (data.card) {
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
        this.setState({
            isPlaying: true,
            isTurn: true,
        })
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
                message: "",
                player1: {
                    isIn: true,
                    isTurn: true,
                    number: 12,
                    name: "Loan"
                }
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
        if (!this.state.isTurn) {
            toast("Chưa đến lượt của bạn !");
            return;
        }

        const inputs = document.getElementsByClassName("card_input");


        let cardSelected = [];
        let handTmp = [...this.state.hand];
        for (let i = inputs.length - 1; i >= 0; i--) {
            if (inputs[i].checked) {
                cardSelected.push(handTmp.splice(i, 1)[0])
            }
        }

        cardSelected = cardSelected.sort((a, b) => a.rank - b.rank)

        if (cardSelected.length == 0) {
            toast("Hãy chọn bài !");
            return;
        }

        console.log(cardSelected, "selected");
        console.log(this.state.card, "surent");

        if(!this.checkValidCard(cardSelected)){
            toast("Hãy chọn bài !!!!!!!!!");
            return;
        }

        console.log("SENDDED");
        

        // if (this.state.card.length != 0) {
        //     if (this.state.card.length != cardSelected.length) {
        //         toast("Bài đánh không hợp lệ !")
        //         return;
        //     }

        //     // 1 lá
        //     if (this.state.card.length == 1) {                
        //         if (this.state.card[0].rank > cardSelected[0].rank) {
        //             toast("Bài đánh không hợp lệ !")
        //             return;
        //         }

        //         if (this.state.card[0].rank == cardSelected[0].rank) {
        //             if (this.state.card[0].suit > cardSelected[0].suit) {
        //                 toast("Bài đánh không hợp lệ !")
        //                 return;
        //             }
        //         }
        //     }

        //     // 2 lá
        //     if(this.state.card.length == 2) {

        //         // logic
        //     }
        // }

        const mess = {
            roomId: this.props.roomId,
            name: this.props.userName,
            hand: handTmp,
            card: cardSelected,
            type: 'ATTACK',
        }
        window.api.sendTCP(JSON.stringify(mess));

        this.setState({
            hand: handTmp,
        })
    }

    checkValidCard = (cardSelected) => {
        
        if(cardSelected.length<2){
            return true;
        }

        const basevl = cardSelected[1].rank-cardSelected[0].rank;
        
        if(basevl>1){
            return false;
        }

        if(basevl==1 && cardSelected.length==2){
            return false;
        }

        for(let i=0;i<cardSelected.length-1;i++){
            if(cardSelected[i+1].rank-cardSelected[i].rank!=basevl){
                return false;
            }
        }
        return true;
        
    }


    handleEndOfTime() {
        this.setState(prevState => ({
            // isTurn: false,
            player1: {
                isIn: prevState.player1.isIn,
                isTurn: false,
                number: prevState.player1.number,
                name: prevState.player1.name,
            },
            player2: {
                isIn: prevState.player2.isIn,
                isTurn: false,
                number: prevState.player2.number,
                name: prevState.player2.name,
            },
            player3: {
                isIn: prevState.player3.isIn,
                isTurn: false,
                number: prevState.player3.number,
                name: prevState.player3.name,
            }
        }))
    }

    handleMicClick = () => {
        this.setState({
            onMic: !this.state.onMic
        });
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
                <button onClick={() => this.handleGetHand()}>Chia bài</button>
                <PlayArea
                    hand={this.state.hand}
                    isPlaying={this.state.isPlaying}
                    isTurn={this.state.isTurn}
                    onEndOfTime={() => this.handleEndOfTime()}
                    onSortCart={() => this.handleSortCart()}
                    onAttack={() => this.handleAttack()}
                    renderCard={(card) => this.renderCard(card)}
                ></PlayArea>
                <div className="playerArea">
                    <PlayerArea
                        isPlayer1={true}
                        player={this.state.player1}
                        onEndOfTime={() => this.handleEndOfTime()}
                    ></PlayerArea>
                    <PlayerArea
                        player={this.state.player2}
                        onEndOfTime={() => this.handleEndOfTime()}
                    ></PlayerArea>
                    <PlayerArea
                        player={this.state.player3}
                        onEndOfTime={() => this.handleEndOfTime()}
                    ></PlayerArea>
                </div>

                <ToastContainer
                    position="top-left"
                    autoClose={2500}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </div>
        </Fade>)
    };
}

export default GamePage;