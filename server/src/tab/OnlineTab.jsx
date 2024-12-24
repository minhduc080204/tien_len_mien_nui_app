import { Alert, Button, Col, Container, Row } from "react-bootstrap";
const { Component } = require("react");

class OnlineTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isStartServer: false,
            isShowAlert: false,
            selectedRoomId: null,            
        }
    }

    handleShowStopRoom(roomId) {
        this.setState({
            isShowAlert: true,
            selectedRoomId: roomId,
        })
    }

    handleStopRoom() {
        const mess = {
            roomId: this.state.selectedRoomId,
            type: 'STOPROOM',
          }
        window.api.sendTCP(JSON.stringify(mess));
        this.setState({
            isShowAlert: false,
            selectedRoomId: null,
        })
    }

    render() {
        const { numberPlayerOnline, ROOMS } = this.props
        return (<>
            <Container className="bg-white p-1 m-1 mt-0 rounded border" onClick={() => {
                console.log("ok");
            }}>
                <h3>Online Tab</h3>
                <p className="text-center text-success">{numberPlayerOnline} player Online</p>
            </Container>
            <Container className="tab-item" fluid>
                {ROOMS && (ROOMS.map((room, key) => {
                    return (
                        <Container fluid className="p-1 m-1 rounded border" key={key}>
                            <Row>
                                <Col xs={1}></Col>
                                <Col>
                                    <p>Room: <span className="fw-bold">{room.roomId}</span></p>
                                    <p className="text-success fw-bold">{room.numberPlayerPlaying} playing</p>
                                </Col>
                                <Col><Button
                                    variant="danger"
                                    onClick={() => this.handleShowStopRoom(room.roomId)}
                                >STOP</Button></Col>
                            </Row>
                        </Container>
                    );
                }))}
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
                        <Button onClick={() => this.handleStopRoom()} variant="outline-secondary">
                            Cancel
                        </Button>
                        <Button onClick={() => this.handleStopRoom()} variant="outline-danger">
                            STOP
                        </Button>
                    </div>
                </div>
            </Alert>
        </>)
    }
}

export default OnlineTab