import {Fetcher} from "../Fetcher";
import {KeyStringInterface} from "../interfaces/KeyStringInterface";
import {Translations} from "../Translations";
import {Tools} from "../Tools";
import {Elements} from "../Elements";
import {ActionWindow} from "../components/ActionWindow";
import {InputElement} from "../interfaces/Elements";

export class NodesExample {
    #parentNode: HTMLDivElement;
    #treesListResultsCls: HTMLDivElement;
    #nodesResults: HTMLDivElement;
    #treesList: KeyStringInterface<{ name: string, id: number }> = {};
    #transl: KeyStringInterface<string>;

    constructor(parnetCls: string, treesListResultsCls: string, nodesResultsCls: string) {
        this.#parentNode = <HTMLDivElement>document.querySelector(parnetCls);
        this.#treesListResultsCls = <HTMLDivElement>document.querySelector(treesListResultsCls);
        this.#nodesResults = <HTMLDivElement>document.querySelector(nodesResultsCls);
        this.#transl = <KeyStringInterface<string>>Translations.get("example");
        this.fetchTree("FirstTree");

        this.#treesList = <KeyStringInterface<{
            name: string,
            id: number
        }>>JSON.parse(localStorage.getItem("myTrees") ?? "{}");

        if (this.#treesListResultsCls) {
            for (let key in this.#treesList) {
                const tree = this.#treesList[key];
                this.appendTreeToList(tree);
            }
        }

