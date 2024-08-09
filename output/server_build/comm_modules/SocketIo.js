"use strict";
/**
 * Designed by Ilya Nikulin 2020
 * This is a template for creating Node Express + TypesScript + Jest applications.
 * You may extend it with your own configs or use it as is.
 * All the required paths and ports are stored within .env.dev/.env.prod files.
 * You may add arguments to npm start dev/prod http/https script via command line.
 * These arguments are for server tuning purposes.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIo = void 0;
const socket_io_1 = require("socket.io");
const Logger_1 = require("../logs/Logger");
class SocketIo {
    constructor(server) {
        this.socketsIo = new socket_io_1.Server(server, {
            transports: ["websocket"],
            cors: { origin: '*' }
        });
        this.socketsIo.on("connection", (socket) => {
            console.log("Socket connected");
            socket.on("join", (data) => {
                const rooms = this.socketsIo.sockets.adapter.rooms;
                console.log("data", data);
                const reqId = data.reqId;
                if (reqId && reqId !== "" && !rooms.has(reqId)) {
                    socket.join(reqId);
                    Logger_1.Logger.addToLog('Socket conn:', reqId, "joins the room");
                }
            });
            socket.on('disconnect', () => {
            });
        });
    }
    to(room, eventId, payload) {
        const rooms = this.socketsIo.sockets.adapter.rooms;
        if (rooms.has(room)) {
            console.log("Ok. Room" + room + " exists");
        }
        else {
            console.log("Bad. Room" + room + " does not exists");
        }
        console.log("Sending message to room:", room, "Event id:", eventId, eventId === "jobinvitation", "payload", payload);
        this.socketsIo.to(room).emit(eventId, payload);
        this.socketsIo.to(room).emit("test", payload);
    }
}
exports.SocketIo = SocketIo;
