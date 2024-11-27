// StatusDashboard.tsx
import React, { useState } from "react";
import { Table, Row, Col, Tabs, Button } from "antd";
import {
  DownloadOutlined,
  FileTextOutlined,
  LaptopOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import "../styles/emergencyMain.css";
import { EyeIcon } from "../../../assets/icons/Icons";
import DeviceStep from "../../deviceManagement/screen/deviceStep";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;

// Define interfaces
interface DataType {
  key: string;
  no: number;
  workId: string;
  startDate: string;
  endDate: string;
  status: string;
  description: string;
  staff: string;
  phone: string;
  step: string;
  type: string;
}

interface StatusCardProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  color: string;
  filterType: string;
  isActive: boolean;
  onClick: () => void;
}

// StatusCard Component
const StatusCard: React.FC<StatusCardProps> = ({
  icon,
  title,
  count,
  color,
  isActive,
  onClick,
}) => (
  <div
    className={`status-card ${color}`}
    onClick={onClick}>
    <div className={`status-icon ${color} ${isActive ? "active" : ""}`}>{icon}</div>
    <div className="status-info">
      <div>{title}</div>
      <div className="status-count">{count}</div>
    </div>
  </div>
);

// Main Dashboard Component
const StatusDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [IshowHomeDetail, setIshowHomeDetail] = useState<boolean>(false)
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Sample data
  const data: DataType[] = [
    {
      key: "1",
      no: 1,
      workId: "111/546",
      startDate: "15/10/2024 09:18",
      endDate: "15/10/2024 10:20",
      status: "เสร็จสิ้น",
      description: "สมชาย ใจดี",
      staff: "เจ้าหน้าที่คนที่ 1",
      phone: "0845625777",
      step: "Step 4",
      type: "completed",
    },
    {
      key: "2",
      no: 2,
      workId: "111/547",
      startDate: "15/10/2024 10:30",
      endDate: "15/10/2024 11:45",
      status: "ฉุกเฉิน",
      description: "วันดี มีสุข",
      staff: "เจ้าหน้าที่คนที่ 2",
      phone: "0845625778",
      step: "Step 1",
      type: "emergency",
    },
    {
      key: "3",
      no: 3,
      workId: "111/548",
      startDate: "15/10/2024 11:00",
      endDate: "15/10/2024 12:15",
      status: "ปัญหาอุปกรณ์",
      description: "มานี รักดี",
      staff: "เจ้าหน้าที่คนที่ 3",
      phone: "0845625779",
      step: "Step 2",
      type: "equipment",
    },
    {
      key: "4",
      no: 4,
      workId: "111/549",
      startDate: "15/10/2024 13:20",
      endDate: "15/10/2024 14:30",
      status: "ยืนยันแล้ว",
      description: "สมศรี ดีใจ",
      staff: "เจ้าหน้าที่คนที่ 4",
      phone: "0845625780",
      step: "Step 4",
      type: "confirmed",
    },
  ];
  const SetIshowHomeDetail = (Ishow: boolean) => setIshowHomeDetail(Ishow);
  const handleCardClick = (filterType: string) => {
    setActiveFilter(activeFilter === filterType ? null : filterType);
  };

  const getFilteredData = () => {
    if (!activeFilter) return data;
    return data.filter((item) => {
      switch (activeFilter) {
        case "completed":
          return item.status === "เสร็จสิ้น";
        case "emergency":
          return item.status === "ฉุกเฉิน";
        case "equipment":
          return item.status === "ปัญหาอุปกรณ์";
        case "confirmed":
          return item.status === "ยืนยันแล้ว";
        default:
          return true;
      }
    });
  };

  const counts = {
    completed: data.filter((item) => item.status === "เสร็จสิ้น").length,
    emergency: data.filter((item) => item.status === "ฉุกเฉิน").length,
    equipment: data.filter((item) => item.status === "ปัญหาอุปกรณ์").length,
    confirmed: data.filter((item) => item.status === "ยืนยันแล้ว").length,
  };

