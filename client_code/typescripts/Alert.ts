interface AlertOptions<C> {
    type: number
    message: string | Node
    title?: string
    context?: C
    parentClass?: string
    animationStyle?: string
    callbackBtnNoText?: string
    callbackBtnYesText?: string
    appender?: HTMLDivElement
    callbackYes?: (modal?: Alert<C>) => void
    callbackNo?: (modal?: Alert<C>) => void
    removeOnSelect?: boolean
}

interface Alerts<C> {
    [key: number]: Alert<C>
}

// @ts-ignore
window.states = {}

export class Alert<C> {
    modal: HTMLDivElement
    buttonsCntr: HTMLDivElement
    modal_parent: HTMLElement
    messageBox: HTMLDivElement
    private options: AlertOptions<C>
    private alertTitle: HTMLDivElement
    private msgBox: HTMLDivElement
    private yesBtn: HTMLDivElement
    private noBtn: HTMLDivElement
    private BtnFnSet: boolean
    private callbackBtnNoText: string
    private callbackBtnYesText: string
    public callbackAcWYes?: (modal?: Alert<C>) => void
    public callbackAcWNo?: (modal?: Alert<C>) => void
    id: number
    type: number
    private checkSum: number
    elements: HTMLElement[]
    modals: any

    constructor(options: AlertOptions<C>, callOnReady?: (modal?: Alert<C>, msgBox?: HTMLDivElement | undefined, context?: C) => void) {
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
            let msgBoxEl: Node | null;
            if (options.type !== 2) {
                this.alertTitle = <HTMLDivElement>this.appendTextualDiv(options.title, "message-title-box");
                msgBoxEl = this.alertTitle;
                msgBoxEl = this.appendTextualDiv(options.message, "message-box");
                this.messageBox = msgBoxEl as HTMLDivElement;
            } else {
                const spinner = document.createElement("div");
                options.parentClass = "loader-box";
                spinner.classList.add("spinner");
                msgBoxEl = this.appendTextualDiv(options.message, "loader");
                msgBoxEl?.appendChild(spinner)
            }
            if (options.removeOnSelect && msgBoxEl) {
                msgBoxEl.addEventListener('click', () => {
                    this.remove();
                })
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

        this.elements.forEach((element: HTMLElement) => {
            if (element.hasAttribute("type")) {
                this.buttonsCntr.appendChild(element);
            } else {
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

    handleActionBtn(btn: HTMLDivElement, fn: (modal?: Alert<C>) => void): any {
        if (fn && typeof fn === "function") {
            fn();
        }
    }

    getTitle(): HTMLDivElement {
        return this.alertTitle;
    }

    setTitleText(text: string): void {
        if (text && text !== "" && this.alertTitle) {
            this.alertTitle.innerHTML = text;
        }
    }

    setCallback(fn: () => void, type: number): void {
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
        this.modal_parent.remove()
        // document.body.removeChild(this.modal_parent);
    }

    private calcChecksum(str: string | undefined): number {
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

    appendTextualDiv(message: string | null | undefined | Node, cssClass: string): HTMLDivElement | null {
        if (!message) {
            return null;
        }
        const messageBox = document.createElement("div");

        if (typeof message === "string") {
            if (message.indexOf("<div") > -1 || message.indexOf("<iframe") > -1 || message.indexOf("<img") > -1 || message.indexOf("<input") > -1) {
                messageBox.innerHTML = message
            } else {
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

    getMessageBox(): HTMLDivElement {
        return this.msgBox;
    }

    findInMsgBox(querySelector: string): HTMLDivElement | null {
        if (!querySelector || querySelector === "") {
            return null;
        }
        return this.msgBox.querySelector(querySelector);
    }

    appendButton(btnText: string, btnCaption: string, callback: (modal?: Alert<C>) => void, isActionw?: boolean): HTMLDivElement {
        const button = <HTMLDivElement>this.appendTextualDiv(btnText, btnCaption.toLowerCase() + "button");
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

    public removeYesBtn() {
        if (this.yesBtn) {
            this.yesBtn.remove();
        }
    }

    public removeNoBtn() {
        if (this.noBtn) {
            this.noBtn.remove();
        }
    }

    public static closeAlerts(): void {
        // @ts-ignore
        const alerts = window.states;
        for (let k in alerts) {
            alerts[k].remove();
        }
    }
}
