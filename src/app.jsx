import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Shop } from './shop/shop';
import { Garden } from './garden/garden';
import { Trading } from './trading/trading';
import { Home } from './home/home';
import { Notification } from './notification/notification';
import { Chat } from './chat/chat';
import { WebHandler} from "./webhandler.js";
//import { Signedin } from './signedin/signedin';

export default function App() {
  const [username, setUsername] = React.useState(localStorage.getItem('username') || '');
  const [password, setPassword] = React.useState("");

  React.useEffect(()=>{
    if (!localStorage.getItem('userName')) {
      localStorage.setItem('userName','');
    }
    console.log("cookies! " + JSON.stringify(Object.keys(document.cookie)));
    if (Object.keys(document.cookie).indexOf('token') === -1) {
      localStorage.setItem('userName','');
    }
    setUsername(localStorage.getItem('userName'));
  },[]);

  /*React.useEffect(()=>{
    if (username === '') {
      console.log("IT'S HAPPENING");
    }
  });*/

  return (
    <BrowserRouter>
<div className="body bg-dark text-light">
    <header className="container-fluid">
      

      <nav className="navbar fixed-top navbar-dark">
        <a className="navbar-brand" href="#">Idle Garden</a>
        <menu className="navbar-nav">
          <li className="nav-item"><NavLink className='nav-link' to=''>Home</NavLink></li>
          <li className="nav-item"><NavLink className='nav-link' to={username === '' ? 'login' : 'trading'}>Chatting</NavLink></li>
          <li className="nav-item"><NavLink className='nav-link' to={username === '' ? 'login' : 'shop'}>Shop</NavLink></li>
          <li className="nav-item"><NavLink className='nav-link' to={username === '' ? 'login' : 'garden'}>Garden</NavLink></li>
          <li className="nav-item"><NavLink className='nav-link' to='login'>Login</NavLink></li>
        </menu>
      </nav>
    </header>

<Routes>
  <Route path='/' element={<Home />} exact />
  <Route path='/trading' element={<Trading name={username}/>} />
  <Route path='/trading/:id' element={<Chat />} exact />
  <Route path='/shop' element={<Shop userName={username}/>} exact />
  <Route path='/garden' element={<Garden userName={username}/>} exact />
  <Route path='/login' element={<Login 
    userName={username} changeUsername={(str)=>{
      setUsername(str);
    }}/>} exact />
  <Route path='/chat' element={<Chat />} exact />
  <Route path='/chat/:id' element={<Chat />} exact />
  <Route path='/notification/:id' element={<Notification />} exact />
  <Route path='/*' element={<Home />} exact />
</Routes>

    <footer className="text-white-50">
        <div className="container-fluid">
        <span className="text-reset">Leif Nelson</span>
        <a className="text-reset" href="https://github.com/Lmannumb/startup">GitHub link</a>
        </div>
    </footer>
  </div>
  </BrowserRouter>
  );
}
//<Route path='/login/:id' element={<Login />} exact />