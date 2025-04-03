import React, { useEffect } from 'react';
import Button from 'react-bootstrap/Button';

export function Login({userName: U, changeUsername}) {
  console.log(U);
  const [userName, setUserName] = React.useState(U);
  const [password, setPassword] = React.useState('');

  async function Login() {
    localStorage.setItem('username', userName);
    changeUsername(userName);
  }

  async function Register() {
    localStorage.setItem('username', userName);
    changeUsername(userName);
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
         <Button variant="primary" onClick={()=>{localStorage.setItem("username", '');setUserName("");changeUsername("");}}>Sign Out</Button>
     </div>
   </div>)
  }
  </main>
  );
}
//<h2>Notifications</h2>
//<div><Link to="/notification/unimplemented">New messages!</Link> <span class="time">11/20/24 11:30 AM</span></div>
//<Signedin username={U} changeUsername={changeUsername}></Signedin>}</main>