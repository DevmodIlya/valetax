/**
 * Designed by Ilya Nikulin 2020
 * This is a template for creating Node Express + TypesScript + Jest applications.
 * You may extend it with your own configs or use it as is.
 * All the required paths and ports are stored within .env.dev/.env.prod files.
 * You may add arguments to npm start dev/prod http/https script via command line.
 * These arguments are for server tuning purposes.
 */

import {Server, ServerOptions} from 'socket.io'
import * as http from 'http'
import * as https from 'https'
import {Logger} from "../logs/Logger";


export interface LatLng {
    lat: number
    lng: number
}

export interface DriverData {
    id: string
    status: boolean
    accepted: boolean
    canceled: boolean
    currentLoc: LatLng
}

export interface ClientData {
    id: string
    accepted: boolean
    canceled: boolean
    currentLoc: LatLng
    destination: {
        lat: number
        lng: number
        totalAscend: number
        totalDistance: number
        totalTime: number
    },
    wayPoints: Array<[number, number]>
}

export interface Drivers {
    [key: string]: DriverData
}

export class SocketIo {
    private socketsIo: Server;

    constructor(server: http.Server | https.Server) {
        this.socketsIo = new Server(server, {
            transports: ["websocket"],
            cors: {origin: '*'}
        });

        this.socketsIo.on("connection", (socket) => {
            console.log("Socket connected")
            socket.on("join", (data: any) => {
                const rooms = this.socketsIo.sockets.adapter.rooms;
                console.log("data",data)
                const reqId = data.reqId;
                if (reqId && reqId !== "" && !rooms.has(reqId)) {
                    socket.join(reqId);
                    Logger.addToLog('Socket conn:', reqId, "joins the room");
                }
            });

            socket.on('disconnect', () => {
            });
        });
    }

    to<PayLoadType>(room: string, eventId: string, payload: PayLoadType): void {
        const rooms = this.socketsIo.sockets.adapter.rooms;
        if (rooms.has(room)) {
            console.log("Ok. Room" + room + " exists");
        } else {
            console.log("Bad. Room" + room + " does not exists");
        }
        console.log("Sending message to room:", room, "Event id:", eventId,eventId ==="jobinvitation", "payload", payload)
        this.socketsIo.to(room).emit(eventId, payload);
        this.socketsIo.to(room).emit("test", payload);
    }
}
