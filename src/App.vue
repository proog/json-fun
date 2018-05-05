<template>
<div class="container-fluid h-100">
  <div class="row h-100">
    <div class="col-md-4 col-12 py-3 pr-md-2 h-100 d-flex flex-column">
      <textarea class="form-control monospace h-100"
                :class="{ 'is-invalid': hasError }"
                placeholder="json or xml here"
                v-model="input"
                ref="input"></textarea>
      <div class="mt-2 text-center">
        {{ input.length }} characters
      </div>
    </div>
    <div class="col-md-8 col-12 py-3 pl-md-2 h-100">
      <transition mode="out-in">
        <formatted-output v-if="formatted" :formatted="formatted" :language="language" :error="hasError"></formatted-output>
        <json-info v-else></json-info>
      </transition>
    </div>
  </div>
</div>
</template>

<script>
import _ from 'lodash'
import FormattedOutput from './FormattedOutput.vue'
import JsonInfo from './JsonInfo.vue'
import Formatter from './formatter'
import XmlFormatter from './xmlformatter'

const xmlParser = new DOMParser()
const xmlFormatter = new XmlFormatter()

export default {
  data() {
    return {
      input: '',
      hasError: false,
      indent: 2,
      formatter: 'native',
      compact: true,
      tab: 'formatted',
      language: 'json'
    }
  },
  computed: {
    formatted() {
      const trimmed = _.trim(this.input)

      if (trimmed === '') {
        this.hasError = false
        return ''
      }

      return _.startsWith(trimmed, '<')
        ? this.xml(trimmed)
        : this.json(trimmed)
    }
  },
  methods: {
    json(input) {
      try {
        const parsed = JSON.parse(input)

        this.hasError = false
        this.language = 'json'
        return formatJson(parsed, this.formatter, this.indent, this.compact)
      }
      catch (e) {
        this.hasError = true
        return formatError(_.toString(e), input)
      }
    },
    xml(input) {
      const parsed = xmlParser.parseFromString(input, 'application/xml')

      if (parsed.getElementsByTagName('parsererror').length) {
        this.hasError = true
        return 'Error parsing XML string :\'('
      }

      this.hasError = false
      this.language = 'xml'
      return xmlFormatter.format(parsed)
    },
    selectTab(name) {
      this.tab = name
    }
  },
  mounted() {
    this.$refs.input.focus()
  },
  components: {
    'json-info': JsonInfo,
    'formatted-output': FormattedOutput
  }
}

function formatJson(data, formatter, indent, compact) {
  return formatter === 'custom'
    ? new Formatter(indent, compact).format(data)
    : JSON.stringify(data, null, _.repeat(' ', indent))
}

function formatError(error, input) {
  let match = /SyntaxError: [\s\S]* at position (\d+)/.exec(error) // \s\S = dot + newline

  if (!match || match.length !== 2)
    return error

  let position = _.parseInt(match[1])
    , lastNewline = input.lastIndexOf('\n', position - 1)
    , nextNewline = input.indexOf('\n', position)
    , start = Math.max(lastNewline > -1 ? lastNewline + 1 : 0, position - 20)
    , end = Math.min(nextNewline > -1 ? nextNewline : input.length, position + 20)
    , snippet = input.substring(start, end)
    , line = (input.substring(0, position).match(/\n/g) || []).length + 1
    , col = position - (lastNewline > -1 ? lastNewline : 0)
    , markerIndent = _.repeat(' ', position - start)

  return `${error}\n\n`
    + `${snippet}\n`
    + `${markerIndent}^\n`
    + `${markerIndent}(line ${line}, col ${col})`
}
</script>