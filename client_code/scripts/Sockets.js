"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sockets = void 0;
class Sockets {
    constructor() {
        this.socket = io("http://localhost:3025", {
            transports: [
                'websocket'
            ]
        });
    }
    emit(id, data) {
        this.socket.emit(id, data);
    }
    on(id, callback) {
        this.socket.on(id, (data) => {
            callback(data);
        });
    }
}
exports.Sockets = Sockets;
