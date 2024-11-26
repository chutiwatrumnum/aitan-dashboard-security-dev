import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "antd";
import {
  DesktopOutlined,
  WifiOutlined,
  WarningOutlined,
  DisconnectOutlined,
  HomeOutlined,
  BellOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import "../styles/AlertMain.css";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import dayjs from "dayjs";
import { DeviceListType } from "../../../stores/interfaces/DeviceList";

// Types
interface DeviceStats {
  label: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

interface HomeUser {
  name: string;
  role: string;
  phone: string;
  avatar: string;
}

interface Device {
  id: string;
  name: string;
  batteryLevel: number;
  alerts: {
    sensor: string;
    warning: string;
  };
  imageUrl: string;
}

interface DeviceList {
  id: string;
  name: string;
  batteryLevel: number;
  alerts: Array<{
    type: "warning" | "danger";
    message: string;
  }>;
  imageUrl: string;
}

// Constants
const DEVICE_STATS: DeviceStats[] = [
  {
    label: "อุปกรณ์ที่เปิดใช้งาน",
    count: 0,
    icon: <DesktopOutlined />,
    color: "#4285F4",
  },
  {
    label: "อุปกรณ์ที่ออนไลน์",
    count: 0,
    icon: <WifiOutlined />,
    color: "#34A853",
  },
  {
    label: "อุปกรณ์มีปัญหา",
    count: 0,
    icon: <WarningOutlined />,
    color: "#EA4335",
  },
  {
    label: "อุปกรณ์ออฟไลน์",
    count: 0,
    icon: <DisconnectOutlined />,
    color: "#9AA0A6",
  },
];

const HOME_USERS: HomeUser[] = [
  {
    name: "วรุณญา ทำเจริญยิ่ง",
    role: "เจ้าของบ้าน",
    phone: "0845625785",
    avatar: "https://i.pravatar.cc/160",
  },
  {
    name: "คมชัย ทำเจริญยิ่ง",
    role: "(ครอบครัว)",
    phone: "0845625799",
    avatar: "https://i.pravatar.cc/161",
  },
];

const DEVICE_DATA: DeviceList[] = [
  {
    id: "000324",
    name: "DOOR SENSOR",
    batteryLevel: 80,
    imageUrl: "https://aitan-smart.web.app/assets/Sensor01-NPTLW2ew.png",
    alerts: [
      // { type: "warning", message: "เซนเซอร์ตรวจจับควัน" },
      { type: "danger", message: "ตรวจพบการบุกรุก" },
    ],
  },
  // {
  //   id: "000325",
  //   name: "DOOR SENSOR",
  //   batteryLevel: 75,
  //   imageUrl: "https://aitan-smart.web.app/assets/Sensor01-NPTLW2ew.png",
  //   alerts: [{ type: "warning", message: "เซนเซอร์ตรวจจับควัน" }],
  // },
];

// Card Components
type HomeDashboardProps = {
  callback(Ishow: boolean): any;
  HomeId:number | undefined
};

const IconAlert=({status}:any) => {
  switch (status) {
    case "online":
    return  <WifiOutlined />
  
  case "offline":
return      <DisconnectOutlined />
    
    default:
      break;
  }
}

const DeviceList: React.FC<{ data: DeviceListType }> = ({ data }) => (
  <Card className="device-card">
    <Row align="middle" className="device-header">
      <Col>
        <div className={data.online?"device-icon-online":"device-icon-offline"}>
          <BellOutlined className="bell-icon" />
        </div>
      </Col>
      <Col flex="auto">
        <span>{data.name}</span>
      </Col>
    </Row>
    <Row className="device-mock">
      <Col span={24}>
        <img src={data.iconFullUrl} alt="Door Sensor" />
      </Col>
    </Row>
    <Row gutter={[0, 12]} className="device-alerts">
        <Col span={24} >
          <Row align="middle" gutter={12}>
            <Col>
              <div className={`alert-dot ${data.online?"device-icon-online":"device-icon-offline"}`}>
                <IconAlert status={data.online?"online":"offline"} />
                {/* <WarningOutlined /> */}
              </div>
            </Col>
            <Col flex="auto">
              <span>{data.online ? "Online" : "Offline"}</span>
            </Col>
          </Row>
        </Col>
    
    </Row>
    <Row align="middle" justify="space-between" className="device-info">
      <Col>
        <span>SN : </span>
        <span>{data.product_id}</span>
      </Col>
      <Col>
        <span>{data.product_name}</span>
      </Col>
      <Col>

        {/* <div className="battery"> */}
          <div className="battery-level">{data.status.find(item => item.code === "battery_percentage")?.value || "-"}</div>
        {/* </div> */}
      </Col>
    </Row>
  </Card>
);
type DeviceStatsProps = {
  color: string;
  count: number;
  label: string;
}
const DeviceStatsComponents= ({icon,color,count,label}:DeviceStats) => (
    <div  className="stat-block">
      <div className="stat-icon" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className="stat-content">
        <div className="stat-count">{count}</div>
        <div className="stat-label">{label}</div>
      </div>
      
    </div>


)
// Component
const HomeDashboard = ({ callback,HomeId }: HomeDashboardProps) => {
    // Variables

    const dispatch = useDispatch<Dispatch>();
    const { DeviceTableData,DeviceListData } = useSelector(
      (state: RootState) => state.deviceList
    );
    const fetchData = async (HomeId: number) => {
      await dispatch.deviceList.getDeviceListTableData(HomeId);
      await dispatch.deviceList.getDeviceList(HomeId);
    };
  useEffect(() => {

    if (HomeId) {
     fetchData(HomeId)
    }
  }, [HomeId]);
  return (
    <div className="dashboard-container">
      {/* Header with Status */}
      <Button
        type="primary"
        onClick={async () => {
          await callback(false);
        }}>
        back
      </Button>
      <div className="header-container">
        <h1 className="main-title">ข้อมูลของบ้าน</h1>
        <div  className="status-badge">Partial Armed</div>
      </div>

      {/* Device Statistics */}
      <div className="stats-grid">
      <DeviceStatsComponents icon={<DesktopOutlined />} color="#4285F4" count={DeviceListData? DeviceListData?.length:0} label="อุปกรณ์ที่เปิดใช้งาน" />
      <DeviceStatsComponents icon={<WifiOutlined />} color="#34A853" count={DeviceListData? DeviceListData?.filter((item) => item.online).length:0} label="อุปกรณ์ที่ออนไลน์" />
      <DeviceStatsComponents icon={<WarningOutlined />} color="#EA4335" count={0} label="อุปกรณ์มีปัญหา" />
      <DeviceStatsComponents icon={<DisconnectOutlined />} color="#9AA0A6" count={DeviceListData? DeviceListData?.filter((item) => !item.online).length:0} label="อุปกรณ์ออฟไลน์" />
        {/* {DEVICE_STATS.map((stat, index) => (
          <div key={index} className="stat-block">
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <div className="stat-count">{stat.count}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))} */}
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column */}
        <Col xs={24} md={8}>
          {/* Location Card */}
          <Card className="location-card">
            <h2 className="section-title">ที่อยู่</h2>
            <div className="address">
              <HomeOutlined />
              <span>
                {DeviceTableData? DeviceTableData?.address : "-"}
              </span>
            </div>
          </Card>

          {/* Users Card */}
          <Card className="users-card">
            <h2 className="section-title">รายชื่อสมาชิกในบ้าน</h2>
            {DeviceTableData?.homeSecurityMember?.length ? (
              DeviceTableData.homeSecurityMember.map((member) => (
                <div key={member.id} className="user-item">
                  <img
                    src="https://i.pravatar.cc/160"
                    alt={member.fullname}
                    className="user-avatar"
                  />
                  <div className="user-info">
                    <div className="user-name">{member.fullname}</div>
                    <div className="user-role">{member.isOwner ? "เจ้าของบ้าน" : "สมาชิกในครอบครัว"}</div>
                    <div className="user-phone">{member.mobile}</div>
                  </div>
                </div>
              ))
            ) : (
              <div>ไม่มีสมาชิกในบ้าน</div>
            )}
            <div className="last-alert">
              <ClockCircleOutlined /> แจ้งเตือนครั้งล่าสุด {dayjs().format("DD/MM/YYYY HH:mm")}
            </div>
          </Card>
        </Col>

        {/* Right Column - Devices */}
                {DeviceListData?DeviceListData?.map((doorbell) => (
                  
        <Col xs={24} md={8}>
          <Row gutter={[16, 16]}>
            <Col xs={24} xl={24} md={24}>
              <div className="doorbell-container">
                  <DeviceList key={doorbell.id} data={doorbell} />
              </div>
            </Col>
          </Row>
        </Col>
                )):<div>no device list</div>}
      </Row>
    </div>
  );
};

export default HomeDashboard;
