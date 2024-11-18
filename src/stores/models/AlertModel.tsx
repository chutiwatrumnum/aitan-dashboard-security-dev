import { createModel } from "@rematch/core";
import { dataAlertType, conditionpage } from "../interfaces/alert";
import { RootModel } from "./index";
// import { getDataAlertLists } from "../../modules/alertManagement/service/api/AlertServiceAPI";
const filterDataInit:conditionpage={
  perPage: 0,
  curPage: 0
}
export const alert = createModel<RootModel>()({
  state: {
    tableData: [],
    loading: false,
    total: 0,
    EventMaxLength: 0,
    filterData:filterDataInit,
    countSecurityAlert: 0,
    countSOSAlert: 0,
    countWarningAlert: 0
  } as dataAlertType,
  reducers: {
    updateloadingDataState: (state, payload) => ({
      ...state,
      loading: payload,
    }),
    updatetotalgDataState: (state, payload) => ({
      ...state,
      total: payload,
    }),
    updateTableDataState: (state, payload) => ({
      ...state,
      tableData: payload,
    }),
    updateCountSOSAlertState: (state, payload) => ({
      ...state,
      countSOSAlert: payload,
    }), updateCountSecurityState: (state, payload) => ({
      ...state,
      countSecurityAlert: payload,
    }), updateCountWarningState: (state, payload) => ({
      ...state,
      countWarningAlert: payload,
    }),
  },
  effects: (dispatch) => ({
    async getTableData(payload: conditionpage) {
      dispatch.alert.updateloadingDataState(true);
      const data: any = await getDataAlertLists(payload);
      if (data?.status) {
        dispatch.alert.updateTableDataState(data.datavalue);
        dispatch.alert.updatetotalgDataState(data.total);
        dispatch.alert.updateCountSOSAlertState(data.countSOSAlert)
        dispatch.alert.updateCountSecurityState(data.countSecurityAlert)
        dispatch.alert.updateCountWarningState(data.countWarningAlert)
        dispatch.alert.updateloadingDataState(false);
      } else {
        dispatch.alert.updateloadingDataState(false);
      }
    },
  }),
});