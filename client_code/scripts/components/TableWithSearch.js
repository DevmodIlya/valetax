"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableWithSearch = void 0;
const DataInTable_1 = require("./DataInTable");
const SearchInArray_1 = require("./SearchInArray");
const Translations_1 = require("../Translations");
class TableWithSearch {
    // constructor(appendSearchTo: HTMLDivElement, appendSearchResTo: HTMLDivElement, dataList: T[], bindTo: BindToType) {
    constructor(componentConfs) {
        var _a;
        this.tableHeadings = [];
        this.componentConfs = componentConfs;
        const translationsG = Translations_1.Translations.get("general");
        this.createHeadings();
        if (componentConfs.appendSearchTo) {
            this.arraySearch = new SearchInArray_1.SearchInArray({
                searchText: "Dddd",
                class: "search-for-department",
                placeholder: (_a = componentConfs.placeHolder) !== null && _a !== void 0 ? _a : translationsG.filterByDprtName,
                appendTo: componentConfs.appendSearchTo,
                resultsTo: componentConfs.appendSearchResTo,
                searchBy: componentConfs.searchIn,
                dataToSort: componentConfs.dataList,
                callFn: (sortedResult, resultsContainer) => {
                    if (!sortedResult || sortedResult.length === 0) {
                        resultsContainer.innerHTML = "";
                        resultsContainer.innerHTML = "<div class='nothing-found'>" + translationsG.filterNotFound + "</div>";
                        return;
                    }
                    resultsContainer.innerHTML = "";
                    this.createTable(sortedResult);
                }
            });
        }
        if (componentConfs.dataList) {
            this.createTable(componentConfs.dataList);
        }
    }
    createHeadings() {
        var _a;
        // const translationsG = Translations.TableSearch;
        const translationsG = Translations_1.Translations.get((_a = this.componentConfs.translations) !== null && _a !== void 0 ? _a : "general");
        const headingsConf = this.componentConfs.headings;
        if (!headingsConf) {
            this.tableHeadings = [];
            return;
        }
        for (let heading of headingsConf) {
            if (!heading.components) {
                let colValue = "";
                let drillDots = heading.colId.split(".");
                if (drillDots && drillDots.length > 1) {
                    const lastKey = drillDots.pop();
                    colValue = translationsG[lastKey];
                }
                else {
                    colValue = translationsG[heading.colId];
                }
                this.tableHeadings.push({
                    colId: heading.colId,
                    width: heading.width,
                    calcVal: heading.calcVal,
                    text: colValue
                });
            }
            else {
                let components = [];
                for (let component of heading.components) {
                    components.push({
                        id: component.id,
                        setIconAs: component.setIconAs,
                        checkParameter: component.checkParameter,
                        element: component.element,
                        fn: component.fn,
                        conditionFn: component.conditionFn
                    });
                }
                this.tableHeadings.push({
                    colId: heading.colId,
                    width: heading.width,
                    components: components,
                    text: translationsG[heading.colId]
                });
            }
        }
    }
    updateData(dataList) {
        if (!dataList) {
            return;
        }
        this.arraySearch.updateData(dataList);
    }
    createTable(dataList) {
        const componentConfs = this.componentConfs;
        const searchResultContainer = componentConfs.appendSearchResTo;
        if (searchResultContainer) {
            searchResultContainer.innerHTML = "";
        }
        new DataInTable_1.DataInTable(componentConfs.appendSearchResTo, dataList, {
            tableId: componentConfs.tableId,
            tableClass: componentConfs.tableClass,
            bindTo: componentConfs.bindTo,
            headings: this.tableHeadings,
            onPageChange: this.componentConfs.onPageChange,
            translations: componentConfs.translations,
            pageSize: componentConfs.pageSize,
            maxTableHeight: componentConfs.maxTableHeight,
            currentPage: componentConfs.currentPage,
        });
    }
}
exports.TableWithSearch = TableWithSearch;
