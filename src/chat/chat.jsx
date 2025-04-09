import React from 'react';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';

export function Chat({ websocket}) {
  const { id: postid } = useParams();

  const [messages, updateMessages] = React.useState([]);
  const [trades, setTrades] = React.useState([]);
  const [message, formUpdate] = React.useState("");
  const [gardenarray, setGarden] = React.useState([]);
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  Reach.useEffect(()=>{
    
  }, [websocket]);

  function UpdateMessages(value) {
    updateMessages(value);
  }

  function UpdateForm(value) {
    console.log(value);
    formUpdate(value);
  }

  async function AddTrade() {
    trades.push(
      {
        value: "-"
      }
    );
    console.log("trades: " + JSON.stringify(trades));

    //localStorage.setItem('messages'+postid, JSON.stringify(messages));
    //setMessages(messages);
    //formUpdate("");
    forceUpdate();
  }

  async function SendTrade() {
    var offer = [];
    console.log(JSON.stringify(trades));
    for (const i of trades) {
      console.log("offer: " + JSON.stringify(i));
      if (i.value !== "-") {
        offer.push(i);
      }
    }
    var item = {
      cont: "Trade",
      offers: offer,
      expired: false,
      ti: "10:20 AM",
      you: true
    };
    sendMessage(item
      //, messageRef, UpdateMessages
      );
  }

  function sendMessage(obj) {
    //console.log("cmo " + JSON.stringify(messages));
    messages.push(obj);
    UpdateMessages(messages)
    //console.log("cmon " + JSON.stringify(messages));
    fetch('/api/trade', { method: "get"})
    .then((result)=>{
      console.log(result);
      return result.json();}
    )
    .then((result)=> {
      console.log("result " + result);
      console.log("result " + JSON.stringify(result));
      if (result) {
        //console.log(JSON.stringify(messages));
        /*
        for (const i of messages) {
          result.push(i)
        }
        console.log("post result " + JSON.stringify(result));*/
        fetch('/api/trade', {
          method: 'post',
          body: JSON.stringify({"messages":messages}),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
      } else {
        console.log("post null result " + JSON.stringify(messages));
        fetch('/api/trade', {
          method: 'post',
          body: JSON.stringify({"messages":messages}),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
      }
    })
      .catch((err) => console.log(`Error: ${err}`))
      .finally(() => {
        forceUpdate();
      });
    /*console.log("sending: " + JSON.stringify(array));
    localStorage.setItem('messages'+postid, JSON.stringify(array));
    forceUpdate();*/
  }

  function sendEntry() {
    const obj = 
    {
      cont: message,
      ti: "10:20 AM",
      //The time will be set when I set up the third party call
      you: true
    };
    sendMessage(obj
      //, messageRef, UpdateMessages
      );
    //setMessages(messages);
    formUpdate("");
  }

  React.useEffect(() => {
    let interval = undefined;
    fetch('/api/chat', {
      method: "post",
      body: JSON.stringify({ "postid": postid}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    .then((result)=>{
      fetch("/api/trade", {
        method: "get",
      })
      .then((result)=>result.json())
      .then((result)=> {
        console.log(JSON.stringify(result));
        const p = async () => UpdateMessages(result);
        p();
      });
    });

    /*interval = setInterval(function () {
      console.log("interval!");
      sendMessage({cont: "hey!", ti: "10:20 AM", you: false}
        //, messageRef, UpdateMessages
      );
    }, 30000);*/

    fetch('/api/garden', {
      method: 'get',
    })
    .then((result)=>result.json())
      .then((result)=>{
        if (result) {
          //result.json();
          console.log('chat garden promise ' + JSON.stringify(result));
          const g = result.garden.map((t, i)=>{t["value"] = i; return t;});
          setGarden(g);
        } else {
          setGarden([]);
        }
        //if ()
      })
      .catch((err) => console.log(`Error: ${err}`))
      .finally(() => {

      });
    
    return function cleanup() {
      clearInterval(interval);
      fetch('/api/chat', {
        method: "delete"
      });
    }
  }, []);

  const optionarray = [];
  for (const k of gardenarray) {
    var d = false;
    //console.log("k.value " + k.value);
    for (const j of trades) {
      //console.log("j.value " + j.value);
      if (j.value === k.value) {
        d = true;
        break;
      }
    }
    var item = <option value={k.value} disabled={d}>{k.name}</option>;

    optionarray.push(
      item
    );
  }
  const messagearray = [];
  if (messages.length) {
    //console.log("messages? " + JSON.stringify(messages));
    for (const i of messages) {
      if (!("offers" in i)) {
        //console.log("pushing message: " + JSON.stringify(i));
        messagearray.push(
          <div className={i.you ? "you" : ""}>{i.cont}</div>
        );
        /*messagearray.push(
          <div className={"time " + (i.you ? "you" : "")}>{i.ti}</div>
        );*/
      }
      else {
        messagearray.push(
          <div className={i.you ? "you" : ""}>{i.cont}</div>
        );

        for (const j of i.offers) {
          var obj = {value: "-", name: "Could not find that plant!"};
          //console.log("j.value " + j.value + " " + typeof(j.value));
          for (const k of gardenarray) {
            //console.log("k.value " + typeof(k.value) + " " + k.value + " " + JSON.stringify(k));
            if (Number(j.value) === Number(k.value)) {
              obj = k;
              //console.log("LES GOOOOO" + JSON.stringify(obj));
              break;
            }
          }
          messagearray.push(
            <div className={i.you ? "you" : ""}>{obj.name}</div>
          );
        }
        /*
        messagearray.push(
          <div className={"time " + (i.you ? "you" : "")}>{i.ti}</div>
        );*/
      }
    }
  }
  const tradearray = [];
  if (trades.length) {
    var j = 0;
    for (const i of trades) {
      
      console.log("pushing trade: " + JSON.stringify(i));
      var rem = function() {
        const index = j.valueOf();
        return () => {
        trades.splice(index, 1);
        console.log("splice: " + index);
        forceUpdate();
        }
      };
      var onchange = function(a) {
        const index = j.valueOf();
        return () => {
          console.log("onchange: " + index);
          const p = document.getElementById("plantlist"+index);
          trades[index] = {value: p.value};
          //this.value = trades[index].value;

          forceUpdate();
        }
      };
      var def = { label: "--Select a Plant to Offer--", value: "-"};
      tradearray.push(
        <div className="input-group mb-3">
          <select value={i.value} name={"offer"+j} id={"plantlist"+j} onChange={onchange()}>
            <option value={"-"}>--Select a Plant to Offer--</option>
            {optionarray}
            </select>
            <Button variant="primary" onClick={rem()}
            >Remove</Button>
        </div>
      );
      j++;
    }
  }
  

  return (
    <main className="container-fluid bg-secondary text-center">

      <div><h1>Chatting with {postid}</h1></div>
      {messagearray}
      <div><br></br></div>
        <div className="input-group mb-3">
        <input className="form-control" type="text" placeholder="message" onChange={(e) => UpdateForm(e.target.value)}/>
          <Button variant="primary"  
            onClick={() => sendEntry()} disabled={message === ""}>Send</Button>
        </div>
        <div className="input-group mb-3">
          {tradearray}
      </div>
      <Button variant="primary" onClick={()=>AddTrade()}>Add Offer</Button>
      <Button variant="primary" onClick={()=>SendTrade()}>Trade</Button>
    </main>
  );
}

/*
      <div className="time">Time of message will display like so</div>
      <div>more example chats</div>
      <div className="time">11/20/24 11:30 AM</div>
      <div className="you">yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap</div>
      <div className="time you">11/20/24 11:30 AM</div>
      <Button variant="primary" >Remove Offer</Button>


      */