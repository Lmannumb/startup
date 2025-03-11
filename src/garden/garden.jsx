import React from 'react';
import ReactDOM from 'react-dom/client';

export function Garden() {
    return (
        <main class="container-fluid bg-secondary text-center">
        <div><h3>
            Basic Plant
          </h3></div>
        <div>
            <image src="exampleplant.png" alt="insert plant here"></image>
        </div>
        <div>Time remaining: "0:13:45"</div>
      </main>
    );
}