import { createModel } from "@rematch/core";
import {
  EmergencyListDataType,
  MyHelperStep,
  GetTableDataType,
} from "../interfaces/Emergencry";
import { RootModel } from "./index";
import axios from "axios";

export const emergencyList = createModel<RootModel>()({
  state: {
    EmergencyDeviceData: [],
    EmergencyData: undefined,
    HelpStepData: [],
    MyHelperStep: undefined,
    emergencyTableData: [],
    cardCount: undefined,
    totalTable: 10,
  } as EmergencyListDataType,
  reducers: {
    updateEmergencyListDataState: (state, payload) => {
      return {
        ...state,
        EmergencyData: payload,
      };
    },
    updateHelpStepListDataState: (state, payload) => {
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
    updateEmergencyTableDataState: (state, payload) => ({
      ...state,
      emergencyTableData: payload,
    }),
    updateCardCountState: (state, payload) => ({
      ...state,
      cardCount: payload,
    }),
    updateTotalTableState: (state, payload) => ({
      ...state,
      totalTable: payload,
    }),
  },
  effects: (dispatch) => ({
    async getEmergencyListData(id: number) {
      try {
        const response = await axios.get(`/home-security/call-history/${id}`);
        console.log("getEmergencyListData:", response.data.result);

        dispatch.emergencyList.updateEmergencyListDataState(
          response.data.result
        );
      } catch (error) {
        console.error("API Error:", error);
        // จัดการ error
      }
    },
    async getHelperStepList(id: number) {
      try {
        const response = await axios.get(`/home-security/ticket/${id}`);
        const data: MyHelperStep = {
          helpStepName: response.data.ticket.helpStep?.nameTh,
          step: response.data.ticket.step,
          HelpStepData: response.data.masterData.helpStep,
        };
        console.log("getHelperStepList:", data);
        dispatch.emergencyList.updateHelpStepListDataState(data);
      } catch (error) {
        console.error("API Error:", error);
        // จัดการ error
      }
    },
    async getEmergencyDeviceList(id: number) {
      try {
        const response = await axios.get(`/home-security/ticket/device/${id}`);
        console.log("getEmergencyDeviceList:", response.data.result);

        dispatch.emergencyList.updateEmergencyDeviceListDataState(
          response.data.result
        );
      } catch (error) {
        console.error("API Error:", error);
        // จัดการ error
      }
    },
    async getEmergencyTableData(payload: GetTableDataType) {
      let URL = `/home-security/ticket-list?curPage=${payload.curPage}&&perPage=${payload.perPage}`;
      if (payload.searchObject && payload.searchText)
        URL += `&&searchObject=${payload.searchObject}&&searchText=${payload.searchText}`;
      if (payload.filterByType) URL += `&&filterByType=${payload.filterByType}`;

      // console.log(URL);

      await axios
        .get(URL)
        .then((res) => {
          // console.log(res.data.result.cardCount);
          dispatch.emergencyList.updateTotalTableState(res.data.result.total);
          dispatch.emergencyList.updateCardCountState(
            res.data.result.cardCount
          );
          dispatch.emergencyList.updateEmergencyTableDataState(
            res.data.result.rows
          );
        })
        .catch((err) => {
          console.error(err);
        });
    },
  }),
});
