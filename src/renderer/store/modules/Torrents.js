const state = {
  items: [],
  current: null,
  isDownloading: false
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

  SET_IS_DOWNLOADING (state, payload) {
    state.isDownloading = payload
  }
}

const actions = {
  download ({ commit, state, rootState }, payload) {
    if (state.isDownloading) {
      commit('Torrents/REMOVE_ITEM', rootState.Torrents.current.id, { root: true })

      commit('SET_CURRENT', null)

      commit('SET_IS_DOWNLOADING', false)
    }

    setTimeout(() => {
      commit('SET_CURRENT', payload)

      commit('SET_IS_DOWNLOADING', true)
    }, 300)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
