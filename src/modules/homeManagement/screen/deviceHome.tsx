import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Spin } from "antd";
import {
  DesktopOutlined,
  WifiOutlined,
  WarningOutlined,
  DisconnectOutlined,
  HomeOutlined,
  BellOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import "../styles/AlertMain.css";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import dayjs from "dayjs";
import { DeviceListType } from "../../../stores/interfaces/DeviceList";
import Title from "antd/es/typography/Title";

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


const CircleIconPhone: React.FC = () => (
  <div
    style={{
      width: "20px",
      height: "20px",
      background: "#1890ff",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "5px",
    }}>
    <PhoneOutlined style={{ fontSize: "12", color: "#fff" }} />
  </div>
);

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
        <h3>{data.name}</h3>
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!HomeId) return;

      setIsLoading(true);
      try {
        await dispatch.deviceList.getDeviceListTableData(HomeId);
        await dispatch.deviceList.getDeviceList(HomeId);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [HomeId]);

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
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}>
          <Spin size="large" />
        </div>
      )}
      <Row
        justify="space-between"
        align="middle"
        className="mb-6"
        style={{ marginBottom: "24px" }}>
        <Button
          type="primary"
          onClick={async () => await callback(false)}
          // style={{ marginBottom: "16px" }}
        >
          back
        </Button>
        <Col>
          <h1 className="main-title">ข้อมูลของบ้าน</h1>
        </Col>
        <Col>
          <StatusBadge
            status={
              DeviceTableData?.homeAlarmStatus
                ? DeviceTableData?.homeAlarmStatus.status.name
                : "ยังไม่เปิดใช้งาน"
            }
          />
        </Col>
      </Row>
      <Card className="mb-6" bodyStyle={{ padding: "16px 0" }}>
        <Row gutter={0} align="middle">
          {statsData.map((stat, index) => (
            <Col
              span={6}
              key={index}
              style={{
                borderRight:
                  index !== statsData.length - 1 ? "1px solid #E8EAED" : "none",
                padding: "0 40px", // เพิ่ม padding ซ้ายขวา
              }}>
              <div className="stat-block">
                <div
                  className="stat-icon"
                  style={{ backgroundColor: stat.color }}>
                  {stat.icon}
                </div>
                <div className="stat-content">
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-count">{stat.count}</div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
      <Row gutter={24} style={{ paddingTop: "24px" }}>
        <Col span={8}>
          <Card className="mb-6" style={{ marginBottom: "24px" }}>
            <div style={{ padding: "10px" }}>
              <Title level={4} className="home-list-title">
                ที่อยู่บ้าน
              </Title>
              <div className="address" style={{ marginTop: "16px" }}>
                <HomeOutlined />
                <span className="member-address" style={{ marginLeft: "12px" }}>
                  {DeviceTableData?.address || "-"}
                </span>
              </div>
            </div>
          </Card>
          <Card style={{ padding: "10px" }}>
            <Title className="section-title">รายชื่อสมาชิกในบ้าน</Title>
            {DeviceTableData?.homeSecurityMember?.map((member) => (
              <div key={member.id} className="user-item">
                <div className="user-info">
                  <Col span={24} className="user-name">
                    {member.fullname}
                  </Col>
                  <Col
                    span={24}
                    className={
                      member.isOwner ? "member-role-owner" : "member-role"
                    }>
                    {member.isOwner ? "เจ้าของบ้าน" : "สมาชิกในครอบครัว"}
                  </Col>
                  <Col span={24} className="member-phone">
                    <CircleIconPhone />
                    <div className="user-phone">{member.mobile}</div>
                  </Col>
                </div>
              </div>
            ))}
            <Col span={24} className="last-alert">
              แจ้งเตือนครั้งล่าสุด {dayjs().format("DD/MM/YYYY HH:mm")}
            </Col>
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
                    ไม่พบอุปกรณ์ในระบบ
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
