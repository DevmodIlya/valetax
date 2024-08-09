/**
 * Designed by Ilya Nikulin 2020
 * This is a template for creating Node Express + TypesScript + Jest applications.
 * You may extend it with your own configs or use it as is.
 * All the required paths and ports are stored within .env.dev/.env.prod files.
 * You may add arguments to npm start dev/prod http/https script via command line.
 * These arguments are for server tuning purposes.
 */

import express from "express";
import {SocketIo} from "../comm_modules/SocketIo";

export interface AppInterface {
    server: express.Application
    socketController: SocketIo;
    pathToClient: string
    configs: Map<string, string | null | undefined | number>
    renderTemplate: (fileName: string) => string
    renderPartial: <T>(fileName: string, parameters:T) => string
}
