import React, { useState } from "react";
import { Card, Steps, Button, Col, Checkbox, message, Row, Modal } from "antd";
import {
  HomeOutlined,
  ClockCircleOutlined,
  BellOutlined,
  WarningOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { encryptStorage } from "../../../utils/encryptStorage";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../../stores";
import "../styles/ServiceRequest.css";
import Title from "antd/es/typography/Title";

const { Step } = Steps;

// Types
interface ProgressDotProps {
  current?: boolean;
  completed?: boolean;
}

interface StepInfo {
  title: string;
  subTitle: string;
  description: string;
}

const STEPS: StepInfo[] = [
  {
    title: "Step 1",
    subTitle: "00:00:10",
    description: "คำอธิบายขั้นตอน\nการดำเนินการ",
  },
  {
    title: "Step 2",
    subTitle: "00:00:10",
    description: "ติดต่อไม่สำเร็จ",
  },
  {
    title: "Step 3",
    subTitle: "00:00:10",
    description: "ส่งเจ้าหน้าที่ไป",
  },
  {
    title: "Step 4",
    subTitle: "00:00:10",
    description: "ติดตามผลดำเนินการ",
  },
];

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

const FAILURE_REASONS = [
  "สัญญาณไม่สามารถติดต่อเลขหมายปลายทางได้ขขณะนี้",
  "สเตตัสตัวรับสัญญาณมีปัญหา",
  "สัญญาณไม่เสถียรไม่สามารถติดต่อปลายทางได้",
  "ไม่มีเจ้าหน้าที่มาติดต่อให้บริการ",
  "เจ้าของปิดสัญญาณในการสื่อสาร",
  "เครื่องมือในการสื่อสารมีปัญหา",
  "สัญญาณขัดข้องชั่วคราว",
  "มีการเปลี่ยนเบอร์ผู้ใช้ไม่ได้แจ้งกับพนักงาน",
] as const;

const DEVICE_DATA: DeviceList[] = [
  {
    id: "000324",
    name: "DOOR SENSOR",
    batteryLevel: 80,
    imageUrl: "https://aitan-smart.web.app/assets/Sensor01-NPTLW2ew.png",
    alerts: [{ type: "danger", message: "ตรวจพบการบุกรุก" }],
  },
  {
    id: "000325",
    name: "DOOR SENSOR",
    batteryLevel: 75,
    imageUrl: "https://aitan-smart.web.app/assets/Sensor01-NPTLW2ew.png",
    alerts: [{ type: "danger", message: "ตรวจพบการบุกรุก" }],
  },
];

const members = [
  {
    name: "วรุณญา ทำเจริญยิ่ง",
    role: "เจ้าของบ้าน",
    phone: "0845625785",
    lastCall: "22/11/2024 11:11",
  },
  {
    name: "คมชัย ทำเจริญยิ่ง",
    role: "ครอบครัว",
    phone: "0845625799",
    lastCall: "22/11/2024 11:11",
  },
  {
    name: "คมสัน ทำเจริญยิ่ง",
    role: "ครอบครัว",
    phone: "0845625888",
    lastCall: "22/11/2024 11:11",
  },
];

// Reusable Components

const ProgressDot: React.FC<ProgressDotProps> = ({ current, completed }) => (
  <div
    className={`custom-dot ${current ? "current" : ""} ${
      completed ? "completed" : ""
    }`}>
    {current && <div className="dot-pulse" />}
  </div>
);

const CircleIcon: React.FC = () => (
  <div
    style={{
      width: "120px",
      height: "120px",
      background: "#1890ff",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "24px",
    }}>
    <HomeOutlined style={{ fontSize: "48px", color: "#fff" }} />
  </div>
);

// Card Components
const DeviceList: React.FC<{ data: DeviceList }> = ({ data }) => (
  <Card className="device-card">
    <Row align="middle" className="device-header">
      <Col>
        <div className="device-icon">
          <BellOutlined className="bell-icon" />
        </div>
      </Col>
      <Col flex="auto">
        <span>{data.name}</span>
      </Col>
    </Row>

    <Row className="device-mock">
      <Col span={24}>
        <img src={data.imageUrl} alt="Door Sensor" />
      </Col>
    </Row>

    <Row gutter={[0, 12]} className="device-alerts">
      {data.alerts.map((alert, index) => (
        <Col span={24} key={index}>
          <Row align="middle" gutter={12}>
            <Col>
              <div className={`alert-dot ${alert.type}`}>
                <WarningOutlined />
              </div>
            </Col>
            <Col flex="auto">
              <span>{alert.message}</span>
            </Col>
          </Row>
        </Col>
      ))}
    </Row>

    <Row align="middle" justify="space-between" className="device-info">
      <Col>
        <span>SN : </span>
        <span>{data.id}</span>
      </Col>
      <Col>
        <span>Gateway</span>
      </Col>
      <Col>
        {/* <div className="battery"> */}
        <div className="battery-level">{data.batteryLevel}%</div>
        {/* </div> */}
      </Col>
    </Row>
  </Card>
);
type DeviceStepProps = {
  callback(Ishow: boolean): any;
};
// Main Component
const DeviceStep = ({ callback }: DeviceStepProps) => {
  const dispatch = useDispatch<Dispatch>();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [isMapVisible, setIsMapVisible] = useState(false);

    const showMap = () => {
      setIsMapVisible(true);
    };

    const handleMapClose = () => {
      setIsMapVisible(false);
    };

  // Handlers
  const handleStepChange = (increment: number = 1) => {
    setIsProcessing(true);
    setTimeout(() => {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + increment);
        if (currentStep + increment === 2) {
          encryptStorage.removeItem("acceptedRequestId");
          // console.log("acceptedRequestId => REMOVED");
        }
        setSelectedReasons([]);
        message.success(
          `ดำเนินการขั้นตอนที่ ${currentStep + increment} เรียบร้อย`
        );
      } else {
        message.success("ดำเนินการทั้งหมดเสร็จสิ้น");
      }
      setIsProcessing(false);
    }, 1000);
  };


