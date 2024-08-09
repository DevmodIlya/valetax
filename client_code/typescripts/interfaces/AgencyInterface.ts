import {EmployeeInterface} from "./EmployeeInterface";
import {KeyStringInterface} from "./KeyStringInterface";

interface Access {
    [key: string]: string[]
}

export interface RangeCode {
    range: string,
    code: number
}

export interface AgencyManager {
    name: string,
    mobile: string,
    email: string,
    address: string,
    managerId: string,
    passport: string
    departments: KeyStringInterface<string>
}

export interface AgencyShiftManager {
    contactName: string,
    contactPhone: string,
    contactEmail: string,
    address: string,
    managerId: string,
    passport: string
    departments: KeyStringInterface<string>
}

export interface Shift {
    [key: string]: RangeCode
}

export interface DropdownRole {
    txt: string,
    val: number
}

export interface Role {
    title: string,
    code: number
}

export interface FavoriteCandidates {
    [key: string]: string[]
}

export interface DepartmentManager {
    "mobile": string,
    "address": string,
    "name": string,
    "contactId": string,
    "managerId": string,
    "contactName": string,
    "contactPhone": string,
    "contactEmail": string,
}

export interface DepartmentShiftsReports {
    [key: string]: {
        [key: string]: {
            [key: string]: {
                [key: string]: KeyStringInterface<ShiftReport>
            }
        }
    }
}

export interface ShiftReport {
    end: string,
    name: string,
    email: string,
    start: string
    totalWorkHours: string
    passport?: string,
}

export interface AgencyDepartment {
    "id": string,
    "name": string,
    "dsc": string,
    "manager": DepartmentManager,
    "workers": string[],
    "shiftsReports": DepartmentShiftsReports,
    "jobs": string[],
    "qrcodes": string[],
}

export interface AgencyDepartments {
    [key: string]: AgencyDepartment
}

export interface AgencyVacancy {
    "title": string,
    "dsc": string,
    "role": Role,
    "hourRate": string,
    "shifts": Shift,
    "reqs": string[],
    "relevancyDate": string,
    "address": string
}

export interface AgencyJob extends AgencyVacancy {
    "agencyId": string,
    "date": string,
    "jobId": string,
    "dptId": string,
    "dptName": string,
    "role": Role,
    "hourRate": string,
    "title": string,
    "dsc": string,
    "shifts": Shift,
    "payment": string,
    "reqs": string[],
    "isActive": boolean,
    "relevancyDate": string,
    "address": string,
    "candidates": string[],
    "canPostJobs": boolean
}

export interface AgencyInterface {
    "id": string,
    "access": Access,
    "joinDate": string,
    "logo": string,
    "companyNameTitle": string,
    "companyName": string,
    "agencyDsc": string,
    "contactName": string,
    "contactPhone": string,
    "contactEmail": string,
    "departments": AgencyDepartments,
    "favoriteCandidates": FavoriteCandidates,
    "employees": string[],
    "jobs": { [key: string]: AgencyJob }
}