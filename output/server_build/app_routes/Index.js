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
class IndexPageController {
    constructor(app) {
        this.timezone = "Asia/Jerusalem";
        this.app = app;
        app.server.get('/', this.homePage.bind(this));
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
    checkUser(args) {
        return __awaiter(this, void 0, void 0, function* () {
            args.res.json("ok");
        });
    }
}
__decorate([
    GuardWrapper_1.GuardWrapper.checkIfLoggedIn(true)
], IndexPageController.prototype, "homePage", null);
__decorate([
    GuardWrapper_1.GuardWrapper.checkIfLoggedIn()
], IndexPageController.prototype, "checkUser", null);
exports.default = IndexPageController;
