import React from "react";
import "./assets/index.css";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Router } from "./Router";
import { ThemeProvider } from "./components/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </ThemeProvider>
);
