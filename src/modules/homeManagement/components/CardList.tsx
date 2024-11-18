import React from "react";
import { Card, Button, Row, Col, Divider } from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const jobData = [
  {
    id: 1,
    title: "การขอความช่วยเหลือ",
    name: "วรุณญา ท่าเจริญยิ่ง",
    address: "11/9 ซอยอรรถสุนิทวงศ์ 79 กรุงเทพมหานคร",
    phone1: "0845625785",
    phone2: "0898456859",
    date: "26/8/64",
    time: "09:10",
    color: "#D32F2F",
  },
  {
    id: 2,
    title: "เช็นเซอร์ควัน",
    name: "ปนัสสา ศึกษาพันธ์",
    address: "11/9 ซอยอรรถสุนิทวงศ์ 79 กรุงเทพมหานคร",
    phone1: "0845625799",
    phone2: "0228456859",
    date: "26/8/64",
    time: "09:15",
    color: "#FF9800",
  },
];

const CardList: React.FC = () => {
  return (
    <div style={{ padding: "5px" }}>
      {jobData.map((job) => (
        <Card
          key={job.id}
          style={{
            marginBottom: "10px",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
          bodyStyle={{ padding: "12px" }}>
          <Row>
            <Col
              style={{
                width: "8px",
                backgroundColor: job.color,
                marginRight: "16px",
                borderRadius: "px",
              }}
            />
            <Col span={20}>
              <h3 style={{ fontWeight: "bold", marginBottom: "4px"}}>
                งาน : {job.title}
              </h3>
              <p style={{ color: "#888", marginBottom: "16px" }}>{job.name}</p>
              <Row style={{ marginBottom: "8px" }}>
                <EnvironmentOutlined style={{ marginRight: "8px" }} />
                <span>{job.address}</span>
              </Row>
              <Row style={{ marginBottom: "8px" }}>
                <PhoneOutlined style={{ marginRight: "8px" }} />
                <span>1 โทรฉุกเฉิน : {job.phone1}</span>
              </Row>
              <Row style={{ marginBottom: "8px" }}>
                <PhoneOutlined style={{ marginRight: "8px" }} />
                <span>2. โทรฉุกเฉิน : {job.phone2}</span>
              </Row>
              <Row style={{ marginBottom: "16px" }}>
                <CalendarOutlined style={{ marginRight: "8px" }} />
                <span>
                  {job.date} {job.time}
                </span>
              </Row>
              <Divider style={{ margin: "0 -16px 16px" }} />
              <Button
                type="primary"
                style={{ width: "100%", fontWeight: "bold" }}>
                แจ้งเตือน
              </Button>
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );
};

export default CardList;
