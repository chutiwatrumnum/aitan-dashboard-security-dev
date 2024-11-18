import React from "react";
import {
  Card,
  Row,
  Col,
  Input,
  Button,
  Table,
  Space,
  Pagination,
  Select,
} from "antd";
import {
  DesktopOutlined,
  ExportOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Search } = Input;

const deviceMain = () => {
  // ข้อมูลสถิติอุปกรณ์
  const statistics = [
    { title: "อุปกรณ์ที่เปิดใช้งาน", count: 0, color: "#4E79F3" },
    { title: "อุปกรณ์ที่ออนไลน์", count: 0, color: "#2FB344" },
    { title: "อุปกรณ์ออฟไลน์", count: 0, color: "#DC3545" },
    { title: "อุปกรณ์มีปัญหา", count: 0, color: "#FDA94F" },
  ];

  // คอลัมน์ตาราง
  const columns = [
    { title: "ห้อง", dataIndex: "room", key: "room" },
    { title: "รหัสอุปกรณ์", dataIndex: "deviceId", key: "deviceId" },
    { title: "สถานะอุปกรณ์", dataIndex: "status", key: "status" },
    { title: "แบตเตอรี่", dataIndex: "battery", key: "battery" },
    {
      title: "เบอร์โทรเข้าอุปกรณ์",
      dataIndex: "devicePhone",
      key: "devicePhone",
    },
    { title: "เบอร์โทร (1)", dataIndex: "phone1", key: "phone1" },
    { title: "เบอร์โทร (2)", dataIndex: "phone2", key: "phone2" },
    { title: "เบอร์โทร (Help)", dataIndex: "phoneHelp", key: "phoneHelp" },
    { title: "เบอร์โทร (?)", dataIndex: "phoneOther", key: "phoneOther" },
    {
      title: "เครื่องแรงของอุปกรณ์",
      dataIndex: "deviceStrength",
      key: "deviceStrength",
    },
    { title: "ชื่อย่างอิง", dataIndex: "reference", key: "reference" },
  ];

  // ข้อมูลตัวอย่าง
  const data = [
    {
      key: "1",
      room: "-",
      deviceId: "Demo",
      status: "-",
      battery: "-",
      devicePhone: "-",
      phone1: "0897764893",
      phone2: "0897764866",
      phoneHelp: "0897764877",
      phoneOther: "0897764888",
      deviceStrength: "-",
      reference: "-",
    },
  ];

  return (
    <div style={{ padding: "24px", backgroundColor: "#f5f5f5" }}>
      {/* หัวข้อ */}
      <h2 style={{ marginBottom: "24px" }}>ภาพรวมอุปกรณ์</h2>

      {/* การ์ดแสดงสถิติ */}
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        {statistics.map((stat, index) => (
          <Col span={6} key={index}>
            <Card style={{ backgroundColor: stat.color, color: "white" }}>
              <Row align="middle">
                <Col span={6}>
                  <DesktopOutlined style={{ fontSize: "24px" }} />
                </Col>
                <Col span={18}>
                  <div>{stat.title}</div>
                  <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                    {stat.count}
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ส่วนแสดงตาราง */}
      <Card>
        <div style={{ marginBottom: "16px" }}>
          <Row justify="space-between" align="middle">
            <Col>
              <h3>รายชื่ออุปกรณ์ที่เปิดใช้งาน</h3>
            </Col>
            <Col>
              <Button type="primary" icon={<ExportOutlined />}>
                Export
              </Button>
            </Col>
          </Row>
        </div>

        {/* ส่วนค้นหาและกรอง */}
        <Row gutter={16} style={{ marginBottom: "16px" }}>
          <Col span={8}>
            <Select placeholder="แสดงทั้งหมด" style={{ width: "100%" }} />
          </Col>
          <Col span={8} offset={8}>
            <Search placeholder="ค้นหา" enterButton={<SearchOutlined />} />
          </Col>
        </Row>

        {/* ตารางข้อมูล */}
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: true }}
          pagination={false}
          size="small"
          style={{ marginBottom: "16px" }}
        />
        {/* Pagination */}
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Button type="text">&lt;</Button>
              {[1, 2, 3, 4, 5].map((page) => (
                <Button key={page} type={page === 1 ? "primary" : "text"}>
                  {page}
                </Button>
              ))}
              <Button type="text">...</Button>
              <Button type="text">20</Button>
              <Button type="text">&gt;</Button>
            </Space>
          </Col>
          <Col>
            <Select defaultValue="10" style={{ width: 120 }}>
              <Select.Option value="10">10/Page</Select.Option>
              <Select.Option value="20">20/Page</Select.Option>
              <Select.Option value="50">50/Page</Select.Option>
            </Select>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default deviceMain;