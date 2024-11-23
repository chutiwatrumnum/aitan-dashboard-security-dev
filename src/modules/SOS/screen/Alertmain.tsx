import { useEffect, useRef, useState } from "react";
import { Card, Row, Col } from "antd";
import ReactDOMServer from "react-dom/server";
import mapboxgl from "mapbox-gl";
import { MapDataType } from "../../../stores/interfaces/SOS";
import { MarkerIcon } from "../../../assets/icons/Icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores";
import io from "socket.io-client";
import { API_URL } from "../../../configs/configs";
import { encryptStorage } from "../../../utils/encryptStorage";

// components
import CardAlert from "../components/CardAlert";
import CardList from "../components/CardList";
import PopupContent from "../components/PopupContent";
import "mapbox-gl/dist/mapbox-gl.css";

import "../styles/AlertMain.css";
import "../styles/map.css";

// const { Text, Title } = Typography;

function Alertmain() {
  const SOCKET_SERVER_URL = `http://${API_URL}/socket/test?event=alert`;
  const accessToken = encryptStorage.getItem("accessToken");
  const { sideMenuCollapsed } = useSelector((state: RootState) => state.common);
  const mapContainerRef = useRef<any>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // useState
  const [currentPopupIndex, setCurrentPopupIndex] = useState(-1);
  const mapCenterPoint: [number, number] = [
    100.4998173979597, 13.757927837596371,
  ];
  const [messages, setMessages] = useState<string[]>([]);

  const mapInfoData: MapDataType[] = [
    {
      properties: {
        id: "70c6a6d3-f43d-45ba-b953-6819761284ac",
        title: "อุปกรณ์มีปัญหา",
        fullName: "Sartayuth m.",
        address: "1011/01",
        date: "22/09/2024",
        contactedAt: "2024-11-06T06:47:00Z",
        status: true,
        alertType: "SOS",
        phone: "09898676755",
      },
      geometry: {
        type: "Point",
        coordinates: [100.4998173979597, 13.757927837596371],
      },
    },
    {
      properties: {
        id: "70c6a6d3-f43d-45ba-b953-6819761284a3",
        title: "อุปกรณ์มีปัญหา",
        fullName: "Sartayuth m.",
        address: "1011/01",
        date: "22/09/2024",
        contactedAt: "2024-11-04T17:23:00Z",
        status: true,
        alertType: "offline",
        phone: "09898676755",
      },
      geometry: {
        type: "Point",
        coordinates: [100.4978173979597, 13.756927837596371],
      },
    },
    {
      properties: {
        id: "70c6a6d3-f43d-45ba-b953-6819761284a1",
        title: "อุปกรณ์มีปัญหา",
        fullName: "Sartayuth m.",
        address: "1011/01",
        date: "22/09/2024",
        contactedAt: "2024-11-04T17:00:00Z",
        status: true,
        alertType: "warning",
        phone: "09898676755",
      },
      geometry: {
        type: "Point",
        coordinates: [100.4988173979597, 13.755927837596371],
      },
    },
    {
      properties: {
        id: "70c6a6d3-f43d-45ba-b953-681976128411",
        title: "อุปกรณ์มีปัญหา",
        fullName: "Sartayuth m.",
        address: "1011/01",
        date: "22/09/2024",
        contactedAt: "2024-11-04T17:00:00Z",
        status: true,
        alertType: "warning",
        phone: "09898676755",
      },
      geometry: {
        type: "Point",
        coordinates: [100.4986173979897, 13.755527837596171],
      },
    },
    {
      properties: {
        id: "70c6a6d3-f43d-45ba-b953-681976128412",
        title: "อุปกรณ์มีปัญหา",
        fullName: "Sartayuth m.",
        address: "1011/01",
        date: "22/09/2024",
        contactedAt: "2024-11-04T17:00:00Z",
        status: true,
        alertType: "warning",
        phone: "09898676755",
      },
      geometry: {
        type: "Point",
        coordinates: [100.4981173979397, 13.755327837596871],
      },
    },
    {
      properties: {
        id: "70c6a6d3-f43d-45ba-b953-681976128413",
        title: "อุปกรณ์มีปัญหา",
        fullName: "Sartayuth m.",
        address: "1011/01",
        date: "22/09/2024",
        contactedAt: "2024-11-04T17:00:00Z",
        status: true,
        alertType: "warning",
        phone: "09898676755",
      },
      geometry: {
        type: "Point",
        coordinates: [100.4985173979297, 13.755967837596671],
      },
    },
    {
      properties: {
        id: "70c6a6d3-f43d-45ba-b953-681976128414",
        title: "อุปกรณ์มีปัญหา",
        fullName: "Sartayuth m.",
        address: "1011/01",
        date: "22/09/2024",
        contactedAt: "2024-11-04T17:00:00Z",
        status: true,
        alertType: "warning",
        phone: "09898676755",
      },
      geometry: {
        type: "Point",
        coordinates: [100.4980173979697, 13.755997837596271],
      },
    },
  ];

  const onGoButtonClick = (data: MapDataType, index: number) => {
    if (currentPopupIndex != -1) {
      markersRef.current[currentPopupIndex].getPopup()?.remove();
      setCurrentPopupIndex(-1);
    }
    mapRef?.current?.flyTo({
      center: data.geometry.coordinates,
      zoom: 20,
      essential: true,
    });
    markersRef?.current[index]?.getPopup()?.addTo(mapRef?.current);
    setCurrentPopupIndex(index);
  };

  const markerColorSelector = (alertType: string) => {
    let color = "#212121";
    switch (alertType) {
      case "SOS":
        color = "#DC2A31";
        break;
      case "warning":
        color = "#F28F1E";
        break;
      case "offline":
        color = "#595959";
        break;

      default:
        break;
    }
    return color;
  };

  // Socket IO
  // useEffect(() => {
  //   const socket = io(SOCKET_SERVER_URL, { auth: { token: accessToken } });
  //   socket.on("connect", () => {
  //     console.log("Socket.IO Connection Opened");
  //   });
  //   socket.on("message", (message) => {
  //     setMessages((prevMessages) => [...prevMessages, message]);
  //   });
  //   socket.on("disconnect", () => {
  //     console.log("Socket.IO Connection Closed");
  //   });
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  // Map data effect
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoibm9wcGFrb3JuIiwiYSI6ImNtMmJoa3owMDBzY2oya29uZWcwc3B3aG0ifQ.ugChO0OZMM-xTs5ROe-Kjw";

    // mapboxgl.accessToken = "1231234142";

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: mapCenterPoint,
      zoom: 18,
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
          color={markerColorSelector(marker.properties.alertType)}
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
        popup.setLngLat(marker.geometry.coordinates).addTo(mapRef.current)
      );
      el.addEventListener("mouseleave", () => popup.remove());

      const newMarker = new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .setPopup(popup)
        .addTo(mapRef.current);

      markersRef.current.push(newMarker);
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      mapRef?.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (mapContainerRef.current) {
      mapContainerRef.current.style.width = "100%";
    }
  }, [sideMenuCollapsed]);

  return (
    <>
      <Row className="noScroll">
        {/* map view */}
        <Col span={16}>
          <Col className="mapContainer" span={24}>
            <div
              ref={mapContainerRef}
              style={{ width: "100%", height: "100vh" }}
            />
          </Col>
        </Col>
        {/* map view */}
        <Col
          span={8}
          className="card-list-scroll"
          style={{ padding: 24, maxHeight: "100vh" }}
        >
          <CardAlert />
          <CardList
            mapInfoData={mapInfoData}
            onGoButtonClick={onGoButtonClick}
          />
          <ul>
            {" "}
            {messages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}{" "}
          </ul>
        </Col>
      </Row>
    </>
  );
}

export default Alertmain;
