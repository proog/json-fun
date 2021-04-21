import { configureStore } from "@reduxjs/toolkit";
import hljs from "highlight.js/lib/core";
import hljson from "highlight.js/lib/languages/json";
import hlxml from "highlight.js/lib/languages/xml";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { formatInput } from "./actions";
import "./assets/style.css";
import App from "./components/App";
import { loadInputFromStorage } from "./storage";
import { initialState, rootReducer } from "./store";

hljs.registerLanguage("json", hljson);
hljs.registerLanguage("xml", hlxml);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
  preloadedState: { ...initialState, input: loadInputFromStorage() },
});

// Format initial input immediately
store.dispatch(formatInput());

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
