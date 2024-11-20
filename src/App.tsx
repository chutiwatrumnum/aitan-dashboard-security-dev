import { useEffect, useLayoutEffect } from "react";
import { Navigate, Route, Routes, BrowserRouter } from "react-router-dom";
import { encryptStorage } from "./utils/encryptStorage";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "./stores";
import { Layout } from "antd";
import SideMenu from "./components/templates/SideMenu";
import "antd/dist/reset.css";
import "./App.css";

const { Sider } = Layout;

// layouts
import UnauthorizedLayout from "./navigation/UnauthorizedLayout";
import AuthorizedLayout from "./navigation/AuthorizedLayout";

// authorize routes
import MapView from "./modules/SOS/screen/Alertmain";

import DeviceManagement from './modules/deviceManagement/screen/deviceMain'
import EmergencyMain from "./modules/emergencyTacking/screen/emergencyMain";
import HomeMain from "./modules/homeManagement/screen/homeMain";
import DeviceStep from './modules/deviceManagement/screen/deviceStep'


import ChangePassword from "./modules/setting/screens/ChangePassword";
import AdminManagement from "./modules/setting/screens/AdminManagement";
// unauthorize routes
import SignInScreen from "./modules/main/SignInScreen";
import RecoveryScreen from "./modules/main/RecoveryScreen";
import ResetPassword from "./modules/main/ResetPassword";
import SuccessResetScreen from "./modules/main/SuccessResetScreen";
import HomeDashboard from "./modules/homeManagement/screen/deviceHome";

// components

function App() {
  const dispatch = useDispatch<Dispatch>();
  const { isAuth } = useSelector((state: RootState) => state.userAuth);

  /*
  const tokenCheck = async () => {
    const accessToken = await encryptStorage.getItem("accessToken");
    if (accessToken) {
      dispatch.userAuth.updateAuthState(true);
    }
  };
  const roleAccessTokenCheck = async () => {
    await dispatch.common.getRoleAccessToken();
  };
  useEffect(() => {
    tokenCheck();
    dispatch.common.getUnitOptions();
    dispatch.common.getMasterData();
  }, []);

  useEffect(() => {
    roleAccessTokenCheck();
  }, [isAuth]);
*/
  useLayoutEffect(() => {
    (async () => {
      try {
        // Check Access token
        const accessToken = await encryptStorage.getItem("accessToken");
        if (
          accessToken === null ||
          accessToken === undefined ||
          accessToken === ""
        )
          throw "accessToken not found";
        // Check Refresh token
        const resReToken = await dispatch.userAuth.refreshTokenNew();
        if (!resReToken) throw "accessToken expired";
        // Token pass
        // await dispatch.common.getUnitOptions();
        // await dispatch.common.getMasterData();
        // await dispatch.userAuth.refreshUserDataEffects();
        await dispatch.common.getRoleAccessToken();
        dispatch.userAuth.updateAuthState(true);
        return true;
      } catch (e) {
        dispatch.userAuth.updateAuthState(false);
        return false;
      }
    })();
  }, [isAuth]);

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: "100vh" }}>
        <Layout>
          <Layout.Content>
            <Routes>
              {/* unauthorized_route */}
              <Route element={<UnauthorizedLayout />}>
                <Route index path="/auth" element={<SignInScreen />} />
                <Route path="/recovery" element={<RecoveryScreen />} />
                <Route
                  path="/forgot-password/:token"
                  element={<ResetPassword />}
                />
                <Route path="/success-reset" element={<SuccessResetScreen />} />
              </Route>
              {/* authorized_route */}
              <Route path="dashboard" element={<AuthorizedLayout />}>
                <Route path="MapView" element={<MapView />} />
             
                <Route path="deviceStep" element={<DeviceStep />} />
                <Route path="deviceManagement" element={<DeviceManagement />} />
                <Route path="EmergencyMain" element={<EmergencyMain />} />
                <Route path="HomeMain" element={<HomeMain />} />
                {/* Setting */}
                <Route path="changePassword" element={<ChangePassword />} />
                <Route path="adminManagement" element={<AdminManagement />} />
                {/* <Route path="deviceHome" element={<HomeDashboard/>} /> */}
              </Route>
              <Route path="*" element={<Navigate to="/auth" />} />
            </Routes>
          </Layout.Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
}
export default App;
