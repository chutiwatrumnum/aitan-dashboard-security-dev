import { createModel } from "@rematch/core";
import { SOSDataType } from "../interfaces/SOS";
import { RootModel } from "./index";
import axios from "axios";

export const alert = createModel<RootModel>()({
  state: {
    pieEventData: [],
    pieStatusData: [],
    mapInfoData: [],
  } as SOSDataType,
  reducers: {
    updatePieEventDataState: (state, payload) => ({
      ...state,
      pieEventData: payload,
    }),
    updatePieStatusDataState: (state, payload) => ({
      ...state,
      pieStatusData: payload,
    }),
    updateMapInfoDataState: (state, payload) => ({
      ...state,
      mapInfoData: payload,
    }),
  },
  effects: (dispatch) => ({
    async getPieEventData() {
      await axios
        .get("/home-security/total-event")
        .then((value) => {
          // console.log(value.data.result);
          dispatch.alert.updatePieEventDataState(value.data.result);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async getPieStatusData() {
      await axios
        .get("/home-security/total-status")
        .then((value) => {
          // console.log(value.data.result);
          dispatch.alert.updatePieStatusDataState(value.data.result);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async getMapInfoData() {
      await axios
        .get("/home-security/event-list")
        .then((value) => {
          // console.log(value.data.result.rows);
          dispatch.alert.updateMapInfoDataState(value.data.result.rows);
        })
        .catch((err) => {
          console.error(err);
        });
    },
  }),
});
