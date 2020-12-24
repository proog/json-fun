<template>
  <div>
    <textarea
      class="w-full h-full border border-gray-800 p-2 font-mono text-xs leading-tight obsidian-gray bg-obsidian-dark-gray resize-none"
      :class="{ 'border-red-800': hasError }"
      placeholder="json or xml here"
      @input="formatInput"
      ref="input"
    ></textarea>
    <div class="mt-2 text-center">{{ input.length }} characters</div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: mapState(["input", "hasError"]),
  methods: {
    formatInput(event) {
      this.$store.commit("formatInput", event.target.value);
    },
  },
  mounted() {
    this.$refs.input.focus();
  },
};
</script>
