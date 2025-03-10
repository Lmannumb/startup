import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from "react-router-dom";
import "./index.css";
//import { Home } from "./index.html";
//import { Garden } from "./garden.jsx";

function Header() {
    return (
    <header className="container-fluid">
      <nav className="navbar fixed-top navbar-dark">
        <a className="navbar-brand" href="#">Idle Garden</a>
        <menu className="navbar-nav">
          <li className="nav-item"><a className="nav-link active" href="index.html">Home</a></li>
          <li className="nav-item"><a className="nav-link" href="trading.html">Trading</a></li>
          <li className="nav-item"><a className="nav-link" href="shop.html">Shop</a></li>
          <li className="nav-item"><a className="nav-link" href="garden.html">Garden</a></li>
          <li className="nav-item"><a className="nav-link" href="account.html">Login</a></li>
        </menu>
      </nav>
    </header>

    );
}

function App() {

  return (
    <>
    <Header />
    <body>
    <Routes>
      <Route path="/" element={<div>balls</div>} />
    </Routes>
    </body>
    </>
  );
}
//<Route path="/garden" element={<div>not balls</div>} />
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<React.StrictMode>
    <BrowserRouter>
        <App />
    </BrowserRouter>
</React.StrictMode>
);