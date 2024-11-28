import { DeviceListType } from "./DeviceList";

export interface EmergencyListDataType {
  EmergencyData?: EmergencyDataType;
  HelpStepData: HelpStep[];
  EmergencyDeviceData: EmergencyDeviceDataType[];
  MyHelperStep: number;
  MyHelperName:string
  emergencyTableData?: TableDataType[];
  cardCount?: CardCount;
  totalTable: number;
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
  helpStepName: string;
  step: number;
  HelpStepData: HelpStep[];
}

export interface GetTableDataType {
  curPage: string;
  perPage: string;
  searchObject?: string;
  searchText?: string;
  filterByType?: string;
}

export interface TableDataType {
  id: number;
  address: string;
  homeId: number;
  lat: number;
  long: number;
  step: number;
  eventTypeId: number;
  complete: boolean;
  adminNote?: string | null;
  helpId?: number | null;
  createdBy: CreatedBy;
  createdAt: string;
  homeOwner: HomeOwner;
  eventType: EventType;
}

export interface CreatedBy {
  lastName: string;
  firstName: string;
  middleName: string;
}

export interface HomeOwner {
  fullname: string;
  mobile: string;
  isOwner: boolean;
}

export interface EventType {
  name: string;
  nameTh: string;
  code: string;
}

export interface CardCount {
  total: number;
  newEvent: number;
  deviceProblem: number;
  deviceOffline: number;
  complete: number;
}
