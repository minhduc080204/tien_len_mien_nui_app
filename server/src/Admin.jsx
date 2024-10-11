import { Component } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import ChatTab from "./tab/ChatTab";
import OnlineTab from "./tab/OnlineTab";
import { HashLoader } from "react-spinners";

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isStartServer: false,
            numberPlayerOnline: 0,
            numberPlayerPlaying: 0,
            chatRoomIdSelected: 0,
            message: "",
            ROOMS: [],
        }
    }

    componentDidMount() {
        window.api.onTCPData((data) => {
            const ROOMS = JSON.parse(data);
            this.setState({
                numberPlayerOnline: ROOMS.numberPlayerOnline,
                ROOMS: ROOMS.Rooms,
            })
        })
    }

    handleStartServer = () => {
        if (this.state.isStartServer) {
            window.api.stopServer();
        } else {
            window.api.startServer();
        }
        this.setState({ isStartServer: !this.state.isStartServer })
    }

    handleChatRoomIdSelected = () => (event) => {
        this.setState({
            chatRoomIdSelected: event.target.value,
        });
    }

    handleSendMessage = () => {
        if (this.state.message.trim()) {
            if (this.state.chatRoomIdSelected == 0) {
                this.state.ROOMS.map((room)=>{
                    const mess = {
                        roomId: room.roomId,
                        name: "THÔNG BÁO",
                        message: this.state.message,
                    }                
                    window.api.sendTCP(JSON.stringify(mess));                    
                })
            } else {
                const mess = {
                    roomId: this.state.ROOMS[this.state.chatRoomIdSelected].roomId,
                    name: "THÔNG BÁO",
                    message: this.state.message,
                }                
                window.api.sendTCP(JSON.stringify(mess));                
            }
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

    render() {
        
        return (<>
            <Container fluid className="border border-3 p-2">
                <Row>
                    <Col>
                        <HashLoader
                            color={this.state.isStartServer ? "green" : "white"}
                            loading={true}
                            // cssOverride={override}
                            size={50}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </Col>
                    <Col xs="6"><h1>ADMIN - SERVER</h1></Col>
                    <Col>
                        <Button
                            size="lg"
                            variant={this.state.isStartServer ? 'success' : "outline-success"}
                            onClick={() => this.handleStartServer()}
                        >{this.state.isStartServer ? 'STOP' : "START"} SERVER</Button>
                    </Col>
                </Row>
            </Container>
            <Container fluid>
                <Row>
                    <Col className="tab-contain border border-2 border-bottom-0 p-1 pb-10" xs="3"><OnlineTab
                        ROOMS={this.state.ROOMS}
                        numberPlayerOnline={this.state.numberPlayerOnline}
                    ></OnlineTab></Col>
                    <Col className="tab-contain border border-2 border-bottom-0 p-1 pb-10"><ChatTab
                        ROOMS={this.state.ROOMS}
                        message={this.state.message}
                        chatRoomIdSelected={this.state.chatRoomIdSelected}
                        onChangeMessage={() => this.handleChangeMessage()}
                        onSendMessage={()=>this.handleSendMessage()}
                        onChatRoomIdSelected={() => this.handleChatRoomIdSelected()}
                    ></ChatTab></Col>
                </Row>
            </Container>
        </>);
    }
}

export default Admin;