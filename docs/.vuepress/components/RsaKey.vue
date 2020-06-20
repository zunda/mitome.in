<template>
  <div>
    <p>
      <input v-model="name" placeholder="ユーザーID">
      <input v-model="email" class="email" placeholder="電子メールアドレス">
      <input v-model="passphrase" class="email" placeholder="パスフレーズ">
      の鍵対を
      <button v-bind:disabled="processing" v-on:click="generateKey">
        生成する
      </button>
    </p>
    <OutputArea v-bind:section="sectionPublicKey"
      cssClass="key"
      name="公開鍵"
      v-bind:output="publicKey"
      v-bind:disabled="processing"
    />
    <OutputArea v-bind:section="sectionPrivateKey"
      cssClass="key"
      name="私有鍵"
      v-bind:output="privateKey"
      v-bind:disabled="processing"
    />
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
      passphrase: "",
      publicKey: "",
      privateKey: "",
      processing: false,
      sectionPublicKey: "RsaKey" + this.owner + "PublicKey",
      sectionPrivateKey: "RsaKey" + this.owner + "PrivateKey"
    }
  },
  methods: {
    generateKey: function () {
      this.processing = true
      OpenPgp.generateKey({
        userIds: [{name: this.name, email: this.email}],
        rsaBits: 2048,
        passphrase: this.passphrase
      }).then(key => {
        this.publicKey = key.publicKeyArmored
        this.privateKey = key.privateKeyArmored
      }).catch(e => {
        console.log(e)
        Vue.$toast.open({message: e.message, type: 'error', duration: 60000})
      }).finally(() => {
        this.processing = false
      })
    }
  },
  mounted() {
    const storedKeyPair = this.$store.state.keyPairs[this.owner]
    if (storedKeyPair !== undefined) {
      this.name = storedKeyPair.name
      this.email = storedKeyPair.email
    } else {
      this.name = this.defaultName
      this.email = this.defaultEmail
    }
  }
}
</script>
