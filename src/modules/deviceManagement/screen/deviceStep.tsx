import React, { useState } from "react";
import { Card, Steps, Button, Col, Checkbox, message, Row } from "antd";
import {
  HomeOutlined,
  ClockCircleOutlined,
  BellOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { encryptStorage } from "../../../utils/encryptStorage";
import { useDispatch } from "react-redux";
import { Dispatch } from "../../../stores";
import "../styles/ServiceRequest.css";

const { Step } = Steps;

// Types
interface ProgressDotProps {
  current?: boolean;
  completed?: boolean;
}

interface UserInfo {
  name: string;
  role: string;
  address: string;
  incidentDate: string;
  imageUrl: string;
}

interface StepInfo {
  title: string;
  subTitle: string;
  description: string;
}

// Constants
const USER_INFO: UserInfo = {
  name: "คมชัย ทำเจริญยิ่ง",
  role: "บุคคลที่2 (ครอบครัว)",
  address: "11/9 ซอยอรรถสุนทรงค์ 79 กรุงเทพมหานคร",
  incidentDate: "26/8/64 09:10",
  imageUrl: "https://i.pravatar.cc/160",
};

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
    name: "VIDEO DOORBELL 02B",
    batteryLevel: 80,
    imageUrl: "https://aitan-smart.web.app/assets/Sensor01-NPTLW2ew.png",
    alerts: [
      { type: "warning", message: "เซนเซอร์ตรวจจับควัน" },
      { type: "danger", message: "คาดว่าอาจจะเกิดเหตุเพลิงไหม้" },
    ],
  },
  {
    id: "000325",
    name: "VIDEO DOORBELL 02B",
    batteryLevel: 75,
    imageUrl: "https://aitan-smart.web.app/assets/Sensor01-NPTLW2ew.png",
    alerts: [{ type: "warning", message: "เซนเซอร์ตรวจจับควัน" }],
  },
];

// Reusable Components
const UserProfile: React.FC<{ userInfo: UserInfo }> = ({ userInfo }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    }}
  >
    <img
      src={userInfo.imageUrl}
      alt="Profile"
      className="profile-image"
      style={{ marginBottom: "16px" }}
    />
    <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>{userInfo.name}</h2>
    <p className="sub-title" style={{ marginBottom: "16px" }}>
      {userInfo.role}
    </p>
    <div className="info-row">
      <HomeOutlined />
      <span>{userInfo.address}</span>
    </div>
    <div className="info-row">
      <ClockCircleOutlined />
      <span>วันเกิดเหตุ {userInfo.incidentDate}</span>
    </div>
  </div>
);

const ProgressDot: React.FC<ProgressDotProps> = ({ current, completed }) => (
  <div
    className={`custom-dot ${current ? "current" : ""} ${
      completed ? "completed" : ""
    }`}
  >
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
    }}
  >
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
        <span>{data.id}</span>
      </Col>
      <Col>
        <span>Gateway</span>
      </Col>
      <Col>
        <div className="battery">
          <div className="battery-level">{data.batteryLevel}%</div>
        </div>
      </Col>
    </Row>
  </Card>
);
type DeviceStepProps={
  callback(Ishow:boolean):any
}
// Main Component
const DeviceStep = ({callback}:DeviceStepProps) => {
  const dispatch = useDispatch<Dispatch>();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

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

  const handleFail = () => {
    if (currentStep === 0) {
      setCurrentStep(currentStep + 1);
    } else if (selectedReasons.length === 0) {
      message.error("กรุณาเลือกเหตุผลที่ไม่สามารถติดต่อได้");
    } else {
      message.error("การดำเนินการไม่สำเร็จ");
    }
  };

  // Content Components
  const InitialStepCard = () => (
    <Card className="info-card">
      <Row>
        <Col xs={24} md={12} className="left-section">
          <UserProfile userInfo={USER_INFO} />
        </Col>
        <Col
          xs={24}
          md={12}
          className="right-section"
          style={{ textAlign: "center" }}
        >
          <h3 className="section-title">ขั้นตอนการดำเนินการแก้ไข</h3>
          <ol
            className="step-list"
            style={{ textAlign: "left", display: "inline-block" }}
          >
            <li>โทรแจ้งเหตุที่ระบบตรวจพบ</li>
            <li>พบความผิดปกติที่เซนเซอร์</li>
            <li>ขออนุญาตเข้าตรวจสอบ</li>
          </ol>
          <div className="phone-section" style={{ justifyContent: "center" }}>
            <div className="phone-icon">2</div>
            <span className="phone-number">0845625799</span>
          </div>
          <Row justify="center" gutter={16} style={{ marginTop: "24px" }}>
            <Col>
              <Button
                danger
                type="primary"
                onClick={handleFail}
                disabled={isProcessing}
              >
                ไม่สำเร็จ
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                onClick={() => handleStepChange(2)}
                disabled={isProcessing}
                loading={isProcessing}
              >
                ต่อไป
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );

  const TravelDetailCard = () => (
    <Card className="info-card">
      <Row>
        <Col xs={24} md={12} className="left-section">
          <UserProfile userInfo={USER_INFO} />
        </Col>
        <Col xs={24} md={12} className="right-section">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
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
              }}
            >
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
    </Card>
  );

  const SuccessCard = () => (
    <Card className="info-card">
      <Row>
        <Col xs={24} md={12} className="left-section">
          <UserProfile userInfo={USER_INFO} />
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
            }}
          >
            <CircleIcon />
            <h2
              style={{
                fontSize: "28px",
                color: "#333",
                marginBottom: "16px",
                textAlign: "center",
              }}
            >
              รอดำเนินการสำเร็จ
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "#666",
                textAlign: "center",
                maxWidth: "300px",
                margin: "0 auto",
              }}
            >
              การดำเนินการทั้งหมดเสร็จสิ้น
            </p>
          </div>
        </Col>
      </Row>
    </Card>
  );

  const FailureReasonsCard = () => (
    <Card className="failure-reasons-card">
      <h2 className="failure-title">ไม่สามารถติดต่อได้ด้วยเหตุผล</h2>
      <Checkbox.Group
        className="reasons-checkbox-group"
        value={selectedReasons}
        onChange={setSelectedReasons}
      >
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
            loading={isProcessing}
          >
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
        <Button type="primary" onClick={ async()=>{
await callback(false)
      } }>back</Button>
      <div className="steps-container">
        <Steps
          current={currentStep}
          progressDot={(dot, { status, index }) => (
            <ProgressDot
              current={status === "process"}
              completed={status === "finish"}
            />
          )}
        >
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

      <Row gutter={24} className="app-container">
        <Col xs={24} xl={16} md={16}>
          {renderContent()}
        </Col>
        <Col xs={24} xl={8} md={8}>
          <div className="doorbell-container">
            {DEVICE_DATA.map((doorbell) => (
              <DeviceList key={doorbell.id} data={doorbell} />
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DeviceStep;
