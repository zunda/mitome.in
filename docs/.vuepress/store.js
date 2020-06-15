import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    keyPairs: {}
  },
  mutations: {
    setKeyPair: (state, payload) => {
      state.keyPairs[payload.owner] = payload.keyPair
    },
  },
});
