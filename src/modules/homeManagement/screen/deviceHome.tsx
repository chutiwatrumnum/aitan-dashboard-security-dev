import React, { useEffect } from "react";
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

interface StatusBadgeProps {
  status: "Disarmed" | "Armed Stay" | "Armed Away" | string;
}

type HomeDashboardProps = {
  callback(show: boolean): void;
  HomeId: number | undefined;
};

// Components
const IconAlert = ({ status }: { status: string }) => {
  switch (status) {
    case "online":
      return <WifiOutlined />;
    case "offline":
      return <DisconnectOutlined />;
    default:
      return null;
  }
};

const DeviceList: React.FC<{ data: DeviceListType }> = ({ data }) => (
  <Card className="device-card">
    <Row align="middle" className="device-header">
      <Col>
        <div
          className={
            data.online ? "device-icon-online" : "device-icon-offline"
          }>
          <BellOutlined className="bell-icon" />
        </div>
      </Col>
      <Col flex="auto">
        <span>{data.name}</span>
      </Col>
    </Row>
    <Row className="device-mock">
      <Col span={24}>
        <img src={data.iconFullUrl} alt="Device" />
      </Col>
    </Row>
    <Row gutter={[0, 12]} className="device-alerts">
      <Col span={24}>
        <Row align="middle" gutter={12}>
          <Col>
            <div
              className={`alert-dot ${
                data.online ? "device-icon-online" : "device-icon-offline"
              }`}>
              <IconAlert status={data.online ? "online" : "offline"} />
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
        <div className="battery-level">
          {data.status.find((item) => item.code === "battery_percentage")
            ?.value || "-"}
        </div>
      </Col>
    </Row>
  </Card>
);

const DeviceStatsComponent = ({ icon, color, count, label }: DeviceStats) => (
  <div className="stat-block">
    <div className="stat-icon" style={{ backgroundColor: color }}>
      {icon}
    </div>
    <div className="stat-content">
      <div className="stat-count">{count}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disarmed":
        return "#dc2626";
      case "Armed Stay":
        return "#2563eb";
      case "Armed Away":
        return "#16a34a";
      default:
        return "#9ca3af";
    }
  };

  return (
    <div
      className="status-badge"
      style={{
        backgroundColor: getStatusColor(status),
        padding: "8px 16px",
        borderRadius: "6px",
        color: "white",
        fontWeight: "500",
      }}>
      {status}
    </div>
  );
};

const HomeDashboard = ({ callback, HomeId }: HomeDashboardProps) => {
  const dispatch = useDispatch<Dispatch>();
  const { DeviceTableData, DeviceListData } = useSelector(
    (state: RootState) => state.deviceList
  );

  useEffect(() => {
    if (HomeId) {
      dispatch.deviceList.getDeviceListTableData(HomeId);
      dispatch.deviceList.getDeviceList(HomeId);
    }
  }, [HomeId, dispatch.deviceList]);

  const statsData = [
    {
      icon: <DesktopOutlined />,
      color: "#4285F4",
      count: DeviceListData?.length || 0,
      label: "อุปกรณ์ที่เปิดใช้งาน",
    },
    {
      icon: <WifiOutlined />,
      color: "#34A853",
      count: DeviceListData?.filter((item) => item.online).length || 0,
      label: "อุปกรณ์ที่ออนไลน์",
    },
    {
      icon: <WarningOutlined />,
      color: "#EA4335",
      count: 0,
      label: "อุปกรณ์มีปัญหา",
    },
    {
      icon: <DisconnectOutlined />,
      color: "#9AA0A6",
      count: DeviceListData?.filter((item) => !item.online).length || 0,
      label: "อุปกรณ์ออฟไลน์",
    },
  ];

  return (
    <div className="dashboard-container">
      <Button
        type="primary"
        onClick={async () => await callback(false)}
        style={{ marginBottom: "16px" }}>
        back
      </Button>

      <Row justify="space-between" align="middle" className="mb-6">
        <Col>
          <h1 className="main-title">ข้อมูลของบ้าน</h1>
        </Col>
        <Col>
          <StatusBadge status={DeviceTableData?.status || "ยังไม่เปิดใช้งาน"} />
        </Col>
      </Row>

      <Card className="mb-6">
        <Row gutter={24}>
          {statsData.map((stat, index) => (
            <Col span={6} key={index}>
              <DeviceStatsComponent {...stat} />
            </Col>
          ))}
        </Row>
      </Card>

      <Row gutter={24}>
        <Col span={8}>
          <Card className="mb-6">
            <div style={{ padding: "24px" }}>
              <h2 className="section-title">ที่อยู่</h2>
              <div className="address" style={{ marginTop: "16px" }}>
                <HomeOutlined />
                <span style={{ marginLeft: "12px" }}>
                  {DeviceTableData?.address || "-"}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="section-title">รายชื่อสมาชิกในบ้าน</h2>
            {DeviceTableData?.homeSecurityMember?.map((member) => (
              <div key={member.id} className="user-item">
                <img
                  src="https://i.pravatar.cc/160"
                  alt={member.fullname}
                  className="user-avatar"
                />
                <div className="user-info">
                  <div className="user-name">{member.fullname}</div>
                  <div className="user-role">
                    {member.isOwner ? "เจ้าของบ้าน" : "สมาชิกในครอบครัว"}
                  </div>
                  <div className="user-phone">{member.mobile}</div>
                </div>
              </div>
            ))}
            <div className="last-alert">
              <ClockCircleOutlined />
              แจ้งเตือนครั้งล่าสุด {dayjs().format("DD/MM/YYYY HH:mm")}
            </div>
          </Card>
        </Col>

        <Col span={16}>
          <Row gutter={[24, 24]}>
            {DeviceListData?.length ? (
              DeviceListData.map((device) => (
                <Col span={12} key={device.id}>
                  <DeviceList data={device} />
                </Col>
              ))
            ) : (
              <Col span={24}>
                <Card className="device-card">
                  <div style={{ textAlign: "center", padding: "24px" }}>
                    no device list
                  </div>
                </Card>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default HomeDashboard;
