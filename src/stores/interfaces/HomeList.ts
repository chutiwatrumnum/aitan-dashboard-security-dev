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
}

export interface HomeOwner {
  id: number;
  fullname: string;
  mobile: string;
  isOwner: boolean;
  active: boolean;
}
