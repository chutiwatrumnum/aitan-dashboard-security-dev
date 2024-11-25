import { useState, useEffect } from "react";
import { Card, Button, Row, Col } from "antd";
import { SOSIcon, WarningIcon, OfflineIcon } from "../../../assets/icons/Icons";
import { MapDataType } from "../../../stores/interfaces/SOS";
import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { Dispatch } from "../../../stores";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import { encryptStorage } from "../../../utils/encryptStorage";

import "../styles/AlertMain.css";
import { whiteLabel } from "../../../configs/theme";

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
      case "ฉุกเฉิน":
        icon = <SOSIcon className="cardIcon_CL" />;
        break;
      case "อุปกรณ์มีปัญหา":
        icon = <WarningIcon className="cardIcon_CL" />;
        break;
      case "อุปกรณ์ออฟไลน์":
        icon = <OfflineIcon className="cardIcon_CL" />;
        break;

      default:
        break;
    }
    return icon;
  };

  const acceptRequest = (id: number) => {
    encryptStorage.setItem("acceptedRequestId", id);
    navigate("/dashboard/deviceStep", { replace: true });
  };

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
    const intervalId = setInterval(updateTimes, 1000);

    return () => clearInterval(intervalId);
  }, [mapInfoData]);

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
                {iconSelector(item.eventTypeNameTH)}
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
                    acceptRequest(item.homeId);
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
