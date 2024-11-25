export interface HomeListDataType {
  homeListTableData: HomeListTableDataType[];
}

export interface HomeListTableDataType {
  id: number;
  address: string;
  homeId: number;
  lat: number;
  long: number;
  active: boolean;
  homeOwner: HomeOwner;
  homeAlarmStatus: HomeAlarmStatus | null;
}

export interface HomeOwner {
  id: number;
  fullname: string;
  mobile: string;
  isOwner: boolean;
  active: boolean;
}

export interface HomeAlarmStatus {
  statusArming: number;
  status: Status;
}

export interface Status {
  name: string;
  code: string;
}
