import { useState, useEffect, useRef } from "react";
import { Card, Table, Input, Button, Row, Space } from "antd";
import { EyeIcon } from "../../../assets/icons/Icons";
import { SearchOutlined } from "@ant-design/icons";
import { whiteLabel } from "../../../configs/theme";
import HomeDashboard from "./deviceHome";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";

import type { ColumnsType } from "antd/es/table";
import type { InputRef, TableColumnType } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { HomeListTableDataType } from "../../../stores/interfaces/HomeList";

type DataIndex = keyof HomeListTableDataType;

const HomeMain = () => {
  // Variables
  const dispatch = useDispatch<Dispatch>();
  const { homeListTableData, totalTable } = useSelector(
    (state: RootState) => state.homeList
  );
  const [IshowHomeDetail, setIshowHomeDetail] = useState<boolean>(false);
  const [HomeId, setHomeId] = useState<number | undefined>(undefined);

  // Functions
  const SetIshowHomeDetail = (Ishow: boolean) => {
    setIshowHomeDetail(Ishow);
  };

  const fetchData = async () => {
    await dispatch.homeList.getHomeListTableData({
      curPage: page.toString(),
      perPage: pageSize.toString(),
      searchObject: searchObject,
      searchText: searchText,
    });
  };

  const [searchText, setSearchText] = useState("");
  const [searchObject, setSearchObject] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    // console.log(selectedKeys[0], dataIndex);

    setSearchText(selectedKeys[0]);
    setSearchObject(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<HomeListTableDataType> => ({
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

  // Table controller
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
            setHomeId(record.id);
            setIshowHomeDetail(true);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
      ...getColumnSearchProps("ownerName"),
      render: (_, record) => {
        return <span>{record.homeOwner?.fullname ?? "-"}</span>;
      },
    },
    {
      title: "เบอร์โทรศัพท์",
      key: "mobile",
      width: 150,
      align: "center", // เพิ่มบรรทัดนี้
      ...getColumnSearchProps("mobile"),
      render: (_, record) => {
        return <span>{record.homeOwner?.mobile ?? "-"}</span>;
      },
    },
  ];

  // Actions
  useEffect(() => {
    fetchData();
  }, [page, pageSize, searchObject, searchText]);

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
            total: totalTable,
            pageSize: pageSize,
            showSizeChanger: true,
            onChange(page, pageSize) {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </Card>
    </div>
  ) : (
    <HomeDashboard callback={SetIshowHomeDetail} HomeId={HomeId} />
  );
};

export default HomeMain;
