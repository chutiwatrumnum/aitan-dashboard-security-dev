// StatusDashboard.tsx
import React, { useState, useEffect, useRef } from "react";
import { Table, Row, Col, Tabs, Button, Input, Space } from "antd";
import {
  DownloadOutlined,
  FileTextOutlined,
  LaptopOutlined,
  WifiOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import "../styles/emergencyMain.css";
import { EyeIcon, OfflineIcon } from "../../../assets/icons/Icons";
import DeviceStep from "../../deviceManagement/screen/deviceStep";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import { whiteLabel } from "../../../configs/theme";

import type { ColumnsType } from "antd/es/table";
import type { InputRef, TableColumnType } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { TableDataType } from "../../../stores/interfaces/Emergencry";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;

type DataIndex = keyof TableDataType;

interface StatusCardProps {
  icon: React.ReactNode;
  title: string;
  count: number | string;
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
  <div className={`status-card ${color}`} onClick={onClick}>
    <div className={`status-icon ${color} ${isActive ? "active" : ""}`}>
      {icon}
    </div>
    <div className="status-info">
      <div>{title}</div>
      <div className="status-count">{count}</div>
    </div>
  </div>
);

// Main Dashboard Component
const StatusDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<Dispatch>();
  const { emergencyTableData, cardCount, totalTable } = useSelector(
    (state: RootState) => state.emergencyList
  );
  const [IshowHomeDetail, setIshowHomeDetail] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [searchObject, setSearchObject] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeKey, setActiveKey] = useState("all");
  const [ticketId, setTicketId] = useState<number>();
  const searchInput = useRef<InputRef>(null);

  const SetIshowHomeDetail = (Ishow: boolean) => setIshowHomeDetail(Ishow);
  const handleCardClick = (filterType: string) => {
    if (filterType == "all") {
      setActiveKey("all");
      setActiveFilter(null);
      return;
    }
    setActiveFilter(activeFilter === filterType ? null : filterType);
    setActiveKey("in-progress");
  };

  // Functions
  const fetchData = async () => {
    await dispatch.emergencyList.getEmergencyTableData({
      curPage: page.toString(),
      perPage: pageSize.toString(),
      searchObject: searchObject,
      searchText: searchText,
      filterByType: activeFilter ?? undefined,
    });
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchObject(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<TableDataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              clearFilters && handleReset(clearFilters);
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined
        style={{
          color: filtered ? whiteLabel.whiteColor : whiteLabel.whiteColor,
        }}
      />
    ),
    render: (text) => text,
  });

  const onTabsChange = (activeKey: string) => {
    setActiveKey(activeKey);
    if (activeKey == "all") {
      setActiveFilter(null);
      return;
    }
    setActiveFilter(activeKey);
  };

  const columns: ColumnsType<TableDataType> = [
    {
      title: "ดูข้อมูล",
      key: "action",
      width: 80,
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeIcon />}
          onClick={() => {
            console.log(record.id);
            navigate("/dashboard/deviceStep", {
              state: { ticketId: record.id, gotoBack: true },
            });
            // setTicketId();
            // setIshowHomeDetail(true);
          }}
        />
      ),
    },
    {
      title: "ลำดับ",
      dataIndex: "no",
      key: "no",
      width: 80,
      align: "center",
      render: (_, record, index) => (
        <span>{index + 1 + (page - 1) * pageSize}</span>
      ),
    },
    {
      title: "บ้านเลขที่",
      dataIndex: "address",
      key: "address",
      width: 100,
      align: "center",
      ...getColumnSearchProps("address"),
    },
    {
      title: "เวลาแจ้งเหตุ",
      dataIndex: "createdAt",
      key: "startDate",
      width: 150,
      align: "center",
      render: (_, record) => {
        return (
          <span>{dayjs(record.createdAt).format("DD/MM/YYYY HH:mm")}</span>
        );
      },
    },
    {
      title: "เวลารับเรื่อง",
      dataIndex: "createdAt",
      key: "endDate",
      width: 150,
      align: "center",
      render: (_, record) => {
        return (
          <span>{dayjs(record.createdAt).format("DD/MM/YYYY HH:mm")}</span>
        );
      },
    },
    {
      title: "ประเภทเหตุการณ์",
      key: "eventType",
      width: 150,
      align: "center",
      render: (_, record) => {
        let className = "";
        switch (record.eventType.code) {
          case "new_event":
            className = "sos";
            break;
          case "device_problem":
            className = "warning";
            break;
          case "device_offline":
            className = "offline";
            break;
        }
        return (
          <span className={`${className}`}>{record.eventType.nameTh}</span>
        );
      },
    },
    {
      title: "ชื่อเจ้าของบ้าน",
      key: "homeOwner",
      width: 200,
      align: "center",
      ...getColumnSearchProps("ownerName"),
      render(_, record) {
        return <span>{record.homeOwner.fullname ?? "-"}</span>;
      },
    },
    {
      title: "ชือเจ้าหน้าที่",
      key: "createdBy",
      width: 200,
      align: "center",
      ...getColumnSearchProps("officerName"),
      render(_, record) {
        return <span>{record.createdBy.firstName ?? "-"}</span>;
      },
    },
    {
      title: "เบอร์โทรศัพท์",
      key: "mobile",
      width: 150,
      align: "center",
      ...getColumnSearchProps("mobile"),
      render(_, record) {
        return <span>{record.homeOwner.mobile ?? "-"}</span>;
      },
    },
    {
      title: "รายงานเหตุการณ์",
      dataIndex: "step",
      key: "step",
      width: 120,
      align: "center",
      render: (step: string) => (
        <span className={`step-tag step-${step}`}>Step {step}</span>
      ),
    },
  ];

  // Actions
  useEffect(() => {
    fetchData();
  }, [page, pageSize, searchObject, searchText, activeFilter]);

  return  (
    <div className="dashboard-container">
      <div className="page-header">ติดตามสถานะงาน</div>
      <div className="status-cards-wrapper">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <StatusCard
              icon={<DownloadOutlined />}
              title="เคลียร์ทั้งหมด"
              count={cardCount?.total ?? "-"}
              color="blue"
              filterType="all"
              isActive={activeKey === "all"}
              onClick={() => handleCardClick("all")}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatusCard
              icon={<FileTextOutlined />}
              title="มีเหตุการณ์เกิดขึ้น"
              count={cardCount?.newEvent ?? "-"}
              color="red"
              filterType="new_event"
              isActive={activeFilter === "new_event"}
              onClick={() => handleCardClick("new_event")}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatusCard
              icon={<LaptopOutlined />}
              title="ปัญหาอุปกรณ์"
              count={cardCount?.deviceProblem ?? "-"}
              color="orange"
              filterType="device_problem"
              isActive={activeFilter === "device_problem"}
              onClick={() => handleCardClick("device_problem")}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatusCard
              icon={<WifiOutlined />}
              title="อุปกรณ์ออฟไลน์"
              count={cardCount?.deviceOffline ?? "-"}
              color="gray"
              filterType="device_offline"
              isActive={activeFilter === "device_offline"}
              onClick={() => handleCardClick("device_offline")}
            />
          </Col>
        </Row>
      </div>

      <Tabs
        // defaultActiveKey="all"
        activeKey={activeKey}
        className="custom-tabs"
        onChange={onTabsChange}
      >
        <TabPane tab="ทั้งหมด" key="all">
          <Table
            columns={columns}
            dataSource={emergencyTableData}
            scroll={{ x: 1300 }}
            pagination={{
              total: totalTable,
              pageSize: pageSize,
              showSizeChanger: true,
              onChange(page, pageSize) {
                setPage(page);
                setPageSize(pageSize);
              },
            }}
            className="custom-table"
          />
        </TabPane>
        <TabPane tab="รอดำเนินการ" key="in-progress">
          <Table
            columns={columns}
            dataSource={emergencyTableData}
            scroll={{ x: 1300 }}
            pagination={{
              total: totalTable,
              pageSize: pageSize,
              showSizeChanger: true,
              onChange(page, pageSize) {
                setPage(page);
                setPageSize(pageSize);
              },
            }}
            className="custom-table"
          />
        </TabPane>
        <TabPane
          tab={`ดำเนินการสำเร็จ (${cardCount?.complete})`}
          key="complete"
        >
          <Table
            columns={columns}
            dataSource={emergencyTableData}
            scroll={{ x: 1300 }}
            pagination={{
              total: totalTable,
              pageSize: pageSize,
              showSizeChanger: true,
              onChange(page, pageSize) {
                setPage(page);
                setPageSize(pageSize);
              },
            }}
            className="custom-table"
          />
        </TabPane>
      </Tabs>
    </div>
  ) ;
};

export default StatusDashboard;
