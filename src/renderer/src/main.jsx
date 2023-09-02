import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/index.css";
import App from "./App";
import { Button } from "@fluentui/react-components";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";

ReactDOM.createRoot(document.getElementById("root")).render(
  <FluentProvider theme={webLightTheme} style={{ height: "100vh" }}>
    {/*<App />*/}
    <p className={"font-bold underline"}>Hello World</p>
    <Button appearance="primary" id="root2">Get started</Button>
  </FluentProvider>
);
