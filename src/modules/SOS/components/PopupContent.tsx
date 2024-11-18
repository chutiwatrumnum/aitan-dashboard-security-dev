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
      case "SOS":
        icon = <SOSIcon className="cardIcon_CL" />;
        break;
      case "warning":
        icon = <WarningIcon className="cardIcon_CL" />;
        break;
      case "offline":
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
      case "SOS":
        color = whiteLabel.dangerTextColor;
        break;
      case "warning":
        color = whiteLabel.warningTextColor;
        break;
      case "offline":
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
        {iconSelector(props.properties.alertType)}
      </Col>
      <Col span={18} className="info">
        <div className="titlePopupContainer_PC">
          <h2
            style={{ color: colorSelector(props.properties.alertType) }}
            className="status"
          >
            {props.properties.title}
          </h2>
        </div>
        <Row className="infoTextContainer_PC">
          <NameIcon />
          <span className="infoText_PC">{props.properties.fullName}</span>
        </Row>
        <Row className="infoTextContainer_PC">
          <AddressIcon />
          <span className="infoText_PC">{props.properties.address}</span>
        </Row>
        <Row className="infoTextContainer_PC">
          <PhoneIcon />
          <span className="infoText_PC">{props.properties.phone ?? "-"}</span>
        </Row>
      </Col>
    </Row>
  );
};

export default PopupContent;
