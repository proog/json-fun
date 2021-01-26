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
    case "formatInput":
      state = { ...state, input: action.input };

      const trimmed = action.input.trim();

      if (trimmed === "") {
        state.hasError = false;
        state.formatted = "";
        return state;
      }

      if (trimmed.startsWith("<")) {
        state.language = "xml";
        formatXml(state, action.input);
      } else {
        state.language = "json";
        formatJson(state, action.input);
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
