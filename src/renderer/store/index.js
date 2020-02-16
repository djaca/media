import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import modules from './modules'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state) => ({Favorites: state.Favorites, Settings: state.Settings})
})

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  plugins: [vuexLocal.plugin],
  strict: process.env.NODE_ENV !== 'production'
})
