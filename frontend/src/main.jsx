import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import App from "./App";
import { applyTheme, getSavedTheme } from "./lib/theme";
import "./theme-overrides.css";

applyTheme(getSavedTheme());

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
