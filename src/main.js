import hljs from "highlight.js/lib/core";
import hljson from "highlight.js/lib/languages/json";
import hlxml from "highlight.js/lib/languages/xml";
import Vue from "vue";
import "./assets/style.css";
import App from "./components/App.vue";
import store from "./store";

hljs.registerLanguage("json", hljson);
hljs.registerLanguage("xml", hlxml);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  store,
}).$mount("#app");
