import Vue from 'vue'

const state = {
  title: '',
  sidebar: false,
  tempSidebar: false,
  settings: false,
  torrentDownloader: false,
  currentMedia: 'movie', // or tv
  mediaIcon: {
    tv: 'mdi-television',
    movie: 'mdi-movie-outline'
  },
  types: {
    tv: [
      {
        text: 'Popular',
        name: 'popular'
      },
      {
        text: 'On the Air',
        name: 'on_the_air'
      },
      {
        text: 'Top Rated',
        name: 'top_rated'
      }
    ],
    movie: [
      {
        text: 'Popular',
        name: 'popular'
      },
      {
        text: 'Now Playing',
        name: 'now_playing'
      },
      {
        text: 'Upcoming',
        name: 'upcoming'
      }
    ]
  },
  type: {
    text: 'Popular',
    name: 'popular'
  },
  sortRules: [
    {
      text: 'Title',
      by: 'title'
    },
    {
      text: 'Date added',
      by: 'added'
    },
    {
      text: 'Last Air Date',
      by: 'lastAirDate'
    }
  ],
  sortOrders: ['asc', 'desc'],
  sortRule: {
    text: 'Title',
    by: 'title',
    order: 'asc'
  }
}

const getters = {
  types: (state, getters, rootState) => state.types[rootState.route.meta.type],

  icon: state => state.mediaIcon[state.currentMedia]
}

const mutations = {
  SET_TITLE (state, val) {
    state.title = val
  },

  SET_SIDEBAR (state, val) {
    state.sidebar = val
  },

  TOGGLE_SIDEBAR (state) {
    state.sidebar = !state.sidebar
  },

  SET_TEMP_SIDEBAR (state, val) {
    state.tempSidebar = val
  },

  SET_SETTINGS (state, payload) {
    state.settings = payload
  },

  SET_SHOW_TORRENT (state, payload) {
    state.torrentDownloader = payload
  },

  SET_TYPES (state, payload) {
    state.types = payload
  },

  SET_TYPE (state, {mediaType, type}) {
    state.type = state.types[mediaType].find(t => t.name === type.name)
  },

  SET_MEDIA (state, payload) {
    state.currentMedia = payload
  },

  RESET_TYPE (state) {
    state.type = {
      text: 'Popular',
      name: 'popular'
    }
  },

  SET_SORT_RULE (state, index) {
    state.sortRule = state.sortRules[index]
  },

  SET_SORT_ORDER (state, order) {
    Vue.set(state.sortRule, 'order', state.sortOrders[order])
  }
}

const actions = {
  setType ({commit, rootState}, type) {
    return new Promise(resolve => {
      commit('SET_TYPE', {mediaType: rootState.route.meta.type, type})

      commit('Media/SET_ITEMS', [], {root: true})

      commit('Media/SET_PAGE', 1, {root: true})

      resolve()
    })
  },

  doSort ({ commit, state, rootState }, { by }) {
    if (by === rootState.App.sortRule.by) {
      commit('SET_SORT_ORDER', state.sortRule.order === state.sortOrders[0] ? 1 : 0)

      return
    }

    commit('SET_SORT_RULE', state.sortRules.findIndex(r => r.by === by))
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
