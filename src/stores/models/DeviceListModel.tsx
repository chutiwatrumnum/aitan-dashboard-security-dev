import { createModel } from "@rematch/core";
import { DeviceListDataType, HomeSecurityMemberDetail } from "../interfaces/DeviceList";
import { RootModel } from "./index";
import axios from "axios";

export const deviceList = createModel<RootModel>()({
  state: {
    DeviceListTableData: undefined,
  } as DeviceListDataType,
  reducers: {
    updateDeviceListTableDataState: (state, payload) => ({
      ...state,
      DeviceListTableData: payload,
    }),
  },
  effects: (dispatch) => ({
    async getDeviceListTableData(id :number) {
      await axios
        .get(`/home-security/home-by-id/${id}`)
        .then((value) => {
          const data:HomeSecurityMemberDetail={
            id: value.data.result.id,
            address: value.data.result.address,
            homeId: value.data.result.homeId,
            lat: value.data.result.lat,
            long: value.data.result.long,
            active: value.data.result.active,
            homeSecurityMember: value.data.result.homeSecurityMember
          }
          console.log("device-list",data);
          dispatch.deviceList.updateDeviceListTableDataState(
            data
          );
        })
        .catch((err) => {
          console.error(err);
        });
        
    },
  }),
});
