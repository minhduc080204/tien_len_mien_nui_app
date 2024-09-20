import { Component } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';
import ErrorPage from './pages/ErrorPage';
import GamePage from './pages/GamePage';
import HomePage from './pages/HomePage';
import { ClipLoader, PacmanLoader } from 'react-spinners';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      roomId: null,
      userName: null,
      messages: [],
      roomIDEntry: null,
    }
  }

  handleChangeUserName = () => (event) => {
    this.setState({
      userName: event.target.value
    });
  }
  handleChangeRoomId = () => (event) => {
    this.setState({
      roomId: event.target.value
    });
  }
  handleLogin = () => {
    toast.success("Lỗi: không thể tham gia !")
    this.setState({
      login: true,
      roomIDEntry: this.state.roomId,
    });    
    return (
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
    )
  }
  handleLogout = () => {
    toast.error("Lỗi: không thể tham gia !")
    window.api.disconnectTCP();
    this.setState({
      login: false,
    });
  }
  render() {
    const visibleLogin = !this.state.login;

    if (!this.state.login) {
      return (
        <HomePage
          visible={visibleLogin}
          onChangeUserName={() => this.handleChangeUserName()}
          onChangeRoomId={() => this.handleChangeRoomId()}
          onLogin={() => this.handleLogin()}
        ></HomePage>
      )
    }    

    return (<>
      <GamePage
        roomId={this.state.roomId}
        userName={this.state.userName}
        visible={!visibleLogin}
        onLogout={this.handleLogout}
      ></GamePage>

      {/* <ErrorPage></ErrorPage> */}

    </>);
  }
}

export default App;
