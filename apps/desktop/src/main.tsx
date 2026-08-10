import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import Overlay from "./Overlay";

import "./index.css";

const isOverlay = window.location.hash === "#/overlay";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>{isOverlay ? <Overlay /> : <App />}</React.StrictMode>,
);
