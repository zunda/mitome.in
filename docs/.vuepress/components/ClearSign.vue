<template>
  <div>
    <textarea v-model="privateKey" class="key" spellcheck="false" placeholder="署名に使う私有鍵" @blur="commitPrivateKey" />
    <button v-bind::disabled="processing" v-on:click="clearPrivateKey" title="私有鍵を消去する" style="float:right;">
      <Fa-Eraser />
    </button>
    <input v-model="passphrase" type="password" placeholder="私有鍵のパスフレーズ" />
    <p>上記にペーストした私有鍵で下記にペーストしたメッセージに
      <button v-bind:disabled="processing" v-on:click="clearSign">
        署名する
      </button>
    </p>
    <p>メッセージ<br><textarea v-model="message" class="cleartext" placeholder="署名されるメッセージ" /></p>
    <p>署名付きメッセージ
      <button @click="copySignedMessage" title="署名付きメッセージをクリップボードにコピーする">
        <Fa-Copy />
      </button>
      <br>
      <textarea v-model="signedMessage" class="cleartext" readonly /></p>
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
  data() {
    return {
      privateKey: "",
      passphrase: "",
      message: "",
      signedMessage: "HI",
      processing: false
    }
  },
  methods: {
    clearSign: function () {
      this.processing = true
      Promise.all([
        OpenPgp.cleartext.fromText(this.message),
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
      .then(([clearText, privateKeys]) =>
        OpenPgp.sign({message: clearText, privateKeys: privateKeys})
      )
      .then(signed => this.signedMessage = signed.data)
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
      this.$store.commit('setPrivateKey', this.privateKey)
    },
    copySignedMessage: function() {
      this.$copyText(this.signedMessage).then(() => {
        Vue.$toast.open({message: '署名付きメッセージをコピーしました', type: 'info'})
      }).catch(e => {
        console.log(e)
        Vue.$toast.open({message: e, type: 'error'})
      })
    }
  },
  mounted() {
    if (this.$store.state.privateKey !== undefined) {
      this.privateKey = this.$store.state.privateKey
    }
  }
}
</script>
