import { createStore } from "@reduxjs/toolkit";
import hljs from "highlight.js/lib/core";
import hljson from "highlight.js/lib/languages/json";
import hlxml from "highlight.js/lib/languages/xml";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./assets/style.css";
import App from "./components/App";
import rootReducer from "./reducers";
import reportWebVitals from "./reportWebVitals";

hljs.registerLanguage("json", hljson);
hljs.registerLanguage("xml", hlxml);

const store = createStore(rootReducer);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
