import React from 'react';
import { Link } from 'react-router-dom';

export function Trading() {
  return (
    <main class="container-fluid bg-secondary text-center">
        <div><h1>Trade History</h1></div>
        <div><Link to="MoeLester">MoeLester</Link></div>
        <div><Link to="barrykikokineer">barrymikokinner</Link></div>
        <div><Link to="darkman42069">darkman42069</Link></div>
        <div><h1>Online</h1></div>
        <div><Link to="BlueCat11">BlueCat11</Link></div>
        <div><h1>Direct Connect</h1></div>
        <form method="get" action="chat.html">
          <div class="input-group mb-3">
            <input class="form-control" type="text" placeholder="username" />
          </div>
          <button type="submit" class="btn btn-primary">Connect</button>
        </form>
      </main>
  );
}