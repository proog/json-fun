import { FORMAT_INPUT, SET_INPUT } from "./actions";
import { formatJsonError } from "./formatJsonError";
import XmlFormatter from "./XmlFormatter";

const xmlParser = new DOMParser();
const xmlFormatter = new XmlFormatter();

const initialState = {
  input: "",
  formatted: "",
  hasError: false,
  language: "json",
};

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case SET_INPUT:
      state = { ...state, input: action.input };
      return state;
    case FORMAT_INPUT:
      state = { ...state };
      const trimmed = state.input.trim();

      if (trimmed === "") {
        state.hasError = false;
        state.formatted = "";
        return state;
      }

      if (trimmed.startsWith("<")) {
        state.language = "xml";
        formatXml(state, state.input);
      } else {
        state.language = "json";
        formatJson(state, state.input);
      }

      return state;
    default:
      return state;
  }
}

function formatJson(state, input) {
  try {
    const parsed = JSON.parse(input);

    state.hasError = false;
    state.formatted = JSON.stringify(parsed, null, "  ");
  } catch (e) {
    state.hasError = true;
    state.formatted = formatJsonError(e.toString(), input);
  }
}

function formatXml(state, input) {
  const parsed = xmlParser.parseFromString(input, "application/xml");

  if (parsed.getElementsByTagName("parsererror").length) {
    state.hasError = true;
    state.formatted = "Error parsing XML string :'(";
    return;
  }

  state.hasError = false;
  state.formatted = xmlFormatter.format(parsed);
}
