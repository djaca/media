const state = {
  snack: ''
}

const mutations = {
  setSnack (state, snack) {
    state.snack = snack
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
