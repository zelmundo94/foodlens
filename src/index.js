import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import "@tensorflow/tfjs";

const REACT_API_KEY =`${process.env.REACT_APP_API_KEY}`


 ReactDOM.render(<App />, document.getElementById("root"));
