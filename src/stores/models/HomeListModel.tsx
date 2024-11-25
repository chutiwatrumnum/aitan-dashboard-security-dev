import { createModel } from "@rematch/core";
import { HomeListDataType } from "../interfaces/HomeList";
import { RootModel } from "./index";
import axios from "axios";

export const homeList = createModel<RootModel>()({
  state: {
    homeListTableData: [],
  } as HomeListDataType,
  reducers: {
    updateHomeListTableDataState: (state, payload) => ({
      ...state,
      homeListTableData: payload,
    }),
  },
  effects: (dispatch) => ({
    async getHomeListTableData() {
      await axios
        .get("/home-security/home-list")
        .then((value) => {
          console.log("home-list:",value.data.result.rows);
          dispatch.homeList.updateHomeListTableDataState(
            value.data.result.rows
          );
        })
        .catch((err) => {
          console.error(err);
        });
    },
  }),
});
