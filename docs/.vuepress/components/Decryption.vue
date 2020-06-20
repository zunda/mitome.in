<template>
  <div>
    <InputArea section="DecryptionPrivateKey"
      cssClass="key"
      name="受取人の私有鍵"
      v-bind:disabled="processing"
    />
    <input v-model="passphrase"
      type="password" placeholder="私有鍵のパスフレーズ"
    />
    <p>上記にペーストした私有鍵で下記にペーストした暗号文を
      <button v-bind:disabled="processing" v-on:click="decrypt">
        復号する
      </button>
      <InputArea section="DecryptionEncryptedMessage"
        cssClass="key"
        name="暗号文"
        v-bind:disabled="processing"
      />
    </p>
    <p>
      <OutputArea section="DecryptionDecryptedMessage"
        cssClass="cleartext"
        name="メッセージ"
        v-bind:output="decryptedMessage"
        v-bind:disabled="processing"
      />
    </p>
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
      passphrase: "",
      encryptedMessage: "",
      decryptedMessage: "",
      processing: false
    }
  },
  methods: {
    decrypt: function () {
      this.processing = true
      const input = this.$store.state.inputText
      Promise.all([
        OpenPgp.message.readArmored(input.DecryptionEncryptedMessage),
        OpenPgp.key.readArmored(input.DecryptionPrivateKey).then(data => {
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
      .then(decrypted => this.decryptedMessage = decrypted.data)
      .catch(e => {
        console.log(e.message)
        Vue.$toast.open({message: e.message, type: 'error', duration: 60000})
      })
      .finally(() => {
        this.processing = false
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
