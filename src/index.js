import hljs from "highlight.js";
import hljson from "highlight.js/lib/languages/json";
import hlxml from "highlight.js/lib/languages/xml";
import Vue from "vue";
import App from "./App.vue";

hljs.registerLanguage("json", hljson);
hljs.registerLanguage("xml", hlxml);

new Vue({
  el: "#app",
  render: (h) => h(App),
});
