"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ActionWindow_translationsG;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionWindow = void 0;
const Alert_1 = require("../Alert");
const Tools_1 = require("../Tools");
const Translations_1 = require("../Translations");
const EventListeners_1 = require("../EventListeners");
const Elements_1 = require("../Elements");
class ActionWindow {
    constructor(configs) {
        var _a, _b, _c, _d, _e;
        _ActionWindow_translationsG.set(this, void 0);
        this.msgBoxElements = {
            title: null,
            msgContainer: null,
            actionBtnsCntr: null,
            searchBoxCntr: null,
            resultsBoxCntr: null
        };
        this.configs = configs;
        __classPrivateFieldSet(this, _ActionWindow_translationsG, Translations_1.Translations.get("general"), "f");
        this.alertPopup = new Alert_1.Alert({
            type: 1,
            title: (_a = configs.title) !== null && _a !== void 0 ? _a : "",
            message: this.createMsgBox(),
            animationStyle: (_b = configs.animationStyle) !== null && _b !== void 0 ? _b : "fadeIn",
            parentClass: (_c = configs.parentClass) !== null && _c !== void 0 ? _c : "manager-window-modal",
            context: configs.context,
            callbackBtnYesText: (_d = configs.callbackBtnYesText) !== null && _d !== void 0 ? _d : __classPrivateFieldGet(this, _ActionWindow_translationsG, "f").approveTitle,
            callbackBtnNoText: (_e = configs.callbackBtnNoText) !== null && _e !== void 0 ? _e : __classPrivateFieldGet(this, _ActionWindow_translationsG, "f").cancelTitle,
        }, (modal, msgBox) => {
        });
    }
    createMsgBox() {
        const configs = this.configs;
        const msgBoxElements = this.msgBoxElements;
        const msgContainer = Tools_1.Tools.createDiv({
            classes: ["action-window-message-box"]
        });
        const title = Tools_1.Tools.createDiv({
            classes: ["action-window-msgbox-title"]
        });
        if (configs.msgBoxTitle) {
            title.innerHTML = configs.msgBoxTitle;
        }
        const actionBtnsCntr = Tools_1.Tools.createDiv({
            classes: ["action-window-msgbox-buttons"]
        });
        const searchBoxCntr = Tools_1.Tools.createDiv({
            classes: ["action-window-msgbox-search"]
        });
        const resultsBoxCntr = Tools_1.Tools.createDiv({
            classes: ["action-window-msgbox-results"]
        });
        msgContainer.appendChild(title);
        msgContainer.appendChild(actionBtnsCntr);
        msgContainer.appendChild(actionBtnsCntr);
        msgContainer.appendChild(searchBoxCntr);
        msgContainer.appendChild(resultsBoxCntr);
        msgBoxElements.msgContainer = msgContainer;
        msgBoxElements.title = title;
        msgBoxElements.actionBtnsCntr = actionBtnsCntr;
        msgBoxElements.searchBoxCntr = searchBoxCntr;
        msgBoxElements.resultsBoxCntr = resultsBoxCntr;
        this.msgBoxElements = msgBoxElements;
        return msgContainer;
    }
    addCloseX(callFn) {
        const closeIcon = Tools_1.Tools.createDiv({
            classes: ["close", "fas", "fa-times"]
        });
        EventListeners_1.EventListeners.groupListeners("closeCandidateViewer", [
            {
                type: "click",
                context: this,
                callback: () => {
                    EventListeners_1.EventListeners.unlisten("closeCandidateViewer");
                    if (callFn && typeof callFn === "function") {
                        callFn();
                    }
                    this.alertPopup.remove();
                },
                debounce: 1000,
                element: closeIcon
            }
        ]);
        this.alertPopup.getTitle().appendChild(closeIcon);
        return this;
    }
    addSaveBtnToTitle(fn, saveText) {
        const btnText = saveText !== null && saveText !== void 0 ? saveText : __classPrivateFieldGet(this, _ActionWindow_translationsG, "f").approveTitle;
        const closeIcon = Elements_1.Elements.newButton({
            text: btnText,
            iconClasses: ["fa-solid", "fa-circle-check"],
            btnClasses: ["center"],
            callOnClick: {
                callDebounce: 2000,
                callFnName: "addSaveBtnToTitle",
                fn: () => {
                    if (fn && typeof fn === "function") {
                        fn();
                    }
                }
            }
        });
        this.alertPopup.getTitle().appendChild(closeIcon);
        return this;
    }
    setCallbackYes(fn) {
        return this.setCallback(fn, 1);
    }
    setCallbackNo(fn) {
        return this.setCallback(fn, 0);
    }
    removeYesBtn() {
        this.alertPopup.removeYesBtn();
        return this;
    }
    removeNoBtn() {
        this.alertPopup.removeNoBtn();
        return this;
    }
    setCallback(fn, type) {
        if (!fn || typeof fn !== "function") {
            return this;
        }
        this.alertPopup.setCallback(fn, type);
        return this;
    }
    setTitleText(text) {
        this.msgBoxElements.title.innerHTML = text !== null && text !== void 0 ? text : "";
    }
    setModalTitleText(text) {
        this.alertPopup.setTitleText(text !== null && text !== void 0 ? text : "");
    }
    msgBoxTitleAppend(htmlNode) {
        this.msgBoxElements.title.appendChild(htmlNode);
    }
    close() {
        this.alertPopup.remove();
    }
    searchElement() {
        return this.msgBoxElements.searchBoxCntr;
    }
    removeSearchBoxCntr() {
        var _a;
        (_a = this.msgBoxElements.searchBoxCntr) === null || _a === void 0 ? void 0 : _a.remove();
        return this;
    }
    removeActionBtnsCntr() {
        var _a;
        (_a = this.msgBoxElements.actionBtnsCntr) === null || _a === void 0 ? void 0 : _a.remove();
        return this;
    }
    removeResultsElement() {
        var _a;
        (_a = this.msgBoxElements.resultsBoxCntr) === null || _a === void 0 ? void 0 : _a.remove();
        return this;
    }
    resultsElement() {
        return this.msgBoxElements.resultsBoxCntr;
    }
    resultsSectionAppend(itemtoAttach) {
        var _a;
        const boxElements = this.msgBoxElements;
        if (!boxElements || !itemtoAttach) {
            return;
        }
        (_a = boxElements.resultsBoxCntr) === null || _a === void 0 ? void 0 : _a.appendChild(itemtoAttach);
    }
    appendToSearchEl(itemtoAttach) {
        var _a;
        const boxElements = this.msgBoxElements;
        if (!boxElements || !itemtoAttach) {
            return;
        }
        (_a = boxElements.searchBoxCntr) === null || _a === void 0 ? void 0 : _a.appendChild(itemtoAttach);
    }
    appendToActionBtns(itemtoAttach) {
        var _a;
        const boxElements = this.msgBoxElements;
        if (!boxElements || !itemtoAttach) {
            return;
        }
        (_a = boxElements.actionBtnsCntr) === null || _a === void 0 ? void 0 : _a.appendChild(itemtoAttach);
    }
}
exports.ActionWindow = ActionWindow;
_ActionWindow_translationsG = new WeakMap();
