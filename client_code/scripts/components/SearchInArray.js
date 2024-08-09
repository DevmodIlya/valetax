"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchInArray = void 0;
const Tools_1 = require("../Tools");
const EventListeners_1 = require("../EventListeners");
class SearchInArray {
    constructor(compConfs) {
        this.compConfs = compConfs;
        this.dataToSort = compConfs.dataToSort;
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
        const resultsTo = compConfs.resultsTo;
        if (typeof resultsTo === "string") {
            this.resultsContainer = document.querySelector(resultsTo);
        }
        else if (appendTo) {
            this.resultsContainer = resultsTo;
        }
        const searchComponent = this.createComponent();
        this.appender.appendChild(searchComponent);
    }
    createComponent() {
        var _a;
        const confs = this.compConfs;
        const searchContainer = Tools_1.Tools.createDiv({
            classes: ["search-container-component", "search-container"]
        });
        const searchInput = Tools_1.Tools.createDiv({
            tag: "input",
            type: "text",
            classes: ["search-input", "search-agency-input"]
        });
        searchInput.placeholder = (_a = confs.placeholder) !== null && _a !== void 0 ? _a : "";
        this.searchInput = searchInput;
        const searchIconBtn = document.createElement("div");
        const searchIcon = document.createElement("i");
        searchIconBtn.classList.add("search-icon");
        searchIcon.classList.add("fas");
        searchIcon.classList.add("fa-search");
        searchIconBtn.appendChild(searchIcon);
        searchContainer.appendChild(searchIconBtn);
        const clearBtn = document.createElement("div");
        clearBtn.classList.add("standard-button");
        clearBtn.classList.add("center");
        clearBtn.classList.add("clear-search");
        const clearIcon = document.createElement("i");
        clearIcon.classList.add("fas");
        clearIcon.classList.add("fa-times");
        clearBtn.style.display = "none";
        clearBtn.appendChild(clearIcon);
        searchContainer.appendChild(clearBtn);
        EventListeners_1.EventListeners.unlistenNamespace(confs.class);
        EventListeners_1.EventListeners.groupListeners(Tools_1.Tools.calcChecksum(confs.class + " - localsearch"), [
            {
                type: "click",
                context: this,
                callback: (item) => this.runSearch(searchInput),
                debounce: 400,
                element: searchIconBtn
            }
        ]);
        EventListeners_1.EventListeners.groupListeners(Tools_1.Tools.calcChecksum(confs.class + " - localsearch"), [
            {
                type: "click",
                context: this,
                callback: (item) => {
                    this.runSearch();
                    searchInput.value = "";
                    clearBtn.style.display = "none";
                },
                debounce: 400,
                element: clearBtn
            }
        ]);
        EventListeners_1.EventListeners.groupListeners(Tools_1.Tools.calcChecksum(confs.class + " - localsearch"), [
            {
                type: "input",
                context: this,
                callback: (item) => {
                    if (searchInput.value.length >= 1) {
                        clearBtn.style.display = "block";
                    }
                },
                debounce: 70,
                element: searchInput
            }
        ]);
        searchContainer.appendChild(searchInput);
        return searchContainer;
    }
    runSearch(searchEl) {
        const callFn = this.compConfs.callFn;
        if (!searchEl) {
            this.runFnAfterFilter(this.dataToSort, callFn);
            return;
        }
        if (searchEl) {
            let filteredObjects = this.searchInString(this.dataToSort, searchEl);
            this.runFnAfterFilter(filteredObjects, callFn);
        }
    }
    searchInString(searchInList, searchEl) {
        let filteredObjects = searchInList;
        const searchStr = searchEl.target ? searchEl.target.value : searchEl.value;
        if (searchStr && searchStr.length >= 1) {
            const searchKeys = this.compConfs.searchBy;
            const searchString = new RegExp(searchStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "gm");
            filteredObjects = this.dataToSort.filter((obj) => {
                for (const field of searchKeys) {
                    // @ts-ignore
                    let fieldValue = obj[field];
                    if (field.includes(".")) {
                        let subFields = field.split(".");
                        fieldValue = this.drillIntoObject(obj, subFields);
                    }
                    if (typeof fieldValue === "boolean") {
                        fieldValue = "" + fieldValue;
                    }
                    if (fieldValue !== undefined && fieldValue.match(searchString)) {
                        return true; // If any field matches, return true
                    }
                }
                return false;
            });
        }
        return filteredObjects;
    }
    drillIntoObject(obj, keysArray) {
        let result = obj;
        for (let key of keysArray) {
            if (result && typeof result === 'object' && key in result) {
                result = result[key];
            }
            else {
                return undefined; // If any key is not found or result is not an object, return undefined
            }
        }
        return result;
    }
    runFnAfterFilter(filteredObjects, callFn) {
        if (callFn && typeof callFn === "function") {
            if (!filteredObjects) {
                filteredObjects = this.dataToSort;
            }
            callFn(filteredObjects, this.compConfs.resultsTo);
        }
    }
    updateData(data) {
        if (!data) {
            return;
        }
        this.dataToSort = data;
    }
}
exports.SearchInArray = SearchInArray;
