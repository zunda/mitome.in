<template>
  <div>
    <InputArea section="VerifyClearSignPublicKey"
      cssClass="key"
      name="検証に使う公開鍵"
      v-bind:onInput="clearResult"
      v-bind:disabled="processing"
    />
    <p>上記にペーストした公開鍵で下記にペーストしたクリアテキスト署名を
      <button v-bind:disabled="processing" v-on:click="verify">
        検証する
      </button>
    </p>
    <InputArea section="VerifyClearSignClearText"
      cssClass="cleartext"
      name="検証されるクリアテキスト署名"
      v-bind:onInput="clearResult"
      v-bind:disabled="processing"
    />
    <p>検証結果: <span v-html="result" /></p>
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
  props: {
    section: String
  },
  data() {
    return {
      result: this.$store.state.outputText.VerifyClearSignResult || '',
      processing: false
    }
  },
  methods: {
    verify: function () {
      this.result = ""
      this.processing = true
      const input = this.$store.state.inputText
      Promise.all([
        OpenPgp.cleartext.readArmored(input.VerifyClearSignClearText)
        .then(data => {
          console.log(data)
          return(data)
        }),
        OpenPgp.key.readArmored(input.VerifyClearSignPublicKey).then(data => {
          if (data.keys.length < 1) {
            if (data.err.length > 0) {
              throw data.err[0]
            } else {
              throw {message: "有効な私有鍵が見つかりませんでした"}
            }
          }
          return data.keys
        })
      ])
      .then(([clearText, publicKeys]) =>
        OpenPgp.verify({message: clearText, publicKeys: publicKeys})
      )
      .then(result => {
        const signature = result.signatures[0]
        if (signature.valid) {
          this.result = '成功 鍵ID: <span class="key-id">' +
            signature.keyid.toHex() + '</span> 時刻: ' +
            moment(signature.signature.packets[0].created).format('YYYY年MM月DD日 HH:mm:ss Z')

        } else {
          this.result = "失敗"
        }
        this.$store.commit('setOutputText', {
          section: 'VerifyClearSignResult', text: this.result
        })
      })
      .catch(e => {
        console.log(e.message)
        Vue.$toast.open({message: e.message, type: 'error', duration: 60000})
      })
      .finally(() => {
        this.processing = false
      })
    },
    clearResult: function() {
      this.result = ""
    }
  }
}
</script>
