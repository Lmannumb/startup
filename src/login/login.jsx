import React from 'react';

export function Login() {
  return (
    <main className="container-fluid bg-secondary text-center">
        <h2>Login or Register to Idle Garden</h2>
        
        <form method="get" action="login/unimplemented">
          <div className="input-group mb-3">
            <input className="form-control" type="text" placeholder="username" />
          </div>
          <div className="input-group mb-3">
            <input className="form-control" type="password" placeholder="password" />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
          <button type="submit" className="btn btn-secondary">Register</button>
        </form>
      </main>
  );
}