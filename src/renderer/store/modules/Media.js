import { getMediaItems, getSingleMedia, getSeason } from '@/api/TMDb'
import { getTorrentsFor } from '@/api/tvApi'
import { searchTitlovi } from '@/api/titlovi'
import router from '@/router'

const state = {
  items: [],
  page: 1,
  current: null,
  season: null,
  torrents: {
    popcorn: null,
    tpb: null
  },
  subtitles: null
}

const getters = {
  torrents: (state, getters, rootState) => {
    if (state.torrents.popcorn && rootState.App.currentMedia === 'tv') {
      return {
        popcorn: state.torrents.popcorn[rootState.route.params.season],
        tpb: state.torrents.tpb
      }
    }

    return state.torrents
  },

  subtitles: (state, getters, rootState) => (episode = null) => {
    if (rootState.App.currentMedia === 'tv') {
      return state.subtitles.filter(s => s.episode === episode)
    }

    return state.subtitles
  }
}

const mutations = {
  SET_ITEMS (state, payload) {
    state.items = payload
  },

  ADD_ITEMS (state, payload) {
    state.items = state.items.concat(payload)
  },

  INCREMENT_PAGE (state) {
    state.page++
  },

  SET_PAGE (state, payload) {
    state.page = payload
  },

  SET_CURRENT (state, payload) {
    state.current = payload
  },

  SET_SEASON (state, payload) {
    state.season = payload
  },

  SET_TORRENTS (state, payload) {
    if (payload instanceof Array) {
      state.torrents.tpb = payload

      return
    }

    state.torrents.popcorn = payload
  },

  RESET_TORRENTS (state) {
    state.torrents = {
      popcorn: null,
      tpb: null
    }
  },

  SET_SUBTITLES (state, payload) {
    state.subtitles = payload
  }
}

const actions = {
  async fetch ({ state, commit, rootState }) {
    try {
      commit('Loader/toggle', null, { root: true })

      commit('ADD_ITEMS', await getMediaItems(rootState.route.meta.type, rootState.App.type.name, state.page))

      commit('INCREMENT_PAGE')

      commit('App/SET_MEDIA', rootState.route.meta.type, { root: true })

      commit('App/SET_TITLE', `${rootState.App.type.text}`, { root: true })

      commit('Loader/toggle', null, { root: true })
    } catch (e) {
      console.log(e)

      commit('Loader/toggle', null, { root: true })
    }
  },

  async get ({ commit, dispatch }) {
    commit('SET_ITEMS', [])

    commit('SET_PAGE', 1)

    dispatch('fetch')
  },

  getCurrent ({ commit, state, dispatch, rootState }) {
    return new Promise(async resolve => {
      commit('Loader/toggle', null, { root: true })

      if (state.current && state.current.id === rootState.route.params.id) {
        commit('App/SET_TITLE', setTitle(state.current.title), { root: true })

        commit('Loader/toggle', null, { root: true })

        resolve()

        return
      }

      commit('SET_CURRENT', null)

      commit('SET_TORRENTS', null)

      commit('SET_SUBTITLES', null)

      try {
        const current = await getSingleMedia(rootState.route.meta.type, rootState.route.params.id)

        commit('SET_CURRENT', current)

        dispatch('getTorrents', current.imdbId)

        if (rootState.route.meta.type === 'movie') {
          dispatch('getSubtitles')
        }

        commit('App/SET_MEDIA', rootState.route.meta.type, { root: true })

        commit('App/SET_TITLE', setTitle(current.title), { root: true })

        commit('Loader/toggle', null, { root: true })

        resolve()
      } catch (e) {
        console.log(e)

        commit('Loader/toggle', null, { root: true })

        router.push({ name: 'home' })
      }
    })
  },

  getSeason ({ state, commit, dispatch, rootState }) {
    return new Promise(async resolve => {
      commit('Loader/toggle', null, { root: true })

      if (state.season && state.season.season_number === rootState.route.params.season) {
        commit('App/SET_TITLE', setTitle(state.current.title, `Season ${state.season.season_number}`), { root: true })

        commit('Loader/toggle', null, { root: true })

        resolve()

        return
      }

      commit('SET_SEASON', null)

      commit('SET_SUBTITLES', null)

      try {
        commit('SET_SEASON', await getSeason(rootState.route.params.id, rootState.route.params.season))

        dispatch('getSubtitles')

        commit('App/SET_TITLE', setTitle(state.current.title, `Season ${state.season.season_number}`), { root: true })

        commit('Loader/toggle', null, { root: true })

        resolve()
      } catch (e) {
        console.log(e)

        commit('Loader/toggle', null, { root: true })

        router.push({ name: 'home' })
      }
    })
  },

  async getTorrents ({ state, commit, rootState }) {
    commit('RESET_TORRENTS')

    try {
      const { data } = await getTorrentsFor(rootState.route.meta.type, state.current.imdbId)

      if (data) {
        let torrents = {}

        if (rootState.route.meta.type === 'tv') {
          data.episodes
            .map(({ season, episode, torrents }) => ({ season, episode, torrents }))
            .forEach(torrent => {
              if (torrents.hasOwnProperty(torrent.season)) {
                torrents[torrent.season][torrent.episode] = torrent
              } else {
                torrents[torrent.season] = {}
                torrents[torrent.season][torrent.episode] = torrent
              }
            })
        } else {
          torrents = data.torrents.en
        }

        commit('SET_TORRENTS', torrents)
      }
    } catch (err) {
      console.log(err)
    }
  },

  async getSubtitles ({ commit, state, rootState }) {
    try {
      const data = await searchTitlovi({ imdbId: state.current.imdbId, season: rootState.route.params.season })

      commit('SET_SUBTITLES', data)
    } catch (err) {
      console.log(err)
    }
  }
}

function setTitle (title, subtitle = '') {
  return `${title} <span class="body-2">${subtitle}</span>`
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
