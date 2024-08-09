import {Tools} from "../Tools";
import {EventListeners} from "../EventListeners";
import {Option} from "../interfaces/OptionInterface";


interface ComponentParams<BT, CT> {
    chooseText?: string
    label?: string
    disabled?: boolean
    appendTo: string | HTMLDivElement
    options: Option[]
    class: string
    bindTo: BT
    callFn?: (data: CT | null, selectField: HTMLDivElement) => void
}

export class DropDown<BT, CT> {
    private compConfs: ComponentParams<BT, CT>
    private appender: HTMLDivElement;
    private drpdwnErr: HTMLDivElement;
    private drpdwnContainer: HTMLDivElement;
    private choiceField: HTMLDivElement;
    private optionsCntr: HTMLDivElement;
    private selectedValue: Option | undefined;
    private isOpen: boolean = true;

    constructor(compConfs: ComponentParams<BT, CT>) {
        this.compConfs = compConfs;
        const appendTo = compConfs.appendTo;
        if (!appendTo || appendTo === "") {
            return;
        }
        if (typeof appendTo === "string") {
            this.appender = <HTMLDivElement>document.querySelector(<string>appendTo);
        } else {
            this.appender = <HTMLDivElement>appendTo;
        }

        EventListeners.unlistenNamespace(compConfs.class);

        this.appender.appendChild(this.createComponent());

        // window.addEventListener('focus', this.handleClickOutside.bind(this));
    }

    private createComponent(): HTMLDivElement {
        this.drpdwnContainer = <HTMLDivElement>Tools.createDiv<HTMLDivElement>({
            tag: "button",
            disabled: <boolean>this.compConfs.disabled,
            classes: ["dropdown-container"]
        });
        const drpdwnIVcontainer = <HTMLDivElement>Tools.createDiv<HTMLDivElement>({
            classes: ["dropdown-icon-value-wrapper"]
        });
        this.drpdwnErr = <HTMLDivElement>Tools.createDiv<HTMLDivElement>({
            classes: ["dropdown-err"]
        });
        const drpdwnIconContainer: HTMLDivElement = <HTMLDivElement>Tools.createDiv<HTMLDivElement>({
            classes: ["dropdown-icon-container"]
        });
        const drpdwnIcon: HTMLDivElement = <HTMLDivElement>Tools.createDiv<HTMLDivElement>({
            tag: "i",
            classes: ["fas", "fa-chevron-down"]
        });
        drpdwnIconContainer.appendChild(drpdwnIcon);

        const dropDownValWrapper = <HTMLDivElement>Tools.createDiv<HTMLDivElement>({
            classes: ["dropdown-value-wrapper"]
        });

        this.choiceField = <HTMLDivElement>Tools.createDiv<HTMLDivElement>({
            text: <string>this.compConfs.chooseText,
            classes: ["dropdown-value-container"]
        });

        if (this.compConfs.label) {
            const drpdwnLabel = <HTMLDivElement>Tools.createDiv<HTMLDivElement>({
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

        EventListeners.unlistenNamespace(compConfs.class + "dropdown");
        EventListeners.groupListeners<BT, CT>(Tools.calcChecksum(compConfs.class + "dropdown-dropdown"), [
            {
                type: "click",
                context: compConfs.bindTo,
                callback: (item?: BT) => {
                    this.optionsCntr.style.display = this.isOpen ? 'block' : 'none'
                    this.isOpen = !this.isOpen;
                },
                debounce: 20,
                element: dropDownValWrapper
            }
        ]);

        return this.drpdwnContainer;
    }

    private optionsContainer(): HTMLDivElement {
        const compConfs = this.compConfs;
        this.optionsCntr = <HTMLDivElement>Tools.createDiv<HTMLDivElement>({
            classes: ["dropdown-options-container"]
        });

        // this.optionsCntr.style.display = 'none';

        const optionsWrapper: HTMLDivElement = <HTMLDivElement>Tools.createDiv<HTMLDivElement>({
            classes: ["dropdown-options-wrapper"]
        });

        const optionsList: Option[] = compConfs.options;

        if (!optionsList || optionsList.length === 0) {
            return this.optionsCntr;
        }

        const optionEl: HTMLDivElement = <HTMLDivElement>Tools.createDiv<HTMLDivElement>({
            text: <string>compConfs.chooseText,
            id: -1,
            classes: ["option"]
        });
        optionsWrapper.appendChild(optionEl);

        optionsList.forEach((option: Option): void => {
            const optionEl: HTMLDivElement = <HTMLDivElement>Tools.createDiv<HTMLDivElement>({
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
        EventListeners.groupListeners<BT, CT>(Tools.calcChecksum(compConfs.class + "-" + compConfs.callFn.toString()), [
            {
                type: "click",
                context: compConfs.bindTo,
                callback: (item?: BT) => this.onSelect(item),
                debounce: 70,
                element: optionsWrapper
            }
        ]);

        return this.optionsCntr;
    }

    public error(msg: string): void {
        if (!msg || msg === "") {
            return;
        }
        this.drpdwnErr.innerHTML = msg;
    }

    public clear(): void {
        this.drpdwnErr.innerHTML = "";
    }

    public set(value: string): void {
        this.choiceField.innerHTML = value.toString();
        const selected = this.compConfs.options.find((sel: Option) => sel.txt === value);
        this.selectedValue = selected;
        // this.compConfs.callFn!(selected as unknown as CT, this.choiceField);
    }

    public checkIfSelected(errMessage?: string): boolean {
        const checkResult = this.selectedValue !== undefined;
        if (errMessage) {
            !checkResult ? this.error(errMessage) : this.clear();
        }
        return checkResult;
    }

    private onSelect(e: any): void {
        if (this.compConfs.disabled){
            return;
        }
        const item: HTMLDivElement = <HTMLDivElement>e.target;
        this.choiceField.innerHTML = item.innerHTML;
        const selected = this.compConfs.options.find((sel: Option) =>
            sel.val == item.id
        );
        console.log(selected)
        this.selectedValue = selected;
        this.clear();
        this.compConfs.callFn!(selected as unknown as CT, this.choiceField);
        this.isOpen = false;
        this.drpdwnContainer.blur();
        // this.optionsCntr.style.display = this.isOpen?'block':'none'
        // this.optionsCntr.style.display = 'none';
    }
}