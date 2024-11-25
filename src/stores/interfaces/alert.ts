export interface alertDataLists {
  countHomeAlert: number;
  countSOSAlert: number;
  countWarningAlert: number;
  allDataAlert: dataAlert[];
}
type alertType = "sos" | "securityAlert" | "warning" | "successfully";
export interface dataAlert {
  id: number | string;
  title: string;
  fullname: string;
  address: string;
  date: string;
  contact_time: string;
  status: boolean;
  lat: number;
  long: number;
  alertType: alertType;
  phone: string;
}

export interface selectedAnswerType {
  status: boolean;
  data: any;
}
export interface conditionpage {
  perPage: number;
  curPage: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
  sortBy?: string;
}
export interface dataAlertType {
  tableData: dataAlert[];
  loading: boolean;
  total: number;
  EventMaxLength: number;
  filterData: conditionpage;
  countSecurityAlert: number;
  countSOSAlert: number;
  countWarningAlert: number;
}

export interface dataMapType {
  lat: number;
  lng: number;
  show: boolean;
  title: string;
  address: string;
  name: string;
  phone: string;
}
