<template>
  <div class="h-full flex flex-col">
    <div class="h-full border border-gray-800 overflow-auto">
      <pre
        class="h-full m-0 text-sm"
        ref="buffer"
      ><code v-if="error" class="h-full hljs">{{ highlighted }}</code><code v-else class="h-full hljs" v-html="highlighted"></code></pre>
    </div>
    <div class="mt-2 text-center">
      <a
        class="focus:outline-none hover:underline obsidian-orange cursor-pointer"
        href=""
        @click.prevent="copy"
      >
        {{ notification }} {{ formatted.length }} characters
      </a>
    </div>
  </div>
</template>

<script>
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
      setTimeout(() => {
        this.notification = "Copy";
      }, 1500);
    },
  },
};
</script>
