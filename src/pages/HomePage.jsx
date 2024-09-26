import { Component } from "react";
import { Fade } from "react-bootstrap";

class HomePage extends Component {
    render() {
        const {
            onChangeUserName,
            onChangeRoomId,
            onLogin,
            visible
        } = this.props

        return (<Fade in={visible} >
            <div className="home_page" style={{ display: visible ? '' : 'none' }}>
                <h1>TIẾN LÊN MIỀN NÚI</h1>
                <div className="form_home">
                    <h3>Tên người chơi</h3>
                    <input type="text" placeholder="Nhập tên" onChange={onChangeUserName()} />
                </div>
                <div className="form_home">
                    <h3>ID phòng</h3>
                    <input id="roomInput" type="number" placeholder="Nhập id phòng" onChange={onChangeRoomId()} />
                </div>
                <button id="homeButton" onClick={onLogin} type="button">Tham gia</button>
            </div>            
        </Fade >);
    }
}

export default HomePage;