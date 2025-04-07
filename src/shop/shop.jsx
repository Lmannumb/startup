import React from 'react';
import Button from 'react-bootstrap/Button';
import plant from '/exampleplant.png';
import { Time } from '/src/time.jsx';

export function Shop({userName: U}) {
  const [sales, setSales] = React.useState([]);
  const [, forceUpdate] = React.useReducer(x => x + 1, 0)
  const [token, setToken] = React.useState("");
  const [balance, setBalance] = React.useState(0);

  React.useEffect(()=>{
    const p = async ()=>{
      const response = await fetch('/api/shop', {
        method: 'get',
      });
      if (response?.status === 200) {
        console.log("response 200 " + response);
        return response;
      } else {
        console.log("error at GetShop: " + JSON.stringify(await response.json()));
        //setDisplayError(`⚠ Error: ${body.msg}`);
      }
    };
    p()
    .then((result)=>result.json())
    .then((result)=>{
      console.log(result);
      if (result) {
        //let j = result.json();
        console.log('GetShop promise ' + result);
        setSales(result);
      } else {
        setSales([]);
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

    console.log("GetGarden");
    fetch('/api/garden', {
      method: 'get',
    })
    .then((result)=>result.json())
    .then((result)=>{
      if (result) {
        //result.json();
        //console.log('GetGarden promise ' + JSON.stringify(result));
        //console.log('GetGarden promise ' + result.balance);
        setBalance(0 + result["balance"]);
      } else {
        setBalance(0);
        /*fetch('/api/garden', {
          method: 'post',
          body: JSON.stringify({ email: U}),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });*/
      }
      //if ()
    })
    .catch((err) => console.log(`Error: ${err}`))
    .finally(() => {
      //console.log(balance);
    });
  },[]);

  const shoparray = [];
  if (sales.length) {
    for (const i of sales) {
      console.log("pushing offer: " + JSON.stringify(i));
      function buy() {
        const index = sales.indexOf(i);
        return function () {
          const item = sales[index].item;
          fetch('/api/time', {method:"get"})
          .then((result)=>result.json())
          .then((result)=>{
            console.log("timebought " + result);
            console.log("timebought " + JSON.stringify(result));
            console.log("timebought " + Number(result));
            item["timebought"] = Number(result.time);
          fetch('/api/shop', {
              method: 'post',
              body: JSON.stringify({ "index": index, count: 1}),
              headers: {
                'Content-type': 'application/json; charset=UTF-8',
              }
            });
          sales[index].buys = sales[index].buys + 1;
          fetch('/api/garden', {
            method: "get"
          })
          .then((result)=>result.json())
          .then((result)=>{
            console.log("result " + JSON.stringify(result));
            //let newg = [];
            //for (const i of result)
            let g = result.garden;
            if (typeof(g) === 'string') {
              g = JSON.parse(g);
            }
            g.push(item);
            console.log("g " + JSON.stringify(g));
            result.garden = g;
            result.balance = result.balance - sales[index].cost
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
            setBalance(result.balance);
          })
          .catch((err) => console.log(`Error: ${err}`))
          .finally(() => {

          });
          /*sales[index].available = sales[index].available-1;
          let astr = localStorage.getItem(U+"garden");
          if (!astr) {
            localStorage.setItem(U+'garden', "[]");
            astr = "[]";
          }
          const a = JSON.parse(astr);
          a.push(item);
          localStorage.setItem(U+"garden", JSON.stringify(a));
          setSales(sales);*/
          console.log("buy " + index);
          forceUpdate();
        });
        }
      }
      const b = i.available > i.buys && i.cost <= balance;
      shoparray.push(
        <div><h3 className={b ? "" : "bought"}>{i.item.name}</h3></div>
      );
      shoparray.push(
        <div><img src={i.item.image} alt="plant for sale did not load!"></img></div>
      );
      shoparray.push(
        <div className={b ? "" : "bought"}>{"Seed Cost: $"+i.cost}</div>
      );
      shoparray.push(
        <div className={b ? "" : "bought"}>{"Plant Worth: $"+i.item.worth}</div>
      );
      shoparray.push(
        <div className={b ? "" : "bought"}>{"Grow Time: "+Time.TimeToString(Time.NumToTime(i.item.timebegan))}</div>
      );
      shoparray.push(
        <div className={b ? "" : "bought"}>{"In Stock: "+(i.available-i.buys)}</div>
      );
      shoparray.push(
        <Button variant="primary" disabled={!b} onClick={buy()}>Buy</Button>
      );
    }
  }

  return (
    <main className="container-fluid bg-secondary text-center">
      <h1>Balance: ${balance}</h1>
      {shoparray}
      </main>
  );
}