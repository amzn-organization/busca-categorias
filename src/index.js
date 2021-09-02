import React from "react";
import ReactDOM from "react-dom";
import Router from "./routes/router";

import "./globals.css";

const App = () => {
  return <Router />;
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
