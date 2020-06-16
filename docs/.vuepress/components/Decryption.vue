<template>
  <div>
    <textarea v-model="privateKey" class="key" spellcheck="false" placeholder="受取人の私有鍵" />
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
  data() {
    return {
      privateKey: "",
      encryptedMessage: "",
      message: "",
      processing: false
    }
  },
  methods: {
    decrypt: function () {
      this.processing = true
      OpenPgp.key.readArmored(this.privateKey)
      .then(data => {
        if (data.keys.length < 1) {
          throw {message: '有効な鍵が見つかりませんでした'}
        }
        if (data.keys.length > 1) {
          Vue.$toast.open({message: '複数の鍵が見つかりました。最初の鍵を利用します', type: 'warning'})
        }
        OpenPgp.message.readArmored(this.encryptedMessage).
        then(message => {
          OpenPgp.decrypt({message: message, privateKeys: data.keys[0]})
          .then(decrypted => {
            this.message = decrypted.data
          })
        })
      }).catch(e => {
        console.log(e)
        Vue.$toast.open({message: e.message, type: 'error'})
      }).finally(() => {
        this.processing = false
      })
    },
  }
}
</script>