        this.createNewTreeCmp(".buttons-container");
    }

    private appendTreeToList(tree: { name: string, id: number }): void {
        this.#treesListResultsCls.appendChild(<HTMLDivElement>Elements.newElement({
            text: "<div><i class=\"fa-solid fa-share-nodes\"></i> </div>"+tree.name,
            classes: ["tree-item"],
            callOnClick: {
                fn: async () => {
                    await this.reloadTree(tree.id, tree.name);
                },
                callType: "click",
                callDebounce: 1000,
                callFnName: "getTree"
            }
        }));
    }

    public createNewTreeCmp(containerCls: string): void {
        const btnAppender: HTMLDivElement = <HTMLDivElement>this.#parentNode.querySelector(containerCls);
        btnAppender.appendChild(<HTMLDivElement>Elements.newButton({
            text: this.#transl.createNewTree,
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
        }))
    }

    private createNode(nodeId: number, nodeName: string, treeId: number, treeName: string): void {
        let nodeNameValue = "";
        const nodeNameInput = <InputElement>Elements.newInput({
            name: "node-name",
            placeholder: this.#transl.enterNodeName,
            classes: ["collection-name"],
            prefix: this.#transl.enterNodeName,
            callOnClick: {
                callType: "input",
                callFnName: "createnewnode",
                fn: (input: any) => {
                    nodeNameValue = input.value;
                    if (nodeNameValue !== "") {
                        nodeNameInput.clearError();
                    } else {
                        nodeNameInput.setError(this.#transl.errEmptyNodeName);
                    }
                }
            }
        });

        const fCWindow: ActionWindow<NodesExample> = new ActionWindow<NodesExample>({
            context: this,
            title: this.#transl.newNodeTitle,
            parentClass: "get-hours-report-window",
            callbackBtnYesText: this.#transl.saveAndExit
        }).removeNoBtn().addCloseX().setCallbackYes(() => {
            if (nodeNameValue !== "") {
                nodeNameInput.clearError();
                Fetcher.makePostFetch<any | null>({
                    url: `/createNodeInTree/${treeName}/${nodeId}/${nodeNameValue}`,
                    data: {nodeNameValue, parentNodeId: nodeId, treeName: treeName},
                    method: "POST",
                    spinnerMsg: this.#transl.gettingTreeSpinner
                }).then(async (tree: any | null) => {
                    if (tree && tree.data && tree.data.message) {
                        Tools.popupBox(this.#transl.message + " " + tree.id, this.#transl[tree.data.message.toLowerCase().replace(/[\'\s]/g, '')]);
                        return;
                    }
                    await this.reloadTree(treeId, treeName);
                    fCWindow.close();
                }).catch((er) => {
                    Tools.popupBox(this.#transl.reqErrTitle, this.#transl.reqErrTitle);
                });
            } else {
                nodeNameInput.setError(this.#transl.errEmptyNodeName);
            }
        });
        const appender: HTMLDivElement = <HTMLDivElement>fCWindow.resultsElement();

        appender.appendChild(nodeNameInput.html);
    }


    private renameNode(nodeId: number, nodeName: string, treeId: number, treeName: string): void {
        let nodeNameValue = nodeName ?? "";
        const nodeNameInput = <InputElement>Elements.newInput({
            name: "node-name",
            placeholder: this.#transl.enterNodeName,
            classes: ["collection-name"],
            prefix: this.#transl.enterNodeName,
            value: nodeName,
            callOnClick: {
                callType: "input",
                callFnName: "renamenode",
                fn: (input: any) => {
                    nodeNameValue = input.value;
                    if (nodeNameValue !== "") {
                        nodeNameInput.clearError();
                    } else {
                        nodeNameInput.setError(this.#transl.errEmptyNodeName);
                    }
                }
            }
        });

        const fCWindow: ActionWindow<NodesExample> = new ActionWindow<NodesExample>({
            context: this,
            title: this.#transl.renameNodeTitle,
            parentClass: "get-hours-report-window",
            callbackBtnYesText: this.#transl.saveAndExit
        }).removeNoBtn().addCloseX().setCallbackYes(() => {
            if (nodeNameValue !== "") {
                nodeNameInput.clearError();
                Fetcher.makePostFetch<any | null>({
                    url: `/renameNodeInTree/${treeName}/${nodeId}/${nodeNameValue}`,
                    data: {nodeNameValue, parentNodeId: nodeId, treeName: treeName},
                    method: "POST",
                    spinnerMsg: this.#transl.gettingTreeSpinner
                }).then(async (tree: any | null) => {
                    if (tree && tree.data && tree.data.message) {
                        Tools.popupBox(this.#transl.message + " " + tree.id, this.#transl[tree.data.message.toLowerCase().replace(/[\'\s]/g, '')]);
                        return;
                    }
                    await this.reloadTree(treeId, treeName);
                    fCWindow.close();
                }).catch(() => {
                    Tools.popupBox(this.#transl.reqErrTitle, this.#transl.reqErrTitle);
                });
            } else {
                nodeNameInput.setError(this.#transl.errEmptyNodeName);
            }
        });
        const appender: HTMLDivElement = <HTMLDivElement>fCWindow.resultsElement();

        appender.appendChild(nodeNameInput.html);
    }


    private createTree(): void {
        let nodeNameValue = "";
        const nodeNameInput = <InputElement>Elements.newInput({
            name: "tree-name",
            placeholder: this.#transl.enterTreeName,
            classes: ["collection-name"],
            prefix: this.#transl.enterTreeName,
            callOnClick: {
                callType: "input",
                callFnName: "createnewtree",
                fn: (input: any) => {
                    nodeNameValue = input.value;
                    if (nodeNameValue !== "") {
                        nodeNameInput.clearError();
                    } else {
                        nodeNameInput.setError(this.#transl.errEmptyTreeName);
                    }
                }
            }
        });

        const fCWindow: ActionWindow<NodesExample> = new ActionWindow<NodesExample>({
            context: this,
            title: this.#transl.newNodeTitle,
            parentClass: "get-hours-report-window",
            callbackBtnYesText: this.#transl.saveAndExit
        }).removeNoBtn().addCloseX().setCallbackYes(async () => {
            if (nodeNameValue !== "") {
                nodeNameInput.clearError();
                const treeData = await this.fetchTree(nodeNameValue);
                this.appendTreeToList({name: treeData.name, id: treeData.id});
                fCWindow.close();
            } else {
                nodeNameInput.setError(this.#transl.errEmptyNodeName);
            }
        });
        const appender: HTMLDivElement = <HTMLDivElement>fCWindow.resultsElement();

        appender.appendChild(nodeNameInput.html);
    }

    public async fetchTree(treeId: string): Promise<any> {
        const transl = this.#transl;
        return new Promise<any>((resolve, reject) => {
            Fetcher.makePostFetch<any | null>({
                url: "/fetchTree/" + treeId,
                data: {treeId},
                method: "POST",
                spinnerMsg: transl.gettingTreeSpinner
            }).then((tree: any | null) => {
                console.log("tree", tree)
                this.#treesList[tree.name] = {name: tree.name, id: tree.id};
                localStorage.setItem("myTrees", JSON.stringify(this.#treesList));
                resolve(tree);
            }).catch(() => {
                Tools.popupBox(this.#transl.reqErrTitle, this.#transl.reqErrTitle);
                reject({});
            });
        });
    }

    private async reloadTree(treeId: number, treeName: string): Promise<void> {
        this.#nodesResults.innerHTML = "";
        const treeData = await this.fetchTree(treeName);
        if (!treeData || Object.keys(treeData).length === 0) {
            return;
        }

        const ul = document.createElement('ul');
        ul.appendChild(this.createTreeNodes(treeData, treeId, treeName));
        this.#nodesResults.appendChild(ul);
    }

    public createTreeNodes(node: any, treeId: number, treeName: string): HTMLLIElement {
        const li = document.createElement('li');
        const nodeName = <HTMLDivElement>Elements.newElement({
            text: node.name,
            classes: ["node-name"]
        })
        const addNewNodeBtn = <HTMLDivElement>Elements.newButton({
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
        const removeNodeBtn = <HTMLDivElement>Elements.newButton({
            btnClasses: ["center"],
            iconClasses: ["fa-solid", "fa-circle-minus"],
            callOnClick: {
                callType: "click",
                callDebounce: 1000,
                callFnName: "createNewNode",
                fn: () => {
                    Tools.approveActionPopupBox({
                        msg: this.#transl.approveDel,
                        okFn: (approveModal) => {
                            approveModal.remove();
                            Fetcher.makePostFetch<any | null>({
                                url: `/deleteNodeInTree/${treeName}/${node.id}`,
                                data: {parentNodeId: node.id, treeName: treeName},
                                method: "POST",
                                spinnerMsg: this.#transl.gettingTreeSpinner
                            }).then(async (tree: any | null) => {
                                if (tree && tree.data && tree.data.message) {
                                    Tools.popupBox(this.#transl.message + " " + tree.id, this.#transl[tree.data.message.toLowerCase().replace(/[\'\s]/g, '')]);
                                    return;
                                }
                                await this.reloadTree(treeId, treeName);
                            }).catch((er) => {
                                Tools.popupBox(this.#transl.reqErrTitle, this.#transl.reqErrTitle);
                            });
                        }
                    });
                }
            }
        });
        const renameNodeBtn = <HTMLDivElement>Elements.newButton({
            btnClasses: ["center"],
            iconClasses: ["fa-solid", "fa-pencil"],
            callOnClick: {
                callType: "click",
                callDebounce: 1000,
                callFnName: "renameNode",
                fn: () => {
                    console.log("renameNodeBtn", node)
                    this.renameNode(node.id, node.name, treeId, treeName);
                }
            }
        });
        const buttonsArray = <HTMLDivElement>Elements.newElement({
            classes: ["node-represent-container"],
            append: [
                nodeName,
                addNewNodeBtn,
                renameNodeBtn,
                removeNodeBtn
            ]
        });
        li.classList.add("node-details-container");
        li.classList.add("node-details-container");
        li.appendChild(buttonsArray);

        li.addEventListener("click", (e: Event) => {
            e.stopPropagation();
            const el = <HTMLDivElement>e.target;
            if (!el.classList.contains("node-name")) {
                return;
            }
            const parent = el.parentElement?.parentElement;
            if (!parent) {
                return;
            }
            const childTree = <HTMLUListElement>parent.querySelector(".child-tree");
            if (!childTree) {
                return;
            }
            if (childTree.classList.contains("active")) {
                childTree.classList.remove("active");
                childTree.classList.add("inactive");
                return
            }
            childTree.classList.remove("inactive");
            childTree.classList.add("active");
        });

        if (node.children && node.children.length > 0) {
            const ul = document.createElement('ul');
            ul.classList.add("child-tree");
            ul.classList.add("active");
            node.children.forEach((child: any) => {
                ul.appendChild(this.createTreeNodes(child, treeId, treeName));
            });
            li.appendChild(ul);
        }

        return li;
    }
}