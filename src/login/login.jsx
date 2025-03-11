import React from 'react';

export function Login() {
  return (
    <main class="container-fluid bg-secondary text-center">
        <h2>Login or Register to Idle Garden</h2>
        
        <form method="get" action="accountsignedin.html">
          <div class="input-group mb-3">
            <input class="form-control" type="text" placeholder="username" />
          </div>
          <div class="input-group mb-3">
            <input class="form-control" type="password" placeholder="password" />
          </div>
          <button type="submit" class="btn btn-primary">Login</button>
          <button type="submit" class="btn btn-secondary">Register</button>
        </form>
      </main>
  );
}