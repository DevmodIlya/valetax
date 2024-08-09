"use strict";
/**
 * Designed by Ilya Nikulin 2020
 * This is a template for creating Node Express + TypesScript + Jest applications.
 * You may extend it with your own configs or use it as is.
 * All the required paths and ports are stored within .env.dev/.env.prod files.
 * You may add arguments to npm start dev/prod http/https script via command line.
 * These arguments are for server tuning purposes.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const GuardWrapper_1 = require("../apis/GuardWrapper");
const Fetcher_1 = require("../Fetcher");
class IndexPageController {
    constructor(app) {
        this.timezone = "Asia/Jerusalem";
        this.app = app;
        this.apiPath = app.configs.get("API_PATH");
        app.server.get('/', this.homePage.bind(this));
        app.server.post('/fetchTree/:treeName', this.fetchTree.bind(this));
        app.server.post('/createNodeInTree/:treeName/:parentNodeId/:nodeName', this.createNodeInTree.bind(this));
        app.server.post('/renameNodeInTree/:treeName/:parentNodeId/:nodeName', this.renameNodeInTree.bind(this));
        app.server.post('/deleteNodeInTree/:treeName/:parentNodeId', this.deleteNodeInTree.bind(this));
    }
    homePage(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const guardedUserData = args.userData;
            args.res.render(this.app.renderTemplate('index.ejs'), {
                userData: args.userData,
                langsList: guardedUserData.langsList,
                pathname: guardedUserData.pathname,
                translations: args.userData.translations,
                pageId: "index"
            });
        });
    }
    fetchTree(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = args.req.body;
            Fetcher_1.Fetcher.makePostFetch({
                url: `${this.apiPath}/api.user.tree.get?treeName=` + params.treeId,
                data: { treeName: params.treeId },
                method: "POST"
            }).then((tree) => {
                args.res.json(tree);
            }).catch(() => {
                args.res.json({});
            });
        });
    }
    createNodeInTree(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = args.req.body;
            Fetcher_1.Fetcher.makePostFetch({
                url: `${this.apiPath}/api.user.tree.node.create?treeName=${params.treeName}&parentNodeId=${params.parentNodeId}&nodeName=${params.nodeNameValue}`,
                data: {
                    treeName: params.treeId,
                    parentNodeId: params.parentNodeId,
                    nodeName: params.nodeName
                },
                method: "POST"
            }).then((tree) => {
                args.res.json(tree);
            }).catch(() => {
                args.res.json({});
            });
        });
    }
    renameNodeInTree(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = args.req.body;
            console.log("renameNodeInTree", params);
            Fetcher_1.Fetcher.makePostFetch({
                url: `${this.apiPath}/api.user.tree.node.rename?treeName=${params.treeName}&nodeId=${params.parentNodeId}&newNodeName=${params.nodeNameValue}`,
                data: {
                    treeName: params.treeName,
                    nodeId: params.parentNodeId,
                    newNodeName: params.nodeName
                },
                method: "POST"
            }).then((tree) => {
                args.res.json(tree);
            }).catch(() => {
                args.res.json({});
            });
        });
    }
    deleteNodeInTree(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = args.req.body;
            console.log("renameNodeInTree", params);
            Fetcher_1.Fetcher.makePostFetch({
                url: `${this.apiPath}/api.user.tree.node.delete?treeName=${params.treeName}&nodeId=${params.parentNodeId}`,
                data: {
                    treeName: params.treeName,
                    nodeId: params.parentNodeId
                },
                method: "POST"
            }).then((tree) => {
                args.res.json(tree);
            }).catch(() => {
                args.res.json({});
            });
        });
    }
}
__decorate([
    GuardWrapper_1.GuardWrapper.checkIfLoggedIn(true)
], IndexPageController.prototype, "homePage", null);
__decorate([
    GuardWrapper_1.GuardWrapper.checkIfLoggedIn(true)
], IndexPageController.prototype, "fetchTree", null);
__decorate([
    GuardWrapper_1.GuardWrapper.checkIfLoggedIn(true)
], IndexPageController.prototype, "createNodeInTree", null);
__decorate([
    GuardWrapper_1.GuardWrapper.checkIfLoggedIn(true)
], IndexPageController.prototype, "renameNodeInTree", null);
__decorate([
    GuardWrapper_1.GuardWrapper.checkIfLoggedIn(true)
], IndexPageController.prototype, "deleteNodeInTree", null);
exports.default = IndexPageController;
