import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    keyPair: null
  },
  mutations: {
    setKeyPair: (state, keyPair) => {
      state.keyPair = keyPair
    },
  },
});
