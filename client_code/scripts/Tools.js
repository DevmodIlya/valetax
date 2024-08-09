"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tools = void 0;
const Alert_1 = require("./Alert");
const Fetcher_1 = require("./Fetcher");
const Translations_1 = require("./Translations");
class Tools {
    static formatDate(originalDate) {
        const year = originalDate.getFullYear();
        const month = String(originalDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because month index starts from 0
        const day = String(originalDate.getDate()).padStart(2, '0');
        const hours = String(originalDate.getHours()).padStart(2, '0');
        const minutes = String(originalDate.getMinutes()).padStart(2, '0');
        const seconds = String("00").padStart(2, '0');
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return formattedDate;
    }
    static createDiv(options) {
        var _a, _b;
        const tmpDiv = document.createElement((_a = options.tag) !== null && _a !== void 0 ? _a : "div");
        for (let key in options) {
            if (key === "classes") {
                const classes = options[key];
                if (Array.isArray(classes)) {
                    for (let cls of classes) {
                        if (cls && cls != "") {
                            tmpDiv.classList.add(cls);
                        }
                    }
                }
                else {
                    tmpDiv.classList.add(classes);
                }
            }
            if (key === "text") {
                const text = document.createTextNode(options.text);
                tmpDiv.appendChild(text);
            }
            if (key === "type") {
                tmpDiv.type = options.type;
            }
            if (key === "value") {
                tmpDiv.value = (_b = options.value) !== null && _b !== void 0 ? _b : "";
            }
            if (key === "disabled" && options.disabled) {
                tmpDiv.setAttribute("disabled", "true");
            }
            if (key === "name") {
                tmpDiv.name = options.name;
            }
            if (key === "title") {
                tmpDiv.title = options.text;
            }
            if (key === "id") {
                tmpDiv.id = options.id;
            }
            if (key === "src") {
                tmpDiv.src = options.src;
            }
        }
        return tmpDiv;
    }
    static calcChecksum(str) {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 33) ^ str.charCodeAt(i);
        }
        const newhash = hash >>> 0;
        const checksum = newhash % 10000;
        return checksum.toString().padStart(5, '0');
    }
    static findItemInArray(sourceArray, key, equals) {
        var _a;
        if (!sourceArray) {
            return null;
        }
        return (_a = sourceArray.find((item) => item[key] === equals)) !== null && _a !== void 0 ? _a : null;
    }
    static toIndexedObj(obj, index) {
        if (!obj || obj.length === 0) {
            return null;
        }
        const temp = {};
        obj.forEach((item) => {
            // @ts-ignore
            temp[item[index]] = item;
        });
        return temp;
    }
    static searchRecord(searchPath, searchStr) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!searchPath || !searchStr || searchStr.length < 3) {
                return null;
            }
            return yield Fetcher_1.Fetcher.makeGetFetch(searchPath + "/" + searchStr);
        });
    }
    static errorPopupBox() {
        const translationsG = Translations_1.Translations.get("general");
        new Alert_1.Alert({
            type: 1,
            title: translationsG.networkErrorTitle,
            message: translationsG.networkErrorDsc,
            animationStyle: "fadeIn",
            callbackBtnYesText: translationsG.approveTitle,
            callbackYes: (innerModal) => {
                innerModal === null || innerModal === void 0 ? void 0 : innerModal.remove();
            }
        });
    }
    static dataErrorPopupBox() {
        const translationsG = Translations_1.Translations.get("general");
        new Alert_1.Alert({
            type: 1,
            title: translationsG.errorDataReq,
            message: translationsG.errorDataReqDsc,
            animationStyle: "fadeIn",
            callbackBtnYesText: translationsG.approveTitle,
            callbackYes: (innerModal) => {
                innerModal === null || innerModal === void 0 ? void 0 : innerModal.remove();
            }
        });
    }
    static unsusccessActionPopupBox() {
        const translationsG = Translations_1.Translations.get("general");
        new Alert_1.Alert({
            type: 1,
            title: translationsG.errorActionReq,
            message: translationsG.errorActionReqDsc,
            animationStyle: "fadeIn",
            callbackBtnYesText: translationsG.approveTitle,
            callbackYes: (innerModal) => {
                innerModal === null || innerModal === void 0 ? void 0 : innerModal.remove();
            }
        });
    }
    static objectLength(object) {
        if (!object) {
            return 0;
        }
        return Object.keys(object).length;
    }
    static approveActionPopupBox(options) {
        const translationsG = Translations_1.Translations.get("general");
        new Alert_1.Alert({
            type: 1,
            title: translationsG.approveActionTitle,
            message: options.msg ? options.msg : translationsG.approveActionDsc,
            animationStyle: "fadeIn",
            callbackBtnYesText: options.yesBtn ? options.yesBtn : translationsG.approveTitle,
            callbackBtnNoText: translationsG.cancelTitle,
            callbackYes: (innerModal) => {
                const okFn = options.okFn;
                if (okFn && typeof okFn === "function") {
                    okFn(innerModal);
                    return;
                }
                innerModal === null || innerModal === void 0 ? void 0 : innerModal.remove();
            },
            callbackNo: (innerModal) => {
                const notOkFn = options.notOkFn;
                if (notOkFn && typeof notOkFn === "function") {
                    notOkFn(innerModal);
                    return;
                }
                innerModal === null || innerModal === void 0 ? void 0 : innerModal.remove();
            }
        });
    }
    static popupBox(title, msg, okFn) {
        if (!title || !msg) {
            return;
        }
        const translationsG = Translations_1.Translations.get("general");
        new Alert_1.Alert({
            type: 1,
            title: title,
            message: msg,
            animationStyle: "fadeIn",
            callbackBtnYesText: translationsG.approveTitle,
            callbackYes: (innerModal) => {
                innerModal === null || innerModal === void 0 ? void 0 : innerModal.remove();
                if (okFn && typeof okFn === "function") {
                    okFn();
                }
            }
        });
    }
    static pushUniqueObject(array, object, key) {
        const exists = array.some(item => item[key] === object[key]);
        if (!exists) {
            array.push(object);
        }
        return array;
    }
    static dragScroll(elementClass) {
        let isMouseDown = false;
        let startX, scrollLeft;
        const container = typeof elementClass === "string" ? document.querySelector(elementClass) : elementClass;
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
            if (!isMouseDown)
                return;
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
    static drillNestedValues(tableDataRow, drillDots, index, len) {
        if (index === len) {
            // Return the value found at the last nested property
            return tableDataRow;
        }
        // Check if the current key exists in the object
        if (tableDataRow.hasOwnProperty(drillDots[index])) {
            // If it exists, recursively call drillNestedValues with the nested object and next index
            return this.drillNestedValues(tableDataRow[drillDots[index]], drillDots, index + 1, len);
        }
        else {
            // If the key doesn't exist, return undefined (or handle error as needed)
            return undefined;
        }
    }
    static createNestedJson(keys, value) {
        const obj = {};
        const parts = keys.split('.');
        const assignValue = (obj, parts, value) => {
            const currentKey = parts.shift();
            if (parts.length === 0) {
                obj[currentKey] = value;
            }
            else {
                obj[currentKey] = obj[currentKey] || {};
                assignValue(obj[currentKey], parts, value);
            }
        };
        assignValue(obj, parts, value);
        return obj;
    }
    static isDefinedString(str) {
        return str !== null && str !== undefined && str !== "";
    }
}
exports.Tools = Tools;
