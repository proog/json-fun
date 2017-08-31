Vue.component('formatted-output', {
  template: '#formatted-output',
  props: {
    formatted: String,
    error: Boolean
  },
  data: function () {
    return { notification: 'click to copy' };
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

      this.notification = 'copied!';
      _.delay(() => {
        this.notification = 'click to copy';
      }, 1500);
    }
  }
});
