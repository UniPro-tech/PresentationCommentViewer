import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import Overlay from "./Overlay";

import "./index.css";
import Monitor from "./Monitor";

const isOverlay = window.location.hash === "#/overlay";
const isMonitor = window.location.hash === "#/monitor";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {isOverlay ? <Overlay /> : isMonitor ? <Monitor /> : <App />}
  </React.StrictMode>,
);
