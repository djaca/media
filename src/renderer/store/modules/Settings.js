const { app } = require('electron').remote

const state = {
  isDark: false,
  folderPath: ''
}

const getters = {
  folderPath: state => state.folderPath !== '' ? state.folderPath : `${app.getPath('downloads')}/Media`,

  subtitlesPath: (state, getters) => `${getters.folderPath}/subtitles`
}

const mutations = {
  SET_IS_DARK (state, payload) {
    state.isDark = payload
  },

  SET_FOLDER_PATH (state, payload) {
    state.folderPath = payload
  }
}

const actions = {
  save ({ commit }, { path, isDark }) {
    commit('SET_FOLDER_PATH', path)

    commit('SET_IS_DARK', isDark)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
