const state = {
  items: {
    movie: [], // id, backdrop_path, title
    tv: []
  },
  watch: []
}

const getters = {
  exists: (state, getters, rootState) => state.items[rootState.App.currentMedia].some(i => i.id === rootState.Media.current.id),

  movies: state => state.items.movie,

  shows: state => state.items.tv,

  isWatched: (state, getters, rootState) => episode => {
    let show = state.watch.find(s => s.id === rootState.route.params.id && s.season === rootState.route.params.season)

    return show ? show.episodes.includes(episode) : false
  }
}

const mutations = {
  SET_MEDIA (state, { media, mediaType }) {
    state.items[mediaType].push(media)
  },

  REMOVE_MEDIA (state, { id, mediaType }) {
    state.items[mediaType].splice(state.items[mediaType].find(i => i.id === id), 1)
  },

  WATCH (state, { index, id, season, episode }) {
    typeof index !== 'undefined'
      ? state.watch[index].episodes.push(episode)
      : state.watch.push({
        id,
        season,
        episodes: [episode]
      })
  },

  UNWATCH (state, { index, episode }) {
    state.watch[index].episodes.splice(state.watch[index].episodes.findIndex(e => e === episode), 1)
  }
}

const actions = {
  toggleAddRemove ({ commit, state, rootState }) {
    let currentMedia = rootState.Media.current

    let id = currentMedia.id

    let mediaType = rootState.App.currentMedia

    let exists = state.items[mediaType].some(i => i.id === id)

    if (exists) {
      commit('REMOVE_MEDIA', { id, mediaType })

      return
    }

    const media = {
      id,
      title: currentMedia.title,
      img: currentMedia.img
    }

    commit('SET_MEDIA', { media, mediaType })
  },

  toggleWatchUnwatch ({ commit, state, rootState }, episode) {
    let id = rootState.route.params.id
    let season = rootState.route.params.season

    let index = state.watch.findIndex(s => s.season === season && s.id === id)

    index !== -1
      ? commit(state.watch[index].episodes.includes(episode) ? 'UNWATCH' : 'WATCH', { index, episode })
      : commit('WATCH', { id, season, episode })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
