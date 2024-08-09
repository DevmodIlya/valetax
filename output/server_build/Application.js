"use strict";
/**
 * Designed by Ilya Nikulin 2020
 * This is a template for creating Node Express + TypesScript + Jest applications.
 * You may extend it with your own configs or use it as is.
 * All the required paths and ports are stored within .env.dev/.env.prod files.
 * You may add arguments to npm start dev/prod http/https script via command line.
 * These arguments are for server tuning purposes.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const http = __importStar(require("http"));
const https = __importStar(require("https"));
const compression_1 = __importDefault(require("compression"));
const body_parser_1 = __importDefault(require("body-parser"));
const SocketIo_1 = require("./comm_modules/SocketIo");
const cors_1 = __importDefault(require("cors"));
const ejs_1 = __importDefault(require("ejs"));
const Logger_1 = require("./logs/Logger");
class Application {
    constructor() {
        this.isHttpsServer = false;
        this.app = (0, express_1.default)();
        this.checkTheEnvironment();
        this.app.use((0, compression_1.default)());
        this.app.use(body_parser_1.default.json({ limit: '50mb' }));
        this.app.use(body_parser_1.default.urlencoded({
            extended: true
        }));
        this.app.use(body_parser_1.default.json());
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
        this.app.use(express_1.default.static(this.pathToClient));
        this.app.use((0, cors_1.default)({
            origin: ["http://localhost:3024", "https://godevmod.com", "https://godevmode.com", "https://shop.godevmod.com", "https://shop.godevmode.com", "*"]
        }));
        this.socketController = new SocketIo_1.SocketIo(this.server);
        this.appInterface = {
            server: this.app,
            socketController: this.socketController,
            configs: this.configs,
            pathToClient: this.pathToClient,
            renderTemplate: this.renderTemplate,
            renderPartial: this.renderPartial
        };
        this.initRoutes();
        this.initServer();
    }
    initServer() {
        if (this.isHttpsServer) {
            this.server = new https.Server({
                key: fs_1.default.readFileSync(__dirname + '/cert.key'),
                cert: fs_1.default.readFileSync(__dirname + '/cert.pem')
            }, (this.app));
        }
        else {
            this.server = new http.Server(this.app);
        }
        this.server.listen({ port: this.configs.get("PORT"), host: "0.0.0.0" }, () => {
            Logger_1.Logger.addToLog(`Starting: Regular server: Port: ${this.configs.get("PORT")}`, "[@]bgGreen.white");
            Logger_1.Logger.addToLog('Server is ready comrade!', "[@]bgGreen.white");
        });
        this.socketController = new SocketIo_1.SocketIo(this.server);
    }
    initRoutes() {
        const path = __dirname + "/" + this.configs.get("APP_ROUTES_PATH");
        fs_1.default.readdir(path, (err, files) => {
            if (err) {
                Logger_1.Logger.addToLog('Can not find app_routes directory on path: ' + path, err.toString());
                return;
            }
            files.forEach((file) => {
                Promise.resolve().then(() => __importStar(require(path + "/" + file))).then((importClass) => {
                    // if (Object.keys(importClass.default).length > 0) {
                    const classFn = importClass.default;
                    if (typeof classFn === 'function' && /^class\s/.test(classFn.toString())) {
                        new classFn(this.appInterface);
                    }
                    else {
                        importClass.default(this.appInterface);
                    }
                    // }
                })
                    .catch();
            });
        });
    }
    closeServer() {
        this.server.close();
    }
    renderTemplate(fileName) {
        Logger_1.Logger.addToLog("Rendering template __dir:", __dirname, this.configs.get('CLIENT_DIR') + fileName);
        const pathToClient = __dirname + this.configs.get('CLIENT_DIR');
        const pathToTemplate = pathToClient + "/" + fileName;
        if (fs_1.default.existsSync(pathToTemplate)) {
            return pathToTemplate;
        }
        return pathToClient + '/404.ejs';
    }
    renderPartial(path, parameters) {
        return ejs_1.default.render(fs_1.default.readFileSync(path, { encoding: 'utf-8' }), parameters !== null && parameters !== void 0 ? parameters : {});
    }
    checkTheEnvironment() {
        const appArguments = process.argv.slice(2);
        let environment = "dev";
        for (const arg of appArguments) {
            if (arg === 'dev' || arg === 'prod' || arg === 'staging') {
                environment = arg;
            }
            this.isHttpsServer = arg === 'https';
        }
        Logger_1.Logger.addToLog('Application mode:', environment);
        process.env.environment = environment;
        const dotEnvPath = __dirname + '/.env.' + environment;
        if (!fs_1.default.existsSync(dotEnvPath)) {
            Logger_1.Logger.addToLog(' No .env file found. Aborting application ', '[@]bgWhite.red');
            return;
        }
        dotenv.config({ path: __dirname + '/.env.' + environment });
        this.configs = new Map(Object.entries(process.env));
    }
}
if (process.argv.slice(2).indexOf("test") === -1) {
    new Application();
}
