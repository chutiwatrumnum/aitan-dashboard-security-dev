import React, { useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  InfoWindowF,
  MarkerF,
} from "@react-google-maps/api";
import '../styles/AlertMain.css'
const mapContainerStyle = {

  height: "73vh",
   marginRight: 10,
  marginLeft: 10,
};

const center = {
  lat: 13.736717,
  lng: 100.523186,
};
interface successModalProps {
  mapData:any
}
const GoogleMapCustom = ({mapData}: successModalProps) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAZMHVYmGEE5ZOVTMGceG0nNwaRs5xcRd0",
  });
  const locationList: any = [
    {
      lat: 13.736717,
      lng: 100.523186,
      show: false,
      title: "สถานะการแจ้งเตือน : Device has a problem",
      address: " บ้านเลขที่ : 122/2 ",
      name: "จตุรงษ์ มณีวงษ์",
      phone: "เบอร์ติดต่อ : 095-0075764",
    },
    {
      lat: 13.736717,
      lng: 100.523186,
      show: false,
      title: "สถานะการแจ้งเตือน : Device has a problem",
      address: " บ้านเลขที่ : 120/2 ",
      name: "จตุรงษ์ มณีวงษ์",
      phone: "เบอร์ติดต่อ : 095-0075764",
    },
  ];
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [locatonDataList, setlocatonDataList] = useState<any>(locationList);
  const onclick = async (map: any) => {
    console.log("on click:", map);
  };
  return isLoaded && mapData ? (
    <>
    <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
        onClick={onclick}
      >
        {mapData?.map((el: any, index: number) => {
          return (
            <MarkerF
              key={index}
              position={{ lat: el?.lat, lng: el?.lng }}
              // onClick={async () => {
              //   let newdata = locationList;
              //   newdata[index].show = true;

              //   await setlocatonDataList(newdata);
              // }}
              >
              {el?.show ? (
                <InfoWindowF
                  key={index}
                  position={{ lat: el?.lat, lng: el?.lng }}
                  // onCloseClick={async () => {
                  //   let newdata = locationList;
                  //   newdata[index].show = false;

                  //   await setlocatonDataList(newdata);
                  // }}
                  >
                  <div>
                    <p
                      style={{
                        color: 'rgba(26, 67, 69, 1)',
                        fontWeight: "bold",
                      }}>
                      {el?.title? `สถานะการแจ้งเตือน : ${el?.title}`:null}
                    </p>
                    <p style={{ color: "black" }}>{el?.address?` บ้านเลขที่ : ${el?.address}`:null}</p>
                    <p style={{ color: "black" }}>{el?.name}</p>
                    <p style={{ color: "black" }}>{el?.phone? `เบอร์ติดต่อ : ${el?.phone}`:null}</p>
                  </div>
                </InfoWindowF>
              ) : null}
            </MarkerF>
          );
        })}
      </GoogleMap>
    </>
  ) : (
    <></>
  );
};

export default GoogleMapCustom;
