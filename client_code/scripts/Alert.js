"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alert = void 0;
// @ts-ignore
window.states = {};
class Alert {
    constructor(options, callOnReady) {
        this.options = options;
        this.modal_parent = document.createElement("div");
        this.modal = document.createElement("div");
        this.buttonsCntr = document.createElement("div");
        this.elements = [];
        this.checkSum = 0;
        this.buttonsCntr.classList.add("buttons-container");
        this.calcChecksum(options.title + "" + options.message);
        this.id = this.checkSum;
        // @ts-ignore
        if (window.states[this.id]) {
            return;
        }
        // @ts-ignore
        window.states[this.id] = this;
        if (options.message) {
            let msgBoxEl;
            if (options.type !== 2) {
                this.alertTitle = this.appendTextualDiv(options.title, "message-title-box");
                msgBoxEl = this.alertTitle;
                msgBoxEl = this.appendTextualDiv(options.message, "message-box");
                this.messageBox = msgBoxEl;
            }
            else {
                const spinner = document.createElement("div");
                options.parentClass = "loader-box";
                spinner.classList.add("spinner");
                msgBoxEl = this.appendTextualDiv(options.message, "loader");
                msgBoxEl === null || msgBoxEl === void 0 ? void 0 : msgBoxEl.appendChild(spinner);
            }
            if (options.removeOnSelect && msgBoxEl) {
                msgBoxEl.addEventListener('click', () => {
                    this.remove();
                });
            }
        }
        if (options.callbackBtnNoText) {
            this.callbackBtnNoText = options.callbackBtnNoText;
        }
        if (options.callbackBtnYesText) {
            this.callbackBtnYesText = options.callbackBtnYesText;
        }
        if (options.callbackNo) {
            this.appendButton(options.callbackBtnNoText || "Cancel", "Cancel", options.callbackNo);
        }
        if (options.callbackYes) {
            this.appendButton(options.callbackBtnYesText || "Ok", "Ok", options.callbackYes);
        }
        this.elements.forEach((element) => {
            if (element.hasAttribute("type")) {
                this.buttonsCntr.appendChild(element);
            }
            else {
                this.modal.appendChild(element);
            }
        });
        this.modal.appendChild(this.buttonsCntr);
        this.modal_parent.className = "parent-modal " + options.parentClass;
        this.modal.className = "alert-modal animate__animated animate__" + (options.animationStyle || "");
        this.modal_parent.appendChild(this.modal);
        if (!options.appender) {
            document.body.appendChild(this.modal_parent);
        }
        if (options.appender) {
            this.modal_parent.style.position = "absolute";
            options.appender.appendChild(this.modal_parent);
        }
        if (callOnReady && typeof callOnReady === 'function' && options.context) {
            callOnReady.bind(options.context)(this, this.messageBox);
        }
    }
    handleActionBtn(btn, fn) {
        if (fn && typeof fn === "function") {
            fn();
        }
    }
    getTitle() {
        return this.alertTitle;
    }
    setTitleText(text) {
        if (text && text !== "" && this.alertTitle) {
            this.alertTitle.innerHTML = text;
        }
    }
    setCallback(fn, type) {
        if (!fn || typeof fn !== "function") {
            return;
        }
        if (type === 0) {
            this.callbackAcWNo = fn;
            this.noBtn = this.appendButton(this.callbackBtnNoText || "Cancel", "Cancel", fn, true);
            this.buttonsCntr.appendChild(this.noBtn);
            return;
        }
        if (type === 1) {
            this.callbackAcWYes = fn;
            this.yesBtn = this.appendButton(this.callbackBtnYesText || "Ok", "Ok", fn, true);
            this.buttonsCntr.appendChild(this.yesBtn);
        }
    }
    remove() {
        // @ts-ignore
        delete window.states[this.id];
        this.modal_parent.remove();
        // document.body.removeChild(this.modal_parent);
    }
    calcChecksum(str) {
        if (!str) {
            str = "a";
        }
        let tmp = 0;
        if (this.checkSum > 0) {
            tmp = this.checkSum;
        }
        for (let i = 0; i < str.length; i++) {
            let chr = str.charCodeAt(i);
            this.checkSum = ((this.checkSum << 5) - this.checkSum) + chr;
            this.checkSum |= 0; // Convert to 32bit integer
        }
        return this.checkSum + tmp;
    }
    appendTextualDiv(message, cssClass) {
        if (!message) {
            return null;
        }
        const messageBox = document.createElement("div");
        if (typeof message === "string") {
            if (message.indexOf("<div") > -1 || message.indexOf("<iframe") > -1 || message.indexOf("<img") > -1 || message.indexOf("<input") > -1) {
                messageBox.innerHTML = message;
            }
            else {
                const messageTxt = document.createTextNode(message);
                messageBox.appendChild(messageTxt);
            }
        }
        if (typeof message === "object") {
            messageBox.appendChild(message);
        }
        messageBox.className = cssClass;
        this.elements.push(messageBox);
        this.msgBox = messageBox;
        return messageBox;
    }
    getMessageBox() {
        return this.msgBox;
    }
    findInMsgBox(querySelector) {
        if (!querySelector || querySelector === "") {
            return null;
        }
        return this.msgBox.querySelector(querySelector);
    }
    appendButton(btnText, btnCaption, callback, isActionw) {
        const button = this.appendTextualDiv(btnText, btnCaption.toLowerCase() + "button");
        if (button) {
            button.setAttribute("type", "1");
            button.addEventListener("click", () => {
                if (typeof callback === "function") {
                    callback(this);
                }
            });
            if (!isActionw) {
                this.elements.push(button);
            }
        }
        return button;
    }
    removeYesBtn() {
        if (this.yesBtn) {
            this.yesBtn.remove();
        }
    }
    removeNoBtn() {
        if (this.noBtn) {
            this.noBtn.remove();
        }
    }
    static closeAlerts() {
        // @ts-ignore
        const alerts = window.states;
        for (let k in alerts) {
            alerts[k].remove();
        }
    }
}
exports.Alert = Alert;
