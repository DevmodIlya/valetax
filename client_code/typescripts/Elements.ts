import {KeyStringInterface} from "./interfaces/KeyStringInterface";
import {EventListeners} from "./EventListeners";
import {InputElement} from "./interfaces/Elements";

interface DivWithIcon extends HTMLDivElement {
    icon: HTMLDivElement
}

type Fn = (el?: HTMLDivElement, e?: Event) => void;

interface EventParameters {
    fn: Fn,
    callType?: string,
    callDebounce?: number
    callFnName: string
}

interface Button {
    text?: string
    btnClasses?: string[]
    iconClasses?: string[]
    callOnClick?: EventParameters
}

interface Input {
    name: string
    value?: string
    tag?: string
    label?: string
    type?: string
    min?: string
    max?: string
    placeholder?: string
    classes?: string[]
    prefix?: string
    disabled?: boolean
    validation?: (str?: string) => void
    callOnClick?: EventParameters
}

interface NewDiv {
    id?: string
    text?: string
    type?: string
    value?: string
    name?: string
    title?: string
    href?: string
    src?: string,
    tag?: string,
    max?: string,
    min?: string,
    target?: string,
    disabled?: boolean,
    placeholder?: string,
    classes?: string[],
    attachTo?: HTMLDivElement,
    callOnClick?: EventParameters | EventParameters[]
    append?: HTMLDivElement[] | HTMLInputElement[] | HTMLButtonElement[] | HTMLAnchorElement[]
}

export class Elements {
    public static newButton(options: Button): HTMLDivElement {
        const btnContainer: DivWithIcon = <DivWithIcon>Elements.newElement({
            callOnClick: options.callOnClick,
            classes: ["standard-button", ...(<string[]>options.btnClasses ?? [])]
        });
        const btnIcon: HTMLDivElement = <HTMLDivElement>Elements.newElement({
            tag: "i",
            classes: <string[]>options.iconClasses || ["fas", "fa-plus-circle"]
        });
        btnContainer.appendChild(btnIcon);
        if (options.text) {
            const btnText: HTMLDivElement = <HTMLDivElement>Elements.newElement({
                classes: ["add-more-deps-title"]
            });
            btnText.innerHTML = <string>options.text;
            btnContainer.appendChild(btnText);
        }

        return btnContainer;
    }

    public static newInput(options: Input): InputElement {
        let addObjects = [];
        const input = <HTMLInputElement>Elements.newElement({
            tag: options.tag ?? "input",
            type: options.type ?? "input",
            id: options.name,
            value: options.value,
            disabled: !!options.disabled,
            callOnClick: options.callOnClick,
            classes: ["regular-input", ...(<string[]>options.classes ?? [])]
        });

        const min = options.min;
        if (min) {
            input.setAttribute("min", min);
        }

        const max = options.max;
        if (max) {
            input.setAttribute("max", max);
        }

        const disabled = options.disabled;
        if (disabled) {
            input.setAttribute("disabled", disabled+"");
        }

        if (options.prefix) {
            const prefix = <HTMLInputElement>Elements.newElement({
                text: options.prefix,
                classes: ["input-prefix"]
            });
            addObjects.push(prefix);
            addObjects.push(input);
        } else {
            addObjects.push(input);
        }

        input.setAttribute("placeholder", <string>options.placeholder ?? "");

        if (options.label) {
            const label = <HTMLDivElement>Elements.newElement({
                text: options.label,
                tag: "label",
                classes: ["input-label"]
            });
            label.setAttribute("for", input.name)
            addObjects.push(label);
        }

        const error = <HTMLDivElement>Elements.newElement({
            classes: ["input-error"]
        });

        addObjects.push(error);

        return {
            html: <HTMLDivElement>Elements.newElement({
                classes: ["input-wrapper"],
                append: addObjects
            }),
            input: input,
            setError: (errorStr?: string) => {
                error.innerHTML = errorStr ?? "";
            },
            validation: () => {
                return options.validation ? options.validation(input.value) : () => {
                };
            },
            setInput: (str?: string) => {
                input.value = str ?? "";
            },
            clearError: () => {
                error.innerHTML = "";
            }
        };
    }

    public static newElement<T>(options: NewDiv): HTMLDivElement | T {
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
                if (options.text?.includes("<d>") ||options.text?.includes("<t>") || options.text?.includes("<div") || options.text?.includes("<b")) {
                    const tmp: HTMLDivElement = document.createElement("div");
                    tmp.innerHTML = options.text;
                    tmpDiv.appendChild(tmp);
                } else {
                    const text: Text = document.createTextNode(<string>options.text);
                    tmpDiv.appendChild(text);
                }
            }
            if (key === "type") {
                if (!(tmpDiv instanceof HTMLTextAreaElement)) {
                    (<HTMLInputElement>tmpDiv).type = <string>options.type;
                }
            }
            if (key === "target") {
                if (!(tmpDiv instanceof HTMLTextAreaElement)) {
                    (<any>tmpDiv).target = <string>options.target;
                }
            }
            if (key === "disabled") {
                (<HTMLInputElement>tmpDiv).disabled = <boolean>options.disabled;
            }
            if (key === "value") {
                (<HTMLInputElement>tmpDiv).value = <string>options.value ?? "";
            }
            if (key === "placeholder") {
                (<HTMLInputElement>tmpDiv).placeholder = <string>options.placeholder ?? "";
            }
            if (key === "name") {
                (<HTMLInputElement>tmpDiv).name = <string>options.name;
            }
            if (key === "title") {
                tmpDiv.title = (<string>options.text);
            }
            if (key === "max") {
                if (!(tmpDiv instanceof HTMLTextAreaElement)) {
                    (<HTMLInputElement>tmpDiv).max = (<string>options.max);
                }
            }
            if (key === "min") {
                if (!(tmpDiv instanceof HTMLTextAreaElement)) {
                    (<HTMLInputElement>tmpDiv).min = (<string>options.min);
                }
            }
            if (key === "id") {
                tmpDiv.id = <string>options.id;
            }
            if (key === "href") {
                (<any>tmpDiv).href = <string>options.href;
            }
            if (key === "src") {
                if (!(tmpDiv instanceof HTMLTextAreaElement)) {
                    (<HTMLImageElement>tmpDiv).src = <string>options.src;
                }
            }
        }

        if (options.callOnClick) {
            if (Array.isArray(options.callOnClick)) {
                for (let callOnClick of options.callOnClick) {
                    Elements.setClick(<EventParameters>callOnClick, tmpDiv);
                }
            } else {
                Elements.setClick(<EventParameters>options.callOnClick, tmpDiv);
            }
        }

        const appendList = options.append;
        if (appendList && appendList.length > 0) {
            for (let element of appendList) {
                if (element) {
                    tmpDiv.appendChild(element);
                }
            }
        }

        if (options.attachTo) {
            options.attachTo.appendChild(tmpDiv);
        }

        return tmpDiv;
    }

    public static setClick(eventParams: EventParameters, element: HTMLDivElement | HTMLInputElement | HTMLButtonElement) {
        EventListeners.unlisten(eventParams.callFnName);
        EventListeners.groupListeners(eventParams.callFnName, [
            {
                type: eventParams.callType ?? "click",
                context: this,
                callback: (e: any) => {
                    const fn = eventParams.fn;
                    if (fn && typeof fn === "function") {
                        fn(<HTMLDivElement>element, e);
                    }
                },
                debounce: eventParams.callDebounce ?? 10,
                element: element
            }
        ]);
    }
}