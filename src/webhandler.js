

class WebHandler {
    observers = [];
    connected = false;
  
    constructor() {
      let port = window.location.port;
      const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
      this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
      this.socket.onopen = (event) => {
        
      };
      this.socket.onclose = (event) => {
        
      };
      this.socket.onmessage = async (msg) => {
        
      };
    }
}

export {WebHandler}