<template>
  <div>
    <p>下記の鍵を
      <button v-bind:disabled="processing" @click="checkKey" >
      確認する</button><br>
      <textarea v-model="keyArmored" class="key" spellcheck="false" />
    </p>
    <ul>
      <li>鍵の種類: {{ klass }}</li>
      <li>名前: {{ name }}</li>
      <li>電子メールアドレス: {{ email }}</li>
      <li>生成時刻:<br>{{ created }}</li>
      <li>指紋(fingerprint):<br>{{ fingerprint }}</li>
    </ul>
  </div>
</template>

<script>
import Vue from 'vue'

import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';
Vue.use(VueToast);

const OpenPgp = require('openpgp')

export default {
  data() {
    return {
      keyArmored: "",
      name: "",
      email: "",
      created: "",
      klass: "",
      fingerprint: "",
      processing: false,
      processed: false
    }
  },
  methods: {
    checkKey: function () {
      this.processing = true
      OpenPgp.key.readArmored(this.keyArmored)
      .then((key) => {
        if (key.keys.length < 1) {
          throw {message: '有効な鍵が見つかりませんでした'}
        }
        this.name = key.keys[0].users[0].userId.name
        this.email = key.keys[0].users[0].userId.email
        this.klass = key.keys[0].keyPacket.constructor.name
        this.created = key.keys[0].keyPacket.created
        this.fingerprint =
          Array.from(key.keys[0].keyPacket.fingerprint)
          .map(x => ('0' + x.toString(16).toUpperCase()).slice(-2)).join(' ')
        this.processed = true
      }).catch((e) => {
        console.log(e)
        Vue.$toast.open({message: e.message, type: 'error'})
      }).finally(() => {
        this.processing = false
      })
    }
  }
}
</script>
