import { createModel } from "@rematch/core";
import { EmergencyListDataType } from "../interfaces/emergencry";
import { RootModel } from "./index";
import axios from "axios";

export const emergencyList = createModel<RootModel>()({
  state: {
    EmergencyDeviceData:[],
   EmergencyData: undefined,
   HelpStepData:[]
  } as EmergencyListDataType,
  reducers: {
    updateEmergencyListDataState: (state, payload) => {
      return {
        ...state,
        EmergencyData: payload,
      };
    },    updateHelpStepListDataState: (state, payload) => {
      return {
        ...state,
        HelpStepData: payload,
      };
    },
    updateEmergencyDeviceListDataState: (state, payload) => {
      return {
        ...state,
        EmergencyDeviceData: payload,
      };
    },
    },
  effects: (dispatch) => ({
    async getEmergencyListData(id: number) {
      try {
        const response = await axios.get(`/home-security/call-history/${id}`);
        console.log("getEmergencyListData:",response.data.result);
        
        dispatch.emergencyList.updateEmergencyListDataState(response.data.result);
      } catch (error) {
        console.error("API Error:", error);
        // จัดการ error
      }
    },
    async getHelperStepList() {
      try {
        const response = await axios.get(`/home-security/ticket`);
console.log("getHelperStepList:",response.data.masterData.helpStep);

        dispatch.emergencyList.updateHelpStepListDataState(response.data.masterData.helpStep);
      } catch (error) {
        console.error("API Error:", error);
        // จัดการ error
      }
    },
    async getEmergencyDeviceList(id:number) {
      try {
        const response = await axios.get(`/home-security/ticket/device/${id}`);
console.log("getEmergencyDeviceList:",response.data.result);

        dispatch.emergencyList.updateEmergencyDeviceListDataState(response.data.result);
      } catch (error) {
        console.error("API Error:", error);
        // จัดการ error
      }
    },
  }),
});
