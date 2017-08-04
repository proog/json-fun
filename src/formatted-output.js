Vue.component('formatted-output', {
  template: '#formatted-output',
  props: {
    formatted: String
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
