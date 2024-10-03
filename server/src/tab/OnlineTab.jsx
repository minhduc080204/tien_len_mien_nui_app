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

        return (<>
            <Container className="bg-white p-1 m-1 mt-0 rounded border" onClick={() => {
                console.log("ok");
            }}>
                <h3>Online Tab</h3>
            </Container>
            <Container className="tab-item" fluid>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => {
                    return (
                        <Container fluid className="p-1 m-1 rounded border" key={item}>
                            <Row>
                                <Col><p>Room Id: {item}</p></Col>
                                <Col><Button
                                    variant="danger"
                                    onClick={() => this.handleStopRoom(item)}
                                >STOP</Button></Col>
                            </Row>
                        </Container>
                    );
                })}
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
        </>)
    }
}

export default OnlineTab