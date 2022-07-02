<template>
  <div>
    <InputArea section="ClearSignPrivateKey"
      cssClass="key"
      name="署名に使う私有鍵"
      v-bind:disabled="processing"
      v-bind:onInput="clearSignedMessage"
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
      <InputArea section="ClearSignMessage"
        cssClass="cleartext"
        name="署名対象のメッセージ"
        v-bind:disabled="processing"
        v-bind:onInput="clearSignedMessage"
      />
    </p>
    <p>
      <OutputArea section="ClearSignSignedMessage"
        cssClass="cleartext"
        name="クリアテキスト署名"
        v-bind:output="signedMessage"
        v-bind:disabled="processing"
      />
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
      signedMessage: undefined,
      processing: false
    }
  },
  methods: {
    clearSign: function () {
      const input = this.$store.state.inputText
      const text = input.ClearSignMessage || ''
      if (text === '') {
        Vue.$toast.open({message: 'ここでは空文字列には署名できません', type: 'warning'})
        return
      }
      if (!input.ClearSignPrivateKey) {
        Vue.$toast.open({message: '署名に使う私有鍵をペーストしてください', type: 'warning'})
        return
      }
      this.processing = true
      Promise.all([
        OpenPgp.createCleartextMessage({ text: text }),
        OpenPgp.readKey({ armoredKey: input.ClearSignPrivateKey })
        .then(key => {
          if (! key.isPrivate()) {
            throw {message: '私有鍵ではありません'}
          }
          if (key.isDecrypted()) {
            return key
          } else {
            return OpenPgp.decryptKey({
              privateKey: key,
              passphrase: this.passphrase
            })
          }
        })
      ])
      .then(([clearText, privateKeys]) =>
        OpenPgp.sign({message: clearText, signingKeys: privateKeys})
      )
      .then(signed => {this.signedMessage = signed})
      .catch(e => {
        console.log(e.message)
        Vue.$toast.open({message: e.message, type: 'error', duration: 60000})
      })
      .finally(() => {
        this.processing = false
      })
    },
    clearSignedMessage: function() {
      this.signedMessage = ''
    }
  }
}
</script>
