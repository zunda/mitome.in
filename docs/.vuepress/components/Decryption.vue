<template>
  <div>
    <InputArea section="DecryptionPrivateKey"
      cssClass="key"
      name="受取人の私有鍵"
      v-bind:disabled="processing"
      v-bind:onInput="clearDecryptedMessageAndPassphrase"
    />
    <input v-model="passphrase"
      v-bind:disabled="processing"
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
        v-bind:onInput="clearDecryptedMessage"
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
      decryptedMessage: undefined,
      processing: false
    }
  },
  methods: {
    decrypt: function () {
      const input = this.$store.state.inputText
      if (! input.DecryptionPrivateKey) {
        Vue.$toast.open({message: '私有鍵をペーストしてください', type: 'warning'})
        return
      }
      if (! input.DecryptionEncryptedMessage) {
        Vue.$toast.open({message: '暗号文をペーストしてください', type: 'warning'})
        return
      }
      this.processing = true
      this.decryptedMessage = ''
      Promise.all([
        OpenPgp.readMessage({
          armoredMessage: input.DecryptionEncryptedMessage
        }),
        OpenPgp.readKey({ armoredKey: input.DecryptionPrivateKey })
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
      .then(([encryptedMessage, privateKeys]) =>
        OpenPgp.decrypt({
          message: encryptedMessage, decryptionKeys: privateKeys
        })
      )
      .then(decrypted => { this.decryptedMessage = decrypted.data })
      .catch(e => {
        console.log(e.message)
        Vue.$toast.open({message: e.message, type: 'error', duration: 60000})
      })
      .finally(() => {
        this.processing = false
      })
    },
    clearDecryptedMessage: function() {
      this.decryptedMessage = ''
    },
    clearDecryptedMessageAndPassphrase: function() {
      this.decryptedMessage = ''
      this.passphrase = ''
    }
  }
}
</script>
