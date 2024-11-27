import { createModel } from "@rematch/core";
import { HomeListDataType, getTableDataType } from "../interfaces/HomeList";
import { RootModel } from "./index";
import axios from "axios";

export const homeList = createModel<RootModel>()({
  state: {
    homeListTableData: [],
    totalTable: 10,
  } as HomeListDataType,
  reducers: {
    updateHomeListTableDataState: (state, payload) => ({
      ...state,
      homeListTableData: payload,
    }),
    updateTotalTableState: (state, payload) => ({
      ...state,
      totalTable: payload,
    }),
  },
  effects: (dispatch) => ({
    async getHomeListTableData(payload: getTableDataType) {
      let URL = `/home-security/home-list?curPage=${payload.curPage}&&perPage=${payload.perPage}`;
      if (payload.searchObject && payload.searchText)
        URL += `&&searchObject=${payload.searchObject}&&searchText=${payload.searchText}`;
      await axios
        .get(URL)
        .then((value) => {
          console.log("home-list:", value.data.result);
          dispatch.homeList.updateTotalTableState(value.data.result.total);
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
