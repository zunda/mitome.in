import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    publicKeys: [], // for encryption
    privateKey: {}, // for decrpytion and clear sign
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
    },
    setPrivateKey: (state, payload) => {
      state.privateKey[payload.owner] = payload.key
    }
  }
});
