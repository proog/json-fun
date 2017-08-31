Vue.component('formatted-output', {
  template: '#formatted-output',
  props: {
    formatted: String,
    error: Boolean
  },
  computed: {
    highlighted: function () {
      if (this.error)
        return this.formatted;

      return hljs.highlight('json', this.formatted).value;
    }
  },
  methods: {
    copy: function () {
      let buffer = this.$refs.buffer;

      buffer.style.display = 'block';
      buffer.select();
      document.execCommand('copy');
      buffer.blur();
      buffer.style.display = 'none';
    }
  }
});
