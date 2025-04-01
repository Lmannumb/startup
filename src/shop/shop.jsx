import React from 'react';
import Button from 'react-bootstrap/Button';
import plant from '/exampleplant.png';

export function Shop() {
  const [sales, setSales] = React.useState([]);

  React.useEffect(()=>{
    localStorage.setItem("shop", JSON.stringify([{
      cost: 98,
      worth: 800,
      name: "Basic Plant",
      image: plant,
      time: "2:00:00"
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
          const item = sales[index];
          sales.splice(index, 1);
          const a = JSON.parse(localStorage.getItem("username"+"garden"));
          a.push(item);
          localStorage.setItem("username"+"garden", JSON.stringify(a));
        }
      }
      shoparray.push(
        <div><h3>{i.name}</h3></div>
      );
      shoparray.push(
        <div><img src={i.image} alt="plant for sale did not load!"></img></div>
      );
      shoparray.push(
        <div>{"Seed Cost: $"+i.cost}</div>
      );
      shoparray.push(
        <div>{"Plant Worth: $"+i.worth}</div>
      );
      shoparray.push(
        <div>{"Grow Time: "+i.time}</div>
      );
      shoparray.push(
        <Button variant="primary" onClick={buy()}>Buy</Button>
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