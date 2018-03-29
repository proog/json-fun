import Vue from 'vue'
import hljs from 'highlight.js/lib/highlight.js'
import hljson from 'highlight.js/lib/languages/json.js'
import App from './App.vue'

hljs.registerLanguage('json', hljson)

new Vue({
  el: '#app',
  render: h => h(App)
})