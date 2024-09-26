import React, { Component } from 'react';

class ChatRoom extends Component {  
  render() {
    const {
      message,
      messages, 
      onSendMessage, 
      onChangeMessage,
      onMicClick,
      onMic,
    } = this.props
    return (
      <div className='chatRoom'>
        <div className='boxMessages' >
          {messages&&(messages.map((msg, index) => (
            <div key={index}><b>{msg.name+": "}</b> {msg.message}</div>
          )))}
        </div>
        <div className='inputChatForm'>
        <button
          onClick={onMicClick}
        ><i class={onMic?"bi bi-mic":"bi bi-mic-mute"}></i></button>
          <input
            type="text"
            onChange={onChangeMessage()}
            id='chatInput'
            placeholder='Chat...'
            value={message}
          />
          <button id='chatButton' onClick={onSendMessage}>Send</button>

        </div>
      </div>
    );
  }
}

export default ChatRoom;