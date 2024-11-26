import { DeviceListType } from "./DeviceList";

export interface EmergencyListDataType {
    EmergencyData?: EmergencyDataType;
    HelpStepData: HelpStep[];
    EmergencyDeviceData: EmergencyDeviceDataType[];
    MyHelperStep?: MyHelperStep
}
export interface EmergencyDataType {
    address: string;
    lat: number;
    long: number;
    step: number;
    member: Member[];
    ticketId: number;
    homeCallSuccess: boolean;
}

export interface Member {
    id: number;
    fullname: string;
    homeSecurityId: number;
    mobile: string;
    isOwner: boolean;
    callHistory: CallHistory[];
    callSuccessTotal: number;
    callFailTotal: number;
}
export interface CallHistory {
    callSuccess: boolean;
    createdAt: Date;
}

export interface HelpStep {
    id: number;
    name: string;
    nameTh: string;
    code: string;
    priority: number;
}

export interface EmergencyDeviceDataType {
    deviceId: string;
    homeId: string;
    eventsType: EventsType;
    ticketId: number;
    deviceDetail: DeviceListType;
}
export interface EventsType {
    name: string;
    nameTh: string;
    code: string;
    priority: number;
}
export interface MyHelperStep {
    helpStepName : string
    step: number;
    HelpStepData: HelpStep[];
}
