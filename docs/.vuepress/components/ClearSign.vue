<template>
  <div>
    <InputArea section="ClearSignPrivateKey"
      cssClass="key"
      name="署名に使う私有鍵"
      v-bind:disabled="processing"
    />
    <input
      v-model="passphrase"
      type="password"
      placeholder="私有鍵のパスフレーズ"
    />
    <p>上記にペーストした私有鍵で下記のメッセージに
      <button v-bind:disabled="processing" v-on:click="clearSign">
        署名する
      </button>
    </p>
    <InputArea section="ClearSignMessage"
      cssClass="cleartext"
      name="署名対象のメッセージ"
      v-bind:disabled="processing"
    />
    <p>クリアテキスト署名
      <button @click="copySignedMessage" title="クリアテキスト署名をクリップボードにコピーする">
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
  props: {
    section: String
  },
  data() {
    return {
      privateKey: "",
      passphrase: "",
      message: "",
      signedMessage: "",
      processing: false
    }
  },
  methods: {
    clearSign: function () {
      this.processing = true
      const input = this.$store.state.inputText
      Promise.all([
        OpenPgp.cleartext.fromText(input.ClearSignMessage || ""),
        OpenPgp.key.readArmored(input.ClearSignPrivateKey).then(data => {
          if (data.keys.length < 1) {
            if (data.err.length > 0) {
              throw data.err[0]
            } else {
              throw {message: "有効な私有鍵が見つかりませんでした"}
            }
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
        Vue.$toast.open({message: e.message, type: 'error', duration: 60000})
      })
      .finally(() => {
        this.processing = false
      })
    },
    copySignedMessage: function() {
      this.$copyText(this.signedMessage).then(() => {
        Vue.$toast.open({message: 'クリアテキスト署名をコピーしました', type: 'info'})
      }).catch(e => {
        console.log(e)
        Vue.$toast.open({message: e, type: 'error', duration: 60000})
      })
    }
  }
}
</script>
