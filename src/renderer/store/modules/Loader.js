const state = {
  show: false
}

const mutations = {
  toggle: state => (state.show = !state.show)
}

export default {
  namespaced: true,
  state,
  mutations
}
