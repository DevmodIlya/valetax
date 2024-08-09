/**
 * Designed by Ilya Nikulin 2020
 * This is a template for creating Node Express + TypesScript + Jest applications.
 * You may extend it with your own configs or use it as is.
 * All the required paths and ports are stored within .env.dev/.env.prod files.
 * You may add arguments to npm start dev/prod http/https script via command line.
 * These arguments are for server tuning purposes.
 */

import {Logger} from "../logs/Logger";
import {AppInterface} from "../interfaces/AppInterface";
import {GuardWrapper} from "../apis/GuardWrapper";
import {LoggedInUser} from "../interfaces/LoggedInUserData";
import {KeyStringInterface} from "../interfaces/KeyStringInterface";
import {Fetcher} from "../Fetcher";

export default class IndexPageController {
    private app: AppInterface;
    private apiPath: string;
    private timezone = "Asia/Jerusalem";

    constructor(app: AppInterface) {
        this.app = app;
        this.apiPath = <string>app.configs.get("API_PATH");

        app.server.get('/', this.homePage.bind(this));
        app.server.post('/fetchTree/:treeName', this.fetchTree.bind(this));
        app.server.post('/createNodeInTree/:treeName/:parentNodeId/:nodeName', this.createNodeInTree.bind(this));
        app.server.post('/renameNodeInTree/:treeName/:parentNodeId/:nodeName', this.renameNodeInTree.bind(this));
        app.server.post('/deleteNodeInTree/:treeName/:parentNodeId', this.deleteNodeInTree.bind(this));

    }

    @GuardWrapper.checkIfLoggedIn(true)
    private async homePage(args: LoggedInUser): Promise<void> {
        const guardedUserData = args.userData;
        args.res.render(this.app.renderTemplate('index.ejs'), {
            userData: args.userData,
            langsList: guardedUserData.langsList,
            pathname: guardedUserData.pathname,
            translations: args.userData.translations,
            pageId: "index"
        });
    }

    @GuardWrapper.checkIfLoggedIn(true)
    private async fetchTree(args: LoggedInUser): Promise<void> {
        const params = args.req.body;
        Fetcher.makePostFetch<any | null>({
            url: `${this.apiPath}/api.user.tree.get?treeName=` + params.treeId,
            data: {treeName: params.treeId},
            method: "POST"
        }).then((tree: any | null) => {
            args.res.json(tree);
        }).catch(() => {
            args.res.json({});
        });
    }

    @GuardWrapper.checkIfLoggedIn(true)
    private async createNodeInTree(args: LoggedInUser): Promise<void> {
        const params = args.req.body;
        Fetcher.makePostFetch<any | null>({
            url: `${this.apiPath}/api.user.tree.node.create?treeName=${params.treeName}&parentNodeId=${params.parentNodeId}&nodeName=${params.nodeNameValue}`,
            data: {
                treeName: params.treeId,
                parentNodeId: params.parentNodeId,
                nodeName: params.nodeName
            },
            method: "POST"
        }).then((tree: any | null) => {
            args.res.json(tree);
        }).catch(() => {
            args.res.json({});
        });
    }

    @GuardWrapper.checkIfLoggedIn(true)
    private async renameNodeInTree(args: LoggedInUser): Promise<void> {
        const params = args.req.body;
        console.log("renameNodeInTree",params)
        Fetcher.makePostFetch<any | null>({
            url: `${this.apiPath}/api.user.tree.node.rename?treeName=${params.treeName}&nodeId=${params.parentNodeId}&newNodeName=${params.nodeNameValue}`,
            data: {
                treeName: params.treeName,
                nodeId: params.parentNodeId,
                newNodeName: params.nodeName
            },
            method: "POST"
        }).then((tree: any | null) => {
            args.res.json(tree);
        }).catch(() => {
            args.res.json({});
        });
    }

    @GuardWrapper.checkIfLoggedIn(true)
    private async deleteNodeInTree(args: LoggedInUser): Promise<void> {
        const params = args.req.body;
        console.log("renameNodeInTree",params)
        Fetcher.makePostFetch<any | null>({
            url: `${this.apiPath}/api.user.tree.node.delete?treeName=${params.treeName}&nodeId=${params.parentNodeId}`,
            data: {
                treeName: params.treeName,
                nodeId: params.parentNodeId
            },
            method: "POST"
        }).then((tree: any | null) => {
            args.res.json(tree);
        }).catch(() => {
            args.res.json({});
        });
    }
}