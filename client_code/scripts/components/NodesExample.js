"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _NodesExample_parentNode, _NodesExample_treesListResultsCls, _NodesExample_nodesResults, _NodesExample_treesList, _NodesExample_transl;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodesExample = void 0;
const Fetcher_1 = require("../Fetcher");
const Translations_1 = require("../Translations");
const Tools_1 = require("../Tools");
const Elements_1 = require("../Elements");
const ActionWindow_1 = require("../components/ActionWindow");
class NodesExample {
    constructor(parnetCls, treesListResultsCls, nodesResultsCls) {
        var _a;
        _NodesExample_parentNode.set(this, void 0);
        _NodesExample_treesListResultsCls.set(this, void 0);
        _NodesExample_nodesResults.set(this, void 0);
        _NodesExample_treesList.set(this, {});
        _NodesExample_transl.set(this, void 0);
        __classPrivateFieldSet(this, _NodesExample_parentNode, document.querySelector(parnetCls), "f");
        __classPrivateFieldSet(this, _NodesExample_treesListResultsCls, document.querySelector(treesListResultsCls), "f");
        __classPrivateFieldSet(this, _NodesExample_nodesResults, document.querySelector(nodesResultsCls), "f");
        __classPrivateFieldSet(this, _NodesExample_transl, Translations_1.Translations.get("example"), "f");
        this.fetchTree("sss");
        __classPrivateFieldSet(this, _NodesExample_treesList, JSON.parse((_a = localStorage.getItem("myTrees")) !== null && _a !== void 0 ? _a : "{}"), "f");
        if (__classPrivateFieldGet(this, _NodesExample_treesListResultsCls, "f")) {
            for (let key in __classPrivateFieldGet(this, _NodesExample_treesList, "f")) {
                const tree = __classPrivateFieldGet(this, _NodesExample_treesList, "f")[key];
                this.appendTreeToList(tree);
            }
        }
        this.createNewTreeCmp(".buttons-container");
    }
    appendTreeToList(tree) {
        __classPrivateFieldGet(this, _NodesExample_treesListResultsCls, "f").appendChild(Elements_1.Elements.newElement({
            text: tree.name,
            classes: ["tree-item"],
            callOnClick: {
                fn: () => __awaiter(this, void 0, void 0, function* () {
                    yield this.reloadTree(tree.id, tree.name);
                }),
                callType: "click",
                callDebounce: 1000,
                callFnName: "getTree"
            }
        }));
    }
    createNewTreeCmp(containerCls) {
        const btnAppender = __classPrivateFieldGet(this, _NodesExample_parentNode, "f").querySelector(containerCls);
        btnAppender.appendChild(Elements_1.Elements.newButton({
            text: __classPrivateFieldGet(this, _NodesExample_transl, "f").createNewTree,
            btnClasses: ["attach-candidats-btn", "center", "red"],
            iconClasses: ["fas", "fa-file-download"],
            callOnClick: {
                callType: "click",
                callDebounce: 1000,
                callFnName: "createNewNode",
                fn: () => {
                    this.createTree();
                }
            }
        }));
    }
    createNode(nodeId, nodeName, treeId, treeName) {
        let nodeNameValue = "";
        const nodeNameInput = Elements_1.Elements.newInput({
            name: "node-name",
            placeholder: __classPrivateFieldGet(this, _NodesExample_transl, "f").enterNodeName,
            classes: ["collection-name"],
            prefix: __classPrivateFieldGet(this, _NodesExample_transl, "f").enterNodeName,
            callOnClick: {
                callType: "input",
                callFnName: "createnewnode",
                fn: (input) => {
                    nodeNameValue = input.value;
                    if (nodeNameValue !== "") {
                        nodeNameInput.clearError();
                    }
                    else {
                        nodeNameInput.setError(__classPrivateFieldGet(this, _NodesExample_transl, "f").errEmptyNodeName);
                    }
                }
            }
        });
        const fCWindow = new ActionWindow_1.ActionWindow({
            context: this,
            title: __classPrivateFieldGet(this, _NodesExample_transl, "f").newNodeTitle,
            parentClass: "get-hours-report-window",
            callbackBtnYesText: __classPrivateFieldGet(this, _NodesExample_transl, "f").saveAndExit
        }).removeNoBtn().addCloseX().setCallbackYes(() => {
            if (nodeNameValue !== "") {
                nodeNameInput.clearError();
                Fetcher_1.Fetcher.makePostFetch({
                    url: `/createNodeInTree/${treeName}/${nodeId}/${nodeNameValue}`,
                    data: { nodeNameValue, parentNodeId: nodeId, treeName: treeName },
                    method: "POST",
                    spinnerMsg: __classPrivateFieldGet(this, _NodesExample_transl, "f").gettingTreeSpinner
                }).then((tree) => __awaiter(this, void 0, void 0, function* () {
                    if (tree && tree.data && tree.data.message) {
                        Tools_1.Tools.popupBox(__classPrivateFieldGet(this, _NodesExample_transl, "f").message + " " + tree.id, __classPrivateFieldGet(this, _NodesExample_transl, "f")[tree.data.message.toLowerCase().replace(/[\'\s]/g, '')]);
                        return;
                    }
                    yield this.reloadTree(treeId, treeName);
                    fCWindow.close();
                })).catch((er) => {
                    Tools_1.Tools.popupBox(__classPrivateFieldGet(this, _NodesExample_transl, "f").reqErrTitle, __classPrivateFieldGet(this, _NodesExample_transl, "f").reqErrTitle);
                });
            }
            else {
                nodeNameInput.setError(__classPrivateFieldGet(this, _NodesExample_transl, "f").errEmptyNodeName);
            }
        });
        const appender = fCWindow.resultsElement();
        appender.appendChild(nodeNameInput.html);
    }
    renameNode(nodeId, nodeName, treeId, treeName) {
        let nodeNameValue = nodeName !== null && nodeName !== void 0 ? nodeName : "";
        const nodeNameInput = Elements_1.Elements.newInput({
            name: "node-name",
            placeholder: __classPrivateFieldGet(this, _NodesExample_transl, "f").enterNodeName,
            classes: ["collection-name"],
            prefix: __classPrivateFieldGet(this, _NodesExample_transl, "f").enterNodeName,
            value: nodeName,
            callOnClick: {
                callType: "input",
                callFnName: "renamenode",
                fn: (input) => {
                    nodeNameValue = input.value;
                    if (nodeNameValue !== "") {
                        nodeNameInput.clearError();
                    }
                    else {
                        nodeNameInput.setError(__classPrivateFieldGet(this, _NodesExample_transl, "f").errEmptyNodeName);
                    }
                }
            }
        });
        const fCWindow = new ActionWindow_1.ActionWindow({
            context: this,
            title: __classPrivateFieldGet(this, _NodesExample_transl, "f").renameNodeTitle,
            parentClass: "get-hours-report-window",
            callbackBtnYesText: __classPrivateFieldGet(this, _NodesExample_transl, "f").saveAndExit
        }).removeNoBtn().addCloseX().setCallbackYes(() => {
            if (nodeNameValue !== "") {
                nodeNameInput.clearError();
                Fetcher_1.Fetcher.makePostFetch({
                    url: `/renameNodeInTree/${treeName}/${nodeId}/${nodeNameValue}`,
                    data: { nodeNameValue, parentNodeId: nodeId, treeName: treeName },
                    method: "POST",
                    spinnerMsg: __classPrivateFieldGet(this, _NodesExample_transl, "f").gettingTreeSpinner
                }).then((tree) => __awaiter(this, void 0, void 0, function* () {
                    if (tree && tree.data && tree.data.message) {
                        Tools_1.Tools.popupBox(__classPrivateFieldGet(this, _NodesExample_transl, "f").message + " " + tree.id, __classPrivateFieldGet(this, _NodesExample_transl, "f")[tree.data.message.toLowerCase().replace(/[\'\s]/g, '')]);
                        return;
                    }
                    yield this.reloadTree(treeId, treeName);
                    fCWindow.close();
                })).catch(() => {
                    Tools_1.Tools.popupBox(__classPrivateFieldGet(this, _NodesExample_transl, "f").reqErrTitle, __classPrivateFieldGet(this, _NodesExample_transl, "f").reqErrTitle);
                });
            }
            else {
                nodeNameInput.setError(__classPrivateFieldGet(this, _NodesExample_transl, "f").errEmptyNodeName);
            }
        });
        const appender = fCWindow.resultsElement();
        appender.appendChild(nodeNameInput.html);
    }
    createTree() {
        let nodeNameValue = "";
        const nodeNameInput = Elements_1.Elements.newInput({
            name: "tree-name",
            placeholder: __classPrivateFieldGet(this, _NodesExample_transl, "f").enterTreeName,
            classes: ["collection-name"],
            prefix: __classPrivateFieldGet(this, _NodesExample_transl, "f").enterTreeName,
            callOnClick: {
                callType: "input",
                callFnName: "createnewtree",
                fn: (input) => {
                    nodeNameValue = input.value;
                    if (nodeNameValue !== "") {
                        nodeNameInput.clearError();
                    }
                    else {
                        nodeNameInput.setError(__classPrivateFieldGet(this, _NodesExample_transl, "f").errEmptyTreeName);
                    }
                }
            }
        });
        const fCWindow = new ActionWindow_1.ActionWindow({
            context: this,
            title: __classPrivateFieldGet(this, _NodesExample_transl, "f").newNodeTitle,
            parentClass: "get-hours-report-window",
            callbackBtnYesText: __classPrivateFieldGet(this, _NodesExample_transl, "f").saveAndExit
        }).removeNoBtn().addCloseX().setCallbackYes(() => __awaiter(this, void 0, void 0, function* () {
            if (nodeNameValue !== "") {
                nodeNameInput.clearError();
                const treeData = yield this.fetchTree(nodeNameValue);
                this.appendTreeToList({ name: treeData.name, id: treeData.id });
                fCWindow.close();
            }
            else {
                nodeNameInput.setError(__classPrivateFieldGet(this, _NodesExample_transl, "f").errEmptyNodeName);
            }
        }));
        const appender = fCWindow.resultsElement();
        appender.appendChild(nodeNameInput.html);
    }
    fetchTree(treeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const transl = __classPrivateFieldGet(this, _NodesExample_transl, "f");
            return new Promise((resolve, reject) => {
                Fetcher_1.Fetcher.makePostFetch({
                    url: "/fetchTree/" + treeId,
                    data: { treeId },
                    method: "POST",
                    spinnerMsg: transl.gettingTreeSpinner
                }).then((tree) => {
                    console.log("tree", tree);
                    __classPrivateFieldGet(this, _NodesExample_treesList, "f")[tree.name] = { name: tree.name, id: tree.id };
                    localStorage.setItem("myTrees", JSON.stringify(__classPrivateFieldGet(this, _NodesExample_treesList, "f")));
                    resolve(tree);
                }).catch(() => {
                    Tools_1.Tools.popupBox(__classPrivateFieldGet(this, _NodesExample_transl, "f").reqErrTitle, __classPrivateFieldGet(this, _NodesExample_transl, "f").reqErrTitle);
                    reject({});
                });
            });
        });
    }
    reloadTree(treeId, treeName) {
        return __awaiter(this, void 0, void 0, function* () {
            __classPrivateFieldGet(this, _NodesExample_nodesResults, "f").innerHTML = "";
            const treeData = yield this.fetchTree(treeName);
            if (!treeData || Object.keys(treeData).length === 0) {
                return;
            }
            const ul = document.createElement('ul');
            ul.appendChild(this.createTreeNodes(treeData, treeId, treeName));
            __classPrivateFieldGet(this, _NodesExample_nodesResults, "f").appendChild(ul);
        });
    }
    createTreeNodes(node, treeId, treeName) {
        const li = document.createElement('li');
        const nodeName = Elements_1.Elements.newElement({
            text: node.name,
            classes: ["node-name"]
        });
        const addNewNodeBtn = Elements_1.Elements.newButton({
            btnClasses: ["center"],
            iconClasses: ["fa-solid", "fa-circle-plus"],
            callOnClick: {
                callType: "click",
                callDebounce: 1000,
                callFnName: "createNewNode",
                fn: () => {
                    this.createNode(node.id, node.name, treeId, treeName);
                }
            }
        });
        const removeNodeBtn = Elements_1.Elements.newButton({
            btnClasses: ["center"],
            iconClasses: ["fa-solid", "fa-circle-minus"],
            callOnClick: {
                callType: "click",
                callDebounce: 1000,
                callFnName: "createNewNode",
                fn: () => {
                    Tools_1.Tools.approveActionPopupBox({
                        msg: __classPrivateFieldGet(this, _NodesExample_transl, "f").approveDel,
                        okFn: (approveModal) => {
                            approveModal.remove();
                            Fetcher_1.Fetcher.makePostFetch({
                                url: `/deleteNodeInTree/${treeName}/${node.id}`,
                                data: { parentNodeId: node.id, treeName: treeName },
                                method: "POST",
                                spinnerMsg: __classPrivateFieldGet(this, _NodesExample_transl, "f").gettingTreeSpinner
                            }).then((tree) => __awaiter(this, void 0, void 0, function* () {
                                if (tree && tree.data && tree.data.message) {
                                    Tools_1.Tools.popupBox(__classPrivateFieldGet(this, _NodesExample_transl, "f").message + " " + tree.id, __classPrivateFieldGet(this, _NodesExample_transl, "f")[tree.data.message.toLowerCase().replace(/[\'\s]/g, '')]);
                                    return;
                                }
                                yield this.reloadTree(treeId, treeName);
                            })).catch((er) => {
                                Tools_1.Tools.popupBox(__classPrivateFieldGet(this, _NodesExample_transl, "f").reqErrTitle, __classPrivateFieldGet(this, _NodesExample_transl, "f").reqErrTitle);
                            });
                        }
                    });
                }
            }
        });
        const renameNodeBtn = Elements_1.Elements.newButton({
            btnClasses: ["center"],
            iconClasses: ["fa-solid", "fa-pencil"],
            callOnClick: {
                callType: "click",
                callDebounce: 1000,
                callFnName: "renameNode",
                fn: () => {
                    console.log("renameNodeBtn", node);
                    this.renameNode(node.id, node.name, treeId, treeName);
                }
            }
        });
        const buttonsArray = Elements_1.Elements.newElement({
            classes: ["node-represent-container"],
            append: [
                nodeName,
                addNewNodeBtn,
                renameNodeBtn,
                removeNodeBtn
            ]
        });
        li.classList.add("node-details-container");
        li.appendChild(buttonsArray);
        li.addEventListener("click", (e) => {
            var _a;
            e.stopPropagation();
            const el = e.target;
            if (!el.classList.contains("node-name")) {
                return;
            }
            const parent = (_a = el.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
            if (!parent) {
                return;
            }
            const childTree = parent.querySelector(".child-tree");
            if (!childTree) {
                return;
            }
            if (childTree.classList.contains("active")) {
                childTree.classList.remove("active");
                return;
            }
            childTree.classList.add("active");
        });
        if (node.children && node.children.length > 0) {
            const ul = document.createElement('ul');
            ul.classList.add("child-tree");
            node.children.forEach((child) => {
                ul.appendChild(this.createTreeNodes(child, treeId, treeName));
            });
            li.appendChild(ul);
        }
        return li;
    }
}
exports.NodesExample = NodesExample;
_NodesExample_parentNode = new WeakMap(), _NodesExample_treesListResultsCls = new WeakMap(), _NodesExample_nodesResults = new WeakMap(), _NodesExample_treesList = new WeakMap(), _NodesExample_transl = new WeakMap();
