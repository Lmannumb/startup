

class WebHandler {
    observers = [];
    name = "E";
    connected = false;
  
    constructor() {
      let port = window.location.port;
      const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
      this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
      this.socket.onopen = (event) => {
        this.notifyObservers('system', 'websocket', 'connected');
        fetch('/api/clients', {
            method:"post",
            body: JSON.stringify({"name":this.name}),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
        })
        this.connected = true;
      };
      this.socket.onclose = (event) => {
        this.notifyObservers('system', 'websocket', 'disconnected');
        fetch('/api/clients', {method:"delete"});
        this.name = "E";
        this.connected = false;
      };
      this.socket.onmessage = async (msg) => {
        const text = await msg.data.text();
        const chat = JSON.parse(text);
        this.notifyObservers('received', chat.name, chat.msg);
      };
    }
    sendMessage(name, msg) {
        this.notifyObservers('sent', 'me', msg);
        this.socket.send(JSON.stringify({ name, msg }));
    };
  
    addObserver(observer) {
      this.observers.push(observer);
    };
  
    notifyObservers(event, from, msg) {
        console.log(event + " from " + from + ": " + msg);
      this.observers.forEach((h) => h({ event, from, msg }));
    };
}

export {WebHandler}