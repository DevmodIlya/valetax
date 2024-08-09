import {Option} from "./OptionInterface";

interface EmployeeJobs {
    agency: string,
    jobId: string,
    jobCity: string,
    jobAddress: string,
    jobFullAddress: string,
    qrValue: string,
    role: {},
    loc: {
        lat: string,
        lon: string
    },
    qrLastUse: string,
    keyActive: boolean
}

interface EmployeeRecords {
    agency: string,
    jobId: string,
    workLocation: string,
    employer: string,
    employerId: string,
    recordDetails: string
}

interface EmployeeLanguages {
    id: string
    value: string,
}

interface EmployeeJobLog {
    [key: string]: {
        [key: string]: {
            [key: string]: {
                [key: string]: {
                    s: string
                    e: string
                }[]
            }
        }
    }
}

export interface EmployeeInterface {
    role: number,
    age: number,
    userId: string,
    duty: Option,
    employeeId: string,
    name: string,
    lname: string,
    gender: Option,
    passport: string,
    maritalStatus: Option,
    kids: Option,
    vehicle: Option,
    available: boolean,
    city: string,
    logo: string,
    address: string,
    fullAddress: string,
    email: string,
    mobile: string,
    isSelected?: boolean,
    jobs: EmployeeJobs,
    jobsReports: EmployeeJobLog,
    languages: EmployeeLanguages[],
    records: EmployeeRecords[]
}