import { Component } from 'react';
import { PacmanLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';
import GamePage from './pages/GamePage';
import HomePage from './pages/HomePage';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      login: false,
      roomId: 1000,
      userId: Date.now(),
      userName: null,
      messages: [],
      players: [],
    }
  }

  componentDidMount() {
    window.api.connectTCP();

    window.api.onTCPData((data) => {

      if (data.type == 'FULL') {
        toast.error(data.message)
        this.setState({ isLoading: false })
      }

      if (data.type == 'JOINOK') {
        const pls = data.players?data.players: [];
        while (pls[0].userId != this.state.userId) {
          pls.unshift(pls.pop())
        }
        pls.shift();        

        this.setState({
          login: true,
          isLoading: false,
          players: pls,
        });

        if(data.message){
          toast.success("HAving FuN 🤞😘");
        }

      }
    })
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
    this.setState({ isLoading: true })

    const mess = {
      roomId: this.state.roomId,
      userId: this.state.userId,
      name: this.state.userName,
      message: "",
      type: 'JOIN',
    }
    window.api.sendTCP(JSON.stringify(mess));
  }

  handleLogout = () => {
    toast.success("Hẹn lặp lại !")

    const mess = {
      roomId: this.state.roomId,
      name: this.state.userName,
      message: "",
      type: 'OUT',
    }
    window.api.sendTCP(JSON.stringify(mess));
    this.setState({
      login: false,
      roomId: 1000,
    });
  }

  render() {
    const visibleLogin = !this.state.login;

    if (this.state.isLoading) {
      return (
        <div className="loading">
          <PacmanLoader
            color={'green'}
            loading={true}
            // cssOverride={override}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )
    }

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
        players={this.state.players}
        userName={this.state.userName}
        visible={!visibleLogin}
        onLogout={this.handleLogout}
      ></GamePage>

      {/* <ErrorPage></ErrorPage> */}

    </>);
  }
}

export default App;
