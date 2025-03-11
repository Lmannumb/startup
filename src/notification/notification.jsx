import React from 'react';
import { Link } from 'react-router-dom';

export function Notification() {
  return (
    <main class="container-fluid bg-secondary text-center">
        <h2>New messages!</h2>
        <div>New messages from <Link to="/trading/unimplemented">[Insert]</Link> and others. Click link to view.</div>
      </main>
  );
}