import React from "react";
import { Card, Col, Row } from "antd";
import { whiteLabel } from "../../../configs/theme";
import {
  SOSIcon,
  WarningIcon,
  OfflineIcon,
  OnlineIcon,
} from "../../../assets/icons/Icons";

import "../styles/AlertMain.css";

const CardAlert = () => {
  const cardData = [
    {
      color: whiteLabel.successColor,
      icon: (
        <OnlineIcon
          color={whiteLabel.blackColor}
          bgOpacity="0.2"
          className="iconControl_CA"
        />
      ),
      label: "ออนไลน์",
      value: 62,
    },
    {
      color: whiteLabel.grayColor,
      icon: (
        <OfflineIcon
          color={whiteLabel.blackColor}
          bgOpacity="0.2"
          className="iconControl_CA"
        />
      ),
      label: "ออฟไลน์",
      value: 40,
    },
    {
      color: whiteLabel.dangerColor,
      icon: (
        <SOSIcon
          color={whiteLabel.blackColor}
          bgOpacity="0.2"
          className="iconControl_CA"
        />
      ),
      label: "ภาวะฉุกเฉิน",
      value: 40,
    },
    {
      color: whiteLabel.warningColor,
      icon: (
        <WarningIcon
          color={whiteLabel.blackColor}
          bgOpacity="0.2"
          className="iconControl_CA"
        />
      ),
      label: "ปัญหาอุปกรณ์",
      value: 40,
    },
  ];

  return (
    <Row
      className=""
      gutter={[16, 16]}
      justify="center"
      style={{ marginBottom: 20 }}
    >
      {cardData.map((card, index) => (
        <Col xs={12} sm={12} md={12} lg={12} key={index}>
          <Card
            style={{
              backgroundColor: card.color,
              borderRadius: 10,
            }}
            bodyStyle={{
              padding: 0,
            }}
          >
            <Row className="cardContent_CA" justify="space-around">
              <Col className="innerContent_CA" span={10}>
                <div>{card.icon}</div>
              </Col>
              <Col className="innerContent_CA" span={14}>
                <h1 style={{ fontSize: whiteLabel.fontSize5xl, margin: 0 }}>
                  {card.value}
                </h1>
                <span>{card.label}</span>
              </Col>
            </Row>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default CardAlert;
