import React from 'react';
import Button from 'react-bootstrap/Button';
import plant from '/exampleplant.png';

export function Shop() {
  const [sales, setSales] = React.useState([]);
  const [, forceUpdate] = React.useReducer(x => x + 1, 0)

  React.useEffect(()=>{
    localStorage.setItem("shop", JSON.stringify([{
      item: {
        cost: 98,
        worth: 800,
        name: "Basic Plant",
        image: plant,
        timebegan: "0:00:15"
      },
      available: 1
    }]));
    
    const shopString = localStorage.getItem('shop');
    if (shopString) {
      console.log("offers: " + shopString);
      setSales(JSON.parse(shopString));
    }
  },[]);

  const shoparray = [];
  if (sales.length) {
    var j = 0;
    for (const i of sales) {
      console.log("pushing offer: " + JSON.stringify(i));
      function buy() {
        const index = j;
        return function () {
          const item = sales[index].item;
          sales[index].available = sales[index].available-1;
          const a = JSON.parse(localStorage.getItem("username"+"garden"));
          a.push(item);
          localStorage.setItem("username"+"garden", JSON.stringify(a));
          setSales(sales);
          console.log("buy " + index);
          forceUpdate();
        }
      }
      shoparray.push(
        <div><h3 className={i.available ? "" : "bought"}>{i.item.name}</h3></div>
      );
      shoparray.push(
        <div><img src={i.item.image} alt="plant for sale did not load!"></img></div>
      );
      shoparray.push(
        <div className={i.available ? "" : "bought"}>{"Seed Cost: $"+i.item.cost}</div>
      );
      shoparray.push(
        <div className={i.available ? "" : "bought"}>{"Plant Worth: $"+i.item.worth}</div>
      );
      shoparray.push(
        <div className={i.available ? "" : "bought"}>{"Grow Time: "+i.item.timebegan}</div>
      );
      //style={i.available ? {} : {color : "gray"}}
      shoparray.push(
        <Button variant="primary" disabled={!i.available} onClick={buy()}>Buy</Button>
      );
      j++;
    }
  }

  return (
    <main className="container-fluid bg-secondary text-center">
      {shoparray}
      </main>
  );
}