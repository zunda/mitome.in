<template>
  <div>
    <p>
      <input v-model="name" placeholder="ユーザーID">
      <input v-model="email" class="email" placeholder="電子メールアドレス">
      の鍵対を
      <button v-bind:disabled="processing" v-on:click="generateKey">
        生成する
      </button>
      <button v-bind:disabled="processing" v-on:click="clearKey">
        消す
      </button>
    </p>
    <p>公開鍵
      <button @click="copyPublicKey" title="公開鍵をクリップボードにコピーする">
        <Fa-Copy />
      </button>
      <br>
      <textarea v-model="publicKey" class="key" spellcheck="false" readonly />
    </p>
    <p>私有鍵
      <button @click="copyPrivateKey" title="私有鍵をクリップボードにコピーする">
        <Fa-Copy />
      </button>
      <textarea v-model="privateKey" class="key" spellcheck="false" readonly />
    </p>
  </div>
</template>

<script>
import Vue from 'vue'

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'
Vue.use(VueToast)

const OpenPgp = require('openpgp')

export default {
  props: {
    owner: String,
    defaultName: String,
    defaultEmail: String
  },
  data() {
    return {
      name: "",
      email: "",
      publicKey: "",
      privateKey: "",
      processing: false
    }
  },
  methods: {
    generateKey: function () {
      this.processing = true
      OpenPgp.generateKey({
        userIds: [{name: this.name, email: this.email}],
        rsaBits: 2048
      }).then((key) => {
        this.publicKey = key.publicKeyArmored
        this.privateKey = key.privateKeyArmored
        this.commitKey()
      }).catch((e) => {
        console.log(e)
        Vue.$toast.open({message: e.message, type: 'error'})
      }).finally(() => {
        this.processing = false
      })
    },
    clearKey: function() {
      this.publicKey = ""
      this.privateKey = ""
      this.commitKey()
    },
    commitKey: function() {
      this.$store.commit('setKeyPair', {
        owner: this.owner,
        keyPair: {
          name: this.name,
          email: this.email,
          privateKey: this.privateKey,
          publicKey: this.publicKey
        }
      })
    },
    copyPublicKey: function() {
      if (this.publicKey === "") {
        Vue.$toast.open({message: '鍵対はまだ生成されていません', type: 'warning'})
        return
      }
      this.$copyText(this.publicKey).then(() => {
        Vue.$toast.open({message: '公開鍵をコピーしました', type: 'info'})
      }).catch((e) => {
        console.log(e)
        Vue.$toast.open({message: e, type: 'error'})
      })
    },
    copyPrivateKey: function() {
      if (this.publicKey === "") {
        Vue.$toast.open({message: '鍵対はまだ生成されていません', type: 'warning'})
        return
      }
      this.$copyText(this.privateKey).then(() => {
        Vue.$toast.open({message: '私有鍵をコピーしました', type: 'info'})
      }).catch((e) => {
        Vue.$toast.open({message: e, type: 'error'})
      })
    }
  },
  mounted() {
    const storedKeyPair = this.$store.state.keyPairs[this.owner]
    if (storedKeyPair !== undefined) {
      this.name = storedKeyPair.name
      this.email = storedKeyPair.email
      this.privateKey = storedKeyPair.privateKey
      this.publicKey = storedKeyPair.publicKey
    } else {
      this.name = this.defaultName
      this.email = this.defaultEmail
    }
  }
}
</script>
