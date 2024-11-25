import { Models } from "@rematch/core";
import { userAuth } from "./UserAuthModel";
import { common } from "./CommonModel";
import { alert } from "./AlertModel";
import { homeList } from "./HomeListModel";
import { deviceList } from './DeviceListModel'
export interface RootModel extends Models<RootModel> {
  userAuth: typeof userAuth;
  common: typeof common;
  alert: typeof alert;
  homeList: typeof homeList;
  deviceList: typeof deviceList;
}
export const models: RootModel = {
  userAuth,
  common,
  alert,
  homeList,
  deviceList
};
