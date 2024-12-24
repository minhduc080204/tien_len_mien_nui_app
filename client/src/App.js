import { Component, createRef } from 'react';
import { PacmanLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';
import GamePage from './pages/GamePage';
import HomePage from './pages/HomePage';

class App extends Component {
  constructor(props) {
    super(props);
    this.audioRefBackground = createRef();
    this.state = {
      isLoading: false,
      isPlayingBackground: true,
      isLogin: false,
      roomId: 1000,
      userId: Date.now(),
      userName: null,
      messages: [],
      players: [],
    }
  }

  componentDidMount() {
    const audio = this.audioRefBackground.current;
    audio.loop = this.props.loop || true;
    audio.play().catch((error) => {
      console.error("Audio playback failed:", error);
    });

    window.api.connectTCP();

    window.api.onTCPData((data) => {
      console.log("ĐT", data);


      if (data.type == 'FULL') {
        toast.error(data.message)
        this.setState({ isLoading: false })
        return;
      }

      if (data.type == 'JOIN') {
        const pls = data.players ? data.players : [];
        while (pls[0].userId != this.state.userId) {
          pls.unshift(pls.pop())
        }
        pls.shift();

        this.setState({
          isLogin: true,
          isLoading: false,
          players: pls,
        });

        return;
      }      

      if(data.type == 'STOPROOM'){
        toast.error("Sorry ! This room had been stopped");
        return;
      }

      if (data.type && !['CHAT', 'offer', 'answer'].includes(data.type)) {
        const pls = data.players ? data.players : [];
        while (pls[0].userId != this.state.userId) {
          pls.unshift(pls.pop())
        }
        pls.shift();

        this.setState({
          players: pls,
        });
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
      isLogin: false,
      roomId: 1000,
    });
  }

  playBackgroundSound = () => {
    const audio = this.audioRefBackground.current;
    if (this.state.isPlayingBackground) {
      audio.pause();
    } else {
      try {
        audio.play()
      } catch { }
    }
    this.setState((prevState) => ({
      isPlayingBackground: !prevState.isPlayingBackground,
    }));
  };

  renderLoading = () => {
    return (
      <div className="loading">
        <PacmanLoader
          color={'green'}
          loading={true}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    )
  }

  renderHomePage = () => {
    return (
      <HomePage
        visible={!this.state.isLogin}
        onChangeUserName={() => this.handleChangeUserName()}
        onChangeRoomId={() => this.handleChangeRoomId()}
        isPlaying={this.state.isPlayingBackground}
        onSoundClick={() => this.playBackgroundSound()}
        onLogin={() => this.handleLogin()}
      ></HomePage>
    )
  }

  renderGamePage = () => {
    return (<>
      <GamePage
        roomId={this.state.roomId}
        userId={this.state.userId}
        players={this.state.players}
        userName={this.state.userName}
        visible={this.state.isLogin}
        onLogout={() => this.handleLogout()}
        isPlaying={this.state.isPlayingBackground}
        onSoundClick={() => this.playBackgroundSound()}
      ></GamePage>

    </>);
  }

  render() {
    return (<>
      <audio
        ref={this.audioRefBackground}
        src="./assets/sound/background.mp3"
      />
      {this.state.isLoading ? this.renderLoading() : this.state.isLogin ? this.renderGamePage() : this.renderHomePage()}
    </>)
  }
}
export default App;
