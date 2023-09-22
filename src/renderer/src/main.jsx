import React from "react";
import "./assets/index.css";
import ReactDOMClient from "react-dom/client";
import Router from "./Router";
import { ThemeProvider } from "./components/ThemeContext";
import { AliveScope } from "react-activation";

ReactDOMClient.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <AliveScope>
      <Router />
    </AliveScope>
  </ThemeProvider>
);
