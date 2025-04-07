import React from 'react';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';

export function Chat() {
  const { id: postid } = useParams();

  const [messages, updateMessages] = React.useState([]);
  const [trades, setTrades] = React.useState([]);
  const [message, formUpdate] = React.useState("");
  const [gardenarray, setGarden] = React.useState([]);
  const [, forceUpdate] = React.useReducer(x => x + 1, 0)

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
      //The time will be set when I set up the third party call
      you: true
    };
    sendMessage(item, messages);
  }

  function sendMessage(obj, array) {
    array.push(obj);
    console.log("cmon");
    fetch('/api/trade', { method: "get"})
    .then((result)=>result.json())
    .then((result)=> {
      console.log("result " + result);
      if (result) {
        console.log(JSON.stringify(result));
        for (const i of messages) {
          result.push(i)
        }
        console.log("post result " + JSON.stringify(result));
        fetch('/api/trade', {
          method: 'post',
          body: JSON.stringify({"messages":result}),
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
    sendMessage(obj, messages);
    //setMessages(messages);
    formUpdate("");
  }

  React.useEffect(() => {
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
        updateMessages(result);
      });
    });

    const interval = setInterval(() => {
      console.log("interval!");
      sendMessage({cont: "hey!", ti: "10:20 AM", you: false}, messages);
    }, 30000);

    fetch('/api/garden', {
      method: 'get',
      //body: JSON.stringify({ email: U}),
      //headers: {
      //  'Content-type': 'application/json; charset=UTF-8',
      //},
    })
    .then((result)=>result.json())
      .then((result)=>{
        if (result) {
          //result.json();
          console.log('chat garden promise ' + JSON.stringify(result));
          setGarden(result.garden);
        } else {
          setGarden([]);
          fetch('/api/garden', {
            method: 'post',
            body: JSON.stringify({ email: U}),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          });
        }
        //if ()
      })
      .catch((err) => console.log(`Error: ${err}`))
      .finally(() => {

      });

    /*const gardenString = localStorage.getItem('username'+'garden');
    if (gardenString) {
      optionarray.splice(0, optionarray.length);
      
      //console.log("options: " + gardenString);  selected={i.value === "-"} selected={k.value === i.value}
      //optionarray.push(
      //);
      setGarden(JSON.parse(gardenString));
    }*/
    
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
    for (const j of trades) {
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
    console.log("messages? " + JSON.stringify(messages));
    for (const i of messages) {
      if (!("offers" in i)) {
        console.log("pushing message: " + JSON.stringify(i));
        messagearray.push(
          <div className={i.you ? "you" : ""}>{i.cont}</div>
        );
        messagearray.push(
          <div className={"time " + (i.you ? "you" : "")}>{i.ti}</div>
        );
      }
      else {
        messagearray.push(
          <div className={i.you ? "you" : ""}>{i.cont}</div>
        );

        for (const j of i.offers) {
          var obj = {value: "-", name: "Could not find that plant!"};
          for (const k of gardenarray) {
            if (j.value === k.value) {
              obj = k;
            }
          }
          messagearray.push(
            <div className={i.you ? "you" : ""}>{obj.name}</div>
          );
        }
        messagearray.push(
          <div className={"time " + (i.you ? "you" : "")}>{i.ti}</div>
        );
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