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
  if (this.input.trim() === '') {
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
    this.formatted = makeParseError(e.toString(), this.input);
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
  let match = / at position (\d+)/.exec(error);

  if (!match || match.length !== 2)
    return error;

  let position = parseInt(match[1])
    , start = Math.max(0, position - 10)
    , snippet = input.substr(start, 20)
    , marker = _.repeat(' ', position - start) + '^';

  return error + '\n\n'
    + snippet + '\n'
    + (_.includes(snippet, '\n') ? '' : marker);
}
