export interface MapViewType {
  center: number[];
}
export interface MapDataType {
  properties: MapDataPropertiesType;
  geometry: MapDataGeometryType;
}

export interface MapDataPropertiesType {
  id: string;
  title: string;
  fullName: string;
  address: string;
  date: string;
  contactedAt: string;
  status: boolean;
  alertType: string;
  phone: string;
  phone2?: string;
  phone3?: string;
}

export interface MapDataGeometryType {
  type: string;
  coordinates: [number, number];
}
