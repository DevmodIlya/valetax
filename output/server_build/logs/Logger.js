"use strict";
/**
 * Designed by Ilya Nikulin 2020
 * This is a template for creating Node Express + TypesScript + Jest applications.
 * You may extend it with your own configs or use it as is.
 * All the required paths and ports are stored within .env.dev/.env.prod files.
 * You may add arguments to npm start dev/prod http/https script via command line.
 * These arguments are for server tuning purposes.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const colors_1 = __importDefault(require("colors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class Logger {
    static addToLog(...args) {
        const momentDate = moment_timezone_1.default.tz("Asia/Jerusalem");
        const currentDateTime = momentDate.format('DD-MM-YYYY HH:M:S');
        const currentDate = momentDate.format('DD-MM-YYYY');
        const logFileName = `${currentDate}.log`;
        const logFilePath = path_1.default.join(__dirname, logFileName);
        const oneString = args.join('  ');
        const messageSplit = oneString.split("[@]");
        const message = messageSplit[0];
        const parameters = messageSplit[1];
        const logMessage = `[${currentDateTime}] ${message}`;
        if (parameters) {
            const split = parameters.split(".");
            let aggreFn = colors_1.default;
            for (let currSpl of split) {
                aggreFn = aggreFn[currSpl];
            }
            console.log(aggreFn(logMessage));
        }
        else {
            console.log(logMessage);
        }
        fs_1.default.appendFile(logFilePath, logMessage + "\n", (err) => {
            if (err) {
                console.error('Error writing to log file:', err);
            }
        });
    }
}
exports.Logger = Logger;
