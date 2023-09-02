import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/index.css";
import Router from "./Router";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <FluentProvider theme={webLightTheme} style={{ height: "100vh" }}>
      <Router />
    </FluentProvider>
  </BrowserRouter>
);
