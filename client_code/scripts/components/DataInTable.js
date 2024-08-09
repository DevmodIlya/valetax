"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataInTable = void 0;
const Tools_1 = require("../Tools");
const EventListeners_1 = require("../EventListeners");
const Translations_1 = require("../Translations");
class DataInTable {
    constructor(appender, tableData, configs) {
        this.tableTotalWidth = 0;
        this.configs = configs;
        if (!appender) {
            return;
        }
        if (typeof appender === "string") {
            this.appender = document.querySelector(appender);
        }
        else {
            this.appender = appender;
        }
        if (tableData && tableData.length > 0) {
            this.tableData = tableData;
        }
        if (!configs) {
            return;
        }
        if (!configs.pageSize) {
            configs.pageSize = 2;
        }
        if (!configs.currentPage) {
            configs.currentPage = 1;
        }
        // EventListeners.unlistenNamespace(configs.tableClass);
        this.pageSize = configs.pageSize;
        this.currentPage = configs.currentPage;
        this.tableConfigs = configs;
        this.tableContent = Tools_1.Tools.createDiv({
            classes: ["table-content"]
        });
        this.tableWrapper = Tools_1.Tools.createDiv({
            classes: ["first-table"]
        });
        this.floatingHeader = Tools_1.Tools.createDiv({
            classes: ["floating-header"]
        });
        this.tableHeadings = this.tableConfigs.headings;
        this.renderCurrentPage();
    }
    renderCurrentPage() {
        var _a;
        const tableData = (_a = this.tableData) !== null && _a !== void 0 ? _a : [];
        this.tableData = tableData;
        const startIdx = (this.currentPage - 1) * this.pageSize;
        const endIdx = Math.min(startIdx + this.pageSize, tableData.length);
        const currentPageData = tableData.slice(startIdx, endIdx);
        // Render table with currentPageData
        // Call buildTableContents with currentPageData
        this.renderTable(currentPageData);
        const redrawFn = this.configs.onPageChange;
        if (redrawFn && typeof redrawFn === "function") {
            redrawFn(currentPageData);
        }
    }
    renderTable(currentPageData) {
        this.tableTotalWidth = 0;
        this.tableWrapper.innerHTML = "";
        this.tableContent.innerHTML = "";
        this.floatingHeader.innerHTML = "";
        this.appender.innerHTML = "";
        EventListeners_1.EventListeners.unlistenNamespace(this.tableConfigs.tableClass);
        const tableHeadings = this.tableConfigs.headings;
        if (tableHeadings) {
            tableHeadings.forEach((heading) => {
                var _a;
                const headingTd = Tools_1.Tools.createDiv({
                    text: [(_a = heading.text) !== null && _a !== void 0 ? _a : ""],
                    classes: ["td", heading.colId]
                });
                const headingWidth = heading.width;
                headingTd.style.width = headingWidth + "px";
                this.tableTotalWidth += headingWidth + 21;
                this.floatingHeader.appendChild(headingTd);
            });
            this.tableWrapper.appendChild(this.floatingHeader);
        }
        this.tableWrapper.appendChild(this.buildTableContents(currentPageData));
        this.tableContent.appendChild(this.tableWrapper);
        this.appender.appendChild(this.tableContent);
        this.renderPagination();
    }
    buildTableContents(currentPageData) {
        var _a;
        const translationsG = Translations_1.Translations.get("general");
        const tableContent = Tools_1.Tools.createDiv({
            classes: ["table-contents"]
        });
        tableContent.style.width = this.tableTotalWidth + "px";
        tableContent.style.maxHeight = ((_a = this.tableConfigs.maxTableHeight) !== null && _a !== void 0 ? _a : 280).toString() + "px";
        const tableData = currentPageData;
        if (!tableData || tableData.length === 0) {
            const tableEmpty = Tools_1.Tools.createDiv({
                text: translationsG.tableEmpty,
                classes: ["table-empty"]
            });
            tableContent.appendChild(tableEmpty);
            return tableContent;
        }
        tableData.forEach((tableDataRow) => {
            const tableRow = Tools_1.Tools.createDiv({
                classes: ["row"]
            });
            this.tableHeadings.forEach((heading) => {
                const rowTd = Tools_1.Tools.createDiv({
                    classes: ["td", heading.colId]
                });
                let colValue = "";
                let drillDots = heading.colId.split(".");
                if (drillDots && drillDots.length > 1) {
                    colValue = Tools_1.Tools.drillNestedValues(tableDataRow, drillDots, 0, drillDots.length);
                }
                else {
                    colValue = tableDataRow[heading.colId];
                }
                if (typeof heading.calcVal === "function") {
                    colValue = heading.calcVal(colValue);
                }
                // const colValue: string = <string>(tableDataRow[heading.colId as keyof DT] as unknown);
                rowTd.style.width = heading.width + "px";
                const isBooleanValue = typeof colValue === "boolean";
                console.log("isBooleanValue", isBooleanValue);
                const translationsG = Translations_1.Translations.get("general");
                const dataToPutInCell = isBooleanValue ? translationsG[colValue.toString()] : colValue !== null && colValue !== void 0 ? colValue : "";
                if (typeof colValue === "boolean") {
                    colValue = colValue.toString();
                }
                if (colValue && !heading.components) {
                    rowTd.innerHTML = dataToPutInCell;
                    rowTd.title = typeof dataToPutInCell === "string" ? dataToPutInCell : "";
                }
                else if (heading.components) {
                    const componentsList = heading["components"];
                    if (!componentsList || componentsList.length === 0) {
                        return;
                    }
                    // const tmpComponentsEls:HTMLDivElement[] = [];
                    componentsList.forEach((component) => {
                        const element = component.element.cloneNode(true);
                        // tmpComponentsEls.push(element);
                        if (component.id) {
                            element.id = tableDataRow[component.id];
                        }
                        if (component.checkParameter) {
                            const isActiveEl = tableDataRow[component.checkParameter];
                            element.classList.add(isActiveEl ? "active" : "inactive");
                            element.isActive = isActiveEl;
                            if (component.setIconAs) {
                                element.children[0].className = component.setIconAs;
                            }
                        }
                        rowTd.appendChild(element);
                        const conditionFn = component.conditionFn;
                        if (conditionFn && typeof conditionFn === "function") {
                            conditionFn(tableDataRow, tableRow, element);
                        }
                        EventListeners_1.EventListeners.groupListeners(Tools_1.Tools.calcChecksum(this.tableConfigs.tableClass + "-" + component.fn.toString()), [
                            {
                                type: "click",
                                context: this.tableConfigs.bindTo,
                                callback: () => component.fn(tableDataRow, tableRow, element),
                                debounce: 1000,
                                element: element
                            }
                        ]);
                    });
                }
                tableRow.appendChild(rowTd);
            });
            tableContent.appendChild(tableRow);
        });
        return tableContent;
    }
    goToPage(page) {
        if (page >= 1 && page <= this.getTotalPages()) {
            this.currentPage = page;
            this.renderCurrentPage();
        }
    }
    // Method to navigate to the next page
    nextPage() {
        if (this.currentPage < this.getTotalPages()) {
            this.currentPage++;
            this.renderCurrentPage();
        }
    }
    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderCurrentPage();
        }
    }
    // Method to get the total number of pages
    getTotalPages() {
        return Math.ceil(this.tableData.length / this.pageSize);
    }
    renderPagination() {
        var _a;
        const translationsTable = Translations_1.Translations.get((_a = this.tableConfigs.translations) !== null && _a !== void 0 ? _a : "TableSearch");
        const totalPages = this.getTotalPages();
        const maxVisiblePages = 5; // Adjust this value to control the maximum number of visible pages
        const paginationContainer = document.createElement('div');
        paginationContainer.classList.add('pagination');
        // Calculate the start and end indices of the visible page buttons
        let start = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let end = Math.min(totalPages, start + maxVisiblePages - 1);
        // Adjust start and end if they don't cover the required number of pages
        if (end - start + 1 < maxVisiblePages) {
            start = Math.max(1, end - maxVisiblePages + 1);
        }
        // Add 'Previous' button
        const prevButton = document.createElement('button');
        // @ts-ignore
        prevButton.textContent = translationsTable.previous;
        prevButton.addEventListener('click', () => this.prevPage());
        prevButton.classList.add("table-nav-btn");
        paginationContainer.appendChild(prevButton);
        // Render page numbers with ellipsis
        if (start > 1) {
            const firstPageButton = document.createElement('button');
            firstPageButton.textContent = '1';
            firstPageButton.addEventListener('click', () => this.goToPage(1));
            firstPageButton.classList.add("table-nav-btn");
            paginationContainer.appendChild(firstPageButton);
            if (start > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                paginationContainer.appendChild(ellipsis);
            }
        }
        for (let i = start; i <= end; i++) {
            const pageNumberButton = document.createElement('button');
            pageNumberButton.textContent = i.toString();
            pageNumberButton.addEventListener('click', () => this.goToPage(i));
            pageNumberButton.classList.add("table-nav-btn");
            if (i === this.currentPage) {
                pageNumberButton.classList.add('active');
            }
            paginationContainer.appendChild(pageNumberButton);
        }
        if (end < totalPages) {
            if (end < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                paginationContainer.appendChild(ellipsis);
            }
            const lastPageButton = document.createElement('button');
            lastPageButton.textContent = totalPages.toString();
            lastPageButton.addEventListener('click', () => this.goToPage(totalPages));
            lastPageButton.classList.add("table-nav-btn");
            paginationContainer.appendChild(lastPageButton);
        }
        // Add 'Next' button
        const nextButton = document.createElement('button');
        // @ts-ignore
        nextButton.textContent = translationsTable.next;
        nextButton.addEventListener('click', () => this.nextPage());
        nextButton.classList.add("table-nav-btn");
        paginationContainer.appendChild(nextButton);
        this.appender.appendChild(paginationContainer);
        // Append pagination controls to the DOM
        // const appenderElement = typeof this.appender === 'string' ? document.querySelector(this.appender) : this.appender;
        // this.appender.appendChild(paginationContainer);
    }
}
exports.DataInTable = DataInTable;
