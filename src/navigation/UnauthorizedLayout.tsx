import { useEffect, useState } from "react";
import { Navigate, useLocation, useOutlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../stores";

import "./styles/unAuthorizedLayout.css";

const from = window.location.pathname;

const UnauthorizedLayout = () => {
  const userAuth = useSelector((state: RootState) => state.userAuth);
  const location = useLocation();
  const outlet = useOutlet();

  if (userAuth.isAuth) {
    return (
      <Navigate
        to={from.includes("dashboard") ? from : "/dashboard/MapView"}
        state={{ from: location }}
        replace
      />
    );
  }

  return <div className="unauthorized-container">{outlet}</div>;
};

export default UnauthorizedLayout;
