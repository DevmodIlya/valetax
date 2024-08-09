/**
 * Designed by Ilya Nikulin 2020
 * This is a template for creating Node Express + TypesScript + Jest applications.
 * You may extend it with your own configs or use it as is.
 * All the required paths and ports are stored within .env.dev/.env.prod files.
 * You may add arguments to npm start dev/prod http/https script via command line.
 * These arguments are for server tuning purposes.
 */

import {HttpDefaultParams} from "./HttpDefaultParams";

export interface LoggedInUserData {
    sid: string,
    nickname: string,
    name: string,
    picture: string,
    updated_at: string,
    email: string,
    email_verified: boolean,
    sub: string
    translations: any
    langsList: string[]
    langsAll: string[]
    lang: string
    pathname: string
    accessLevel: number
}

export interface LoggedInUser extends HttpDefaultParams {
    userData: LoggedInUserData
}
