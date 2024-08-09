declare let io: any;

export class Sockets {
    private socket: any;

    constructor() {
        this.socket = io("http://localhost:3025", {
            transports: [
                'websocket'
            ]
        });
    }

    emit(id: string, data: any): void {
        this.socket.emit(id, data);
    }

    on(id: string, callback: any): void {
        this.socket.on(id, (data: any): void => {
            callback(data);
        });
    }
}