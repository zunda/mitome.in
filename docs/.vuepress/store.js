import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    keyPairs: {}, // genrated key pairs
    publicKeys: [], // for encryption
    privateKey: {}, // for decrpytion and clear sign
    inputText: {}
  },
  mutations: {
    setInputText: (state, payload) => {
      state.inputText[payload.section] = payload.text
    },
    setKeyPair: (state, payload) => {
      state.keyPairs[payload.owner] = payload.keyPair
    },
    setPublicKeys: (state, publicKeys) => {
      state.publicKeys = publicKeys
    },
    setPrivateKey: (state, payload) => {
      state.privateKey[payload.owner] = payload.key
    }
  }
});
