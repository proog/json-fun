let app = new Vue({
  el: '#formatter',
  data: {
    input: '',
    formatted: '',
    indent: 2,
    live: true,
    compact: true
  },
  watch: {
    input: watcher,
    indent: watcher,
    live: watcher,
    compact: watcher
  },
  methods: {
    format: function () {
      if (this.input.trim() === '') {
        this.formatted = '';
        return;
      }

      try {
        let data = JSON.parse(this.input)
          , formatter = new Formatter(this.indent, this.compact);
        this.formatted = formatter.format(data);
      }
      catch (e) {
        this.formatted = makeParseError(e, this.input);
      }
    },
    copyOutput: function () {
      let copyBuffer = document.getElementById('copy-buffer');

      copyBuffer.style.display = 'block';
      copyBuffer.select();
      document.execCommand('copy');
      copyBuffer.blur();
      copyBuffer.style.display = 'none';
    }
  }
});

function watcher() {
  if (this.live)
    this.format();
}

function makeParseError(error, input) {
  let match = / at position (\d+)/.exec(error);

  if (!match || match.length !== 2)
    return `Parse error: ${error}`;

  let position = parseInt(match[1])
    , start = Math.max(0, position - 10)
    , snippet = input.substr(start, 20);

  return 'Something wasn\'t valid around here\n'
    + `  ${snippet}\n\n`
    + 'The error was\n'
    + `  ${error}`;
}
