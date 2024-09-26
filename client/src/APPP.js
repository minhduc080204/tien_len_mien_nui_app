import React, { useState, useEffect } from 'react';

const App = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState([]);

  const sendMessage = () => {
    window.api.sendTCP(message);
    setMessage("")
    console.log(response);
    
  };

  useEffect(() => {
    window.api.onTCPData((data) => {
      setResponse((prevResponse) => [...prevResponse, data]);
      console.log("reviced "+data);
      
    });
  }, []);

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <div>
        <h3>Response:</h3>
        {response.map((data, index)=>{
          return(<p key={index}>{data}</p>)
        })}
      </div>
    </div>
  );
};

export default App;
