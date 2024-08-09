"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Translations = void 0;
class Translations {
    static get(index) {
        const storage = localStorage.getItem("translations");
        if (storage && storage !== "") {
            try {
                return JSON.parse(storage)[index];
            }
            catch (e) {
                return "";
            }
        }
        return "";
    }
}
exports.Translations = Translations;
