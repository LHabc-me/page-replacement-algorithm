import React from "react";
import "./assets/index.css";
import ReactDOMClient from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./components/ThemeContext";
import { TipProvider } from "./components/TipContext";
import { AliveScope } from "react-activation";

ReactDOMClient.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <TipProvider>
      <AliveScope>
        <App />
      </AliveScope>
    </TipProvider>
  </ThemeProvider>
);
