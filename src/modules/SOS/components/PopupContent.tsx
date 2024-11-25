import {
  SOSIcon,
  WarningIcon,
  OfflineIcon,
  NameIcon,
  AddressIcon,
  PhoneIcon,
} from "../../../assets/icons/Icons";
import { Row, Col, Space } from "antd";
import { MapDataType } from "../../../stores/interfaces/SOS";
import { whiteLabel } from "../../../configs/theme";

import "../styles/map.css";

const PopupContent = (props: MapDataType) => {
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

  const colorSelector = (alertType: string) => {
    let color = whiteLabel.mainTextColor;
    switch (alertType) {
      case "ฉุกเฉิน":
        color = whiteLabel.dangerTextColor;
        break;
      case "อุปกรณ์มีปัญหา":
        color = whiteLabel.warningTextColor;
        break;
      case "อุปกรณ์ออฟไลน์":
        color = whiteLabel.grayTextColor;
        break;

      default:
        break;
    }
    return color;
  };

  return (
    <Row className="notification">
      <Col span={6} className="icon-container">
        {iconSelector(props.eventTypeNameTH)}
      </Col>
      <Col span={18} className="info">
        <div className="titlePopupContainer_PC">
          <h2
            style={{ color: colorSelector(props.eventTypeNameTH) }}
            className="status"
          >
            {props.eventTypeNameTH}
          </h2>
        </div>
        <Row className="infoTextContainer_PC">
          <NameIcon />
          <span className="infoText_PC">{props.homeOwnerFullname ?? "-"}</span>
        </Row>
        <Row className="infoTextContainer_PC">
          <AddressIcon />
          <span className="infoText_PC">{props.homeAddress ?? "-"}</span>
        </Row>
        <Row className="infoTextContainer_PC">
          <PhoneIcon />
          <span className="infoText_PC">{props.homeOwnerMobile ?? "-"}</span>
        </Row>
      </Col>
    </Row>
  );
};

export default PopupContent;
