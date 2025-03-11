import React from 'react';

export function Trading() {
  return (
    <main class="container-fluid bg-secondary text-center">
        <div><h1>Trade History</h1></div>
        <div><a href="chat.html">MoeLester</a></div>
        <div><a href="chat.html">barrymikokinner</a></div>
        <div><a href="chat.html">darkman42069</a></div>
        <div><h1>Online</h1></div>
        <div><a href="chat.html">BlueCat11</a></div>
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