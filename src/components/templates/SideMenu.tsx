import { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { Dispatch } from "../../stores";
import { whiteLabel } from "../../configs/theme";
import ConfirmModal from "../../components/common/ConfirmModal";
import { LogOutIcon } from "../../assets/icons/Icons";
import {
  UserOutlined,
  AlertOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import MENU_LOGO from "../../assets/images/AiTAN-logo-white.png";
import "../styles/sideMenu.css";

const { Sider } = Layout;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
  onClick?: () => void;
}

const MAIN_LINK = "/dashboard";

const SideMenu = () => {
  const location = useLocation();
  const [activeKey, setActiveKey] = useState<string>(
    location.state?.selectedMenu || location.pathname
  );
  const dispatch = useDispatch<Dispatch>();
  const navigate = useNavigate();


  const handleLogout = () => {
    ConfirmModal({
      title: "ต้องการออกจากระบบใช่หรือไม่?",
      okMessage: "ใช่",
      cancelMessage: "ยกเลิก",
      onOk: async () => {
        await dispatch.userAuth.onLogout();
        dispatch.userAuth.updateAuthState(false);
        navigate("/auth", { replace: true });
      },
      onCancel: () => {
        console.log("Cancel logout");
      },
    });
  };

  const menuItems: MenuItem[] = [
    {
      key: `${MAIN_LINK}/MapView`,
      icon: <AlertOutlined className="sideMenuIcon" />,
      label: "แผนที่หลัก",
      path: `${MAIN_LINK}/MapView`,
    },
    {
      key: `${MAIN_LINK}/EmergencyMain`,
      icon: <FileSearchOutlined className="sideMenuIcon" />,
      label: "ติดตามเหตุ",
      path: `${MAIN_LINK}/EmergencyMain`,
    },
    {
      key: `${MAIN_LINK}/HomeMain`,
      icon: <UserOutlined className="sideMenuIcon" />,
      label: "ภาพรวมผู้ใช้",
      path: `${MAIN_LINK}/HomeMain`,
    },
    {
      key: "logout",
      icon: (
        <LogOutIcon
          color={whiteLabel.whiteTransColor}
          className="sideMenuIcon"
        />
      ),
      label: "ออกจากระบบ",
      onClick: handleLogout,
    },
  ];

  useEffect(() => {
    if (location.state?.selectedMenu) {
      setActiveKey(location.state.selectedMenu);
    }
  }, [location]);

  const handleMenuClick = (key: string) => {
    const item = menuItems.find((menuItem) => menuItem.key === key);
    if (item?.onClick) {
      item.onClick();
    } else if (item?.path) {
      navigate(item.path, {
        state: { selectedMenu: key },
      });
      setActiveKey(key);
    }
  };

  return (
    <Sider
      collapsed={true}
      collapsible={false}
      className="sideContainer"
      width={80}
      collapsedWidth={80}>
      <div className="layout-container">
        <div className="sideMenuLogo">
          <img src={MENU_LOGO} alt="AiTAN Logo" style={{ width: "60%" }} />
        </div>

        <Menu
          selectedKeys={[activeKey]}
          mode="inline"
          theme="dark"
          className="main-menu">
          {menuItems.map((item) => (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              onClick={() => handleMenuClick(item.key)}>
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      </div>
    </Sider>
  );
};

export default SideMenu;
