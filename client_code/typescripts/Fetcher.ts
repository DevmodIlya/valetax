import {Alert} from "./Alert";

interface ReqConfigs {
    url: string,
    data: any,
    method?: string
    spinnerMsg?: string
}

export class Fetcher {
    public static makeGetFetch<K>(url: string, loadingMs?: string): Promise<K | null> {
        let spinner: Alert<null> | null;
        if (loadingMs) {
            spinner = new Alert({
                type: 2,
                message: loadingMs
            });
        }
        return new Promise<K | null>((resolve, reject) => {
            fetch(url)
                .then(response => {
                    if (!response) {
                        reject(null);
                    }
                    if (spinner) {
                        spinner.remove();
                    }
                    return response.json()
                })
                .then((parsedData: any) => {
                    resolve(parsedData);
                })
                .catch(error => {
                    if (spinner) {
                        spinner.remove();
                    }
                    reject(null)
                });
        });
    }

    public static makePostFetch<K>(configs: ReqConfigs): Promise<K | null> {
        let spinner: Alert<null> | null;
        if (configs.spinnerMsg) {
            spinner = new Alert({
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
        }
        return new Promise<K | null>((resolve, reject) => {
            fetch(configs.url, options)
                .then(response => {
                    if (!response) {
                        console.log("Network response was not ok");
                        reject(null);
                    }
                    if (spinner) {
                        spinner.remove();
                    }
                    return response.json()
                })
                .then((parsedData: any) => {
                    resolve(parsedData as K);
                })
                .catch(error => {
                    if (spinner) {
                        spinner.remove();
                    }
                    reject(null)
                });
        });
    }
}
