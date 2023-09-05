import React from "react";
import "./assets/index.css";
import ReactDOM from "react-dom";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { BrowserRouter } from "react-router-dom";
import Router from "./Router";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <FluentProvider theme={webLightTheme} className={"h-screen"}>
      <Router></Router>
    </FluentProvider>
  </BrowserRouter>
);
