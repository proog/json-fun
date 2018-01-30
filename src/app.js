import Vue from 'vue/dist/vue.esm.js'
import _ from 'lodash'
import './formatted-output'
import './formatter'

let app = new Vue({
  el: '#json-formatter',
  data: {
    input: '',
    parsed: undefined,
    hasError: false,
    indent: 2,
    formatter: 'native',
    compact: true,
    tab: 'formatted'
  },
  computed: {
    formatted() {
      if (_.trim(this.input) === '') {
        this.parsed = undefined
        this.hasError = false
        return ''
      }

      try {
        this.parsed = JSON.parse(this.input)
        this.hasError = false
        return formatJson(this.parsed, this.formatter, this.indent, this.compact)
      }
      catch (e) {
        this.parsed = undefined
        this.hasError = true
        return formatError(_.toString(e), this.input)
      }
    }
  },
  methods: {
    selectTab(name) {
      this.tab = name
    }
  },
  mounted() {
    this.$refs.input.focus()
  }
})

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
