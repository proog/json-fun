<template>
  <div class="w-100 h-100 ph3">
    <div class="h-100 flex flex-wrap">
      <div class="w-100 w-third-ns h-100 flex flex-column pv3 pr1-ns">
        <textarea
          class="w-100 h-100 ba b--gray br2 pa2 code f6 obsidian-gray bg-obsidian-dark-gray"
          :class="{ 'b--red': hasError }"
          placeholder="json or xml here"
          v-model="input"
          ref="input"
        ></textarea>
        <div class="mt2 tc">{{ input.length }} characters</div>
      </div>
      <div class="w-100 w-two-thirds-ns h-100 pv3 pl1-ns">
        <transition mode="out-in">
          <formatted-output
            v-if="formatted"
            :formatted="formatted"
            :language="language"
            :error="hasError"
          ></formatted-output>
          <json-info v-else></json-info>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import FormattedOutput from "./FormattedOutput.vue";
import JsonInfo from "./JsonInfo.vue";
import Formatter from "./formatter";
import XmlFormatter from "./xmlformatter";

const xmlParser = new DOMParser();
const xmlFormatter = new XmlFormatter();

export default {
  data() {
    return {
      input: "",
      hasError: false,
      indent: 2,
      formatter: "native",
      compact: true,
      tab: "formatted",
      language: "json",
    };
  },
  computed: {
    formatted() {
      const trimmed = _.trim(this.input);

      if (trimmed === "") {
        this.hasError = false;
        return "";
      }

      return _.startsWith(trimmed, "<")
        ? this.xml(trimmed)
        : this.json(trimmed);
    },
  },
  methods: {
    json(input) {
      try {
        const parsed = JSON.parse(input);

        this.hasError = false;
        this.language = "json";
        return formatJson(parsed, this.formatter, this.indent, this.compact);
      } catch (e) {
        this.hasError = true;
        return formatError(_.toString(e), input);
      }
    },
    xml(input) {
      const parsed = xmlParser.parseFromString(input, "application/xml");

      if (parsed.getElementsByTagName("parsererror").length) {
        this.hasError = true;
        return "Error parsing XML string :'(";
      }

      this.hasError = false;
      this.language = "xml";
      return xmlFormatter.format(parsed);
    },
    selectTab(name) {
      this.tab = name;
    },
  },
  mounted() {
    this.$refs.input.focus();
  },
  components: {
    "json-info": JsonInfo,
    "formatted-output": FormattedOutput,
  },
};

function formatJson(data, formatter, indent, compact) {
  return formatter === "custom"
    ? new Formatter(indent, compact).format(data)
    : JSON.stringify(data, null, _.repeat(" ", indent));
}

function formatError(error, input) {
  let match = /SyntaxError: [\s\S]* at position (\d+)/.exec(error); // \s\S = dot + newline

  if (!match || match.length !== 2) return error;

  let position = _.parseInt(match[1]),
    lastNewline = input.lastIndexOf("\n", position - 1),
    nextNewline = input.indexOf("\n", position),
    start = Math.max(lastNewline > -1 ? lastNewline + 1 : 0, position - 20),
    end = Math.min(
      nextNewline > -1 ? nextNewline : input.length,
      position + 20
    ),
    snippet = input.substring(start, end),
    line = (input.substring(0, position).match(/\n/g) || []).length + 1,
    col = position - (lastNewline > -1 ? lastNewline : 0),
    markerIndent = _.repeat(" ", position - start);

  return (
    `${error}\n\n` +
    `${snippet}\n` +
    `${markerIndent}^\n` +
    `${markerIndent}(line ${line}, col ${col})`
  );
}
</script>
