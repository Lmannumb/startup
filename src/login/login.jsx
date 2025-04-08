import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';

export function Login({userName: U, changeUsername}) {
  console.log(U);
  const [userName, setUserName] = React.useState(U);
  const [password, setPassword] = React.useState('');
  const [imglink, setImage] = React.useState('');

  async function GetCatImage() {
    const response = await fetch("https://api.thecatapi.com/v1/images/search", {
      method: "get",
      headers: {
        "x-api-key": "live_jDCbGiIRgWL1WA8jN8DKZtCbMRfte6A8OGdxqECYdExKMK086qoZ3wY388XE4w6t",
        "Access-Control-Allow-Origin": "*"
      }
    });
    if (response?.status === 200) {
      console.log("response 200 " + response);
      return response;
    } else {
      console.log("error at GetCatImage: " + JSON.stringify(await response.json()));
      //setDisplayError(`⚠ Error: ${body.msg}`);
    }
  }

  React.useEffect(()=> {
    GetCatImage()
    .then((result)=>result.json())
    .then((result)=>{
      console.log("GetCatImage " + JSON.stringify(result));
      console.log("GetCatImage " + result[0].url);
      setImage(result[0].url);
    })
    .catch((err) => console.log(`Error: ${err}`))
    .finally(() => {
    });
  },[]);

  async function Login() {
    loginOrCreate("api/auth/login");
  }

  async function Register() {
    loginOrCreate("api/auth/create");
  }

  function Logout() {
    fetch(`/api/auth/logout`, {
      method: 'delete',
    })
      .catch(() => {
        changeUsername(undefined);
        localStorage.removeItem('userName');
      })
      .finally(() => {
        changeUsername(undefined);
        localStorage.removeItem('userName');
      });
    changeUsername(undefined);
    localStorage.removeItem('userName');
  }

  async function loginOrCreate(endpoint) {
    const response = await fetch(endpoint, {
      method: 'post',
      body: JSON.stringify({ email: userName, password: password }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      localStorage.setItem('userName', userName);
      changeUsername(userName);
    } else {
      const body = await response.json();
      //setDisplayError(`⚠ Error: ${body.msg}`);
    }
  }

  return (
    <main className="container-fluid bg-secondary text-center">
      {U === "" | U === undefined ?
        (<div><h2>Login or Register to Idle Garden</h2>
        
          <div className="input-group mb-3">
            <input className="form-control" type="text" placeholder="username" 
              onChange={(e) => setUserName(e.target.value)}/>
          </div>
          <div className="input-group mb-3">
            <input className="form-control" type="password" placeholder="password" 
              onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <button type="submit" className="btn btn-primary" onClick={()=>Login()}>Login</button>
          <button type="submit" className="btn btn-secondary" onClick={()=>Register()}>Register</button></div>)
 : (<div>
      <h1>Welcome {U}</h1>
     <div>
         <Button variant="primary" onClick={()=>{Logout();}}>Sign Out</Button>
     </div>
     <div><br></br>
      <img src={imglink} alt="image not found"  />
     </div>
   </div>)
  }
  </main>
  );
}
//<h2>Notifications</h2>
//<div><Link to="/notification/unimplemented">New messages!</Link> <span class="time">11/20/24 11:30 AM</span></div>
//<Signedin username={U} changeUsername={changeUsername}></Signedin>}</main>
/* */