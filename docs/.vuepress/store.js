import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    keyPairs: {},
    publicKeys: []
  },
  mutations: {
    setKeyPair: (state, payload) => {
      state.keyPairs[payload.owner] = payload.keyPair
    },
    setPublicKeys: (state, publicKeys) => {
      state.publicKeys = publicKeys
    }
  },
});
