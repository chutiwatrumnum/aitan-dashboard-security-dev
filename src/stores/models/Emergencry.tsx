import { createModel } from "@rematch/core";
import { EmergencyListDataType, MyHelperStep } from "../interfaces/emergencry";
import { RootModel } from "./index";
import axios from "axios";

export const emergencyList = createModel<RootModel>()({
  state: {
    EmergencyDeviceData:[],
   EmergencyData: undefined,
   HelpStepData:[],
   MyHelperStep:undefined
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
        MyHelperStep: payload,
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
    async getHelperStepList(id:number) {
      try {
        const response = await axios.get(`/home-security/ticket/${id}`);
        const data : MyHelperStep={
          helpStepName:response.data.ticket.helpStep?.nameTh,
          step:response.data.ticket.step,
          HelpStepData:response.data.masterData.helpStep
        }
        console.log("getHelperStepList:",data);
       dispatch.emergencyList.updateHelpStepListDataState(data);
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
