import React from 'react';

export function Signedin() {
  return (
    <main class="container-fluid bg-secondary text-center">
        <h2>Notifications</h2>
        <div><a href="notification.html">New messages!</a> <span class="time">11/20/24 11:30 AM</span></div>
        <div>
          <form method="get" action="account.html">
            <button class="btn btn-primary">Sign Out</button>
          </form>
        </div>
      </main>
  );
}