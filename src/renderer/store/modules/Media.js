import { getMediaItems, getSingleMedia, getSeason } from '@/api/TMDb'
import { getTorrentsFor } from '../../api/tvApi'
import { searchTorrents } from '../../api/thePirateBay'
import router from '../../router'

const state = {
  items: [],
  page: 1,
  current: null,
  season: null,
  torrents: {
    popcorn: null,
    tpb: null
  }
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
  }
}

const actions = {
  async fetch ({ state, commit, rootState }) {
    try {
      commit('Loader/toggle', null, { root: true })

      const data = await getMediaItems(rootState.route.meta.type, rootState.App.type.name, state.page)

      commit('ADD_ITEMS', data)

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

      try {
        const current = await getSingleMedia(rootState.route.meta.type, rootState.route.params.id)

        commit('SET_CURRENT', current)

        dispatch('getTorrents', current.imdbId)

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

  getSeason ({ state, commit, rootState }) {
    return new Promise(async resolve => {
      commit('Loader/toggle', null, { root: true })

      if (state.season && state.season.season_number === rootState.route.params.season) {
        commit('App/SET_TITLE', setTitle(state.current.title, `Season ${state.season.season_number}`), { root: true })

        commit('Loader/toggle', null, { root: true })

        resolve()

        return
      }

      commit('SET_SEASON', null)

      try {
        commit('SET_SEASON', await getSeason(rootState.route.params.id, rootState.route.params.season))

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

  getTorrents ({ state, commit, rootState }) {
    commit('RESET_TORRENTS')

    getTorrentsFor(rootState.route.meta.type, state.current.imdbId)
      .then(({ data }) => {
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
      })
      .catch(err => console.log(err))
  },

  searchTorrents ({ commit }, query) {
    return new Promise((resolve, reject) => {
      searchTorrents(query)
        .then(data => {
          commit('SET_TORRENTS', data)

          resolve(data)
        })
        .catch(err => {
          console.log(err)

          reject(err)
        })
    })
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
