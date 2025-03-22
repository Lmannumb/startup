import React from 'react';
import { Link } from 'react-router-dom';

export function Signedin() {
  return (
    <main class="container-fluid bg-secondary text-center">
        <h2>Notifications</h2>
        <div><Link to="/notification/unimplemented">New messages!</Link> <span class="time">11/20/24 11:30 AM</span></div>
        <div>
          <form method="get" action="/login">
            <button class="btn btn-primary">Sign Out</button>
          </form>
        </div>
      </main>
  );
}