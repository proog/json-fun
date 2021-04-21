import { createReducer } from "@reduxjs/toolkit";
import { formatInput, setInput } from "./actions";
import { formatJsonError } from "./formatJsonError";
import XmlFormatter from "./XmlFormatter";

const xmlParser = new DOMParser();
const xmlFormatter = new XmlFormatter();

export const initialState = {
  input: "",
  formatted: "",
  hasError: false,
  language: "json",
};

export const rootReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setInput, (state, action) => {
      state.input = action.payload;
    })
    .addCase(formatInput, (state) => {
      const trimmed = state.input.trim();

      if (trimmed === "") {
        state.hasError = false;
        state.formatted = "";
        return;
      }

      if (trimmed.startsWith("<")) {
        state.language = "xml";
        formatXml(state);
      } else {
        state.language = "json";
        formatJson(state);
      }
    });
});

function formatJson(state) {
  try {
    const parsed = JSON.parse(state.input);

    state.hasError = false;
    state.formatted = JSON.stringify(parsed, null, "  ");
  } catch (e) {
    state.hasError = true;
    state.formatted = formatJsonError(e.toString(), state.input);
  }
}

function formatXml(state) {
  const parsed = xmlParser.parseFromString(state.input, "application/xml");

  if (parsed.getElementsByTagName("parsererror").length) {
    state.hasError = true;
    state.formatted = "Error parsing XML string :'(";
    return;
  }

  state.hasError = false;
  state.formatted = xmlFormatter.format(parsed);
}
