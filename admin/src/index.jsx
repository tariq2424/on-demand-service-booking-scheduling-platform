import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "react-toastify/dist/ReactToastify.css";

// Mapbox token from environment variables
window.MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
