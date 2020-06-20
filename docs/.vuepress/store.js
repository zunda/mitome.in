import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    publicKeys: [], // for encryption
    inputText: {},
    outputText: {}
  },
  mutations: {
    setInputText: (state, payload) => {
      state.inputText[payload.section] = payload.text
    },
    setOutputText: (state, payload) => {
      state.outputText[payload.section] = payload.text
    },
    setPublicKeys: (state, publicKeys) => {
      state.publicKeys = publicKeys
    }
  }
});
