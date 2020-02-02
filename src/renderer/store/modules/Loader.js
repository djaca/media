const state = {
  show: false
}

const mutations = {
  toggle: state => (state.show = !state.show)
}

const actions = {
  //
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