const renderMemberList = () => (
  <Row>
    <Col span={24}>
      {/* หัวข้อ */}
      <Title level={4} className="member-list-title">
        รายชื่อสมาชิกในบ้าน
      </Title>
      <Row align="middle" className="address-line">
        <Col>
          <HomeOutlined className="home-icon" />
          <span>11/9 ซอยอรรถสุนทรงค์ 79 กรุงเทพมหานคร</span>
        </Col>
      </Row>

      {/* รายชื่อสมาชิก */}
      <Row gutter={[0, 24]} className="member-list-container">
        {members.map((member, index) => (
          <Col span={24} key={index}>
            <Row
              className={`member-item ${
                index !== members.length - 1 ? "with-border" : ""
              }`}>
              <Col span={24}>
                <Row className="member-info-container">
                  {/* ข้อมูลด้านซ้าย */}
                  <Col flex="auto">
                    <Row className="member-main-info">
                      <Col span={24}>
                        <span className="member-name">{member.name}</span>
                      </Col>
                      <Col span={24}>
                        <span
                          className={
                            member.role === "เจ้าของบ้าน"
                              ? "member-role-owner"
                              : "member-role"
                          }>
                          {member.role === "เจ้าของบ้าน"
                            ? "เจ้าของบ้าน"
                            : `(${member.role})`}
                        </span>
                      </Col>
                      <Col span={24} className="member-phone">
                        <PhoneOutlined className="phone-icon" />
                        <span>{member.phone}</span>
                      </Col>
                    </Row>
                  </Col>

                  {/* ปุ่มด้านขวา */}
                  <Col className="member-buttons">
                    <Row gutter={8}>
                      <Col>
                        <Button className="success-button">สำเร็จ</Button>
                      </Col>
                      <Col>
                        <Button className="fail-button">ไม่สำเร็จ (1)</Button>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <span className="last-call">
                          (โทรครั้งล่าสุด {member.lastCall})
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        ))}
      </Row>

      {/* ปุ่มดูแผนที่ */}
      <Row>
        <Col span={24}>
          <Button
            type="primary"
            block
            icon={<EnvironmentOutlined />}
            className="map-button"
            onClick={showMap}>
            ดูแผนที่
          </Button>
        </Col>
      </Row>
    </Col>
  </Row>
);

