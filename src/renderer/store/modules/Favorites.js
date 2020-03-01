const state = {
  items: [],
  watch: []
}

const getters = {
  exists: (state, getters, rootState) =>
    rootState.Media.current
      ? state.items.some(i => i.id === rootState.Media.current.id)
      : false,

  isWatched: (state, getters, rootState) => episode => {
    let show = state.watch.find(s => s.id === rootState.route.params.id && s.season === rootState.route.params.season)

    return show ? show.episodes.includes(episode) : false
  },

  title: state => order =>
    order === 'asc'
      ? [...state.items].sort((a, b) => a.title.localeCompare(b.title))
      : [...state.items].sort((a, b) => b.title.localeCompare(a.title)),

  added: state => order =>
    order === 'asc'
      ? [...state.items].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
      : [...state.items].sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded)),

  lastAirDate: state => order =>
    order === 'asc'
      ? [...state.items].sort((a, b) => new Date(b.lastAirDate) - new Date(a.lastAirDate))
      : [...state.items].sort((a, b) => new Date(a.lastAirDate) - new Date(b.lastAirDate))
}

const mutations = {
  SET_MEDIA (state, media) {
    state.items.push(media)
  },

  REMOVE_MEDIA (state, id) {
    state.items.splice(state.items.findIndex(i => i.id === id), 1)
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

    let exists = state.items.some(i => i.id === id)

    if (exists) {
      commit('REMOVE_MEDIA', id)

      return
    }

    const media = {
      id,
      title: currentMedia.title,
      img: currentMedia.img,
      year: currentMedia.year,
      dateAdded: new Date(),
      lastAirDate: currentMedia.lastAirDate
    }

    commit('SET_MEDIA', media)
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
