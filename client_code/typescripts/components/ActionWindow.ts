import {Alert} from "../Alert";
import {Tools} from "../Tools";
import {KeyStringInterface} from "../interfaces/KeyStringInterface";
import {Translations} from "../Translations";
import {EventListeners} from "../EventListeners";
import {Elements} from "../Elements";
import {Fetcher} from "../Fetcher";

interface ActionWindowConfs<ContextType> {
    context: ContextType,
    type?: number,
    message?: string | Node,
    appender?: HTMLDivElement
    title?: string,
    parentClass?: string,
    msgBoxTitle?: string,
    animationStyle?: string,
    callbackBtnYesText?: string,
    callbackBtnNoText?: string
}

interface MsgBoxElements {
    title: HTMLDivElement | null
    msgContainer: HTMLDivElement | null
    actionBtnsCntr: HTMLDivElement | null
    searchBoxCntr: HTMLDivElement | null
    resultsBoxCntr: HTMLDivElement | null
}

export class ActionWindow<ContextType> {
    private alertPopup: Alert<ContextType>
    private configs: ActionWindowConfs<ContextType>
    #translationsG: KeyStringInterface<string>
    private msgBoxElements: MsgBoxElements = {
        title: null,
        msgContainer: null,
        actionBtnsCntr: null,
        searchBoxCntr: null,
        resultsBoxCntr: null
    }

    constructor(configs: ActionWindowConfs<ContextType>) {
        this.configs = configs;
        this.#translationsG = <KeyStringInterface<string>>Translations.get("general");
        this.alertPopup = new Alert<ContextType>({
            type: 1,
            title: configs.title ?? "",
            message: this.createMsgBox(),
            animationStyle: configs.animationStyle ?? "fadeIn",
            parentClass: configs.parentClass ?? "manager-window-modal",
            context: configs.context,
            callbackBtnYesText: configs.callbackBtnYesText ?? this.#translationsG.approveTitle,
            callbackBtnNoText: configs.callbackBtnNoText ?? this.#translationsG.cancelTitle,

        }, (modal, msgBox) => {
        });
    }

    private createMsgBox(): HTMLDivElement {
        const configs = this.configs;
        const msgBoxElements = this.msgBoxElements;

        const msgContainer = <HTMLDivElement>Tools.createDiv({
            classes: ["action-window-message-box"]
        });

        const title = <HTMLDivElement>Tools.createDiv({
            classes: ["action-window-msgbox-title"]
        });

        if (configs.msgBoxTitle) {
            title.innerHTML = configs.msgBoxTitle;
        }

        const actionBtnsCntr: HTMLDivElement = <HTMLDivElement>Tools.createDiv({
            classes: ["action-window-msgbox-buttons"]
        });

        const searchBoxCntr: HTMLDivElement = <HTMLDivElement>Tools.createDiv({
            classes: ["action-window-msgbox-search"]
        });

        const resultsBoxCntr: HTMLDivElement = <HTMLDivElement>Tools.createDiv({
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

    public addCloseX(callFn?:()=>void): ActionWindow<ContextType> {
        const closeIcon = <HTMLDivElement>Tools.createDiv({
            classes: ["close", "fas", "fa-times"]
        });

        EventListeners.groupListeners("closeCandidateViewer", [
            {
                type: "click",
                context: this,
                callback: () => {
                    EventListeners.unlisten("closeCandidateViewer");
                    if (callFn && typeof callFn === "function"){
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

    public addSaveBtnToTitle(fn: () => void, saveText?: string): ActionWindow<ContextType> {
        const btnText = saveText ?? this.#translationsG.approveTitle
        const closeIcon = <HTMLDivElement>Elements.newButton({
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

    public setCallbackYes(fn: () => void): ActionWindow<ContextType> {
        return this.setCallback(fn, 1);
    }

    public setCallbackNo(fn: () => void): ActionWindow<ContextType> {
        return this.setCallback(fn, 0);
    }

    public removeYesBtn(): ActionWindow<ContextType> {
        this.alertPopup.removeYesBtn();
        return this;
    }

    public removeNoBtn(): ActionWindow<ContextType> {
        this.alertPopup.removeNoBtn();
        return this;
    }

    private setCallback(fn: () => void, type: number): ActionWindow<ContextType> {
        if (!fn || typeof fn !== "function") {
            return this;
        }
        this.alertPopup.setCallback(fn, type);
        return this;
    }

    public setTitleText(text: string): void {
        this.msgBoxElements!.title!.innerHTML = text ?? "";
    }

    public setModalTitleText(text: string): void {
        this.alertPopup.setTitleText(text ?? "");
    }

    public msgBoxTitleAppend(htmlNode: HTMLDivElement): void {
        this.msgBoxElements!.title!.appendChild(htmlNode);
    }

    public close(): void {
        this.alertPopup.remove();
    }

    public searchElement(): HTMLDivElement {
        return <HTMLDivElement>this.msgBoxElements!.searchBoxCntr;
    }

    public removeSearchBoxCntr(): ActionWindow<ContextType> {
        this.msgBoxElements!.searchBoxCntr?.remove();
        return this
    }

    public removeActionBtnsCntr(): ActionWindow<ContextType> {
        this.msgBoxElements!.actionBtnsCntr?.remove();
        return this
    }

    public removeResultsElement(): ActionWindow<ContextType> {
        this.msgBoxElements!.resultsBoxCntr?.remove();
        return this;
    }

    public resultsElement(): HTMLDivElement {
        return <HTMLDivElement>this.msgBoxElements!.resultsBoxCntr;
    }

    public resultsSectionAppend(itemtoAttach: HTMLDivElement): void {
        const boxElements = this.msgBoxElements;
        if (!boxElements || !itemtoAttach) {
            return;
        }
        boxElements.resultsBoxCntr?.appendChild(itemtoAttach);
    }

    public appendToSearchEl(itemtoAttach: HTMLDivElement): void {
        const boxElements = this.msgBoxElements;
        if (!boxElements || !itemtoAttach) {
            return;
        }
        boxElements.searchBoxCntr?.appendChild(itemtoAttach);
    }

    public appendToActionBtns(itemtoAttach: HTMLDivElement): void {
        const boxElements = this.msgBoxElements;
        if (!boxElements || !itemtoAttach) {
            return;
        }
        boxElements.actionBtnsCntr?.appendChild(itemtoAttach);
    }
}