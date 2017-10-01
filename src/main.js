/* Imports */
import Vue from 'vue'
import VueFire from 'vuefire'
import Lodash from 'lodash'
import List from './components/List.vue'

/* Use */
Vue.use(VueFire)
Vue.use(Lodash)

/* Redenring container */
new Vue({
  el: '#app',
  render: h => h(List)
})
