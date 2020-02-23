import { ipcRenderer } from 'electron'

const state = {
  items: []
}

const getters = {
  subtitle: state => id => state.items.find(s => s.id === id)
}

const mutations = {
  ADD (state, payload) {
    state.items.push(payload)
  },

  REMOVE (state, index) {
    state.items.splice(index, 1)
  }
}

const actions = {
  remove ({ state, commit }, id) {
    return new Promise(resolve => {
      let index = state.items.findIndex(i => i.id === id)

      if (index !== -1) {
        commit('REMOVE', index)
      }

      resolve()
    })
  },

  download ({ commit, dispatch, getters, rootGetters }, {id, urlId}) {
    ipcRenderer.send('download-subtitle', { path: rootGetters['Settings/subtitlesPath'], id: urlId })

    ipcRenderer.once('subtitle-downloaded', (event, { path }) => {
      dispatch('remove', id)
        .then(() => {
          commit('ADD', { id, urlId, path })

          commit('Snackbar/setSnack', 'Subtitle downloaded successfully', {root: true})
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
