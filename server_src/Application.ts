/**
 * Designed by Ilya Nikulin 2020
 * This is a template for creating Node Express + TypesScript + Jest applications.
 * You may extend it with your own configs or use it as is.
 * All the required paths and ports are stored within .env.dev/.env.prod files.
 * You may add arguments to npm start dev/prod http/https script via command line.
 * These arguments are for server tuning purposes.
 */

import * as dotenv from 'dotenv';
import fs from "fs";

import express from "express";
import * as http from 'http';
import * as https from 'https';

import compression from "compression";
import bodyParser from "body-parser";
import {SocketIo} from "./comm_modules/SocketIo";
import cors from "cors";
import {auth} from 'express-openid-connect'

import {AppInterface} from "./interfaces/AppInterface";
import ejs from "ejs";
import {Logger} from "./logs/Logger";

class Application {
    private app: express.Application;
    private socketController: SocketIo;
    private server: http.Server | https.Server;
    private pathToClient: string;
    private isHttpsServer: boolean = false;
    private configs: Map<string, string | null | undefined | number>;
    private appInterface: AppInterface

    constructor() {
        this.app = express();
        this.checkTheEnvironment();

        this.app.use(compression());
        this.app.use(bodyParser.json({limit: '50mb'}));
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(bodyParser.json());
/*
        const authConfig = {
            authRequired: false,
            auth0Logout: true,
            routes: {
                logout:"/logoutauth"
            },
            secret: <string>this.configs.get('AUTH0_SECRET'),
            baseURL: <string>this.configs.get('AUTH0_BASE_URL'),
            clientID: <string>this.configs.get('AUTH0_CLIENT_ID'),
            issuerBaseURL: <string>this.configs.get('AUTH0_ISSUER_BASE_URL')
        };
        this.app.use(auth(authConfig));
*/

        this.pathToClient = __dirname + this.configs.get('CLIENT_DIR');
        this.app.use(express.static(this.pathToClient));

        this.app.use(cors({
            origin: ["http://localhost:3024", "https://godevmod.com", "https://godevmode.com", "https://shop.godevmod.com", "https://shop.godevmode.com", "*"]
        }));

        this.socketController = new SocketIo(this.server);

        this.appInterface = {
            server: this.app,
            socketController: this.socketController,
            configs: this.configs,
            pathToClient: this.pathToClient,
            renderTemplate: this.renderTemplate,
            renderPartial: this.renderPartial
        }
        this.initRoutes();
        this.initServer();
    }

    public initServer(): void {
        if (this.isHttpsServer) {
            this.server = new https.Server({
                key: fs.readFileSync(__dirname + '/cert.key'),
                cert: fs.readFileSync(__dirname + '/cert.pem')
            }, (this.app));
        } else {
            this.server = new http.Server(this.app);
        }

        this.server.listen({port: this.configs.get("PORT"), host: "0.0.0.0"}, (): void => {
            Logger.addToLog(`Starting: Regular server: Port: ${this.configs.get("PORT")}`, "[@]bgGreen.white");
            Logger.addToLog('Server is ready comrade!', "[@]bgGreen.white");
        });

        this.socketController = new SocketIo(this.server);
    }

    private initRoutes(): void {
        const path = __dirname + "/" + <string>this.configs.get("APP_ROUTES_PATH");
        fs.readdir(path, (err: Error | null, files: string[]): void => {
            if (err) {
                Logger.addToLog('Can not find app_routes directory on path: ' + path, err.toString());
                return;
            }

            files.forEach((file: string): void => {
                import(path + "/" + file)
                    .then((importClass: any): void => {
                        // if (Object.keys(importClass.default).length > 0) {
                            const classFn = importClass.default;
                            if (typeof classFn === 'function' && /^class\s/.test(classFn.toString())) {
                                new classFn(this.appInterface);
                            } else {
                                importClass.default(this.appInterface);
                            }
                        // }
                    })
                    .catch();
            });
        });
    }

    public closeServer(): void {
        this.server.close();
    }

    public renderTemplate(fileName: string): string {
        Logger.addToLog("Rendering template __dir:", __dirname, this.configs.get('CLIENT_DIR') + fileName);
        const pathToClient = __dirname + this.configs.get('CLIENT_DIR');
        const pathToTemplate = pathToClient + "/" + fileName;
        if (fs.existsSync(pathToTemplate)) {
            return pathToTemplate;
        }
        return pathToClient + '/404.ejs';
    }

    public renderPartial<T>(path: string, parameters?: T): string {
        return ejs.render(fs.readFileSync(path, {encoding: 'utf-8'}), parameters ?? {});
    }

    private checkTheEnvironment() {
        const appArguments = process.argv.slice(2);
        let environment: string = "dev";

        for (const arg of appArguments) {
            if (arg === 'dev' || arg === 'prod' || arg === 'staging') {
                environment = arg;
            }
            this.isHttpsServer = arg === 'https';
        }

        Logger.addToLog('Application mode:', environment);
        process.env.environment = environment;

        const dotEnvPath = __dirname + '/.env.' + environment;
        if (!fs.existsSync(dotEnvPath)) {
            Logger.addToLog(' No .env file found. Aborting application ', '[@]bgWhite.red');
            return;
        }
        dotenv.config({path: __dirname + '/.env.' + environment});
        this.configs = new Map(Object.entries(process.env));
    }
}

if (process.argv.slice(2).indexOf("test") === -1) {
    new Application();
}
