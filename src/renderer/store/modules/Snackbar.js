const state = {
  snack: '',
  color: 'success'
}

const mutations = {
  setSnack (state, payload) {
    if (typeof payload === 'string') {
      state.snack = payload

      return
    }

    state.snack = payload.snack

    state.color = payload.color
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
