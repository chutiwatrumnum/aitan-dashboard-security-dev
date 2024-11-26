export interface DeviceListDataType {
    DeviceTableData?: HomeSecurityMemberDetail;
    DeviceListData?: DeviceListType[];
  }
export interface HomeSecurityMemberDetail{
    id:                 number;
    address:            string;
    //status:             string;
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
export interface DeviceListType {
    active_time:  number;
    biz_type:     number;
    category:     string;
    create_time:  number;
    icon:         string;
    id:           string;
    ip:           string;
    lat:          string;
    local_key:    string;
    lon:          string;
    model:        string;
    name:         string;
    online:       boolean;
    owner_id:     string;
    product_id:   string;
    product_name: string;
    status:       Status[];
    sub:          boolean;
    time_zone:    string;
    uid:          string;
    update_time:  number;
    uuid:         string;
    iconFullUrl:  string;
}
export interface Status {
    code:  string;
    value: boolean | string;
}