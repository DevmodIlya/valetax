"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalSearch = void 0;
const Tools_1 = require("../Tools");
const DropDown_1 = require("./DropDown");
const Fetcher_1 = require("../Fetcher");
const EventListeners_1 = require("../EventListeners");
const Translations_1 = require("../Translations");
class LocalSearch {
    constructor(compConfs) {
        this.compConfs = compConfs;
        this.dataToSort = compConfs.dataToSort;
        const translationsG = Translations_1.Translations.get("general");
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
        Fetcher_1.Fetcher.makeGetFetch('/roles').then((roles) => {
            if (!roles) {
                this.appender.appendChild(searchComponent);
                return;
            }
            const dropDown = new DropDown_1.DropDown({
                chooseText: translationsG.chooseRoleText,
                appendTo: searchComponent,
                class: "local-searc-dropdown",
                bindTo: this,
                callFn: (option) => {
                    console.log(option);
                    this.dropDown = option !== null && option !== void 0 ? option : { val: -1, txt: "" };
                    this.runSearch();
                },
                options: roles
            });
            this.appender.appendChild(searchComponent);
        }).catch(() => {
            this.appender.appendChild(searchComponent);
        });
    }
    createComponent() {
        var _a;
        const confs = this.compConfs;
        const searchContainer = Tools_1.Tools.createDiv({
            classes: ["search-container-component", "search-container"]
        });
        const searchInputContainer = Tools_1.Tools.createDiv({
            classes: ["search-input-container"]
        });
        const searchInput = Tools_1.Tools.createDiv({
            tag: "input",
            type: "text",
            classes: ["search-input", "search-agency-input"]
        });
        searchInput.placeholder = (_a = confs.placeholder) !== null && _a !== void 0 ? _a : "";
        this.searchInput = searchInput;
        const clearBtn = document.createElement("div");
        clearBtn.classList.add("standard-button");
        clearBtn.classList.add("center");
        clearBtn.classList.add("clear-search");
        const clearIcon = document.createElement("i");
        clearIcon.classList.add("fas");
        clearIcon.classList.add("fa-times");
        clearBtn.style.display = "none";
        clearBtn.appendChild(clearIcon);
        const searchIconBtn = document.createElement("div");
        const searchIcon = document.createElement("i");
        searchIconBtn.classList.add("search-icon");
        searchIcon.classList.add("fas");
        searchIcon.classList.add("fa-search");
        searchIconBtn.appendChild(searchIcon);
        searchInput.addEventListener("input", () => {
            clearBtn.style.display = "flex";
        });
        EventListeners_1.EventListeners.unlistenNamespace(confs.class);
        EventListeners_1.EventListeners.groupListeners(Tools_1.Tools.calcChecksum(confs.class + " - jobSearchInput"), [
            {
                type: "input",
                context: this,
                callback: () => { clearBtn.style.display = "flex"; },
                debounce: 70,
                element: searchInput
            }
        ]);
        EventListeners_1.EventListeners.groupListeners(Tools_1.Tools.calcChecksum(confs.class + " - jobSearchInputSEbox"), [
            {
                type: "click",
                context: this,
                callback: (item) => this.runSearch(searchInput),
                debounce: 500,
                element: searchIconBtn
            }
        ]);
        EventListeners_1.EventListeners.groupListeners(Tools_1.Tools.calcChecksum(confs.class + " - jobSearchInputClearInput"), [
            {
                type: "click",
                context: this,
                callback: () => {
                    clearBtn.style.display = "none";
                    searchInput.value = "";
                    this.runSearch();
                },
                debounce: 500,
                element: searchIconBtn
            }
        ]);
        searchInputContainer.appendChild(searchInput);
        searchInputContainer.appendChild(clearBtn);
        searchInputContainer.appendChild(searchIconBtn);
        searchContainer.appendChild(searchInputContainer);
        return searchContainer;
    }
    runSearch(searchEl) {
        const callFn = this.compConfs.callFn;
        const isDropDown = this.dropDown && this.dropDown.val !== -1;
        if (searchEl && !isDropDown) {
            let filteredObjects = this.searchInString(this.dataToSort, searchEl);
            this.runFnAfterFilter(filteredObjects, callFn);
        }
        if (searchEl && isDropDown) {
            const searchByRole = this.searchByRole(this.dataToSort);
            const filteredObjects = this.searchInString(searchByRole, searchEl);
            // let filteredObjects: CT[] = this.searchByRole(search.length > 0 ? search : <CT[]>this.dataToSort);
            this.runFnAfterFilter(filteredObjects.length > 0 ? filteredObjects : searchByRole, callFn);
        }
        if (!searchEl && isDropDown) {
            let filteredObjects = this.searchByRole(this.dataToSort);
            this.runFnAfterFilter(filteredObjects, callFn);
        }
        if (!searchEl && !isDropDown) {
            this.runFnAfterFilter(this.dataToSort, callFn);
        }
    }
    searchByRole(filteredObjects) {
        const dropdown = this.dropDown;
        let dropdownFilter = [];
        if (filteredObjects && filteredObjects.length > 0) {
            dropdownFilter = filteredObjects.filter((jobs) => jobs["role"]["code"] === dropdown.val);
        }
        return dropdownFilter;
    }
    searchInString(searchInList, searchEl) {
        let filteredObjects = searchInList;
        const searchStr = searchEl.target ? (searchEl.target).value : (searchEl.value);
        if (searchStr && searchStr.length >= 3) {
            const searchStirng = new RegExp(searchStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "gm");
            filteredObjects = this.dataToSort.filter((obj) => {
                // @ts-ignore
                const matchTitle = obj.title.match(searchStirng);
                // @ts-ignore
                const matchDsc = obj.dsc.match(searchStirng);
                // @ts-ignore
                const matchJobId = obj.jobId.match(searchStirng);
                // @ts-ignore
                const matchDptId = obj.dptId.match(searchStirng);
                return matchTitle || matchDsc || matchJobId || matchDptId;
            });
        }
        return filteredObjects;
    }
    runFnAfterFilter(filteredObjects, callFn) {
        if (callFn && typeof callFn === "function") {
            if (!filteredObjects) {
                filteredObjects = this.dataToSort;
            }
            callFn(filteredObjects, this.compConfs.resultsTo);
        }
    }
}
exports.LocalSearch = LocalSearch;