const columns: ColumnsType<DataType> = [
  {
    title: "ดูข้อมูล",
    key: "action",
    width: 80,
    align: "center", // เพิ่มบรรทัดนี้
    render: (_, record) => (
      <Button
        type="primary"
        icon={<EyeIcon />}
        onClick={() => {
            navigate("/dashboard/deviceStep", { state: { ticketId:11, gotoBack: true } });
          console.log(record.workId);
        }}
      />
    ),
  },
  {
    title: "ลำดับ",
    dataIndex: "no",
    key: "no",
    width: 80,
    align: "center", // เพิ่มบรรทัดนี้
  },
  {
    title: "บ้านเลขที่",
    dataIndex: "workId",
    key: "workId",
    width: 100,
    align: "center", // เพิ่มบรรทัดนี้
  },
  {
    title: "เวลาแจ้งเหตุ",
    dataIndex: "startDate",
    key: "startDate",
    width: 150,
    align: "center", // เพิ่มบรรทัดนี้
  },
  {
    title: "เวลารับเรื่อง",
    dataIndex: "endDate",
    key: "endDate",
    width: 150,
    align: "center", // เพิ่มบรรทัดนี้
  },
  {
    title: "ประเภทเหตุการณ์",
    dataIndex: "status",
    key: "status",
    width: 150,
    align: "center", // เพิ่มบรรทัดนี้
    render: (status: string) => {
      let className = "";
      switch (status) {
        case "ฉุกเฉิน":
          className = "emergency";
          break;
        case "ปัญหาอุปกรณ์":
          className = "equipment";
          break;
        case "เสร็จสิ้น":
          className = "completed";
          break;
        case "ยืนยันแล้ว":
          className = "confirmed";
          break;
      }
      return <span className={`status-tag ${className}`}>{status}</span>;
    },
  },
  {
    title: "ชื่อเจ้าของบ้าน",
    dataIndex: "description",
    key: "description",
    width: 200,
    align: "center", // เพิ่มบรรทัดนี้
  },
  {
    title: "เจ้าหน้าที่",
    dataIndex: "staff",
    key: "staff",
    width: 150,
    align: "center", // เพิ่มบรรทัดนี้
  },
  {
    title: "เบอร์โทรศัพท์",
    dataIndex: "phone",
    key: "phone",
    width: 150,
    align: "center", // เพิ่มบรรทัดนี้
  },
  {
    title: "รายงานเหตุการณ์",
    dataIndex: "step",
    key: "step",
    width: 120,
    align: "center", // เพิ่มบรรทัดนี้
    render: (step: string) => (
      <span className={`step-tag step-${step.split(" ")[1]}`}>{step}</span>
    ),
  },
];

  return (
   
    <div className="dashboard-container">
      <div className="page-header">ติดตามสถานะงาน</div>
      <div className="status-cards-wrapper">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <StatusCard
              icon={<DownloadOutlined />}
              title="เคลียร์ทั้งหมด"
              count={counts.completed}
              color="blue"
              filterType="completed"
              isActive={activeFilter === "completed"}
              onClick={() => handleCardClick("completed")}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatusCard
              icon={<FileTextOutlined />}
              title="มีเหตุการณ์เกิดขึ้น"
              count={counts.emergency}
              color="red"
              filterType="emergency"
              isActive={activeFilter === "emergency"}
              onClick={() => handleCardClick("emergency")}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatusCard
              icon={<LaptopOutlined />}
              title="ปัญหาอุปกรณ์"
              count={counts.equipment}
              color="orange"
              filterType="equipment"
              isActive={activeFilter === "equipment"}
              onClick={() => handleCardClick("equipment")}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatusCard
              icon={<CheckCircleOutlined />}
              title="ยืนยันการจัดงาน"
              count={counts.confirmed}
              color="green"
              filterType="confirmed"
              isActive={activeFilter === "confirmed"}
              onClick={() => handleCardClick("confirmed")}
            />
          </Col>
        </Row>
      </div>

      <Tabs defaultActiveKey="1" className="custom-tabs">
        <TabPane tab="ทั้งหมด" key="1">
          <Table
            columns={columns}
            dataSource={getFilteredData()}
            scroll={{ x: 1300 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
            className="custom-table"
          />
        </TabPane>
        <TabPane tab="รอดำเนินการ" key="2">
          <Table
            columns={columns}
            dataSource={data.filter((item) =>
              ["Step 1", "Step 2", "Step 3"].includes(item.step)
            )}
            scroll={{ x: 1300 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
            className="custom-table"
          />
        </TabPane>
        <TabPane tab="ดำเนินการสำเร็จ" key="3">
          <Table
            columns={columns}
            dataSource={data.filter((item) => item.step === "Step 4")}
            scroll={{ x: 1300 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
            className="custom-table"
          />
        </TabPane>
      </Tabs>
    </div>);
};

export default StatusDashboard;
