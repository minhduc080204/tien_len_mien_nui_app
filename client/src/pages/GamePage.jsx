import React, { Component } from "react";
import { Fade } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import ChatRoom from "../components/ChatRoom";
import PlayerArea from "../components/PlayerArea";
import PlayArea from "../components/playarea/PlayArea";
import BackCard from "../components/playarea/components/BackCard";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

class GamePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hand: [],
            card: [],
            messages: [],
            message: "",
            onMic: false,
            isPlaying: false,
            isTurn: false,
            isReady: false,
            isAllReady: false,
        }

    }

    componentDidMount() {
        if (this.props.roomId) {
            window.api.onTCPData((data) => {                                
                // console.log("dataooRR", data.isAllReady);

                // console.log("dataoo", data);

                // console.log("ISTURN", data.isTurn);

                if (data.players){
                    console.log(data.players);
                    data.players.forEach((player)=>{
                        if(player.userId==this.props.userId){
                            this.setState({
                                hand: player.hand,
                                isPlaying: true,
                                isTurn: player.isTurn,
                            })
                        }
                    })
                }

                if (data.isAllReady) {
                    this.setState({
                        isAllReady: true,
                    })                    
                }

                if (data.isReady!==undefined) {
                    this.setState({
                        isReady: data.isReady
                    })
                    !this.state.isReady ? toast.success("Bạn đã sẵn sàng.") : toast.success("Bạn hủy sẵn sàng.")
                    return;
                }

                if (data.hand) {
                    this.setState({
                        hand: data.hand,
                        isPlaying: true,
                    })
                    return;
                }

                if (data.card) {
                    this.setState({
                        card: data.card
                    })
                    return;
                }


                if (data.message) {
                    this.setState((prevState) => ({
                        messages: [...prevState.messages, data]
                    }));
                }
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
            hand: this.sortCard(this.state.hand)
        })
    }

    handleReady = () => {
        if (this.state.hand.length != 0) {
            toast.error("Đang trong trận")
            return;
        }
                
        const mess = {
            roomId: this.props.roomId,
            userId: this.props.userId,
            isReady: !this.state.isReady,
            type: 'READY',
        }

        window.api.sendTCP(JSON.stringify(mess));

        // this.setState({
        //     isReady: !this.state.isReady,
        // })
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

        cardSelected = this.sortCard(cardSelected)

        if (cardSelected.length == 0) {
            toast("Hãy chọn bài !");
            return;
        }

        if (!this.checkValidCard(cardSelected)) {
            toast("Bài đánh ko hợp lệ !");
            return;
        }

        if (this.state.card.length != 0) {
            // số lượng bài đánh khác số lượng bài trên bàn
            if (this.state.card.length != cardSelected.length) {
                toast("Bài đánh không hợp lệ !1")
                return;
            }
            // trường hợp sảnh và sam/đôi
            if (cardSelected.length > 1) {
                if (cardSelected[1].rank - cardSelected[0].rank != this.state.card[1].rank - this.state.card[0].rank) {
                    toast("Bài đánh không hợp lệ !10")
                    return;
                }
            }
            // so sánh giá trị 
            if (cardSelected[cardSelected.length - 1].rank < this.state.card[this.state.card.length - 1].rank) {
                toast("Bài đánh không hợp lệ !2")
                return;
            }
            // so sánh giá trị con nếu giá trị = nhau
            if (cardSelected[cardSelected.length - 1].rank == this.state.card[this.state.card.length - 1].rank) {
                if (cardSelected[cardSelected.length - 1].suit < this.state.card[this.state.card.length - 1].suit) {
                    toast("Bài đánh không hợp lệ !3")
                    return;
                }
            }
        }

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
            isTurn: false,
        })
        
    }

    checkValidCard = (cardSelected) => {
        // 1 lá
        if (cardSelected.length < 2) {
            return true;
        }

        const basevl = cardSelected[1].rank - cardSelected[0].rank;

        if (basevl > 1) {
            return false;
        }

        if (basevl == 1 && cardSelected.length == 2) {
            return false;
        }

        for (let i = 0; i < cardSelected.length - 1; i++) {
            if (cardSelected[i + 1].rank - cardSelected[i].rank != basevl) {
                return false;
            }
        }
        return true;

    }

    sortCard(cards) {
        return cards.sort((a, b) => {
            if (a.rank === b.rank) {
                return a.suit - b.suit;
            }
            return a.rank - b.rank;
        });
    }


    handleEndOfTime() {
        this.setState({
            isTurn: false,
            card: []
        })

        const mess = {
            roomId: this.props.roomId,
            // name: this.props.cuserName,
            // hand: handTmp,
            // card: cardSelected,
            type: 'SKIP',
        }
        window.api.sendTCP(JSON.stringify(mess));
    }

    handleEndOfTimeCircleMiddle() {
        const mess = {
            roomId: this.props.roomId,
            name: this.props.userName,
            type: 'START',
        }
        window.api.sendTCP(JSON.stringify(mess));
        this.setState({
            isAllReady: false,
        })
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
            onLogout,
            visible,
        } = this.props

        return (<Fade in={visible}>
            <div>
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
                <button
                    className={this.state.isReady ? "bg-success text-white" : ""}
                    onClick={() => this.handleReady()}
                >Sẵn sàng</button>
                <button onClick={() => this.handleGetHand()}>Sẵn sangf</button>
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
                    {this.props.players && this.props.players.map((player, index) => {
                        return (
                            <PlayerArea
                                key={index}
                                player={player}
                            />
                        );
                    })}
                </div>
                <Fade in={this.state.isAllReady && this.state.isReady}>
                    <div className="circleTimeMiddle">
                        <CountdownCircleTimer
                            key={this.state.isAllReady && this.state.isReady}
                            size={130}
                            isPlaying={this.state.isAllReady && this.state.isReady}
                            duration={5}
                            colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                            colorsTime={[10, 6, 3, 0]}
                            onComplete={() => { this.handleEndOfTimeCircleMiddle() }}
                            >
                        </CountdownCircleTimer>
                        <h2>Sẵn sàn để chơi !</h2>
                    </div>
                </Fade>

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