import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import vuetify from '@/plugins/vuetify'

import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

import { sync } from 'vuex-router-sync'

import VueYoutube from 'vue-youtube'

Vue.use(VueYoutube)

sync(store, router)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  vuetify,
  template: '<App/>'
}).$mount('#app')
