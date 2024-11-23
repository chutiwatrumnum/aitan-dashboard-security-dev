import { useState, useEffect } from "react";
import { Card, Table, Input, Button, Row } from "antd";
import { EyeIcon } from "../../../assets/icons/Icons";
import type { ColumnsType } from "antd/es/table";
import { whiteLabel } from "../../../configs/theme";
import HomeDashboard from "./deviceHome";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "./stores";

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
const HomeMain = () => {
  // Variables
  const dispatch = useDispatch<Dispatch>();
  const { homeListTableData } = useSelector(
    (state: RootState) => state.homeList
  );
  const [IshowHomeDetail, setIshowHomeDetail] = useState<boolean>(false);

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
            setIshowHomeDetail(true);
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
      title: "สถานะบ้าน",
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
            className = "confirmed";
            break;
          case "เสร็จสิ้น":
            className = "completed";
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
      title: "เบอร์โทรศัพท์",
      dataIndex: "phone",
      key: "phone",
      width: 150,
      align: "center", // เพิ่มบรรทัดนี้
    },
  ];

  // Functions
  const SetIshowHomeDetail = (Ishow: boolean) => setIshowHomeDetail(Ishow);

  const fetchData = async () => {
    await dispatch.homeList.getHomeListTableData();
    // const resReToken = await dispatch.userAuth.refreshTokenNew();
    // if (!resReToken) throw "accessToken expired";
  };

  // Actions
  useEffect(() => {
    fetchData();
    return () => {
      setIshowHomeDetail(false);
    };
  }, []);

  return !IshowHomeDetail ? (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      {/* Filters */}
      <Row
        style={{
          marginBottom: 24,
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <h2 style={{ margin: 0, fontWeight: whiteLabel.boldWeight }}>
          รายการบ้านทั้งหมด
        </h2>
        {/* <Button type="primary" icon={<ExportOutlined />}>
          Export
        </Button> */}
      </Row>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: 1500 }}
          pagination={{
            total: 200,
            pageSize: 10,
            showSizeChanger: true,
          }}
        />
      </Card>
    </div>
  ) : (
    <HomeDashboard callback={SetIshowHomeDetail} />
  );
};

export default HomeMain;
