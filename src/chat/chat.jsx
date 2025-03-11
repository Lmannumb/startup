import React from 'react';

export function Chat() {
  return (
    <main class="container-fluid bg-secondary text-center">

      <div><h1>Chatting with [UNIMPLEMENTED]</h1></div>
      <div>
        Once texts have been sent back and forth, they will appear here.
      </div>
      <div class="time">Time of message will display like so</div>
      <div>more example chats</div>
      <div class="time">11/20/24 11:30 AM</div>
      <div class="you">yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap yapyapyapyap</div>
      <div class="time you">11/20/24 11:30 AM</div>
      <div><br></br></div>
      <form method="get" action="chat.html">
        <div class="input-group mb-3">
          <input class="form-control" type="text" placeholder="message" />
          <button type="submit" class="btn btn-primary" >Send</button>
        </div>
        </form>
      <form>
        <div class="input-group mb-3">
          <select name="offer" id="plant list">
            <option value="">--Select a Plant to Offer--</option>
            <option value="">The offering options will be pulled from the storage database.</option>
            </select>
      </div>
      <button type="submit" class="btn btn-primary" >Add Offer (Javascript and Database required)</button>
      <button type="submit" class="btn btn-primary" >Trade</button>
    </form>
    </main>
  );
}