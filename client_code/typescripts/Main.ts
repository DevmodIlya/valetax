/**
 * Designed by Ilya Nikulin 2020
 * This is a template for creating Node Express + TypesScript + Jest applications.
 * You may extend it with your own configs or use it as is.
 * All the required paths and ports are stored within .env.dev/.env.prod files.
 * You may add arguments to npm start dev/prod http/https script via command line.
 * These arguments are for server tuning purposes.
 */

import '../sass/main.scss';
import {Sockets} from "./Sockets";
import {Alert} from "./Alert";
import {NodesExample} from "./components/NodesExample";

// @ts-ignore
window.Alert = Alert;
// @ts-ignore
window.Sockets = Sockets;
// @ts-ignore
window.NodesExample = NodesExample;
