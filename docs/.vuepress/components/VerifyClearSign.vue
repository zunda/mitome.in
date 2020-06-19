<template>
  <div>
    <p>
      <InputArea v-bind:text="publicKey" cssClass="key" name="検証に使う公開鍵" v-bind:onInput="clearResult" v-bind:disabled="processing" />
    </p>
    <p>上記にペーストした公開鍵で下記にペーストしたメッセージの署名を
      <button v-bind:disabled="processing" v-on:click="verify">
        検証する
      </button>
    </p>
    <p>
      クリアテキスト署名<br><textarea v-model="signedMessage" class="cleartext" spellcheck="false" placeholder="検証されるクリアテキスト署名" v-on:input="clearResult" />
      <button v-bind::disabled="processing" v-on:click="clearSignedMessage" title="クリアテキスト署名を消去する" style="float:right;">
        <Fa-Eraser />
      </button>
    </p>
    <p>検証結果: <span v-html="result" /></p>
  </div>
</template>

<script>
import Vue from 'vue'

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

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
      publicKey: "",
      signedMessage: "",
      result: "",
      processing: false
    }
  },
  methods: {
    verify: function () {
      this.result = ""
      this.processing = true
      Promise.all([
        OpenPgp.cleartext.readArmored(this.signedMessage),
        OpenPgp.key.readArmored(this.publicKey).then(data => {
          if (data.keys.length < 1) {
            throw {message: "有効な公開鍵が見つかりませんでした"}
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
      })
      .catch(e => {
        console.log(e.message)
        Vue.$toast.open({message: e.message, type: 'error', duration: 60000})
      })
      .finally(() => {
        this.processing = false
      })
    },
    clearPublicKey: function () {
      this.publicKey = ""
      this.commitPublicKey()
    },
    clearSignedMessage: function () {
      this.signedMessage = ""
    },
    commitPublicKey: function() {
      this.$store.commit('setPublicKey', {
        owner: this.section, key: this.publicKey
      })
    },
    clearResult: function() {
      this.result = ""
    }
  },
  mounted() {
    if (this.$store.state.publicKey[this.section] !== undefined) {
      this.publicKey = this.$store.state.publicKey[this.section]
    }
  }
}
</script>
