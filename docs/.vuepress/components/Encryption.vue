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
    <p>ここに公開鍵のリストが表示される</p>
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
  mounted() {
  }
}
</script>
