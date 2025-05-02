import { WebSocketServer } from 'ws';
import Socket from './socket.js';

class CFTPServer {
    constructor(port) {
        const wss = new WebSocketServer({ port: port });

        this.wss = wss;
        this.connections = []

        wss.on('connection', (ws, req) => this.on_connect(ws, req));
    }

    on_connect(ws, req) {
        this.connections.push(new Socket(this, ws, req))   
    }
}

export default CFTPServer;