const renderActionSteps = () => (
  <Row>
    <Col span={24} className="right-section">
      {/* หัวข้อและคำอธิบาย */}
      <Title level={4} style={{ marginBottom: 4 }}>
        1. ขั้นตอนการดำเนินการแก้ไข
      </Title>
      <Row>
        <Col span={24}>
          <div
            style={{
              marginBottom: 24,
              borderBottom: "1px solid #f0f0f0",
              paddingBottom: 16,
            }}>
            โทรติดต่อลูกค้า
          </div>
        </Col>
      </Row>

      <Title level={4} style={{ marginBottom: 16 }}>
        2. ต้องการความช่วยเหลือด้านใด
      </Title>

      {/* ปุ่มตัวเลือก */}
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Button
            type="primary"
            block
            style={{ height: 48 }}
            onClick={() => handleStepChange(2)}
            disabled={isProcessing}
            loading={isProcessing}>
            ตำรวจ
          </Button>
        </Col>
        <Col span={24}>
          <Button
            type="primary"
            block
            style={{ height: 48 }}
            onClick={() => handleStepChange(2)}
            disabled={isProcessing}
            loading={isProcessing}>
            โรงพยาบาล
          </Button>
        </Col>
        <Col span={24}>
          <Button
            type="primary"
            block
            style={{ height: 48 }}
            onClick={() => handleStepChange(2)}
            disabled={isProcessing}
            loading={isProcessing}>
            ดับเพลิง
          </Button>
        </Col>
        <Col span={24}>
          <Button
            type="primary"
            block
            style={{ height: 48 }}
            onClick={() => handleStepChange(2)}
            disabled={isProcessing}
            loading={isProcessing}>
            ไม่ต้องการขอความช่วยเหลือ
          </Button>
        </Col>
      </Row>
    </Col>
  </Row>
);
  

  // Content Components
  const InitialStepCard = () => (
    <>
      <Card className="info-card">
        <Row gutter={24}>
          <Col xs={24} md={12}>
            {renderMemberList()}
          </Col>
          <Col xs={24} md={12}>
            {renderActionSteps()}
          </Col>
        </Row>
      </Card>
    </>
  );

  const TravelDetailCard = () => (

      <Row gutter={24}>
        <Col xs={24} md={12}>
          {renderMemberList()}
        </Col>
        <Col xs={24} md={12} className="right-section">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}>
            <CircleIcon />
            <Button
              type="primary"
              size="large"
              block
              onClick={() => handleStepChange()}
              loading={isProcessing}
              style={{
                height: "48px",
                fontSize: "16px",
                borderRadius: "8px",
                marginBottom: "16px",
              }}>
              เดินทางไปบ้านเลขที่ 11/9
            </Button>
            <div style={{ width: "100%", textAlign: "left" }}>
              <h4 style={{ marginBottom: "12px" }}>ขั้นตอนการดำเนินการ:</h4>
              <ul style={{ paddingLeft: "20px" }}>
                <li>ตรวจสอบสถานที่เกิดเหตุ</li>
                <li>ประเมินความเสียหาย</li>
                <li>รายงานผลการตรวจสอบ</li>
              </ul>
            </div>
          </div>
        </Col>
      </Row>
  
  );

  const SuccessCard = () => (
      <Row gutter={24}>
        <Col xs={24} md={12}>
          {renderMemberList()}
        </Col>
        <Col xs={24} md={12} className="right-section">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              height: "100%",
              justifyContent: "center",
            }}>
            <CircleIcon />
            <h2
              style={{
                fontSize: "28px",
                color: "#333",
                marginBottom: "16px",
                textAlign: "center",
              }}>
              รอดำเนินการสำเร็จ
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "#666",
                textAlign: "center",
                maxWidth: "300px",
                margin: "0 auto",
              }}>
              การดำเนินการทั้งหมดเสร็จสิ้น
            </p>
          </div>
        </Col>
      </Row>
  );

  const FailureReasonsCard = () => (
    <Card className="failure-reasons-card">
      <h2 className="failure-title">ไม่สามารถติดต่อได้ด้วยเหตุผล</h2>
      <Checkbox.Group
        className="reasons-checkbox-group"
        value={selectedReasons}
        onChange={setSelectedReasons}>
        {FAILURE_REASONS.map((reason, index) => (
          <Checkbox key={index} value={reason} className="reason-checkbox">
            {reason}
          </Checkbox>
        ))}
      </Checkbox.Group>
      <Row justify="end" gutter={16} className="button-section">
        <Col>
          <Button
            type="primary"
            className="success-btn"
            onClick={() => handleStepChange()}
            disabled={isProcessing}
            loading={isProcessing}>
            ต่อไป
          </Button>
        </Col>
      </Row>
    </Card>
  );

  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return <InitialStepCard />;
      case 2:
        return <TravelDetailCard />;
      case 3:
        return <SuccessCard />;
      default:
        return <FailureReasonsCard />;
    }
  };

  return (
    <div className="page-container">
      <Button
        type="primary"
        onClick={async () => {
          await callback(false);
        }}>
        back
      </Button>
      <div className="steps-container">
        <Steps
          current={currentStep}
          progressDot={(dot, { status, index }) => (
            <ProgressDot
              current={status === "process"}
              completed={status === "finish"}
            />
          )}>
          {STEPS.map((step, index) => (
            <Step
              key={index}
              title={step.title}
              description={
                <div className="step-description">
                  <div className="step-time">{step.subTitle}</div>
                  <div>{step.description}</div>
                </div>
              }
            />
          ))}
        </Steps>
      </div>

      <Row gutter={24} className="content-section">
        <Col span={16}>
          <Card>
            <Row gutter={24}>
              <Col xs={24} xl={24} md={24}>
                {renderContent()}
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} xl={8} md={8}>
          <div className="doorbell-container">
            {DEVICE_DATA.map((doorbell) => (
              <DeviceList key={doorbell.id} data={doorbell} />
            ))}
          </div>
        </Col>
      </Row>

      <Modal
        title="แผนที่บ้าน"
        open={isMapVisible}
        onCancel={handleMapClose}
        footer={[
          <Button key="close" type="primary" onClick={handleMapClose}>
            ปิด
          </Button>,
        ]}
        width={800}>
        <div
          style={{
            width: "100%",
            height: "400px",
            background: "#f5f5f5",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.9572635011583!2d100.5982313!3d13.7238899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ed419c84529%3A0x8f84e39892588c24!2z4LiL4Lit4Lii4Lit4Lij4Lij4LiW4Liq4Li44LiZ4LiX4Lij!5e0!3m2!1sth!2sth!4v1701144444444!5m2!1sth!2sth"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </Modal>
    </div>
  );
};

export default DeviceStep;
