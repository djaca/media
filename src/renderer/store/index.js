import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import ElectronStore from 'electron-store'

import modules from './modules'

const store = new ElectronStore()

const opt = {
  storage: {
    getItem: key => store.get(key),
    setItem: (key, value) => store.set(key, value),
    removeItem: key => store.delete(key)
  },
  reducer: (state) => ({Favorites: state.Favorites, Settings: state.Settings})
}

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  plugins: [createPersistedState(opt)],
  strict: process.env.NODE_ENV !== 'production'
})
