import React from 'react';
import speak from '/speak.png';
import plant from '/exampleplant.png';
import money from '/money.png';

export function Home() {
  return (
    <main className="container-fluid bg-secondary text-center">
      <h1 className="justify-center">Welcome to Idle Garden!</h1>
      <div><p>
        Idle Garden is a game where you grow plants, and talk and trade with others. Start by creating an account at the login page and planting your first seed!
      </p></div>
      <div className="homepagestuff">
        <div>
          <h3>Buy seeds and grow plants</h3>
          <div>
          <img src={plant} alt="image not found" />
        </div>
        </div>
        <div>
          <h3>Sell them to expand your ventures</h3>
          <div>
            <img src={money} alt="image not found" width="230" height="230" />
          </div>
        </div>
        <div>
          <h3>Talk and trade with other players</h3>
          <div>
            <img src={speak} alt="image not found" width="230" height="240" />
          </div>
        </div>

      </div>
    </main>
  );
}