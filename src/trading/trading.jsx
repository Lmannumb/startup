import React from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { WebHandler } from '/src/WebHandler.js';

export function Trading({userName, websocket}) {
  const [message, setMessage] = React.useState("");
  const [history, setHistory] = React.useState([]);
  const [online, setOnline] = React.useState([]);

  React.useEffect(()=>{
    
    fetch('/api/clients', {
      method:"post",
      body: JSON.stringify({name:userName}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    
    fetch('/api/chat', {
      method: "post",
      body: JSON.stringify({postid:userName}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });

    return function cleanup() {
      fetch('/api/clients', {
        method:"delete",
        credentials: 'same-origin',});
    }
  }, [websocket]);

  React.useEffect(() => {
    websocket.addObserver((chat) => {
      setHistory((prevMessages) => [...prevMessages, chat]);
    });
    websocket.name = userName;
    fetch('/api/clients', {method:"get"})
    .then((result)=>result.json())
    .then((result)=>{
      console.log("onliners: " + JSON.stringify(result));
      setOnline(result);
    })
  }, [websocket]);

  const historyarray = [];
  for (const i of history) {
    console.log("event: " + i.event);
    if (i.event === 'system') {
      historyarray.push(
      <div>Communication {i.msg}</div>);
    }
    else {
      historyarray.push((
        <div>{i.from}: {i.msg}</div>
      ));
    }
  }
  
  const observerarray = [];
  for (const i of online) {
    console.log(online.length)
    console.log("balls on my face " + i);
    observerarray.push(
      <div>{i}</div>
    );
  }

  return (
    <main className="container-fluid bg-secondary text-center">
        <div><h1>Messages</h1></div>
        {historyarray}
        <div><h1>Message</h1></div>
          <div className="input-group mb-3">
            <input className="form-control" type="text" placeholder="message" onChange={(e) => setMessage(e.target.value)}/>
          </div>
          <Button variant="primary"
            disabled={message === ""} onClick={()=>{websocket.sendMessage(userName, message)}}>Send</Button>
            
      </main>
  );
}

/* 

        <div><h1>Online</h1></div>
        {observerarray}
<Link to={i.recipient}>{i.recipient}</Link>
        <div><Link to="BlueCat11">BlueCat11</Link></div>
        <div><Link to="MoeLester">MoeLester</Link></div>
        <div><Link to="barrykikokineer">barrymikokinner</Link></div>
        <div><Link to="darkman42069">darkman42069</Link></div>*/