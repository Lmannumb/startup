

class WebHandler {
    observers = [];
    connected = false;
  
    constructor() {
      let port = window.location.port;
      const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
      this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
      this.socket.onopen = (event) => {
        this.notifyObservers('system', 'websocket', 'connected');
        this.connected = true;
      };
      this.socket.onclose = (event) => {
        this.notifyObservers('system', 'websocket', 'disconnected');
        this.connected = false;
      };
      this.socket.onmessage = async (msg) => {
        const text = await msg.data.text();
        const chat = JSON.parse(text);
        this.notifyObservers('received', chat.name, chat.msg);
      };
    }
    sendMessage(name, msg) {
    };
  
    addObserver(observer) {
      this.observers.push(observer);
    };
  
    notifyObservers(event, from, msg) {
      this.observers.forEach((h) => h({ event, from, msg }));
    };
}

export {WebHandler}