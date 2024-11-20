import { Models } from "@rematch/core";
import { userAuth } from "./UserAuthModel";
import { common } from "./CommonModel";
import { alert } from './AlertModel'
export interface RootModel extends Models<RootModel> {
  userAuth: typeof userAuth;
  common: typeof common;
  alert: typeof alert;
}
export const models: RootModel = {
  userAuth,
  common,
  alert
};
