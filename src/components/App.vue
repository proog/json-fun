<template>
  <div class="w-full h-full px-4">
    <div class="h-full flex flex-wrap">
      <InputForm class="w-full h-full flex flex-col py-4 md:w-1/3 md:pr-2" />
      <div class="w-full h-full py-4 md:w-2/3 md:pl-2">
        <transition mode="out-in">
          <FormattedOutput v-if="formatted" />
          <JsonInfo v-else />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import FormattedOutput from "./FormattedOutput.vue";
import InputForm from "./InputForm.vue";
import JsonInfo from "./JsonInfo.vue";

export default {
  computed: mapState(["formatted"]),
  components: {
    JsonInfo,
    FormattedOutput,
    InputForm,
  },
};
</script>
