import React from 'react';
import ReactDOM from 'react-dom/client';
import { Time } from '/src/time.jsx';
import Button from 'react-bootstrap/Button';

export function Garden({userName: U}) {
  const [plants, updatePlants] = React.useState([]);
  const [timeElapsed, setTime] = React.useState(0);
  const [money, setMoney] = React.useState(0);
  
  async function GetGarden() {
    console.log("GetGarden");
    const response = await fetch('/api/garden', {
      method: 'get',
      //body: JSON.stringify({ email: U}),
      //headers: {
      //  'Content-type': 'application/json; charset=UTF-8',
      //},
    });
    if (response?.status === 200) {
      console.log("response 200 " + response);
      return response;
    } else {
      console.log("error at GetGarden: " + JSON.stringify(await response.json()));
      //setDisplayError(`⚠ Error: ${body.msg}`);
    }
  }

  React.useEffect(()=>{
    //new Time("00:00:00");
    /*localStorage.setItem(U+"garden", JSON.stringify(
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
    const gpromise = GetGarden()
      .then((result)=>result.json())
      .then((result)=>{
        if (result) {
          //result.json();
          console.log('GetGarden promise ' + JSON.stringify(result));
          updatePlants(result.garden);
          setMoney(result.balance);
        } else {
          updatePlants([]);
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
    /*let moneystring = localStorage.getItem(U+'balance');
    if (moneystring !== null) {
    }
    else {
      console.log("setting money to 0");
      moneystring = "0";
      localStorage.setItem(U+'balance', "0");
    }
    console.log("money " + moneystring);
    setMoney(parseInt(moneystring));*/
    /*const gardenString = localStorage.getItem(U+'garden');
    if (gardenString) {
      console.log("plants: " + gardenString);
      updatePlants(JSON.parse(gardenString));
    }*/
    let interval;
    fetch('/api/time', {method:"get"})
    .then((result)=>result.json())
    .then((result)=>{
      console.log("result " + JSON.stringify(result));
      console.log("result " + result["time"]);
      let i = Number(result.time);
      interval = setInterval(() => {
        setTime(++i);
      }, 1000);
    })


    return function cleanup() {
      clearInterval(interval);
    }
  }, []);

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
      console.log(i.timebegan)
      console.log(i.timebought);
      console.log(timeElapsed);
      let outtime = i.timebought+i.timebegan-timeElapsed;
      console.log("outtime " + outtime);
      if (outtime < 0) {
        outtime = 0;
        f = true;
      }
      outtime = Time.TimeToString(Time.NumToTime(outtime));

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
            const item = plants[index].item;
            fetch('/api/garden', {
              method: "get"
            })
            .then((result)=>result.json())
            .then((result)=>{
              console.log("result " + JSON.stringify(result));
              //let newg = [];
              //for (const i of result)
              const g = result.garden
              g.splice(g.indexOf(item), 1);
              console.log("g " + JSON.stringify(g));
              result.garden = g;
              updatePlants(g);
              result.balance = result.balance + plants[index].worth;
              setMoney(result.balance);
              console.log("result " + JSON.stringify(result));
              fetch('/api/garden', {
                method: "post",
                body: JSON.stringify(result),
                headers: {
                  'Content-type': 'application/json; charset=UTF-8',
                },
              })
              .then((result)=>result.json())
              .then((result)=>{
                console.log("result " + JSON.stringify(result));
              });
              setMoney(result.balance);
            })
            .catch((err) => console.log(`Error: ${err}`))
            .finally(() => {

            });
            console.log("buy " + index);
            /*localStorage.setItem(U+'balance', money + plants[index].worth);
            setMoney(money + plants[index].worth);
            plants.splice(index, 1);
            localStorage.setItem(U+'garden', JSON.stringify(plants));
            updatePlants(JSON.parse(localStorage.getItem(U+'garden')));*/
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