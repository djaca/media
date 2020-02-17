import { search } from '@/api/TMDb'

const state = {
  items: null
}

const mutations = {
  SET_ITEMS (state, payload) {
    state.items = payload
  }
}

const actions = {
  async search ({ commit, rootState }, query) {
    try {
      commit('SET_ITEMS', search(rootState.App.currentMedia, query))
    } catch (err) {
      console.log(err)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
