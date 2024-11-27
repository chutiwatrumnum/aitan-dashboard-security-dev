import React, { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const MapWithMarker = ({ lat = 13.7876731, lng = 100.4794405 }) => {
  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyAZMHVYmGEE5ZOVTMGceG0nNwaRs5xcRd0", // ต้องใส่ API key ของคุณ
      version: "weekly",
    });

    loader.load().then(() => {
      const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat, lng },
        zoom: 15,
      });

      // เพิ่มหมุด
      new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: "ตำแหน่งที่ตั้ง",
      });
    });
  }, [lat, lng]);

  return (
    <div
      id="map"
      style={{
        width: "100%",
        height: "400px",
        background: "#f5f5f5",
      }}
    />
  );
};

export default MapWithMarker;
