import Vue from 'vue/dist/vue.esm.js'
import _ from 'lodash'
import hljs from 'highlight.js/lib/highlight.js'
import hljson from 'highlight.js/lib/languages/json.js'

hljs.registerLanguage('json', hljson)

Vue.component('formatted-output', {
  template: '#formatted-output',
  props: {
    formatted: String,
    error: Boolean
  },
  data() {
    return {
      showNotification: false,
      notification: 'click to copy'
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
      let buffer = this.$refs.buffer

      buffer.style.display = 'block'
      buffer.select()
      document.execCommand('copy')
      buffer.blur()
      buffer.style.display = 'none'

      this.notification = 'copied!'
      _.delay(() => {
        this.notification = 'click to copy'
      }, 1500)
    }
  }
})
