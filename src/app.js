let app = new Vue({
  el: '#formatter',
  data: {
    input: '',
    formatted: '',
    indent: 2,
    live: true,
    compact: true,
    error: false,
    formatter: 'native'
  },
  watch: {
    input: watcher,
    indent: watcher,
    live: watcher,
    compact: watcher,
    formatter: watcher
  },
  methods: {
    format: format,
    copyOutput: copyOutput
  }
});

function watcher() {
  if (this.live)
    this.format();
}

function format() {
  if (_.trim(this.input) === '') {
    this.formatted = '';
    this.error = false;
    return;
  }

  try {
    let data = JSON.parse(this.input);
    this.formatted = this.formatter === 'custom'
      ? formatCustom(data, this.indent, this.compact)
      : formatNative(data, this.indent);
    this.error = false;
  }
  catch (e) {
    this.formatted = makeParseError(_.toString(e), this.input);
    this.error = true;
  }
}

function formatNative(data, indent) {
  return JSON.stringify(data, null, _.repeat(' ', indent));
}

function formatCustom(data, indent, compact) {
  return new Formatter(indent, compact).format(data);
}

function copyOutput() {
  let copyBuffer = document.getElementById('copy-buffer');

  copyBuffer.style.display = 'block';
  copyBuffer.select();
  document.execCommand('copy');
  copyBuffer.blur();
  copyBuffer.style.display = 'none';
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
    , col = position - (lastNewline > -1 ? lastNewline : 0) + 1
    , markerIndent = _.repeat(' ', position - start);

  return `${error}\n\n`
    + snippet + '\n'
    + markerIndent + '^\n'
    + markerIndent + `(line ${line}, col ${col})`;
}
