const INDENT = 2;
const LF = '\n';

let app = new Vue({
  el: '#formatter',
  data: {
    input: '',
    formatted: '',
    live: true
  },
  watch: {
    input: function () {
      if (!this.live)
        return;
      this.format();
    },
    live: function (live) {
      if (!live)
        return;
      this.format();
    }
  },
  methods: {
    format: function () {
      if (this.input.trim() === '') {
        this.formatted = '';
        return;
      }

      try {
        let data = JSON.parse(this.input);
        this.formatted = format(data, 0);
      }
      catch (e) {
        this.formatted = `Parse error: ${e}`;
      }
    },
    copyOutput: function () {
      let copyBuffer = document.getElementById('copy-buffer');
      copyBuffer.select();
      document.execCommand('copy');
      copyBuffer.blur();
    }
  }
});
