export interface DeviceListDataType {
    DeviceTableData?: HomeSecurityMemberDetail;
  }
export interface HomeSecurityMemberDetail{
    id:                 number;
    address:            string;
    status:             string;
    homeId:             number;
    lat:                number;
    long:               number;
    active:             boolean;
    homeSecurityMember: HomeSecurityMember[];
}

export interface HomeSecurityMember {
    id:       number;
    fullname: string;
    mobile:   string;
    isOwner:  boolean;
    active:   boolean;
}