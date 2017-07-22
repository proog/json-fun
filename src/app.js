let app = new Vue({
  el: '#formatter',
  data: {
    input: '',
    indent: 2,
    compact: true,
    error: false,
    formatter: 'native'
  },
  mounted: function () {
    this.$refs.input.focus();
  },
  computed: {
    formatted: function () {
      if (_.trim(this.input) === '') {
        this.error = false;
        return '';
      }

      try {
        let data = JSON.parse(this.input);
        this.error = false;
        return formatJson(data, this.formatter, this.indent, this.compact);
      }
      catch (e) {
        this.error = true;
        return makeParseError(_.toString(e), this.input);
      }
    }
  },
  methods: {
    copyOutput: function () {
      let buffer = this.$refs.copyBuffer;

      buffer.style.display = 'block';
      buffer.select();
      document.execCommand('copy');
      buffer.blur();
      buffer.style.display = 'none';
    }
  }
});

function formatJson(data, formatter, indent, compact) {
  return formatter === 'custom'
    ? new Formatter(indent, compact).format(data)
    : JSON.stringify(data, null, _.repeat(' ', indent));
}

function makeParseError(error, input) {
  let match = /SyntaxError: .* at position (\d+)/.exec(error);

  if (!match || match.length !== 2)
    return error;

  let position = _.parseInt(match[1])
    , lastNewline = input.lastIndexOf('\n', position - 1)
    , nextNewline = input.indexOf('\n', position)
    , start = Math.max(lastNewline > -1 ? lastNewline + 1 : 0, position - 20)
    , end = Math.min(nextNewline > -1 ? nextNewline : input.length, position + 20)
    , snippet = input.substring(start, end)
    , line = (input.substring(0, position).match(/\n/g) || []).length + 1
    , col = position - (lastNewline > -1 ? lastNewline : 0)
    , markerIndent = _.repeat(' ', position - start);

  return `${error}\n\n`
    + snippet + '\n'
    + markerIndent + '^\n'
    + markerIndent + `(line ${line}, col ${col})`;
}
