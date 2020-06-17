<template>
  <div>
    <textarea v-model="privateKey" class="key" spellcheck="false" placeholder="受取人の私有鍵" @blur="commitPrivateKey" />
    <button v-bind::disabled="processing" v-on:click="clearPrivateKey" title="私有鍵を消去する" style="float:right;">
      <Fa-Eraser />
    </button>
    <input v-model="passphrase" type="password" placeholder="私有鍵のパスフレーズ" />
    <p>上記にペーストした私有鍵で下記にペーストした暗号文を
      <button v-bind:disabled="processing" v-on:click="decrypt">
        復号する
      </button>
    </p>
    <textarea v-model="encryptedMessage" class="encryptedtext" spellcheck="false" placeholder="暗号文" />
    <p>メッセージ<br><textarea v-model="message" class="cleartext" readonly /></p>
  </div>
</template>

<script>
import Vue from 'vue'

import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'
Vue.use(VueToast)

const OpenPgp = require('openpgp')

export default {
  props: {
    section: String
  },
  data() {
    return {
      privateKey: "",
      passphrase: "",
      encryptedMessage: "",
      message: "",
      processing: false
    }
  },
  methods: {
    decrypt: function () {
      this.processing = true
      Promise.all([
        OpenPgp.message.readArmored(this.encryptedMessage),
        OpenPgp.key.readArmored(this.privateKey).then(data => {
          if (data.keys.length < 1) {
            throw {message: "有効な私有鍵が見つかりませんでした"}
          }
          data.keys.forEach(key => {
            key.decrypt(this.passphrase)
            .catch(e => {
              if (e.message !== "Key packet is already decrypted.") {
                throw e
              }
            })
          })
          return data.keys
        })
      ])
      .then(([encryptedMessage, privateKeys]) =>
        OpenPgp.decrypt({message: encryptedMessage, privateKeys: privateKeys})
      )
      .then(decrypted => this.message = decrypted.data)
      .catch(e => {
        console.log(e.message)
        Vue.$toast.open({message: e.message, type: 'error'})
      })
      .finally(() => {
        this.processing = false
      })
    },
    clearPrivateKey: function () {
      this.privateKey = ""
      this.passphrase = ""
      this.commitPrivateKey()
    },
    commitPrivateKey: function() {
      this.$store.commit('setPrivateKey', {
        owner: this.section, key: this.privateKey
      })
    }
  },
  mounted() {
    if (this.$store.state.privateKey[this.section] !== undefined) {
      this.privateKey = this.$store.state.privateKey[this.section]
    }
  }
}
</script>
