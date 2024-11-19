import { useState } from "react";
import { Breadcrumb, Layout, Menu, theme } from "antd";
const { Header, Content, Footer, Sider } = Layout;
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../stores";
import { APP_VERSION } from "../../configs/configs";
import { whiteLabel } from "../../configs/theme";
import ConfirmModal from "../../components/common/ConfirmModal";
import { LogOutIcon } from "../../assets/icons/Icons";

import {
  UserOutlined,
  AlertOutlined,
  DesktopOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
//icon svg
import MENU_LOGO from "../../assets/images/AiTAN-logo.png";

import "../styles/sideMenu.css";

//antd constraints components
const { SubMenu } = Menu;
const main_link = "/dashboard";
// const path = window.location.pathname.split("/");

const SideMenu = () => {
  const { sideMenuCollapsed } = useSelector((state: RootState) => state.common);
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();

  const [keyPath, setKeyPath] = useState<string>("");
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const logoutHandler = () => {
    ConfirmModal({
      title: "Do you want to log out?",
      okMessage: "Yes",
      cancelMessage: "Cancel",
      onOk: onLogoutOk,
      onCancel: onLogoutCancel,
    });
  };

  const onLogoutOk = async () => {
    await dispatch.userAuth.onLogout();
    dispatch.userAuth.updateAuthState(false);
    navigate("/auth", { replace: true });
  };

  const onLogoutCancel = async () => {
    console.log("Cancel");
  };

  const iconMenuColorSelector = (key: string) => {
    // console.log(keyPath);
    // console.log(key);
    // console.log(keyPath.includes(key));

    if (keyPath.includes(key)) return whiteLabel.whiteColor;
    return whiteLabel.whiteColor;
  };

  const iconSubMenuColorSelector = (key: string) => {
    if (keyPath.includes(key)) return whiteLabel.primaryColor;
    return whiteLabel.mainTextColor;
  };
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Sider
        collapsible
        collapsed={sideMenuCollapsed}
        onCollapse={(value) => dispatch.common.updateSideMenuCollapsed(value)}
        className="sideContainer"
      >
        <div className="sideMenuLogo">
          <img style={{ width: "50%" }} src={MENU_LOGO} alt="menuLogo" />
        </div>
        <div className="menuContainer">
          <div>
            <Menu
              defaultSelectedKeys={[window.location.pathname]}
              mode="inline"
              theme="dark"
              onSelect={({ keyPath }) => {
                setKeyPath(keyPath.toString());
              }}
              onOpenChange={(keys) => {
                const latestOpenKey = keys.find(
                  (key) => openKeys.indexOf(key) === -1
                );
                setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
              }}
              openKeys={openKeys}
            >
              <Menu.Item
                key={`${main_link}/profile`}
                icon={
                  <AlertOutlined
                    color={iconMenuColorSelector(`profile`)}
                    className="sideMenuIcon"
                  />
                }
              >
                <Link to={`${main_link}/profile`}>แผนที่หลัก</Link>
              </Menu.Item>
              <Menu.Item
                key={`${main_link}/EmergencyMain`}
                icon={
                  <FileSearchOutlined
                    color={iconMenuColorSelector("EmergencyMain")}
                    className="sideMenuIcon"
                  />
                }
              >
                <Link to={`${main_link}/EmergencyMain`}>ติดตามเหตุ</Link>
              </Menu.Item>
              {/* <Menu.Item
                key={`${main_link}/deviceStep`}
                icon={
                  <FileSearchOutlined
                    color={iconMenuColorSelector("deviceStep")}
                    className="sideMenuIcon"
                  />
                }
              >
                <Link to={`${main_link}/deviceStep`}>Step</Link>
              </Menu.Item> */}

              {/* User management */}
              {/* <SubMenu
                key="userManagement"
                icon={
                  <UserManagementIcon
                    color={iconMenuColorSelector("userManagement")}
                    className="sideMenuIcon"
                  />
                }
                title="User management">
                <Menu.Item
                  key={`${main_link}/residentInformation`}
                  icon={
                    <ResidentManagementIcon
                      color={iconSubMenuColorSelector("residentInformation")}
                      className="sideMenuIcon"
                    />
                  }>
                  <Link to={`${main_link}/residentInformation`}>
                    Resident’s information
                  </Link>
                </Menu.Item>
                <Menu.Item
                  key={`${main_link}/residentSignUp`}
                  icon={
                    <RegistrationIcon
                      color={iconSubMenuColorSelector("residentSignUp")}
                      className="sideMenuIcon"
                    />
                  }>
                  <Link to={`${main_link}/residentSignUp`}>
                    Resident’s sign up
                  </Link>
                </Menu.Item>
              </SubMenu> */}
              {/* <Menu.Item
                key={`${main_link}/deviceManagement`}
                icon={
                  <DesktopOutlined
                    color={iconMenuColorSelector("deviceManagement")}
                    className="sideMenuIcon"
                  />
                }
              >
                <Link to={`${main_link}/deviceManagement`}>ภาพรวมอุปกรณ์</Link>
              </Menu.Item> */}
              <Menu.Item
                key={`${main_link}/HomeMain`}
                icon={
                  <UserOutlined
                    color={iconMenuColorSelector("/HomeMain")}
                    className="sideMenuIcon"
                  />
                }
              >
                <Link to={`${main_link}/HomeMain`}>ภาพรวมผู้ใช้</Link>
              </Menu.Item>
            </Menu>
          </div>
          <div style={{ display: "none" }}>
            <Menu
              style={{ marginBottom: "auto" }}
              mode="inline"
              selectable={false}
            >
              <Menu.Item
                key="auth"
                icon={
                  <LogOutIcon
                    color={whiteLabel.logoutColor}
                    className="sideMenuIcon"
                  />
                }
                onClick={logoutHandler}
                style={{ alignSelf: "end", bottom: 0 }}
              >
                <span style={{ color: whiteLabel.logoutColor }}>Logout</span>
              </Menu.Item>
              {/* <div className="textVersion">version {APP_VERSION}</div> */}
            </Menu>
          </div>
        </div>
      </Sider>
    </>
  );
};

export default SideMenu;
