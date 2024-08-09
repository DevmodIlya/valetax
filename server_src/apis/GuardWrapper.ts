/**
 * Designed by Ilya Nikulin 2020
 * This is a template for creating Node Express + TypesScript + Jest applications.
 * You may extend it with your own configs or use it as is.
 * All the required paths and ports are stored within .env.dev/.env.prod files.
 * You may add arguments to npm start dev/prod http/https script via command line.
 * These arguments are for server tuning purposes.
 */

import express from "express";
import fs from "fs";
import * as url from "url";

interface UserModel {
    "userId": string,
    "agencyId": string,
    "accessLevel": number
}

export class GuardWrapper {
    public static allowedLanguages: { [key: string]: string } = {
        "eng": "eng",
        "ru": "ru"
    }

    constructor() {
    }

    public static getLanguage(req: express.Request) {
        let lang = req.query.lang;
        if (!lang || lang === "") {
            lang = "ru";
        }

        let listOfLanguages: string[] = [];
        let fullListOfLanguages: string[] = [];

        const pathToLanguages = __dirname + '/../languages/';

        let language = GuardWrapper.allowedLanguages[<string>lang];
        if (!language || language === "") {
            language = "ru";
        }
        try {
            const files = fs.readdirSync(pathToLanguages)
            files.forEach((file: string): void => {
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
                trans: JSON.parse(fs.readFileSync(pathToLanguages + language + '.json', 'utf8'))
            };
        } catch (e) {
            return {
                lang: lang,
                langs: listOfLanguages,
                langsAll: fullListOfLanguages,
                trans: JSON.parse(fs.readFileSync(pathToLanguages + '/heb.json', 'utf8'))};
        }
    }

    public static checkIfLoggedIn(dontRedirectToLogin?:boolean): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void {
        return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
            const originalMethod = descriptor.value;
            descriptor.value = async function (req: express.Request, res: express.Response, ...args: any[]){
                const langsData = GuardWrapper.getLanguage(req);
                const parsedUrl = url.parse(req.url);
                const pathname = (parsedUrl.pathname ?? "/").replace("/", "");
                const userData = {
                    translations: langsData.trans,
                    lang: langsData.lang,
                    langsList: langsData.langs,
                    langsAll: langsData.langsAll,
                    pathname
                };
                return originalMethod.call(this, {req, res, userData});
            };
        }
    }
}
