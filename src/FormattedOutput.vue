<template>
<div class="h-100 d-flex flex-column">
  <div class="card h-100">
    <div class="card-body h-100 relative">
      <pre class="h-100 monospace" ref="buffer"><code v-if="error">{{ highlighted }}</code><code v-else v-html="highlighted"></code></pre>
    </div>
  </div>
  <div class="mt-2 text-center">
    <a class="pointer" href="" @click.prevent="copy">
      {{ notification }} {{ formatted.length }} characters
    </a>
  </div>
</div>
</template>

<script>
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
</script>