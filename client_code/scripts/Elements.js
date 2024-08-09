"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Elements = void 0;
const EventListeners_1 = require("./EventListeners");
class Elements {
    static newButton(options) {
        var _a;
        const btnContainer = Elements.newElement({
            callOnClick: options.callOnClick,
            classes: ["standard-button", ...((_a = options.btnClasses) !== null && _a !== void 0 ? _a : [])]
        });
        const btnIcon = Elements.newElement({
            tag: "i",
            classes: options.iconClasses || ["fas", "fa-plus-circle"]
        });
        btnContainer.appendChild(btnIcon);
        if (options.text) {
            const btnText = Elements.newElement({
                classes: ["add-more-deps-title"]
            });
            btnText.innerHTML = options.text;
            btnContainer.appendChild(btnText);
        }
        return btnContainer;
    }
    static newInput(options) {
        var _a, _b, _c, _d;
        let addObjects = [];
        const input = Elements.newElement({
            tag: (_a = options.tag) !== null && _a !== void 0 ? _a : "input",
            type: (_b = options.type) !== null && _b !== void 0 ? _b : "input",
            id: options.name,
            value: options.value,
            disabled: !!options.disabled,
            callOnClick: options.callOnClick,
            classes: ["regular-input", ...((_c = options.classes) !== null && _c !== void 0 ? _c : [])]
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
            input.setAttribute("disabled", disabled + "");
        }
        if (options.prefix) {
            const prefix = Elements.newElement({
                text: options.prefix,
                classes: ["input-prefix"]
            });
            addObjects.push(prefix);
            addObjects.push(input);
        }
        else {
            addObjects.push(input);
        }
        input.setAttribute("placeholder", (_d = options.placeholder) !== null && _d !== void 0 ? _d : "");
        if (options.label) {
            const label = Elements.newElement({
                text: options.label,
                tag: "label",
                classes: ["input-label"]
            });
            label.setAttribute("for", input.name);
            addObjects.push(label);
        }
        const error = Elements.newElement({
            classes: ["input-error"]
        });
        addObjects.push(error);
        return {
            html: Elements.newElement({
                classes: ["input-wrapper"],
                append: addObjects
            }),
            input: input,
            setError: (errorStr) => {
                error.innerHTML = errorStr !== null && errorStr !== void 0 ? errorStr : "";
            },
            validation: () => {
                return options.validation ? options.validation(input.value) : () => {
                };
            },
            setInput: (str) => {
                input.value = str !== null && str !== void 0 ? str : "";
            },
            clearError: () => {
                error.innerHTML = "";
            }
        };
    }
    static newElement(options) {
        var _a, _b, _c, _d, _e, _f, _g;
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
                if (((_b = options.text) === null || _b === void 0 ? void 0 : _b.includes("<d>")) || ((_c = options.text) === null || _c === void 0 ? void 0 : _c.includes("<t>")) || ((_d = options.text) === null || _d === void 0 ? void 0 : _d.includes("<div")) || ((_e = options.text) === null || _e === void 0 ? void 0 : _e.includes("<b"))) {
                    const tmp = document.createElement("div");
                    tmp.innerHTML = options.text;
                    tmpDiv.appendChild(tmp);
                }
                else {
                    const text = document.createTextNode(options.text);
                    tmpDiv.appendChild(text);
                }
            }
            if (key === "type") {
                if (!(tmpDiv instanceof HTMLTextAreaElement)) {
                    tmpDiv.type = options.type;
                }
            }
            if (key === "target") {
                if (!(tmpDiv instanceof HTMLTextAreaElement)) {
                    tmpDiv.target = options.target;
                }
            }
            if (key === "disabled") {
                tmpDiv.disabled = options.disabled;
            }
            if (key === "value") {
                tmpDiv.value = (_f = options.value) !== null && _f !== void 0 ? _f : "";
            }
            if (key === "placeholder") {
                tmpDiv.placeholder = (_g = options.placeholder) !== null && _g !== void 0 ? _g : "";
            }
            if (key === "name") {
                tmpDiv.name = options.name;
            }
            if (key === "title") {
                tmpDiv.title = options.text;
            }
            if (key === "max") {
                if (!(tmpDiv instanceof HTMLTextAreaElement)) {
                    tmpDiv.max = options.max;
                }
            }
            if (key === "min") {
                if (!(tmpDiv instanceof HTMLTextAreaElement)) {
                    tmpDiv.min = options.min;
                }
            }
            if (key === "id") {
                tmpDiv.id = options.id;
            }
            if (key === "href") {
                tmpDiv.href = options.href;
            }
            if (key === "src") {
                if (!(tmpDiv instanceof HTMLTextAreaElement)) {
                    tmpDiv.src = options.src;
                }
            }
        }
        if (options.callOnClick) {
            if (Array.isArray(options.callOnClick)) {
                for (let callOnClick of options.callOnClick) {
                    Elements.setClick(callOnClick, tmpDiv);
                }
            }
            else {
                Elements.setClick(options.callOnClick, tmpDiv);
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
    static setClick(eventParams, element) {
        var _a, _b;
        EventListeners_1.EventListeners.unlisten(eventParams.callFnName);
        EventListeners_1.EventListeners.groupListeners(eventParams.callFnName, [
            {
                type: (_a = eventParams.callType) !== null && _a !== void 0 ? _a : "click",
                context: this,
                callback: (e) => {
                    const fn = eventParams.fn;
                    if (fn && typeof fn === "function") {
                        fn(element, e);
                    }
                },
                debounce: (_b = eventParams.callDebounce) !== null && _b !== void 0 ? _b : 10,
                element: element
            }
        ]);
    }
}
exports.Elements = Elements;
