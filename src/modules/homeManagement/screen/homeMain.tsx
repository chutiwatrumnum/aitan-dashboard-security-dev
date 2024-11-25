import { useState, useEffect } from "react";
import { Card, Table, Input, Button, Row } from "antd";
import { EyeIcon } from "../../../assets/icons/Icons";
import type { ColumnsType } from "antd/es/table";
import { HomeListTableDataType } from "../../../stores/interfaces/HomeList";
import { whiteLabel } from "../../../configs/theme";
import HomeDashboard from "./deviceHome";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";

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

  const columns: ColumnsType<HomeListTableDataType> = [
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
            // setIshowHomeDetail(true);
            // console.log(record.workId);
            // console.log("HOME LIST DATA =>", homeListTableData);
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
      render: (_, record, index) => <span>{index + 1}</span>,
    },
    {
      title: "บ้านเลขที่",
      dataIndex: "address",
      key: "address",
      width: 100,
      align: "center", // เพิ่มบรรทัดนี้
    },
    {
      title: "สถานะบ้าน",
      key: "status",
      width: 150,
      align: "center", // เพิ่มบรรทัดนี้
      render: (_, record) => {
        let className = "";
        switch (record?.homeAlarmStatus?.status?.code) {
          case "away":
            className = "away";
            break;
          case "stay":
            className = "stay";
            break;
          case "disarm":
            className = "disarmed";
            break;
        }
        return (
          <span className={`status-tag ${className}`}>
            {record?.homeAlarmStatus?.status?.name ?? "ยังไม่เปิดใช้งาน"}
          </span>
        );
      },
    },
    {
      title: "ชื่อเจ้าของบ้าน",
      key: "ownerName",
      width: 200,
      align: "center", // เพิ่มบรรทัดนี้
      render: (_, record) => {
        return <span>{record.homeOwner?.fullname ?? "-"}</span>;
      },
    },
    {
      title: "เบอร์โทรศัพท์",
      key: "phone",
      width: 150,
      align: "center", // เพิ่มบรรทัดนี้
      render: (_, record) => {
        return <span>{record.homeOwner?.mobile ?? "-"}</span>;
      },
    },
  ];

  // Functions
  const SetIshowHomeDetail = (Ishow: boolean) => {
    setIshowHomeDetail(Ishow);
  };

  const fetchData = async () => {
    await dispatch.homeList.getHomeListTableData();
  };

  // Actions
  useEffect(() => {
    fetchData();
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
          dataSource={homeListTableData}
          scroll={{ x: 1500 }}
          pagination={{
            total: homeListTableData.length,
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
