"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fetcher = void 0;
const Alert_1 = require("./Alert");
class Fetcher {
    static makeGetFetch(url, loadingMs) {
        let spinner;
        if (loadingMs) {
            spinner = new Alert_1.Alert({
                type: 2,
                message: loadingMs
            });
        }
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => {
                if (!response) {
                    reject(null);
                }
                if (spinner) {
                    spinner.remove();
                }
                return response.json();
            })
                .then((parsedData) => {
                resolve(parsedData);
            })
                .catch(error => {
                if (spinner) {
                    spinner.remove();
                }
                reject(null);
            });
        });
    }
    static makePostFetch(configs) {
        let spinner;
        if (configs.spinnerMsg) {
            spinner = new Alert_1.Alert({
                type: 2,
                message: configs.spinnerMsg
            });
        }
        let options = {
            'method': configs.method || 'POST',
            'headers': {
                'content-type': "application/json"
            },
            body: JSON.stringify(configs.data)
        };
        return new Promise((resolve, reject) => {
            fetch(configs.url, options)
                .then(response => {
                if (!response) {
                    console.log("Network response was not ok");
                    reject(null);
                }
                if (spinner) {
                    spinner.remove();
                }
                return response.json();
            })
                .then((parsedData) => {
                resolve(parsedData);
            })
                .catch(error => {
                if (spinner) {
                    spinner.remove();
                }
                reject(null);
            });
        });
    }
}
exports.Fetcher = Fetcher;
