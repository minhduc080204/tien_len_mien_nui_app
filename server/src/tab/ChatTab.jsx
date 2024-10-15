import { Alert, Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
const { Component } = require("react");

class ChatTab extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    renderMessage() {
        const ROOMS = this.props.ROOMS
        const chatRoomIdSelected = this.props.chatRoomIdSelected

        if (ROOMS && chatRoomIdSelected) {
            if (chatRoomIdSelected == 0) {
                return ROOMS.map((room, key) => {
                    return <p key={key} className="messageAll">{
                        room.messages && (room.messages.map((message, key2) => {
                            return <p key={key2}>
                                <span className="fw-bold ">{`Room: ${room.roomId} | ${message.name}`}: </span>
                                <label>{message.message}</label>
                            </p>
                        }))
                    }</p>
                })
            } else {
                return (
                    <p className="messageAll">
                        {ROOMS[chatRoomIdSelected] && ROOMS[chatRoomIdSelected].messages &&
                            ROOMS[chatRoomIdSelected].messages.map((message, key) => {
                                return (
                                    <p key={key}>
                                        <span className="fw-bold">
                                            {`Room: ${chatRoomIdSelected} | ${message.name}`}:
                                        </span>
                                        <label>{message.message}</label>
                                    </p>
                                );
                            })
                        }
                    </p>
                );
            }
        }
    }

    render() {
        const {
            ROOMS,
            chatRoomIdSelected,
            message,
            onChangeMessage,
            onSendMessage,
            onChatRoomIdSelected,
        } = this.props
        return (<Container className="ChatContainer">
            <Container className="bg-white p-1 m-1 mt-0 rounded border" onClick={() => {

            }}>
                <h3>Chat Tab <span className="text-success">({chatRoomIdSelected == 0 ? 'All' : chatRoomIdSelected})</span></h3>
            </Container>
            <Container className="tab-item" style={{ flexGrow: 1 }} fluid>
                {this.renderMessage()}
            </Container>

            <Container fluid style={{ display: "flex", gap: 20 }} className="mt-2">
                <InputGroup>
                    <Form.Control
                        placeholder={chatRoomIdSelected == 0 ? "Thông báo cho tất cả..." : "Thông báo cho roomId " + chatRoomIdSelected + "..."}
                        aria-label={chatRoomIdSelected == 0 ? "Thông báo cho tất cả..." : "Thông báo cho roomId " + chatRoomIdSelected + "..."}
                        onChange={onChangeMessage()}
                        value={message}
                        aria-describedby="basic-addon2"
                    />
                    <Button variant="outline-secondary" id="button-addon2" onClick={() => onSendMessage()}>
                        Gửi
                    </Button>
                </InputGroup>
                <Form.Select
                    aria-label="Default select example" style={{ width: 130 }}
                    onChange={onChatRoomIdSelected()}
                >
                    <option value="0">All</option>
                    {ROOMS && (ROOMS.map((room, key) => {
                        return <option key={key} value={key}>Room: {room.roomId}</option>
                    }))}
                </Form.Select>
            </Container>
        </Container>)
    }
}

export default ChatTab