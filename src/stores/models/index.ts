import { Models } from "@rematch/core";
import { userAuth } from "./UserAuthModel";
import { common } from "./CommonModel";
import { announcement } from "./Announcement";
import { MCST } from "./MCSTModel";
import { resident } from "./residentModel";
import { alert } from './AlertModel'
export interface RootModel extends Models<RootModel> {
  userAuth: typeof userAuth;
  common: typeof common;
  announcement: typeof announcement;
  MCST: typeof MCST;
  resident: typeof resident;
  alert: typeof alert;
}
export const models: RootModel = {
  userAuth,
  common,
  announcement,
  MCST,
  resident,
  alert
};
