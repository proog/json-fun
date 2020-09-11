<template>
  <div class="h-100 flex flex-column">
    <div class="h-100 ba b--gray br2 overflow-auto">
      <pre
        class="h-100 ma0 f6 lh-copy"
        ref="buffer"
      ><code v-if="error" class="h-100 hljs">{{ highlighted }}</code><code v-else class="h-100 hljs" v-html="highlighted"></code></pre>
    </div>
    <div class="mt2 tc">
      <a
        class="link underline-hover obsidian-orange pointer"
        href=""
        @click.prevent="copy"
      >
        {{ notification }} {{ formatted.length }} characters
      </a>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import hljs from "highlight.js";

export default {
  template: "#formatted-output",
  props: {
    formatted: String,
    language: String,
    error: Boolean,
  },
  data() {
    return {
      notification: "Copy",
    };
  },
  computed: {
    highlighted() {
      if (this.error) return this.formatted;

      return hljs.highlight(this.language, this.formatted).value;
    },
  },
  methods: {
    copy() {
      const selection = window.getSelection();
      selection.selectAllChildren(this.$refs.buffer);
      document.execCommand("copy");
      selection.removeAllRanges();

      this.notification = "Copied";
      _.delay(() => {
        this.notification = "Copy";
      }, 1500);
    },
  },
};
</script>
