export interface ResumesInterface {
    userId: string,
    resumes: {
        [key: string]: ResumeInterface
    }
}

export interface ResumeInterface {
    title: string,
    primary?: boolean,
    prevJobs: {
        [key:string]: ResumePrevJob
    }
}

export interface ResumePrevJob {
    name: string,
    role: string,
    dsc: string,
    startDateMonth: string,
    startDateYear: string,
    endDateMonth: string,
    endDateYear: string,
    totalYears: string
}