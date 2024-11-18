import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import { Provider } from "react-redux";
import { store } from "./stores";
import { ConfigProvider } from "antd";
import { theme } from "./configs/theme";
import { validateMessages } from "./configs/inputRule.tsx";

import WebBackground from "./components/templates/WebBackground.tsx";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import "./configs/axios";
import "./i18n";
import "antd/dist/reset.css";
import "./index.css";

dayjs.extend(utc);
dayjs.extend(timezone);

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <ConfigProvider
    componentSize="large"
    theme={theme}
    form={{ validateMessages }}
  >
    <Provider store={store}>
      {/* <WebBackground> */}
      <App />
      {/* </WebBackground> */}
    </Provider>
  </ConfigProvider>
  // </React.StrictMode>
);
