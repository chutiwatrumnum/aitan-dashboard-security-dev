import { useEffect, useRef, useState } from "react";
import { Row, Col, Spin } from "antd";
import ReactDOMServer from "react-dom/server";
import mapboxgl from "mapbox-gl";
import { MapDataType } from "../../../stores/interfaces/SOS";
import { MarkerIcon } from "../../../assets/icons/Icons";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../../../stores";
import io from "socket.io-client";
import { SOCKET_API_URL } from "../../../configs/configs";
import { encryptStorage } from "../../../utils/encryptStorage";
// import { socket } from "../../../configs/socket";

// components
import CardList from "../components/CardList";
import PopupContent from "../components/PopupContent";
import PieEvent from "../components/PieEvent";
import PieStatus from "../components/PieStatus";
import "mapbox-gl/dist/mapbox-gl.css";

import "../styles/AlertMain.css";
import "../styles/map.css";

// const { Text, Title } = Typography;

function Alertmain() {
  const SOCKET_SERVER_URL = `${SOCKET_API_URL}dashboard`;
  const accessToken = encryptStorage.getItem("accessToken");
  const dispatch = useDispatch<Dispatch>();
  const { pieEventData, pieStatusData, mapInfoData } = useSelector(
    (state: RootState) => state.alert
  );
  const mapContainerRef = useRef<any>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // useState
  const [currentPopupIndex, setCurrentPopupIndex] = useState(-1);
  const mapCenterPoint: [number, number] = [
    100.4698173979597, 13.787927837596371,
  ];

  // Functions
  const onGoButtonClick = (
    data: MapDataType,
    index: number | null,
    zoom?: number
  ) => {
    if (currentPopupIndex != -1) {
      markersRef.current[currentPopupIndex].getPopup()?.remove();
      setCurrentPopupIndex(-1);
    }
    mapRef?.current?.flyTo({
      center: [data.homeLong, data.homeLat],
      zoom: zoom ?? 19,
      essential: true,
    });
    if (index !== null) {
      markersRef?.current[index]?.getPopup()?.addTo(mapRef?.current);
      setCurrentPopupIndex(index);
    }
  };

  const markerColorSelector = (alertType: string) => {
    let color = "#212121";
    switch (alertType) {
      case "new_event":
        color = "#DC2A31";
        break;
      case "device_problem":
        color = "#F28F1E";
        break;
      case "device_offline":
        color = "#595959";
        break;

      default:
        break;
    }
    return color;
  };

  const fetchPieStatusData = async () => {
    try {
      setIsLoading(true);
      await dispatch.alert.getPieStatusData();
    } catch (error) {
      console.error("Error fetching status data:", error);
    }
  };

  const fetchEventData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        dispatch.alert.getPieEventData(),
        dispatch.alert.getMapInfoData(),
      ]);
      onGoButtonClick(mapInfoData[0], null, 14);
    } catch (error) {
      console.error("Error fetching event data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onActionEventTrigger = async (value: { cmd: string }) => {
    console.log("Action Event Triggered:");
    try {
      setIsLoading(true);
      if (value.cmd === "arm_action") {
        await fetchPieStatusData();
      } else if (value.cmd === "new_event") {
        await fetchEventData();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Actions
  // Socket IO
  useEffect(() => {
    // console.log(SOCKET_SERVER_URL);
    const socket = io(SOCKET_SERVER_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      extraHeaders: {
        authorization: `bearer ${accessToken}`,
      },
    });

    socket.on("connect", () => {
      console.log("Socket.IO Connection Opened");
    });
    socket.on("action", onActionEventTrigger);
    socket.on("connect_error", (error) => {
      console.error("Connection Error:", error);
    });
    socket.on("reconnect_attempt", (attempt) => {
      console.log(`Reconnect attempt ${attempt}`);
    });
    socket.on("disconnect", (reason) => {
      console.log("Socket.IO Connection Closed: Reason is =>", reason);
      // if (reason === "io server disconnect") {
      //   socket.connect();
      // }
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  // Map data effect
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoibm9wcGFrb3JuIiwiYSI6ImNtMmJoa3owMDBzY2oya29uZWcwc3B3aG0ifQ.ugChO0OZMM-xTs5ROe-Kjw";

    // mapboxgl.accessToken = "1231234142";

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: mapCenterPoint,
      zoom: 14,
      pitch: 62,
      bearing: -20,
    });

    mapRef.current.on("style.load", () => {
      mapRef.current.setConfigProperty("basemap", "lightPreset", "day");
      mapRef.current.setConfigProperty(
        "basemap",
        "showPointOfInterestLabels",
        false
      );
    });

    mapInfoData.map((marker, idx) => {
      // ----------------------------------------------------------------------------------
      const el = document.createElement("div");
      el.className = "markerContainer";
      el.style.display = "block";
      el.style.border = "none";
      el.style.cursor = "pointer";
      el.innerHTML = ReactDOMServer.renderToString(
        <MarkerIcon
          color={markerColorSelector(marker.eventTypeCode)}
          className="marker_AM"
        />
      );

      const popupHTML = ReactDOMServer.renderToString(
        <PopupContent {...marker} />
      );
      // สร้าง popup
      var popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: true,
      }).setHTML(popupHTML);

      // เพิ่ม event listener สำหรับ 'click'
      el.addEventListener("click", () => {
        popup.remove();
      });

      // เพิ่ม event listener สำหรับ 'mouseenter' และ 'mouseleave'
      el.addEventListener("mouseenter", () =>
        popup.setLngLat([marker.homeLong, marker.homeLat]).addTo(mapRef.current)
      );
      el.addEventListener("mouseleave", () => popup.remove());

      const newMarker = new mapboxgl.Marker(el)
        .setLngLat([marker.homeLong, marker.homeLat])
        .setPopup(popup)
        .addTo(mapRef.current);

      markersRef.current.push(newMarker);
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      mapRef?.current?.remove();
    };
  }, [mapInfoData]);

  // Fetch Data
  useEffect(() => {
    fetchPieStatusData();
    fetchEventData();
  }, []);

  return (
    <>
      <Row className="noScroll">
        {isLoading && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <Spin size="large" />
          </div>
        )}
        {/* map view */}
        <Col span={16}>
          <Row
            style={{ height: "40vh", padding: 24, paddingRight: 0 }}
            justify="space-between"
          >
            <Col style={{ width: "48.5%" }} className="pieContainer">
              <span
                style={{
                  display: "block",
                  textAlign: "right",
                  fontWeight: "700",
                }}
              >
                ข้อมูลระบบรักษาความปลอดภัย
              </span>
              <PieStatus data={pieStatusData} />
            </Col>
            <Col style={{ width: "48.5%" }} className="pieContainer">
              <span
                style={{
                  display: "block",
                  textAlign: "right",
                  fontWeight: "700",
                }}
              >
                สถานะอุปกรณ์
              </span>

              <PieEvent data={pieEventData} />
            </Col>
          </Row>
          <Col span={24}>
            <Col className="mapContainer" span={24}>
              <div
                ref={mapContainerRef}
                style={{ width: "100%", height: "58vh" }}
              />
            </Col>
          </Col>
        </Col>

        {/* map view */}
        <Col
          span={8}
          className="card-list-scroll"
          style={{ padding: 24, maxHeight: "100vh" }}
        >
          {/* <CardAlert /> */}
          <CardList
            mapInfoData={mapInfoData}
            onGoButtonClick={onGoButtonClick}
          />
        </Col>
      </Row>
    </>
  );
}

export default Alertmain;
