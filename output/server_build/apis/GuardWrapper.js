"use strict";
/**
 * Designed by Ilya Nikulin 2020
 * This is a template for creating Node Express + TypesScript + Jest applications.
 * You may extend it with your own configs or use it as is.
 * All the required paths and ports are stored within .env.dev/.env.prod files.
 * You may add arguments to npm start dev/prod http/https script via command line.
 * These arguments are for server tuning purposes.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardWrapper = void 0;
const fs_1 = __importDefault(require("fs"));
const url = __importStar(require("url"));
class GuardWrapper {
    constructor() {
    }
    static getLanguage(req) {
        let lang = req.query.lang;
        if (!lang || lang === "") {
            lang = "ru";
        }
        let listOfLanguages = [];
        let fullListOfLanguages = [];
        const pathToLanguages = __dirname + '/../languages/';
        let language = GuardWrapper.allowedLanguages[lang];
        if (!language || language === "") {
            language = "ru";
        }
        try {
            const files = fs_1.default.readdirSync(pathToLanguages);
            files.forEach((file) => {
                const fileName = file.replace(".json", "");
                if (fileName !== lang) {
                    listOfLanguages.push(fileName);
                }
                fullListOfLanguages.push(fileName);
            });
            return {
                lang: lang,
                langs: listOfLanguages,
                langsAll: fullListOfLanguages,
                trans: JSON.parse(fs_1.default.readFileSync(pathToLanguages + language + '.json', 'utf8'))
            };
        }
        catch (e) {
            return {
                lang: lang,
                langs: listOfLanguages,
                langsAll: fullListOfLanguages,
                trans: JSON.parse(fs_1.default.readFileSync(pathToLanguages + '/heb.json', 'utf8'))
            };
        }
    }
    static checkIfLoggedIn(dontRedirectToLogin) {
        return (target, propertyKey, descriptor) => {
            const originalMethod = descriptor.value;
            descriptor.value = function (req, res, ...args) {
                var _a;
                return __awaiter(this, void 0, void 0, function* () {
                    const langsData = GuardWrapper.getLanguage(req);
                    const parsedUrl = url.parse(req.url);
                    const pathname = ((_a = parsedUrl.pathname) !== null && _a !== void 0 ? _a : "/").replace("/", "");
                    const userData = {
                        translations: langsData.trans,
                        lang: langsData.lang,
                        langsList: langsData.langs,
                        langsAll: langsData.langsAll,
                        pathname
                    };
                    return originalMethod.call(this, { req, res, userData });
                });
            };
        };
    }
}
exports.GuardWrapper = GuardWrapper;
GuardWrapper.allowedLanguages = {
    "eng": "eng",
    "ru": "ru"
};
