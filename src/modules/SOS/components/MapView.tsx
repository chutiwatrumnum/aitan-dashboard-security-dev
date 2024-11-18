import { useState, useEffect, useRef } from "react";
import ReactDOMServer from "react-dom/server";
import mapboxgl from "mapbox-gl";

import PopupContent from "./PopupContent";

import { MapDataType, MapViewType } from "../../../stores/interfaces/SOS";
import "mapbox-gl/dist/mapbox-gl.css";
import "../styles/map.css";

const MapView = ({ center }: MapViewType) => {
  const mapContainerRef = useRef();
  const mapRef = useRef();

  const handleGoto = (data: MapDataType) => {
    mapRef.current.flyTo({
      center: data.geometry.coordinates,
      zoom: 18,
    });
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

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoibm9wcGFrb3JuIiwiYSI6ImNtMmJoa3owMDBzY2oya29uZWcwc3B3aG0ifQ.ugChO0OZMM-xTs5ROe-Kjw";

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center,
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

    const geojson: MapDataType[] = [
      {
        properties: {
          id: "70c6a6d3-f43d-45ba-b953-6819761284ac",
          title: "อุปกรณ์มีปัญหา",
          fullName: "Sartayuth m.",
          address: "1011/01",
          date: "22/09/2023",
          contactTime: "18:06:28",
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
          id: "70c6a6d3-f43d-45ba-b953-6819761284ac",
          title: "อุปกรณ์มีปัญหา",
          fullName: "Sartayuth m.",
          address: "1011/01",
          date: "22/09/2023",
          contactTime: "18:06:28",
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
          id: "70c6a6d3-f43d-45ba-b953-6819761284ac",
          title: "อุปกรณ์มีปัญหา",
          fullName: "Sartayuth m.",
          address: "1011/01",
          date: "22/09/2023",
          contactTime: "18:06:28",
          status: true,
          alertType: "warning",
          phone: "09898676755",
        },
        geometry: {
          type: "Point",
          coordinates: [100.4988173979597, 13.755927837596371],
        },
      },
    ];

    geojson.map((marker, idx) => {
      // ----------------------------------------------------------------------------------

      const el = document.createElement("div");
      // const width = marker.properties.iconSize[0];
      // const height = marker.properties.iconSize[1];
      el.className = "marker";
      // el.style.width = `${width}px`;
      // el.style.height = `${height}px`;
      el.style.width = `15px`;
      el.style.height = `15px`;
      el.style.background = markerColorSelector(marker.properties.alertType);
      el.style.display = "block";
      el.style.border = "none";
      el.style.borderRadius = "50%";
      el.style.cursor = "pointer";

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
        // window.alert(marker.properties.message);
        handleGoto(marker);
      });

      // เพิ่ม event listener สำหรับ 'mouseenter' และ 'mouseleave'
      el.addEventListener("mouseenter", () =>
        popup.setLngLat(marker.geometry.coordinates).addTo(mapRef.current)
      );
      el.addEventListener("mouseleave", () => popup.remove());

      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .setPopup(popup)
        .addTo(mapRef.current);
    });

    return () => mapRef.current.remove();
  }, []);

  return (
    <>
      <div ref={mapContainerRef} style={{ height: "70vh" }} />
    </>
  );
};

export default MapView;
