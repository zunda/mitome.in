<template>
  <div>
    <p>メッセージ<br><textarea v-model="message" class="cleartext" /></p>
    <p>下記にペーストした公開鍵を受取人に
      <button v-bind:disabled="processing" v-on:click="addPubKey">
        追加する
      </button>
      <br>
      <textarea v-model="newPubKey" class="key" spellcheck="false" />
    </p>
    <ul id="public-keys">
      <li v-for="pubKey in pubKeys" :key="pubKey.keyId">
        <button v-on:click="removePubKey(pubKey.keyId)" title="鍵をリストから取り除く"><Fa-Eraser /></button>
        <span class="key-id">{{ pubKey.keyId }}</span>:
        {{ pubKey.name }}
        <span class="email">&lt;{{ pubKey.emali }}&gt;</span>
      </li>
    </ul>
    <p>
      <button v-bind:disabled="processing" v-on:click="encrypt">
        暗号化する
      </button>
    </p>
    <p>暗号文
      <button @click="copyEncryptedMessage" title="暗号文をクリップボードにコピーする">
        <Fa-Copy />
      </button>
      <br>
      <textarea v-model="encryptedMessage" class="encryptedtext" spellcheck="false" readonly />
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
      message: "",
      newPubKey: "",
      pubKeys: [],
      encryptedMessage: "",
      processing: false
    }
  },
  methods: {
    addPubKey: function () {
      this.processing = true
      OpenPgp.key.readArmored(this.newPubKey)
      .then((key) => {
        if (key.keys.length < 1) {
          throw {message: '有効な鍵が見つかりませんでした'}
        }
        const newKey = key.keys[0]
        if (newKey.keyPacket.tag != 6 && newKey.keyPacket.tag != 14) {
          throw {message: '公開鍵ではありません'}
        }
        const newKeyId = newKey.keyPacket.keyid.toHex()
        if (this.pubKeys.find(key => key.keyId === newKeyId)) {
          throw {message: '同じIDの鍵が登録されています'}
        }
        this.pubKeys.unshift({
          keyId: newKeyId,
          name: newKey.users[0].userId.name,
          emali: newKey.users[0].userId.email,
          key: newKey
        })
        this.newPubKey = ''
      }).catch((e) => {
        console.log(e)
        Vue.$toast.open({message: e.message, type: 'error'})

      }).finally(() => {
        this.processing = false
      })
    },
    removePubKey: function (keyId) {
      this.pubKeys = this.pubKeys.filter(key => key.keyId !== keyId)
    },
    encrypt: function() {
    },
    commitPubKeys: function() {
    },
    copyEncryptedMessage: function() {
      this.$copyText(this.encryptedMessage).then(() => {
        Vue.$toast.open({message: '暗号文をコピーしました', type: 'info'})
      }).catch((e) => {
        console.log(e)
        Vue.$toast.open({message: e, type: 'error'})
      })
    }
  },
}
</script>
