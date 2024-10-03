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
        }
    }

    handleStartServer = () => { 
        console.log("siuuuuuuuuuuuu");
        if(this.state.isStartServer){
            window.api.stopServer();
        }else{
            window.api.startServer();
        }
        this.setState({ isStartServer: !this.state.isStartServer }) 
    }

    render() {

        return (<>
            <Container fluid className="border border-3 p-2">
                <Row>
                    <Col>
                        <HashLoader
                            color={this.state.isStartServer?"green":"white"}
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
                    <Col className="tab-contain border border-2 border-bottom-0 p-1 pb-10" xs="3"><OnlineTab></OnlineTab></Col>
                    <Col className="tab-contain border border-2 border-bottom-0 p-1 pb-10"><ChatTab></ChatTab></Col>
                </Row>
            </Container>
        </>);
    }
}

export default Admin;