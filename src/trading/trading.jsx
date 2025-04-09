import React from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

export function Trading() {
  const [goto, setGoto] = React.useState("");

  React.useEffect(()=>{

  }, []);

  function sendCookie() {
    fetch('/api/chat', {
      method: "post",
      body: JSON.stringify({"postid": goto}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
  }
  
  console.log(goto);

  return (
    <main className="container-fluid bg-secondary text-center">
        <div><h1>Trade History</h1></div>
        <div><Link to="MoeLester">MoeLester</Link></div>
        <div><Link to="barrykikokineer">barrymikokinner</Link></div>
        <div><Link to="darkman42069">darkman42069</Link></div>
        <div><h1>Online</h1></div>
        <div><Link to="BlueCat11">BlueCat11</Link></div>
        <div><h1>Direct Connect</h1></div>
          <div className="input-group mb-3">
            <input className="form-control" type="text" placeholder="username" onChange={(e) => setGoto(e.target.value)}/>
          </div>
          <Link to={"/trading/" + goto}><Button variant="primary"  
            disabled={goto === ""}>Send</Button></Link>
            
      </main>
  );
}