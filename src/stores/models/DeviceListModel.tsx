import { createModel } from "@rematch/core";
import { DeviceListDataType, HomeSecurityMemberDetail } from "../interfaces/DeviceList";
import { RootModel } from "./index";
import axios from "axios";

export const deviceList = createModel<RootModel>()({
  state: {
    DeviceListTableData: undefined,
  } as DeviceListDataType,
  reducers: {
    updateDeviceListTableDataState: (state, payload) => {
      console.log("State before update:", state);
      return {
        ...state,
        DeviceTableData: payload,
      };
    },
  },
  effects: (dispatch) => ({
    async getDeviceListTableData(id: number) {
      try {
        const response = await axios.get(`/home-security/home-by-id/${id}`);
        const data: HomeSecurityMemberDetail = {
          id: response.data.result.id,
          address: response.data.result.address,
          homeId: response.data.result.homeId,
          lat: response.data.result.lat,
          long: response.data.result.long,
          active: response.data.result.active,
          homeSecurityMember: response.data.result.homeSecurityMember,
          status: response.data.result.homeAlarmStatus,
        };
        dispatch.deviceList.updateDeviceListTableDataState(data);
      } catch (error) {
        console.error("API Error:", error);
        // จัดการ error
      }
    },
  }),
});
