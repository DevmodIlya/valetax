/**
 * Designed by Ilya Nikulin 2020
 * This is a template for creating Node Express + TypesScript + Jest applications.
 * You may extend it with your own configs or use it as is.
 * All the required paths and ports are stored within .env.dev/.env.prod files.
 * You may add arguments to npm start dev/prod http/https script via command line.
 * These arguments are for server tuning purposes.
 */

import moment from "moment-timezone";
import colors, {Color} from 'colors';
import path from "path";
import fs from "fs";

export class Logger {
    public static addToLog(...args: string[]): void {
        const momentDate = moment.tz("Asia/Jerusalem");
        const currentDateTime = momentDate.format('DD-MM-YYYY HH:M:S');
        const currentDate = momentDate.format('DD-MM-YYYY');
        const logFileName = `${currentDate}.log`;
        const logFilePath = path.join(__dirname, logFileName);

        const oneString = args.join('  ');
        const messageSplit = oneString.split("[@]");
        const message = messageSplit[0];
        const parameters = messageSplit[1];

        const logMessage = `[${currentDateTime}] ${message}`;

        if (parameters) {
            const split = parameters.split(".");
            let aggreFn = colors;
            for (let currSpl of split) {
                aggreFn = <any>aggreFn[currSpl as keyof Color];
            }
            console.log((<any>aggreFn)(logMessage))
        } else {
            console.log(logMessage);
        }

        fs.appendFile(logFilePath, logMessage + "\n", (err) => {
            if (err) {
                console.error('Error writing to log file:', err);
            }
        });
    }
}