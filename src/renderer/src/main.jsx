import React from "react";
import "./assets/index.css";
import ReactDOM from "react-dom";
import { FluentProvider, webLightTheme, Button } from "@fluentui/react-components";
import { Nav } from "./Nav";
import { VerticalDivider } from "./VerticalDivider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <FluentProvider theme={webLightTheme} style={{ height: "100vh", display: "flex" }}>
    <Nav></Nav>
    <VerticalDivider></VerticalDivider>
    {/*<Nav></Nav>*/}
    {/*<Button appearance="primary">Get started</Button>*/}
  </FluentProvider>
);
