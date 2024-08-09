import {KeyStringInterface} from "./KeyStringInterface";

export interface ShiftInvitationTempalte {
    templateId?: string,
    banner: string,
    startTime?: string,
    endTime?: string,
    date?: string,
    templateName: string,
    templateSubject: string,
    templateLocation: string,
    emergencyPhone: string,
    emergencyEmail: string,
    gglMapsLink: string,
    wazeLink: string,
    instructions: KeyStringInterface<string>
}