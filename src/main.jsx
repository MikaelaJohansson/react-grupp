import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/*omsluter App.jsx inom BrowsweRouter för att applikationen ska kunna använda Navlink och Routes */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
