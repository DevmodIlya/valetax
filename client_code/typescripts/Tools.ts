import {Alert} from "./Alert";
import {Fetcher} from "./Fetcher";
import {KeyStringInterface} from "./interfaces/KeyStringInterface";
import {Translations} from "./Translations";

export class Tools {
    public static formatDate(originalDate: Date): string {
        const year = originalDate.getFullYear();
        const month = String(originalDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because month index starts from 0
        const day = String(originalDate.getDate()).padStart(2, '0');
        const hours = String(originalDate.getHours()).padStart(2, '0');
        const minutes = String(originalDate.getMinutes()).padStart(2, '0');
        const seconds = String("00").padStart(2, '0');
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return formattedDate;
    }

    public static createDiv<T>(options: { [key: string]: string | number | string[] | boolean }): HTMLDivElement | T {
        const tmpDiv: HTMLDivElement = <HTMLDivElement>document.createElement(<string>options.tag ?? "div");
        for (let key in options) {
            if (key === "classes") {
                const classes = <string[] | string>options[key];
                if (Array.isArray(classes)) {
                    for (let cls of classes) {
                        if (cls && cls != "") {
                            tmpDiv.classList.add(cls);
                        }
                    }
                } else {
                    tmpDiv.classList.add(classes);
                }
            }
            if (key === "text") {
                const text: Text = document.createTextNode(<string>options.text);
                tmpDiv.appendChild(text);
            }
            if (key === "type") {
                (<HTMLInputElement>tmpDiv).type = <string>options.type;
            }
            if (key === "value") {
                (<HTMLInputElement>tmpDiv).value = <string>options.value ?? "";
            }
            if (key === "disabled" && options.disabled) {
                (<HTMLDivElement>tmpDiv).setAttribute("disabled", "true");
            }
            if (key === "name") {
                (<HTMLInputElement>tmpDiv).name = <string>options.name;
            }
            if (key === "title") {
                tmpDiv.title = (<string>options.text);
            }
            if (key === "id") {
                tmpDiv.id = <string>options.id;
            }
            if (key === "src") {
                (<HTMLImageElement>tmpDiv).src = <string>options.src;
            }
        }

        return tmpDiv;
    }

    public static calcChecksum(str: string): string {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 33) ^ str.charCodeAt(i);
        }
        const newhash = hash >>> 0;
        const checksum = newhash % 10000;
        return checksum.toString().padStart(5, '0');
    }

    public static findItemInArray<T extends {
        [key: string]: any
    }>(sourceArray: T[], key: string, equals: string | number): { [key: string]: string | number } | null {
        if (!sourceArray) {
            return null;
        }
        return sourceArray.find((item: T) => item[key] === equals) ?? null;
    }

    public static toIndexedObj<T>(obj: T[], index: string): { [key: string]: T } | null {
        if (!obj || obj.length === 0) {
            return null;
        }
        const temp: { [key: string]: T } = {};
        obj.forEach((item: T) => {
            // @ts-ignore
            temp[item[index]] = item;
        });
        return temp;
    }

    public static async searchRecord<T>(searchPath: string, searchStr: string): Promise<T | null> {
        if (!searchPath || !searchStr || searchStr.length < 3) {
            return null;
        }
        return await Fetcher.makeGetFetch<T | null>(searchPath + "/" + searchStr);
    }

    public static errorPopupBox(): void {
        const translationsG = <KeyStringInterface<string | number | string[]>>Translations.get("general");
        new Alert({
            type: 1,
            title: <string>translationsG.networkErrorTitle,
            message: <string>translationsG.networkErrorDsc,
            animationStyle: "fadeIn",
            callbackBtnYesText: <string>translationsG.approveTitle,
            callbackYes: (innerModal) => {
                innerModal?.remove();
            }
        });
    }

    public static dataErrorPopupBox(): void {
        const translationsG = <KeyStringInterface<string | number | string[]>>Translations.get("general");
        new Alert({
            type: 1,
            title: <string>translationsG.errorDataReq,
            message: <string>translationsG.errorDataReqDsc,
            animationStyle: "fadeIn",
            callbackBtnYesText: <string>translationsG.approveTitle,
            callbackYes: (innerModal) => {
                innerModal?.remove();
            }
        });
    }

    public static unsusccessActionPopupBox(): void {
        const translationsG = <KeyStringInterface<string | number | string[]>>Translations.get("general");
        new Alert({
            type: 1,
            title: <string>translationsG.errorActionReq,
            message: <string>translationsG.errorActionReqDsc,
            animationStyle: "fadeIn",
            callbackBtnYesText: <string>translationsG.approveTitle,
            callbackYes: (innerModal) => {
                innerModal?.remove();
            }
        });
    }

    public static objectLength<T>(object: T): number {
        if (!object) {
            return 0;
        }
        return Object.keys(object).length;
    }

    public static approveActionPopupBox(options: KeyStringInterface<((alertModal: Alert<any>) => void) | string>): void {
        const translationsG = <KeyStringInterface<string | number | string[]>>Translations.get("general");
        new Alert({
            type: 1,
            title: <string>translationsG.approveActionTitle,
            message: options.msg ? <string>options.msg : <string>translationsG.approveActionDsc,
            animationStyle: "fadeIn",
            callbackBtnYesText: options.yesBtn ? <string>options.yesBtn :<string>translationsG.approveTitle,
            callbackBtnNoText: <string>translationsG.cancelTitle,
            callbackYes: (innerModal) => {
                const okFn = options.okFn;
                if (okFn && typeof okFn === "function") {
                    okFn(<Alert<any>>innerModal);
                    return
                }
                innerModal?.remove();
            },
            callbackNo: (innerModal) => {
                const notOkFn = options.notOkFn;
                if (notOkFn && typeof notOkFn === "function") {
                    notOkFn(<Alert<any>>innerModal);
                    return
                }
                innerModal?.remove();
            }
        });
    }

    public static popupBox(title: string, msg: string, okFn?: () => void): void {
        if (!title || !msg) {
            return;
        }
        const translationsG = <KeyStringInterface<string | number | string[]>>Translations.get("general");
        new Alert({
            type: 1,
            title: title,
            message: msg,
            animationStyle: "fadeIn",
            callbackBtnYesText: <string>translationsG.approveTitle,
            callbackYes: (innerModal) => {
                innerModal?.remove();
                if (okFn && typeof okFn === "function") {
                    okFn();
                }
            }
        });
    }

    public static pushUniqueObject<T extends { [key: string]: any }>(array: T[], object: T, key: string): T[] {
        const exists = array.some(item => item[key] === object[key]);
        if (!exists) {
            array.push(object);
        }
        return array
    }

    public static dragScroll(elementClass: string | HTMLDivElement): void {
        let isMouseDown = false;
        let startX: number, scrollLeft: number;
        const container: HTMLDivElement = typeof elementClass === "string" ? <HTMLDivElement>document.querySelector(elementClass) : <HTMLDivElement>elementClass;
        if (!container) {
            return;
        }
        container.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
            container.style.cursor = 'grabbing';
        });

        container.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });

        container.addEventListener('mouseup', () => {
            isMouseDown = false;
            container.style.cursor = 'grab';
        });
    }

    public static drillNestedValues(tableDataRow: any, drillDots: string[], index: number, len: number): any {
        if (index === len) {
            // Return the value found at the last nested property
            return tableDataRow;
        }

        // Check if the current key exists in the object
        if (tableDataRow.hasOwnProperty(drillDots[index])) {
            // If it exists, recursively call drillNestedValues with the nested object and next index
            return this.drillNestedValues(tableDataRow[drillDots[index]], drillDots, index + 1, len);
        } else {
            // If the key doesn't exist, return undefined (or handle error as needed)
            return undefined;
        }
    }

    public static createNestedJson(keys: string, value: any): any {
        const obj = {};
        const parts = keys.split('.');

        const assignValue = (obj: any, parts: string[], value: any) => {
            const currentKey = parts.shift();
            if (parts.length === 0) {
                obj[currentKey as string] = value;
            } else {
                obj[currentKey as string] = obj[currentKey as string] || {};
                assignValue(obj[currentKey as string], parts, value);
            }
        };

        assignValue(obj, parts, value);
        return obj;
    }

    public static isDefinedString(str: string): boolean {
        return str !== null && str !== undefined && str !== "";
    }
}