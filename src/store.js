import Vue from "vue";
import Vuex from "vuex";
import { formatJsonError } from "./formatJsonError";
import XmlFormatter from "./XmlFormatter";

const xmlParser = new DOMParser();
const xmlFormatter = new XmlFormatter();

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    input: "",
    formatted: "",
    hasError: false,
    language: "json",
  },
  mutations: {
    formatInput(state, input) {
      state.input = input;

      const trimmed = input.trim();

      if (trimmed === "") {
        state.hasError = false;
        state.formatted = "";
        return;
      }

      if (trimmed.startsWith("<")) {
        state.language = "xml";
        formatXml(state, input);
      } else {
        state.language = "json";
        formatJson(state, input);
      }
    },
  },
});

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
