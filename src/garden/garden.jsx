import React from 'react';
import ReactDOM from 'react-dom/client';
import { Time } from '/src/time.jsx';
import Button from 'react-bootstrap/Button';

export function Garden() {
  const [plants, updatePlants] = React.useState([]);
  const [timeElapsed, setTime] = React.useState(0);
  const [money, setMoney] = React.useState(0);
  
  React.useEffect(()=>{
    new Time("00:00:00");
    /*localStorage.setItem("username"+"garden", JSON.stringify(
      [{
        value: "0",
        name: "Basic Plant",
        image: "exampleplant.png",
        timebegan: "0:13:45",
        worth: "$10"
      },
      {
        value: "1",
        name: "Basic Plant",
        image: "exampleplant.png",
        timebegan: "0:13:45",
        worth: "$10"
      }]
    ));*/
    let moneystring = localStorage.getItem('username'+'balance');
    if (moneystring !== null) {
    }
    else {
      console.log("setting money to 0");
      moneystring = "0";
      localStorage.setItem('username'+'balance', "0");
    }
    console.log("money " + moneystring);
    setMoney(parseInt(moneystring));
    const gardenString = localStorage.getItem('username'+'garden');
    if (gardenString) {
      console.log("plants: " + gardenString);
      updatePlants(JSON.parse(gardenString));
    }
    let i = timeElapsed;
    const interval = setInterval(() => {
      
      setTime(++i);
    }, 1000);


    return function cleanup() {
      clearInterval(interval);
    }
  }, []);

  function newTime(time) {
    var t = Time.StringToTime(time);

  }

  const gardenarray = [];
  if (plants.length) {
    for (const i of plants) {
      console.log("pushing plant: " + JSON.stringify(i));
      gardenarray.push(
        <div><h3>
            {i.name}
          </h3></div>
      );
      gardenarray.push(
        <div>
            <img src={i.image} alt="insert plant image here"></img>
        </div>
      );
      let f = false;
      let outtime = Time.TimeToString(Time.Arithmatic(i.timebegan, -timeElapsed));
      if (!Time.Comparison(outtime, 0)) {
        outtime = "0:00:00";
        f = true;
      }
      gardenarray.push(
        <div>Time remaining: {outtime}</div>
      );
      gardenarray.push(
        <div>Worth: {i.worth}</div>
      )
      if (f) {
        const redeem = function () {
          let index = plants.indexOf(i);
          return () => {
            localStorage.setItem('username'+'balance', money + plants[index].worth);
            setMoney(money + plants[index].worth);
            plants.splice(index, 1);
            localStorage.setItem('username'+'garden', JSON.stringify(plants));
            updatePlants(JSON.parse(localStorage.getItem('username'+'garden')));
          };
        };
        gardenarray.push(
          <Button variant="primary" onClick={redeem()}>Sell</Button>
        );
      }
    }
  }

    return (
        <main className="container-fluid bg-secondary text-center">
          <h1>Balance: ${money}</h1>
          {gardenarray}
      </main>
    );
}