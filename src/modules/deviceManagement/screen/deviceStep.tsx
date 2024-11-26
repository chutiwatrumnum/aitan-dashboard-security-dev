import React, { useEffect, useState } from "react";
import { Card, Steps, Button, Col, Checkbox, message, Row, Modal, Input } from "antd";
import {
  HomeOutlined,
  WifiOutlined,
  BellOutlined,
  DisconnectOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { encryptStorage } from "../../../utils/encryptStorage";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import "../styles/ServiceRequest.css";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import { DeviceListType } from "../../../stores/interfaces/DeviceList";
import { callToMember, nextStep2, nextStep3, nextStep4 } from "../service/emergencyApi";

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
    subTitle: "00:00:10",
    description: "คำอธิบายขั้นตอน\nการดำเนินการ",
  },
  {
    title: "Step 2",
    subTitle: "00:00:10",
    description: "โทรหาเจ้าหน้าที่",
  },
  {
    title: "Step 3",
    subTitle: "00:00:10",
    description: "ติดตามผลดำเนินการ",
  },
  {
    title: "Step 4",
    subTitle: "00:00:10",
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
type DeviceStepProps = {
  callback(Ishow: boolean): any;
  ticketId: number;
};
// Main Component
const DeviceStep = ({ callback, ticketId }: DeviceStepProps) => {
  const dispatch = useDispatch<Dispatch>();
  const { EmergencyData, HelpStepData, EmergencyDeviceData,MyHelperStep } = useSelector(
    (state: RootState) => state.emergencyList
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [HelpStepName, setHelpStepName] = useState<string>("")
  useEffect(() => {
    if (ticketId) {
      dispatch.emergencyList.getEmergencyListData(ticketId);
      dispatch.emergencyList.getEmergencyDeviceList(ticketId);
      dispatch.emergencyList.getHelperStepList(ticketId);
      if (MyHelperStep?.step) {
        setCurrentSteps(MyHelperStep.step)
        setHelpStepName(MyHelperStep.helpStepName)
      }
    }
  }, [ticketId]);
const setCurrentSteps=async(step:number) => {
  await setCurrentStep(step-1)
}

  const showMap = () => {
    setIsMapVisible(true);
  };

  const handleMapClose = () => {
    setIsMapVisible(false);
  };

  // Handlers
  const handleStepChange = async(increment: number = 1, helpId: number,helpStepName?:string) => {
    const Issuccess= await nextStep2(ticketId,helpId)
    if (Issuccess) {
              setSelectedReasons([]);
        message.success(
          `ดำเนินการขั้นตอนที่ 1 เรียบร้อย`
        );
      setCurrentSteps(2)
      setHelpStepName(helpStepName?helpStepName:"")
    }else{

    }
    // setIsProcessing(true);
    // setTimeout(() => {
    //   if (currentStep < STEPS.length - 1) {
    //     setCurrentStep(currentStep + increment);
    //     if (currentStep + increment === 2) {
    //       encryptStorage.removeItem("acceptedRequestId");
    //       // console.log("acceptedRequestId => REMOVED");
    //     }
    //     setSelectedReasons([]);
    //     message.success(
    //       `ดำเนินการขั้นตอนที่ ${currentStep + increment} เรียบร้อย`
    //     );
    //   } else {
    //     message.success("ดำเนินการทั้งหมดเสร็จสิ้น");
    //   }

    //   setIsProcessing(false);
    // }, 1000);
  };

  const renderMemberList = () => (
    <Row>
      <Col span={24}>
        <Title level={4} className="member-list-title">
          รายชื่อสมาชิกในบ้าน
        </Title>
        <Row align="middle" className="address-line">
          <Col>
            <HomeOutlined className="home-icon" />
            <span>{EmergencyData ? EmergencyData.address : "-"}</span>
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
                          <PhoneOutlined className="phone-icon" />
                          <span>{member.mobile}</span>
                        </Col>
                      </Row>
                    </Col>

                    {/* ปุ่มด้านขวา */}
                    <Col className="member-buttons">
                      <Row gutter={8}>
                        <Col>
                          <Button
                            onClick={async() => {
                              const Issuccess=await callToMember(ticketId,member.id,true)
                              if (Issuccess) {
                                message.success("ติดต่อสำเร็จ")
                               await dispatch.emergencyList.getEmergencyListData(ticketId);
                              }else{
                                message.destroy("ไม่สำเร็จ")
                              }
                             
                            }}
                            disabled={EmergencyData.homeCallSuccess}
                            className="success-button">
                          {member.callSuccessTotal > 0
                              ? `เดิม' (${member.callSuccessTotal})`
                              : "ไม่สำเร็จ"}
                          </Button>
                        </Col>
                        <Col>
                          <Button
                            onClick={async() => {
                              const Issuccess=await callToMember(ticketId,member.id,false)
                              if (Issuccess) {
                                message.success("ติดต่อสำเร็จ")
                               await dispatch.emergencyList.getEmergencyListData(ticketId);
                              }else{
                                message.destroy("ไม่สำเร็จ")
                              }
                             
                            }}
                            disabled={EmergencyData.homeCallSuccess}
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
          {MyHelperStep?.HelpStepData?.length ? (
            MyHelperStep?.HelpStepData?.map((step) => (
              <Col key={step.id} span={24}>
                <Button
                  type="primary"
                  block
                  style={{ height: 48 }}
                  onClick={() => handleStepChange(1, step.id,step.nameTh)}
                  disabled={isProcessing}
                  loading={isProcessing}>
                  {step.nameTh}
                 
                </Button>
              </Col>
            ))
          ) : (
            <div>ไม่มีข้อมูล</div>
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
const handleStepTWo=async(ticketId:number) => {
 const IsSuccess= await nextStep3(ticketId)
 if (IsSuccess) {
  await setCurrentSteps(3)
  alert("ติดต่อสำเร็จ")
 }else{
alert("ไม่สำเร็จ")
 }
}

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
          }}>
          <div style={{ width: "100%", textAlign: "left" }}>
            <h4 style={{ marginBottom: "12px" }}>ขั้นตอนการดำเนินการ:</h4>
            <ul style={{ paddingLeft: "20px" }}>
              <li>1.โทรติดต่อเจ้าหน้าที่เพื่อแจ้ง</li>
              <li>1.1ติดต่อรถพยาบาล 1669</li>
              <li>1.2ติดต่อรถพยาบาล 191</li>
            </ul>
           
          </div>
          <CircleIcon />
          <p>{HelpStepName}</p>
          <Button
            type="primary"
            size="large"
            block
            onClick={() => handleStepTWo(ticketId)}
            loading={isProcessing}
            style={{
              height: "48px",
              fontSize: "16px",
              borderRadius: "8px",
              marginBottom: "16px",
            }}>
            ติดต่อสำเร็จ
          </Button>
        </div>
      </Col>
    </Row>
  );
  const handleStepThree=async(ticketId:number,note:string) => {
    const IsSuccess= await nextStep4(ticketId,note)
    if (IsSuccess) {
     await setCurrentSteps(4)
     alert("ติดต่อสำเร็จ")
    }else{
   alert("ไม่สำเร็จ")
    }
   }
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
              margin: "0 auto 24px", // เพิ่ม margin-bottom
            }}>
            การดำเนินการทั้งหมดเสร็จสิ้น
          </p>

          {/* เพิ่มส่วน TextArea */}
          <div style={{ width: "100%", maxWidth: "500px" }}>
            <div style={{ marginBottom: "8px", fontWeight: "500" }}>
              บันทึกเพิ่มเติม
            </div>
            <TextArea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="กรอกรายละเอียดเพิ่มเติม..."
              autoSize={{ minRows: 4, maxRows: 6 }}
              style={{ marginBottom: "16px" }}
            />
            <Button
              type="primary"
              block
              onClick={async () => {
  if (note.trim()) {
    handleStepThree(ticketId,note)
    return
    try {
      setIsSubmitting(true); // เพิ่ม loading state
      // สมมติว่ามีการเรียก API
      // await saveNote(note);
      
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
          <Button
            type="primary"
            onClick={async () => {
              await callback(false);
            }}>
            back
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
        return <StepCardFour/>;
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
            {EmergencyData ? (
              EmergencyDeviceData?.map((doorbell) => (
                <DeviceList
                  key={doorbell.deviceId}
                  data={doorbell.deviceDetail}
                  alertType={doorbell.eventsType.nameTh}
                />
              ))
            ) : (
              <div>ไม่มีข้อมูล</div>
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
