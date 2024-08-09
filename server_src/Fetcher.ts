interface ReqConfigs {
    url: string,
    data: any,
    method?: string
    spinnerMsg?: string
}

export class Fetcher {
    public static makeGetFetch<K>(url: string, loadingMs?: string): Promise<K | null> {
        return new Promise<K | null>((resolve, reject) => {
            fetch(url)
                .then(response => {
                    if (!response) {
                        reject(null);
                    }
                    return response.json()
                })
                .then((parsedData: any) => {
                    resolve(parsedData);
                })
                .catch(error => {
                    reject(null)
                });
        });
    }

    public static makePostFetch<K>(configs: ReqConfigs): Promise<K | null> {
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
                    return response.json()
                })
                .then((parsedData: any) => {
                    resolve(parsedData as K);
                })
                .catch(error => {
                    reject(null)
                });
        });
    }
}
