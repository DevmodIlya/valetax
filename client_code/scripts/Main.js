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
require("../sass/main.scss");
const Sockets_1 = require("./Sockets");
const Alert_1 = require("./Alert");
const NodesExample_1 = require("./components/NodesExample");
// @ts-ignore
window.Alert = Alert_1.Alert;
// @ts-ignore
window.Sockets = Sockets_1.Sockets;
// @ts-ignore
window.NodesExample = NodesExample_1.NodesExample;
