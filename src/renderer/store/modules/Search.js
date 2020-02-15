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
  search ({ commit, rootState }, query) {
    search(rootState.App.currentMedia, query)
      .then(data => {
        commit('SET_ITEMS', data)
      })
      .catch(err => console.log(err))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
