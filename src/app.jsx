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

export default function App() {
  return (
    <BrowserRouter>
<div className="body bg-dark text-light">
    <header className="container-fluid">
      

      <nav className="navbar fixed-top navbar-dark">
        <a className="navbar-brand" href="#">Idle Garden</a>
        <menu className="navbar-nav">
          <li className="nav-item"><NavLink className='nav-link' to=''>Home</NavLink></li>
          <li className="nav-item"><NavLink className='nav-link' to='trading'>Trading</NavLink></li>
          <li className="nav-item"><NavLink className='nav-link' to='shop'>Shop</NavLink></li>
          <li className="nav-item"><NavLink className='nav-link' to='garden'>Garden</NavLink></li>
          <li className="nav-item"><NavLink className='nav-link' to='login'>Login</NavLink></li>
        </menu>
      </nav>
    </header>

<Routes>
  <Route path='/' element={<Home />} exact />
  <Route path='/trading' element={<Trading />} />
  <Route path='/shop' element={<Shop />} exact />
  <Route path='/garden' element={<Garden />} exact />
  <Route path='/login' element={<Login />} exact />
  <Route path='/chat' element={<Chat />} exact />
  <Route path='/notification' element={<Notification />} exact />
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