import React, { useEffect, useState } from "react";
import {
  Card,
  Steps,
  Button,
  Col,
  Checkbox,
  message,
  Row,
  Modal,
  Input,
  Spin,
} from "antd";
import {
  HomeOutlined,
  WifiOutlined,
  BellOutlined,
  DisconnectOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { encryptStorage } from "../../../utils/encryptStorage";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import "../styles/ServiceRequest.css";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import { DeviceListType } from "../../../stores/interfaces/DeviceList";
import {
  callToMember,
  nextStep2,
  nextStep3,
  nextStep4,
} from "../service/emergencyApi";
import { useLocation, useNavigate } from "react-router-dom";
import MapWithMarker from "./MapWithMarker";

const { Step } = Steps;
const { TextArea } = Input;

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
    // subTitle: "00:00:10",
    description: "คำอธิบายขั้นตอน\nการดำเนินการ",
  },
  {
    title: "Step 2",
    // subTitle: "00:00:10",
    description: "โทรหาเจ้าหน้าที่",
  },
  {
    title: "Step 3",
    // subTitle: "00:00:10",
    description: "ติดตามผลดำเนินการ",
  },
  {
    title: "Step 4",
    // subTitle: "00:00:10",
    description: "ดำเนินการเสร็จสิ้น",
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

const CircleIcon: React.FC = () => (
  <div
    style={{
      width: "140px",
      height: "140px",
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

const CircleIconDone: React.FC = () => (
  <div
    style={{
      width: "140px",
      height: "140px",
      background: "#01A171",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "24px",
    }}>
    <CheckOutlined style={{ fontSize: "48px", color: "#fff" }} />
  </div>
);
const IconAlert = ({ status }: { status: string }) => {
  switch (status) {
    case "ฉุกเฉิน":
      return (
        <div className={`alert-dot ${"device-icon"}`}>
          <WarningOutlined />
        </div>
      );
    case "อุปกรณ์มีปัญหา":
      return (
        <div className={`alert-dot ${"device-icon-warring"}`}>
          <ExclamationCircleOutlined />
        </div>
      );
    case "อุปกรณ์ออฟไลน์":
      return (
        <div className={`alert-dot ${"device-icon-offline"}`}>
          <DisconnectOutlined />
        </div>
      );
    default:
      return null;
  }
};

const IconAlertCard = ({ status }: { status: string }) => {
  switch (status) {
    case "ฉุกเฉิน":
      return (
        <div className={`device-icon ${"device-icon"}`}>
          <BellOutlined className="bell-icon" />
        </div>
      );
    case "อุปกรณ์มีปัญหา":
      return (
        <div className={`device-icon ${"device-icon-warring"}`}>
          <BellOutlined className="bell-icon" />
        </div>
      );
    case "อุปกรณ์ออฟไลน์":
      return (
        <div className={`device-icon ${"device-icon-offline"}`}>
          <BellOutlined className="bell-icon" />
        </div>
      );
    default:
      return null;
  }
};
// Card Components
const DeviceList: React.FC<{ data: DeviceListType; alertType: string }> = ({
  data,
  alertType,
}) => (
  <Card className="device-card">
    <Row align="middle" className="device-header">
      <Col>
        <Col>
          <IconAlertCard status={alertType} />
        </Col>
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
            <IconAlert status={alertType} />
          </Col>
          <Col flex="auto">
            <span>{alertType}</span>
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

interface DeviceStepProps {
  ticketId: number;
  callback: (show: boolean) => void;
}
// Main Component
const DeviceStep: React.FC<DeviceStepProps> = ({ ticketId, callback }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();
  const { EmergencyData, HelpStepData, EmergencyDeviceData, MyHelperStep } =
    useSelector((state: RootState) => state.emergencyList);
  const [currentStep, setCurrentStep] = useState(
    MyHelperStep?.step ? MyHelperStep.step - 1 : 0
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [HelpStepName, setHelpStepName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const loadData = async () => {
      if (!ticketId) return;
      setIsLoading(true);
      try {
        await Promise.all([
          dispatch.emergencyList.getEmergencyListData(ticketId),
          dispatch.emergencyList.getEmergencyDeviceList(ticketId),
          dispatch.emergencyList.getHelperStepList(ticketId),
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [ticketId]);

  // เพิ่ม useEffect ใหม่เพื่อติดตาม MyHelperStep
  useEffect(() => {
    if (MyHelperStep?.step) {
      setCurrentStep(MyHelperStep.step - 1);
      setHelpStepName(MyHelperStep.helpStepName || "");
    }
  }, [MyHelperStep]);

  useEffect(() => {
    const loadData = async () => {
      if (!ticketId) return;
      setIsLoading(true);
      try {
        await Promise.all([
          dispatch.emergencyList.getEmergencyListData(ticketId),
          dispatch.emergencyList.getEmergencyDeviceList(ticketId),
          dispatch.emergencyList.getHelperStepList(ticketId),
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Cleanup function
    return () => {
      setCurrentStep(0);
      setHelpStepName("");
      setSelectedReasons([]);
    };
  }, [ticketId]);

  const showMap = () => {
    setIsMapVisible(true);
  };

  const handleMapClose = () => {
    setIsMapVisible(false);
  };

  // Handlers
  const handleStepChange = async (
    increment: number = 1,
    helpId: number,
    helpStepName?: string
  ) => {
    setIsLoading(true);
    try {
      const Issuccess = await nextStep2(ticketId, helpId);
      if (Issuccess) {
        setSelectedReasons([]);
        await Promise.all([
          dispatch.emergencyList.getEmergencyListData(ticketId),
          dispatch.emergencyList.getHelperStepList(ticketId),
        ]);
        message.success("ดำเนินการขั้นตอนที่ 1 เรียบร้อย");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMemberList = () => (
    <Row>
      <Col span={24}>
        <Title level={4} className="member-list-title">
          ที่อยู่บ้านและสมาชิกในบ้าน
        </Title>
        <Row align="middle" className="address-line">
          <Col>
            <HomeOutlined className="home-icon" />
            <span className="member-address">
              {EmergencyData ? EmergencyData.address : "ไม่มีข้อมูลลูกบ้าน"}
            </span>
          </Col>
        </Row>

        {/* รายชื่อสมาชิก */}
        <Row gutter={[0, 24]} className="member-list-container">
          {EmergencyData?.member.map((member, index) => (
            <Col span={24} key={index}>
              <Row
                className={`member-item ${
                  index !== members.length - 1 ? "with-border" : ""
                }`}>
                <Col span={24}>
                  <Row className="member-info-container">
                    <Col flex="auto">
                      <Row className="member-main-info">
                        <Col span={24}>
                          <span className="member-name">{member.fullname}</span>
                        </Col>
                        <Col span={24}>
                          <span
                            className={
                              member.isOwner
                                ? "member-role-owner"
                                : "member-role"
                            }>
                            {member.isOwner
                              ? "เจ้าของบ้าน"
                              : "สมาชิกในครอบครัว"}
                          </span>
                        </Col>
                        <Col span={24} className="member-phone">
                          <CircleIconPhone />
                          <span className="member-text">{member.mobile}</span>
                        </Col>
                      </Row>
                    </Col>

                    {/* ปุ่มด้านขวา */}
                    <Col className="member-buttons">
                      <Row gutter={8}>
                        <Col>
                          <Button
                            onClick={async () => {
                              const Issuccess = await callToMember(
                                ticketId,
                                member.id,
                                true
                              );
                              if (Issuccess) {
                                message.success("ติดต่อสำเร็จ");
                                await dispatch.emergencyList.getEmergencyListData(
                                  ticketId
                                );
                              } else {
                                message.destroy("ไม่สำเร็จ");
                              }
                            }}
                            className="success-button">
                            {member.callSuccessTotal > 0
                              ? `สำเร็จ (${member.callSuccessTotal})`
                              : "สำเร็จ"}
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            onClick={async () => {
                              const Issuccess = await callToMember(
                                ticketId,
                                member.id,
                                false
                              );
                              if (Issuccess) {
                                message.success("ติดต่อสำเร็จ");
                                await dispatch.emergencyList.getEmergencyListData(
                                  ticketId
                                );
                              } else {
                                message.destroy("ไม่สำเร็จ");
                              }
                            }}
                            disabled={
                              EmergencyData.homeCallSuccess ||
                              member.callSuccessTotal > 0
                            }
                            className="fail-button">
                            {member.callFailTotal > 0
                              ? `ไม่สำเร็จ (${member.callFailTotal})`
                              : "ไม่สำเร็จ"}
                          </Button>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24}>
                          <span className="last-call">
                            {member.callHistory.length > 0
                              ? `โทรครั้งล่าสุด ${dayjs(
                                  member.callHistory[0].createdAt
                                ).format("DD/MM/YYYY HH:mm")}`
                              : "ยังไม่มีข้อมูล"}
                            {/* (โทรครั้งล่าสุด {dayjs().format("DD/MM/YYYY HH:mm")}) */}
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
        <Title level={4} style={{ marginBottom: 4, paddingBottom: "5px" }}>
          1. ขั้นตอนการดำเนินการแก้ไข
        </Title>
        {/* <span className="member-address" style={{ paddingLeft: "20px" }}>
          โทรหาลูกบ้านและรายละเอียดเหตุการณ์ที่ต้องแจ้งเตือน
        </span> */}

        <Row>
          <Col span={24}>
            <p
              style={{
                fontSize: "20px",
                color: "#666",
                textAlign: "center",
                maxWidth: "300px",
                margin: "0 auto",
                paddingTop: 12,
                paddingBottom: 12,
              }}>
              โทรหาลูกบ้านและแจ้งรายละเอียดเหตุการณ์ที่ต้องแจ้งเตือน
            </p>
          </Col>
        </Row>

        <Title level={4} style={{ marginBottom: 16 }}>
          2. ต้องการความช่วยเหลือด้านใด
        </Title>
        {/* ปุ่มตัวเลือก */}
        <Row gutter={[0, 16]}>
          {MyHelperStep?.HelpStepData?.length ? (
            MyHelperStep?.HelpStepData?.map((step) => (
              <Col key={step.id} span={24}>
                <Button
                  type="primary"
                  block
                  style={{ height: 48 }}
                  onClick={() => handleStepChange(1, step.id, step.nameTh)}
                  disabled={isProcessing}
                  loading={isProcessing}>
                  {step.nameTh}
                </Button>
              </Col>
            ))
          ) : (
            <Col span={24}>
              <p
                style={{
                  fontSize: "20px",
                  color: "#666",
                  textAlign: "center",
                  maxWidth: "300px",
                  margin: "0 auto",
                  paddingTop: 12,
                  paddingBottom: 12,
                }}>
                ไม่มีข้อมูล
              </p>
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  );

  // Content Components
  const StepCardOne = () => (
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
  const handleStepTwo = async (ticketId: number) => {
    setIsLoading(true);
    try {
      const isSuccess = await nextStep3(ticketId);
      if (isSuccess) {
        await dispatch.emergencyList.getEmergencyListData(ticketId);
        setCurrentStep(2);
        message.success("ติดต่อสำเร็จ");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const StepCardTwo = () => (
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
            textAlign: "center",
          }}>
          <div style={{ width: "100%", textAlign: "center" }}>
            <Title level={2} style={{ marginBottom: 4 }}>
              ขั้นตอนการดำเนินการ
            </Title>
            <Title level={4} style={{ marginBottom: 4, paddingBottom: "20px" }}>
              1.โทรติดต่อเพื่อแจ้งเจ้าหน้าที่
            </Title>
          </div>
          <CircleIcon />
          <Title level={3} style={{ marginBottom: 4 }}>
            {HelpStepName}
          </Title>
          <Button
            type="primary"
            size="large"
            block
            onClick={() => handleStepTwo(ticketId)}
            loading={isProcessing}
            style={{
              height: "48px",
              fontSize: "16px",
              borderRadius: "8px",
              marginBottom: "16px",
              marginTop: "30px",
            }}>
            ติดต่อสำเร็จ
          </Button>
        </div>
      </Col>
    </Row>
  );
  const handleStepThree = async (ticketId: number, note: string) => {
    if (!note.trim()) {
      message.warning("กรุณากรอกรายละเอียด");
      return;
    }

    setIsLoading(true);
    try {
      const isSuccess = await nextStep4(ticketId, note);
      if (isSuccess) {
        await dispatch.emergencyList.getEmergencyListData(ticketId);
        setCurrentStep(3);
        message.success("บันทึกข้อมูลเรียบร้อย");
        const acceptedRequestId = encryptStorage.getItem("acceptedRequestId");
        if (acceptedRequestId) {
          encryptStorage.removeItem("acceptedRequestId");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const StepCardThree = () => {
    const [note, setNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    return (
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
            {/* <CircleIcon /> */}

            <Title level={2} style={{ marginBottom: 4 }}>
              โทรแจ้งกลับหาลูกบ้าน
            </Title>

            {/* เพิ่มส่วน TextArea */}
            <div
              style={{
                width: "100%",
                maxWidth: "500px",
                paddingBottom: "20px",
                paddingTop: "20px",
              }}>
              <span className="member-role">บันทึกเพิ่มเติม</span>
            </div>

            <div
              style={{
                width: "100%",
                maxWidth: "500px",
              }}>
              <TextArea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="กรอกรายละเอียดเพิ่มเติม..."
                autoSize={{ minRows: 8, maxRows: 12 }} // เพิ่มค่า minRows และ maxRows
                style={{
                  marginBottom: "16px",
                  minHeight: "50px", // เพิ่ม minHeight
                }}
              />
              <Button
                type="primary"
                block
                onClick={async () => {
                  if (note.trim()) {
                    handleStepThree(ticketId, note);
                    return;
                    try {
                      setIsSubmitting(true);
                      message.success("บันทึกข้อมูลเรียบร้อย");
                    } catch (error) {
                      message.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
                    } finally {
                      setIsSubmitting(false);
                    }
                  } else {
                    message.warning("กรุณากรอกรายละเอียด");
                  }
                }}
                loading={isSubmitting}>
                บันทึกข้อมูล
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    );
  };
  const StepCardFour = () => (
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
          <CircleIconDone />
          <h2
            style={{
              fontSize: "28px",
              color: "#333",
              marginBottom: "16px",
              textAlign: "center",
            }}>
            ดำเนินการสำเร็จ
          </h2>
          <Button
            type="default"
            onClick={() => {
              callback(false); // เรียกใช้ callback เพื่อเปลี่ยนค่า IshowHomeDetail กลับเป็น false
            }}
            style={{
              backgroundColor: "#01A171",
              borderColor: "#01A171",
              color: "white",
            }}>
            กดเพื่อย้อนกลับ
          </Button>
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
        return <StepCardOne />;
      case 1:
        return <StepCardTwo />;
      case 2:
        return <StepCardThree />;
      case 3:
        return <StepCardFour />;
      default:
        return <FailureReasonsCard />;
    }
  };

  return (
    <div className="page-container">
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Spin />
        </div>
      )}
      <Button
        type="primary"
        onClick={async () => {
          if (currentStep == 2) {
            const acceptedRequestId =
              encryptStorage.getItem("acceptedRequestId");
            if (acceptedRequestId) {
              encryptStorage.removeItem("acceptedRequestId");
            }
            callback(false);
          }
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
            {EmergencyDeviceData ? (
              EmergencyDeviceData?.map((doorbell) =>
                doorbell.deviceDetail ? (
                  <DeviceList
                    key={doorbell.deviceId}
                    data={doorbell.deviceDetail}
                    alertType={doorbell.eventsType.nameTh}
                  />
                ) : (
                  <Col span={24}>
                    <Card className="device-card">
                      <div style={{ textAlign: "center", padding: "24px" }}>
                        ไม่พบอุปกรณ์ในระบบ
                      </div>
                    </Card>
                  </Col>
                )
              )
            ) : (
              <Col span={24}>
                <Card className="device-card">
                  <div style={{ textAlign: "center", padding: "24px" }}>
                    ไม่พบอุปกรณ์ในระบบ
                  </div>
                </Card>
              </Col>
            )}
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
        <MapWithMarker lat={13.7876731} lng={100.4794405} />
      </Modal>
    </div>
  );
};

export default DeviceStep;
