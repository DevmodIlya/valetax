"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropDown = void 0;
const Tools_1 = require("../Tools");
const EventListeners_1 = require("../EventListeners");
class DropDown {
    constructor(compConfs) {
        this.isOpen = true;
        this.compConfs = compConfs;
        const appendTo = compConfs.appendTo;
        if (!appendTo || appendTo === "") {
            return;
        }
        if (typeof appendTo === "string") {
            this.appender = document.querySelector(appendTo);
        }
        else {
            this.appender = appendTo;
        }
        EventListeners_1.EventListeners.unlistenNamespace(compConfs.class);
        this.appender.appendChild(this.createComponent());
        // window.addEventListener('focus', this.handleClickOutside.bind(this));
    }
    createComponent() {
        this.drpdwnContainer = Tools_1.Tools.createDiv({
            tag: "button",
            disabled: this.compConfs.disabled,
            classes: ["dropdown-container"]
        });
        const drpdwnIVcontainer = Tools_1.Tools.createDiv({
            classes: ["dropdown-icon-value-wrapper"]
        });
        this.drpdwnErr = Tools_1.Tools.createDiv({
            classes: ["dropdown-err"]
        });
        const drpdwnIconContainer = Tools_1.Tools.createDiv({
            classes: ["dropdown-icon-container"]
        });
        const drpdwnIcon = Tools_1.Tools.createDiv({
            tag: "i",
            classes: ["fas", "fa-chevron-down"]
        });
        drpdwnIconContainer.appendChild(drpdwnIcon);
        const dropDownValWrapper = Tools_1.Tools.createDiv({
            classes: ["dropdown-value-wrapper"]
        });
        this.choiceField = Tools_1.Tools.createDiv({
            text: this.compConfs.chooseText,
            classes: ["dropdown-value-container"]
        });
        if (this.compConfs.label) {
            const drpdwnLabel = Tools_1.Tools.createDiv({
                text: this.compConfs.label,
                classes: ["dropdown-label"]
            });
            this.drpdwnContainer.appendChild(drpdwnLabel);
        }
        dropDownValWrapper.appendChild(this.choiceField);
        dropDownValWrapper.appendChild(this.optionsContainer());
        drpdwnIVcontainer.appendChild(dropDownValWrapper);
        drpdwnIVcontainer.appendChild(drpdwnIconContainer);
        this.drpdwnContainer.appendChild(drpdwnIVcontainer);
        this.drpdwnContainer.appendChild(this.drpdwnErr);
        const compConfs = this.compConfs;
        EventListeners_1.EventListeners.unlistenNamespace(compConfs.class + "dropdown");
        EventListeners_1.EventListeners.groupListeners(Tools_1.Tools.calcChecksum(compConfs.class + "dropdown-dropdown"), [
            {
                type: "click",
                context: compConfs.bindTo,
                callback: (item) => {
                    this.optionsCntr.style.display = this.isOpen ? 'block' : 'none';
                    this.isOpen = !this.isOpen;
                },
                debounce: 20,
                element: dropDownValWrapper
            }
        ]);
        return this.drpdwnContainer;
    }
    optionsContainer() {
        const compConfs = this.compConfs;
        this.optionsCntr = Tools_1.Tools.createDiv({
            classes: ["dropdown-options-container"]
        });
        // this.optionsCntr.style.display = 'none';
        const optionsWrapper = Tools_1.Tools.createDiv({
            classes: ["dropdown-options-wrapper"]
        });
        const optionsList = compConfs.options;
        if (!optionsList || optionsList.length === 0) {
            return this.optionsCntr;
        }
        const optionEl = Tools_1.Tools.createDiv({
            text: compConfs.chooseText,
            id: -1,
            classes: ["option"]
        });
        optionsWrapper.appendChild(optionEl);
        optionsList.forEach((option) => {
            const optionEl = Tools_1.Tools.createDiv({
                text: option.txt,
                id: option.val,
                classes: ["option"]
            });
            optionsWrapper.appendChild(optionEl);
        });
        this.optionsCntr.appendChild(optionsWrapper);
        if (!compConfs.callFn) {
            return this.optionsCntr;
        }
        EventListeners_1.EventListeners.groupListeners(Tools_1.Tools.calcChecksum(compConfs.class + "-" + compConfs.callFn.toString()), [
            {
                type: "click",
                context: compConfs.bindTo,
                callback: (item) => this.onSelect(item),
                debounce: 70,
                element: optionsWrapper
            }
        ]);
        return this.optionsCntr;
    }
    error(msg) {
        if (!msg || msg === "") {
            return;
        }
        this.drpdwnErr.innerHTML = msg;
    }
    clear() {
        this.drpdwnErr.innerHTML = "";
    }
    set(value) {
        this.choiceField.innerHTML = value.toString();
        const selected = this.compConfs.options.find((sel) => sel.txt === value);
        this.selectedValue = selected;
        // this.compConfs.callFn!(selected as unknown as CT, this.choiceField);
    }
    checkIfSelected(errMessage) {
        const checkResult = this.selectedValue !== undefined;
        if (errMessage) {
            !checkResult ? this.error(errMessage) : this.clear();
        }
        return checkResult;
    }
    onSelect(e) {
        if (this.compConfs.disabled) {
            return;
        }
        const item = e.target;
        this.choiceField.innerHTML = item.innerHTML;
        const selected = this.compConfs.options.find((sel) => sel.val == item.id);
        console.log(selected);
        this.selectedValue = selected;
        this.clear();
        this.compConfs.callFn(selected, this.choiceField);
        this.isOpen = false;
        this.drpdwnContainer.blur();
        // this.optionsCntr.style.display = this.isOpen?'block':'none'
        // this.optionsCntr.style.display = 'none';
    }
}
exports.DropDown = DropDown;
