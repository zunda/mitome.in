<template>
  <div>
    <p>下記の鍵を
      <button v-bind:disabled="processing" @click="readKey" >
      確認する</button>
    </p>
    <InputArea section="ReadKey"
      cssClass="key"
      name="確認する鍵"
      v-bind:disabled="processing"
      v-bind:onInput="clearResult"
    />
    <ul>
      <li>種類: {{ details.type }}</li>
      <li>名前: {{ details.name }}</li>
      <li>電子メールアドレス: <span class="email">{{ details.email }}</span></li>
      <li>生成時刻: {{ details.created }}</li>
      <li>ID: <span class="key-id">{{ details.keyID }}</span></li>
      <li>指紋: <span class="key-id">{{ details.fingerprint }}</span></li>
    </ul>
  </div>
</template>

<script>
import Vue from 'vue'

import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-default.css'
Vue.use(VueToast)

import moment from 'moment'

const OpenPgp = require('openpgp')

export default {
  data() {
    return {
      processing: false,
      details: this.$store.state.outputText.ReadKeyDetails || {}
    }
  },
  methods: {
    readKey: function () {
      if (! this.$store.state.inputText.ReadKey) {
        Vue.$toast.open({message: '確認する鍵をペーストしてください', type: 'warning'})
        return
      }
      this.processing = true
      OpenPgp.readKey({armoredKey: this.$store.state.inputText.ReadKey})
      .then(key => {
        console.log(key)
        const details = {
          name: key.users[0].userID.name,
          email:  key.users[0].userID.email,
          type: key.isPrivate()
            ? (key.isDecrypted() ? '私有鍵' : '私有鍵 (パスフレーズ付き)')
            : '公開鍵',
          created:
            moment(key.keyPacket.created).format('YYYY年MM月DD日 HH:mm:ss Z'),
          keyID: key.keyPacket.keyID.toHex(),
          fingerprint:
            Array.from(key.keyPacket.fingerprint)
            .map(x => ('0' + x.toString(16).toUpperCase()).slice(-2)).join(' ')
        }
        this.$store.commit('setOutputText',
          {section: 'ReadKeyDetails', text: details}
        )
        this.details = details
      }).catch(e => {
        console.log(e)
        Vue.$toast.open({message: e.message, type: 'error', duration: 60000})
      }).finally(() => {
        this.processing = false
      })
    },
    clearResult: function() {
      this.$store.commit('setOutputText', {section: 'ReadKeyDetails', text: {}})
      this.details = {}
    }
  }
}
</script>
