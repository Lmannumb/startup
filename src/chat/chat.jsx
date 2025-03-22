import React from 'react';
import { useParams } from 'react-router-dom';

export function Chat() {
  const { id: postid } = useParams();

  const [messages, setMessages] = React.useState([]);

  React.useEffect(() => {
    //localStorage.clear();
    //let example = [{cont: "content", ti: "time:00:00", you: false }];
    //localStorage.setItem('messages'+postid, JSON.stringify(example));

    const messageString = localStorage.getItem('messages'+postid);
    if (messageString) {
      console.log("messages: " + messageString);
      setMessages(JSON.parse(messageString));
    }

  }, []);

  const messagearray = [];
  if (messages.length) {
    for (const i of messages) {
      console.log("pushing obj: " + JSON.stringify(i));
      messagearray.push(
        <div className={i.you ? "you" : ""}>{i.cont}</div>
      );
      messagearray.push(
        <div className={"time " + (i.you ? "you" : "")}>{i.ti}</div>
      );
    }
  }

  return (
    <main className="container-fluid bg-secondary text-center">

      <div><h1>Chatting with {postid}</h1></div>
      {messagearray}
      <div><br></br></div>
      <form method="get">
        <div className="input-group mb-3">
          <input className="form-control" type="text" placeholder="message" />
          <button type="submit" className="btn btn-primary" >Send</button>
        </div>
        </form>
      <form>
        <div className="input-group mb-3">
          <select name="offer" id="plant list">
            <option value="">--Select a Plant to Offer--</option>
            <option value="">The offering options will be pulled from the storage database.</option>
            </select>
      </div>
      <button type="submit" className="btn btn-primary" >Add Offer (Javascript and Database required)</button>
      <button type="submit" className="btn btn-primary" >Trade</button>
    </form>
    </main>
  );
}

/*
      <div className="time">Time of message will display like so</div>
      <div>more example chats</div>
      <div className="time">11/20/24 11:30 AM</div>
      <div className="you">yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap</div>
      <div className="time you">11/20/24 11:30 AM</div>


      */