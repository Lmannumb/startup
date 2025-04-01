import React from 'react';
import ReactDOM from 'react-dom/client';

export function Garden() {
  const [plants, updatePlants] = React.useState([]);
  
  React.useEffect(()=>{
    localStorage.setItem("username"+"garden", JSON.stringify(
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
    ));
    const gardenString = localStorage.getItem('username'+'garden');
    if (gardenString) {
      console.log("plants: " + gardenString);
      updatePlants(JSON.parse(gardenString));
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
      gardenarray.push(
        <div>Time remaining: {i.timebegan}</div>
      );
      gardenarray.push(
        <div>Worth: {i.worth}</div>
      )
    }
  }

    return (
        <main className="container-fluid bg-secondary text-center">
          {gardenarray}
      </main>
    );
}