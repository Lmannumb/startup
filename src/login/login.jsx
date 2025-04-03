import React, { useEffect } from 'react';
import { Signedin } from './signedin.jsx';

export function Login({userName: U, changeUsername}) {
  const [userName, setUserName] = React.useState(U);
  const [password, setPassword] = React.useState('');
  return (
    <main className="container-fluid bg-secondary text-center">
      {userName === "" ?
        (<div><h2>Login or Register to Idle Garden</h2>
        
          <div className="input-group mb-3">
            <input className="form-control" type="text" placeholder="username" 
              onChange={(e) => setUserName(e.target.value)}/>
          </div>
          <div className="input-group mb-3">
            <input className="form-control" type="password" placeholder="password" />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
          <button type="submit" className="btn btn-secondary">Register</button></div>)
 : <Signedin username={U} changeUsername={changeUsername}></Signedin>}</main>
  );
}