"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fetcher = void 0;
class Fetcher {
    static makeGetFetch(url, loadingMs) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => {
                if (!response) {
                    reject(null);
                }
                return response.json();
            })
                .then((parsedData) => {
                resolve(parsedData);
            })
                .catch(error => {
                reject(null);
            });
        });
    }
    static makePostFetch(configs) {
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
                return response.json();
            })
                .then((parsedData) => {
                resolve(parsedData);
            })
                .catch(error => {
                reject(null);
            });
        });
    }
}
exports.Fetcher = Fetcher;
