import _ from 'lodash'
import hljs from 'highlight.js/lib/highlight.js'

export default {
  template: '#formatted-output',
  props: {
    formatted: String,
    error: Boolean
  },
  data() {
    return {
      notification: 'Copy'
    }
  },
  computed: {
    highlighted() {
      if (this.error)
        return this.formatted

      return hljs.highlight('json', this.formatted).value
    }
  },
  methods: {
    copy() {
      window.getSelection().selectAllChildren(this.$refs.buffer)
      document.execCommand('copy')

      this.notification = 'Copied'
      _.delay(() => {
        this.notification = 'Copy'
      }, 1500)
    }
  }
}
