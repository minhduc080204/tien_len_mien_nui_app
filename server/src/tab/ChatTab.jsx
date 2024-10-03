import { Alert, Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
const { Component } = require("react");

class ChatTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isStartServer: false,
            isShowAlert: false,
            selectedRoomId: null,
        }
    }

    handleStopRoom(roomId) {
        this.setState({
            isShowAlert: true,
            selectedRoomId: roomId,
        })
    }

    stoproom() {
        this.setState({
            isShowAlert: false,
            selectedRoomId: null,
        })
    }

    render() {

        return (<Container className="ChatContainer">
            <Container className="bg-white p-1 m-1 mt-0 rounded border" onClick={() => {
                console.log("ok");
            }}>
                <h3>Chat Tab</h3>
            </Container>
            <Container className="tab-item" style={{ flexGrow: 1 }} fluid>
                <p>hiii</p>
                <p>hiii</p>
                <p>hiii</p>
            </Container>

            <Container fluid style={{ display:"flex", gap:20 }} className="mt-2">
                <InputGroup>
                    <Form.Control
                        placeholder="Thông báo cho client..."
                        aria-label="Thông báo cho client..."
                        aria-describedby="basic-addon2"
                    />
                    <Button variant="outline-secondary" id="button-addon2">
                        Gửi
                    </Button>
                </InputGroup>
                <Form.Select aria-label="Default select example" style={{ width:130 }}>
                    <option value="0">All</option>
                    <option value="1">Room: 1</option>
                    <option value="2">Room: 2</option>
                    <option value="3">Room: 3</option>
                </Form.Select>
            </Container>


            <Alert show={this.state.isShowAlert} variant="" className="alertContain fixed-top">
                <div className=" border border-3 rounded bg-white p-3">
                    <Alert.Heading>STOP ROOM ID: {this.state.selectedRoomId}</Alert.Heading>
                    <p>
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget
                        lacinia odio sem nec elit. Cras mattis consectetur purus sit amet
                        fermentum.
                    </p>
                    <hr />
                    <div className="d-flex justify-content-end gap-4">
                        <Button onClick={() => this.stoproom()} variant="outline-secondary">
                            Cancel
                        </Button>
                        <Button onClick={() => this.stoproom()} variant="outline-danger">
                            STOP
                        </Button>
                    </div>
                </div>
            </Alert>
        </Container>)
    }
}

export default ChatTab