const state = {
  items: [],
  current: null
}

const getters = {
  torrent: state => id => state.items.find(i => i.id === id)
}

const mutations = {
  ADD_ITEM (state, payload) {
    state.items.push(payload)
  },

  REMOVE_ITEM (state, { id, season, episode }) {
    if (!episode) {
      state.items.splice(state.items.findIndex(i => i.id === id), 1)

      return
    }

    state.items.splice(state.items.findIndex(i => i.id === id && i.season === season && i.episode === episode), 1)
  },

  SET_CURRENT (state, payload) {
    state.current = payload
  },

  ADD_FILE_PATH (state, payload) {
    state.current.path = payload
  },

  close (state) {
    state.show = false
  }
}

const actions = {
  download ({ commit, rootState }, payload) {
    commit('SET_CURRENT', payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
