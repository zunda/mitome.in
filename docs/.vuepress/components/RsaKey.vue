<template>
  <div>
    <p>
      <input
        v-model="name"
        v-on:input="commitName"
        placeholder="ユーザーID"
      >
      <input
        v-model="email"
        v-on:input="commitEmail"
        class="email"
        placeholder="電子メールアドレス"
      >
      <input
        v-model="passphrase"
        v-on:input="commitPassphrase"
        placeholder="パスフレーズ"
      >
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
    const input = this.$store.state.inputText
    return {
      name: input["RsaKey" + this.owner + "Name"] || this.defaultName,
      email: input["RsaKey" + this.owner + "Email"] || this.defaultEmail,
      passphrase: input["RsaKey" + this.owner + "Passphrase"] || "",
      publicKey: undefined,
      privateKey: undefined,
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
    },
    commitName: function() {
      this.$store.commit('setInputText', {
        section: "RsaKey" + this.owner + "Name", text: this.name
      })
    },
    commitEmail: function() {
      this.$store.commit('setInputText', {
        section: "RsaKey" + this.owner + "Email", text: this.email
      })
    },
    commitPassphrase: function() {
      this.$store.commit('setInputText', {
        section: "RsaKey" + this.owner + "Passphrase", text: this.passphrase
      })
    },
  }
}
</script>
