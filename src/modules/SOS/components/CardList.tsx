import { useState, useEffect } from "react";
import { Card, Button, Row, Col, message } from "antd";
import { SOSIcon, WarningIcon, OfflineIcon } from "../../../assets/icons/Icons";
import {
  CreateTicketRequest,
  MapDataType,
} from "../../../stores/interfaces/SOS";
import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { Dispatch } from "../../../stores";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import { encryptStorage } from "../../../utils/encryptStorage";

import "../styles/AlertMain.css";
import { whiteLabel } from "../../../configs/theme";
import { acceptAlertCase } from "../service/alertServiceApi";
import { getTicketList } from "../../deviceManagement/service/emergencyApi";

dayjs.extend(relativeTime);
dayjs.extend(duration);

interface CardListType {
  mapInfoData: MapDataType[];
  onGoButtonClick?: (data: MapDataType, index: number) => void;
}

interface TimeAgoType {
  formattedDuration: string;
  color: string;
}

const CardList = ({ mapInfoData, onGoButtonClick }: CardListType) => {
  const navigate = useNavigate();
  const [timeAgos, setTimeAgos] = useState<TimeAgoType[]>([]);

  const iconSelector = (alertType: string) => {
    let icon = <SOSIcon />;
    switch (alertType) {
      case "new_event":
        icon = <SOSIcon className="cardIcon_CL" />;
        break;
      case "device_problem":
        icon = <WarningIcon className="cardIcon_CL" />;
        break;
      case "device_offline":
        icon = <OfflineIcon className="cardIcon_CL" />;
        break;

      default:
        break;
    }
    return icon;
  };

  // const acceptRequest = (id: number) => {
  //   encryptStorage.setItem("acceptedRequestId", id);
  //   navigate("/dashboard/deviceStep", { replace: true });
  // };

  useEffect(() => {
    const updateTimes = () => {
      const now = dayjs();
      const newTimes = mapInfoData.map((date) => {
        const past = dayjs(date.eventDateTime);
        const diffDuration = dayjs.duration(now.diff(past));
        const totalMinutes = Math.floor(diffDuration.asMinutes());
        const totalSeconds = Math.floor(diffDuration.asSeconds());

        const minutes = totalMinutes % 60;
        const seconds = totalSeconds % 60;
        let formattedDuration = `${String(minutes)} นาที ${String(
          seconds
        ).padStart(2, "0")} วินาที`;

        if (totalMinutes >= 60) {
          formattedDuration = `มากกว่า ${Math.floor(totalMinutes / 60)} ชม`;
        }

        let color = "#0A121B";
        if (totalMinutes >= 5) {
          color = "#DC2A31";
        } else if (totalSeconds > 30) {
          color = "#F28F1E";
        }

        return { formattedDuration: formattedDuration, color: color };
      });

      setTimeAgos(newTimes);
    };

    updateTimes();
    const intervalId = setInterval(updateTimes, 30000);

    return () => clearInterval(intervalId);
  }, [mapInfoData]);

  const acceptRequest = async (data: MapDataType) => {
    const dataRequest: CreateTicketRequest = {
      homeId: data.homeId,
      eventTypeId: data.eventTypeId,
      homeAddress: data.homeAddress,
      homeLat: data.homeLat,
      homeLong: data.homeLong,
    };

    const Issuccess = await acceptAlertCase(dataRequest);
    if (Issuccess) {
      const ticketId = await getTicketList();
      console.log("ticketId:", ticketId);
      await encryptStorage.setItem("acceptedRequestId", ticketId);
      message.success("กดรับการแจ้งเตือนสำเร็จ");
      navigate("/dashboard/deviceStep", {
        state: { ticketId: ticketId, gotoBack: true },
      });
    } else {
      message.error("ไม่สามารถรับได้ โปรดตรวจเช็คงานที่ค้าง");
    }
  };

  return (
    <div style={{ padding: "5px" }}>
      {mapInfoData.map((item, index) => (
        <Card
          key={index}
          style={{
            marginBottom: "10px",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
          bodyStyle={{ padding: "12px" }}
        >
          <Col span={24}>
            <Row>
              <Col className="iconContainer_CL" span={4}>
                {iconSelector(item.eventTypeCode)}
              </Col>
              <Col className="contentContainer_CL" span={20}>
                <h2
                  style={{
                    fontWeight: whiteLabel.boldWeight,
                    marginBottom: "4px",
                  }}
                >
                  ผ่านมาแล้ว :{" "}
                  <span
                    style={{
                      color: timeAgos[index]?.color,
                    }}
                  >
                    {timeAgos[index]?.formattedDuration}
                  </span>
                </h2>
                <span>งาน : {item.eventTypeNameTH}</span>
              </Col>
            </Row>
            <Row justify="space-around">
              <Col span={8}>
                <Button
                  onClick={() => {
                    onGoButtonClick
                      ? onGoButtonClick(item, index)
                      : console.log("No function!");
                  }}
                  className="cardBtn_CL blueBtn"
                >
                  ดูแผนที่
                </Button>
              </Col>
              <Col span={8}>
                <Button
                  onClick={() => {
                    acceptRequest(item);
                  }}
                  className="cardBtn_CL greenBtn"
                >
                  กดรับเคส
                </Button>
              </Col>
            </Row>
          </Col>
        </Card>
      ))}
    </div>
  );
};

export default CardList;
