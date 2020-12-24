<template>
  <div class="w-full h-full px-4">
    <div class="h-full flex flex-wrap">
      <div class="w-full h-full flex flex-col py-4 md:w-1/3 md:pr-2">
        <textarea
          class="w-full h-full border border-gray-800 p-2 font-mono text-xs leading-tight obsidian-gray bg-obsidian-dark-gray resize-none"
          :class="{ 'border-red-800': hasError }"
          placeholder="json or xml here"
          v-model="input"
          ref="input"
        ></textarea>
        <div class="mt-2 text-center">{{ input.length }} characters</div>
      </div>
      <div class="w-full h-full py-4 md:w-2/3 md:pl-2">
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
import FormattedOutput from "./FormattedOutput.vue";
import JsonInfo from "./JsonInfo.vue";
import XmlFormatter from "../xmlformatter";

const xmlParser = new DOMParser();
const xmlFormatter = new XmlFormatter();

export default {
  data() {
    return {
      input: "",
      hasError: false,
      indent: 2,
      compact: true,
      tab: "formatted",
      language: "json",
    };
  },
  computed: {
    formatted() {
      const trimmed = this.input.trim();

      if (trimmed === "") {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.hasError = false;
        return "";
      }

      return trimmed.startsWith("<") ? this.xml(trimmed) : this.json(trimmed);
    },
  },
  methods: {
    json(input) {
      try {
        const parsed = JSON.parse(input);

        this.hasError = false;
        this.language = "json";
        return formatJson(parsed, this.indent);
      } catch (e) {
        this.hasError = true;
        return formatError(e.toString(), input);
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

function formatJson(data, indent) {
  return JSON.stringify(data, null, " ".repeat(indent));
}

function formatError(error, input) {
  let match = /SyntaxError: [\s\S]* at position (\d+)/.exec(error); // \s\S = dot + newline

  if (!match || match.length !== 2) return error;

  let position = parseInt(match[1], 10),
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
    markerIndent = " ".repeat(position - start);

  return (
    `${error}\n\n` +
    `${snippet}\n` +
    `${markerIndent}^\n` +
    `${markerIndent}(line ${line}, col ${col})`
  );
}
</script>
