import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';

export function Login({userName: U, changeUsername}) {
  console.log(U);
  const [userName, setUserName] = React.useState(U);
  const [password, setPassword] = React.useState('');

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
        // Logout failed. Assuming offline
      })
      .finally(() => {
        localStorage.removeItem('userName');
        props.onLogout();
      });
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
      props.onLogin(userName);
    } else {
      const body = await response.json();
      setDisplayError(`⚠ Error: ${body.msg}`);
    }
  }

  return (
    <main className="container-fluid bg-secondary text-center">
      {U === "" ?
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
   </div>)
  }
  </main>
  );
}
//<h2>Notifications</h2>
//<div><Link to="/notification/unimplemented">New messages!</Link> <span class="time">11/20/24 11:30 AM</span></div>
//<Signedin username={U} changeUsername={changeUsername}></Signedin>}</main>