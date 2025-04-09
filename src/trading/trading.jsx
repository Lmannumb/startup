import React from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { WebHandler } from '/src/WebHandler.js';

export function Trading({userName}) {
  const [message, setMessage] = React.useState("");
  const [history, setHistory] = React.useState([]);
  const [online, setOnline] = React.useState([]);
  //const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  const websocket = new WebHandler();

  React.useEffect(() => {
    websocket.addObserver((chat) => {
      setHistory((prevMessages) => [...prevMessages, chat]);
    });
  }, [websocket]);

  React.useEffect(()=>{
    fetch('/api/trades', {method:"get"})
    .then((result)=>result.json())
    .then((result)=>{
      console.log("trades result: " + result);
      console.log("trades result: " + JSON.stringify(result));
      setHistory(result.messages);
    })
  }, []);

  function sendCookie() {
    fetch('/api/chat', {
      method: "post",
      body: JSON.stringify({"postid": message}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
  }
  
  //console.log(message);

  const historyarray = [];
  for (const i of history) {
    historyarray.push((
      <div><Link to={i.recipient}>{i.recipient}</Link></div>
    ));
  }
  

  return (
    <main className="container-fluid bg-secondary text-center">
        <div><h1>Online</h1></div>
        <div><h1>Messages</h1></div>
        {historyarray}
        <div><h1>Message</h1></div>
          <div className="input-group mb-3">
            <input className="form-control" type="text" placeholder="username" onChange={(e) => setMessage(e.target.value)}/>
          </div>
          <Button variant="primary"
            disabled={message === ""} onClick={()=>{websocket.sendMessage(userName, message)}}>Send</Button>
            
      </main>
  );
}

/* 
        <div><Link to="BlueCat11">BlueCat11</Link></div>
        <div><Link to="MoeLester">MoeLester</Link></div>
        <div><Link to="barrykikokineer">barrymikokinner</Link></div>
        <div><Link to="darkman42069">darkman42069</Link></div>*/