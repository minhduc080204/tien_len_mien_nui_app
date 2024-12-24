import React, { Component, createRef } from "react";
import { Fade } from "react-bootstrap";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { toast, ToastContainer } from "react-toastify";
import Peer from 'simple-peer';
import ChatRoom from "../components/ChatRoom";
import PlayerArea from "../components/PlayerArea";
import PlayArea from "../components/playarea/PlayArea";
import BackCard from "../components/playarea/components/BackCard";

class GamePage extends Component {
    constructor(props) {
        super(props);
        this.audioRefShuffle = createRef();
        this.audioRefAttack = createRef();
        this.audioRefChat = createRef();
        this.peerRef = createRef();
        this.voiceRef = createRef();
        this.streamRef = createRef();

        this.state = {
            hand: [],
            card: [],
            messages: [],
            message: "",
            isPlaying: false,
            isTurn: false,
            isReady: false,
            isAllReady: false,
            onMic: false,
        }

    }

    async componentDidMount() {
        if (this.props.roomId) {
            toast.success("HAving FuN 🤞😘");
            this.streamRef.current = await this.getMedia();
            window.api.onTCPData((data) => {

                if (data.type == 'STOPROOM') {
                    console.log("STOPPPPPPPPPPPPPPPp");
                    
                    toast.error("Sorry ! This room had been stopped");
                    this.handleLogout();
                }

                if (data.type == 'ATTACK') {
                    this.playSound(this.audioRefAttack.current);
                }

                if (data.type == 'JOIN') {
                    if (data.userId && data.userId != this.props.userId) {
                        this.newVoicer(this.props.userId, data.userId);
                    }
                }

                if (data.type == 'offer') {
                    this.handleOffer(data);
                }

                if (data.type == 'answer') {
                    console.log("anssweee", data);
                    this.handleAnswer(data);
                }

                if (data.players) {
                    console.log(data.players, "dataPLayer");
                    data.players.forEach((player) => {
                        if (player.userId == this.props.userId) {
                            this.setState({
                                hand: player.hand,
                                isPlaying: player.hand.length == 0 ? false : true,
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

                if (data.isReady !== undefined) {
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
                    this.playSound(this.audioRefChat.current);
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

            // chặt heo
            if (this.state.card[0].rank == 20) {
                // 1 heo
                if (this.state.card.length == 1) {
                    if (cardSelected.length == 4) {
                        if (cardSelected[0].rank == cardSelected[1].rank) {
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
                    }
                }
                // 2 heo
                if (this.state.card.length == 1) {
                    if (cardSelected.length == 8) {
                        if (cardSelected[0].rank == cardSelected[1].rank) {
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
                    }
                }
                return;
            }

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

        this.playSound(this.audioRefAttack.current);

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
        if (!this.state.isTurn) {
            toast.error('Chưa tới lượt');
            return;
        }

        if (this.state.card.length == 0) {
            toast.error('Không thể bỏ lượt');
            return;
        }
        this.setState({
            isTurn: false,
            isReady: false,
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

    playSound = (ref) => {
        const audio = ref;
        try {
            audio.play();
        } catch { }
    };

    handleEndOfTimeCircleMiddle() {
        this.playSound(this.audioRefShuffle);
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
        if (!this.voiceRef.current) {
            return;
        }

        if (this.state.onMic) {
            const audioTrack = this.streamRef.current.getAudioTracks()[0];
            audioTrack.enabled = false;
            this.voiceRef.current.forEach(audio => {
                audio.pause();
            });
        } else {
            const audioTrack = this.streamRef.current.getAudioTracks()[0];
            audioTrack.enabled = true;
            this.voiceRef.current.forEach(audio => {
                audio.play();
            });
        }

        this.setState({
            onMic: !this.state.onMic
        });
    }

    getMedia = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getAudioTracks()[0].enabled = false;
        return stream;
    };

    newVoicer = async (offerId, answerId) => {


        const newPeer = new Peer({
            initiator: true,
            trickle: false,
            stream: this.streamRef.current,
        });

        newPeer.on('signal', (data) => {
            const mess = {
                roomId: this.props.roomId,
                offerId: offerId,
                answerId: answerId,
                ...data,
            }

            window.api.sendTCP(JSON.stringify(mess));

        });

        newPeer.on('stream', (remoteStream) => {
            const audioElement = document.createElement('audio');
            audioElement.srcObject = remoteStream;
            audioElement.pause();

            if (!this.voiceRef.current) {
                this.voiceRef.current = [];
            }
            this.voiceRef.current.push(audioElement);

        });

        if (!this.peerRef.current) {
            this.peerRef.current = [];
        }
        this.peerRef.current.push({ answerId: answerId, peer: newPeer });

    };

    // Xử lý tín hiệu offer
    handleOffer = async (dataInput) => {

        const newPeer = new Peer({
            initiator: false,
            trickle: false,
            stream: this.streamRef.current,
        });

        newPeer.on('signal', (data) => {
            const mess = {
                roomId: this.props.roomId,
                offerId: dataInput.offerId,
                answerId: dataInput.answerId,
                ...data,
            }

            window.api.sendTCP(JSON.stringify(mess));
        });

        newPeer.on('stream', (remoteStream) => {
            const audioElement = document.createElement('audio');
            audioElement.srcObject = remoteStream;
            audioElement.pause();

            if (!this.voiceRef.current) {
                this.voiceRef.current = [];
            }
            this.voiceRef.current.push(audioElement);
        });

        newPeer.signal({
            type: dataInput.type,
            sdp: dataInput.sdp,
        });

        if (!this.peerRef.current) {
            this.peerRef.current = [];
        }
        this.peerRef.current.push({ answerId: dataInput.answerId, peer: newPeer });
    };

    // Xử lý tín hiệu answer từ đối tác
    handleAnswer = (dataInput) => {
        this.peerRef.current.forEach((peer) => {

            if (peer.answerId == dataInput.answerId) {
                peer.peer.signal({
                    type: dataInput.type,
                    sdp: dataInput.sdp,
                })

            }
        })
    };

    // Kết thúc cuộc gọi
    endCall = () => {
        if(!this.peerRef.current){
            return;
        }
        this.peerRef.current.forEach((peer) => {
            peer.destroy();
        })
        this.peerRef.current = null;
    };

    handleLogout=()=>{
        this.props.onLogout();
        this.endCall();
        this.setState({
            hand: [],
            card: [],
        })
    }


    render() {
        const {
            roomId,
            onLogout,
            visible,
            isPlaying,
            onSoundClick,
        } = this.props

        console.log("refff", this.voiceRef.current);


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
                <button onClick={() => onSoundClick()}><i className={isPlaying ? "bi bi-volume-up" : "bi bi-volume-mute"}></i></button>
                <button onClick={() => this.handleLogout()}>Logout</button>
                <BackCard
                    renderCard={(card) => this.renderCard(card)}
                    card={this.state.card}
                ></BackCard>

                <button
                    className={this.state.isReady ? "bg-success text-white" : ""}
                    onClick={() => this.handleReady()}
                >Sẵn sàng</button>

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

                <audio
                    ref={this.audioRefShuffle}
                    src="./assets/sound/shuffle_card.mp3"
                />
                <audio
                    ref={this.audioRefShuffle}
                    src="./assets/sound/shuffle_card.mp3"
                />
                <audio
                    ref={this.audioRefAttack}
                    src="./assets/sound/attack_card.mp3"
                />
                <audio
                    ref={this.audioRefChat}
                    src="./assets/sound/chat.mp3"
                />

                {this.state.peerConnected && (
                    <audio ref={this.remoteAudioRef} autoPlay playsInline />
                )}

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