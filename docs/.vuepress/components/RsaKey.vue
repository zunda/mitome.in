<template>
  <div>
    <p>
      <input v-model="name" placeholder="ユーザーID">
      <input v-model="email" placeholder="電子メールアドレス">
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
        <font-awesome-icon icon="copy" />
      </button>
      <br>
      <textarea v-model="publicKey" class="key" spellcheck="false" readonly />
    </p>
    <p>私有鍵
      <button @click="copyPrivateKey" title="私有鍵をクリップボードにコピーする">
        <font-awesome-icon icon="copy" />
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

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faCopy)
Vue.component('font-awesome-icon', FontAwesomeIcon)

const OpenPgp = require('openpgp')

export default {
  props: {
    name: String,
    email: String
  },
  data() {
    return {
      privateKey: "",
      publicKey: "",
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
        this.privateKey = key.privateKeyArmored
        this.publicKey = key.publicKeyArmored
      }).catch((e) => {
        console.log(e)
        Vue.$toast.open({message: e.message, type: 'error'})
      }).finally(() => {
        this.processing = false
      })
    },
    clearKey: function () {
      this.privateKey = ""
      this.publicKey = ""
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
  }
}
</script>
