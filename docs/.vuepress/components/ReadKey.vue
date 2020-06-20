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
      <li>ID: <span class="key-id">{{ details.keyId }}</span></li>
      <li>指紋(fingerprint): <span class="key-id">{{ details.fingerprint }}</span></li>
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

// https://www.ipa.go.jp/security/rfc/RFC2440JA.html#05
const packetTypes = {
  1: '公開鍵暗号セッション鍵',
  2: '署名',
  3: '共通鍵で暗号化されたセッション鍵',
  4: 'One-Pass署名',
  6: '公開鍵',
  14: '公開サブキー',
  5: '私有鍵',  // 秘密鍵
  7: '私有サブキー',  // 秘密サブキー
  8: '圧縮データ',
  9: '共通鍵暗号化データ',
  10: 'マーカー',
  11: 'リテラルデータ',
  12: 'トラスト',
  13: 'ユーザID'
}

export default {
  data() {
    return {
      processing: false,
      details: this.$store.state.outputText.ReadKeyDetails || {}
    }
  },
  methods: {
    readKey: function () {
      this.processing = true
      OpenPgp.key.readArmored( this.$store.state.inputText.ReadKey)
      .then(data => {
        if (data.keys.length < 1) {
          if (data.err.length > 0) {
            throw data.err[0]
          } else {
            throw {message: '有効な鍵が見つかりませんでした'}
          }
        }
        const details = {
          name: data.keys[0].users[0].userId.name,
          email:  data.keys[0].users[0].userId.email,
          type: packetTypes[data.keys[0].keyPacket.tag],
          created: moment(data.keys[0].keyPacket.created).format('YYYY年MM月DD日 HH:mm:ss Z'),
          keyId: data.keys[0].keyPacket.keyid.toHex(),
          fingerprint:
            Array.from(data.keys[0].keyPacket.fingerprint)
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
