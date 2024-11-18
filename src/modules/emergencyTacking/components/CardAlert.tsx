import React from "react";
import { Card, Col, Row } from "antd";
import {
  WifiOutlined,
  AudioMutedOutlined,
  AlertOutlined,
  DesktopOutlined,
} from "@ant-design/icons";

const CardAlert: React.FC = () => {
  const cardData = [
    {
      color: "#4CAF50",
      icon: <WifiOutlined style={{ fontSize: 40, color: "#fff" }} />,
      label: "ออนไลน์",
      value: 62,
    },
    {
      color: "#424242",
      icon: <AudioMutedOutlined style={{ fontSize: 40, color: "#fff" }} />,
      label: "ออฟไลน์",
      value: 40,
    },
    {
      color: "#f44336",
      icon: <AlertOutlined style={{ fontSize: 40, color: "#fff" }} />,
      label: "ภาวะฉุกเฉิน",
      value: 40,
    },
    {
      color: "#FF9800",
      icon: <DesktopOutlined style={{ fontSize: 40, color: "#fff" }} />,
      label: "ปัญหาอุปกรณ์",
      value: 40,
    },
  ];

  return (
    <Row gutter={[16, 16]} justify="center" style={{marginBottom:20}}>
      {cardData.map((card, index) => (
        <Col xs={12} sm={12} md={12} lg={12} key={index}>
          <Card
            style={{
              backgroundColor: card.color,
              borderRadius: 10,
              height: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            bodyStyle={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: "#fff",
              padding: 0,
            }}>
            <div >{card.icon}</div>
            <h3 style={{ fontSize: 18, margin: 0 }}>{card.value}</h3>
            <h1 style={{ margin: 0, fontSize: 14 }}>{card.label}</h1>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default CardAlert;
