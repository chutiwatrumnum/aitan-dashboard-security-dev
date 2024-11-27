export interface SOSDataType {
  pieEventData: PieEventDataType[];
  pieStatusData: PieStatusDataType[];
  mapInfoData: MapDataType[];
}
export interface MapViewType {
  center: number[];
}
export interface MapDataType {
  totalDevice: number;
  homeId: number;
  homeOwnerFullname?: string | null;
  homeOwnerMobile?: string | null;
  homeOwnerIsowner?: boolean | null;
  eventDateTime: string;
  eventTypeId: number;
  eventTypeName: string;
  eventTypeNameTH: string;
  eventTypeCode: string;
  homeAddress: string;
  homeLat: number;
  homeLong: number;
}

// export interface MapDataPropertiesType {
//   id: string;
//   title: string;
//   fullName: string;
//   address: string;
//   date: string;
//   contactedAt: string;
//   status: boolean;
//   alertType: string;
//   phone: string;
//   phone2?: string;
//   phone3?: string;
// }

// export interface MapDataGeometryType {
//   type: string;
//   coordinates: [number, number];
// }

export interface PieEventDataType {
  name: string;
  total: number;
  nameTH: string;
}

export interface PieStatusDataType {
  status: string;
  total: number;
}
export interface CreateTicketRequest {
  homeId:      number;
  eventTypeId: number;
  homeAddress: string;
  homeLat:     number;
  homeLong:    number;
}