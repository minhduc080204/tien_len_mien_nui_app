import { Component } from "react";
import { Fade } from "react-bootstrap";
import { ToastContainer } from "react-toastify";

class HomePage extends Component {
    render() {
        const {
            onChangeUserName,
            onChangeRoomId,
            onLogin,
            visible
        } = this.props

        return (<Fade in={visible} >
            <div>
                <ToastContainer
                    position="top-right"
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
                <form className="home_page" style={{ display: visible ? '' : 'none' }} onSubmit={onLogin}>
                    <h1>TIẾN LÊN MIỀN NÚI</h1>
                    <div className="form_home">
                        <h3>Tên người chơi</h3>
                        <input type="text" placeholder="Nhập tên" onChange={onChangeUserName()} required />
                    </div>
                    <div className="form_home">
                        <h3>ID phòng</h3>
                        <input
                            min={1000} max={1999}
                            defaultValue={1000} id="roomInput" type="number"
                            placeholder="Nhập id phòng" onChange={onChangeRoomId()} required
                        />
                    </div>
                    <button id="homeButton" type="submit">Tham gia</button>                    
                </form>
            </div>
        </Fade >);
    }
}

export default HomePage;