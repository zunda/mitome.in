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
import Vue from "vue"

import VueClipboard from "vue-clipboard2"
Vue.use(VueClipboard)

import VueToast from "vue-toast-notification"
import "vue-toast-notification/dist/theme-default.css"
Vue.use(VueToast)

import moment from "moment"

const OpenPgp = require("openpgp")

export default {
  props: {
    section: String
  },
  data() {
    return {
      result: this.$store.state.outputText.VerifyClearSignResult || "",
      processing: false
    }
  },
  methods: {
    verify: function () {
      const input = this.$store.state.inputText
      if (!input.VerifyClearSignPublicKey) {
        Vue.$toast.open({message: "検証に利用する公開鍵をペーストしてください", type: "warning"})
        return
      }
      if (!input.VerifyClearSignClearText) {
        Vue.$toast.open({message: "検証するクリアテキスト署名をペーストしてください", type: "warning"})
        return
      }
      this.result = ""
      this.processing = true
      Promise.all([
        OpenPgp.readCleartextMessage({
          cleartextMessage: input.VerifyClearSignClearText
        }),
        OpenPgp.readKey({
          armoredKey: input.VerifyClearSignPublicKey
        })
      ])
      .then(([clearText, publicKeys]) =>
        OpenPgp.verify({message: clearText, verificationKeys: publicKeys})
      )
      .then(result => Promise.all([
        result.signatures[0].verified,
        result.signatures[0].keyID,
        result.signatures[0].signature
      ]))
      .then(([_verified, keyID, signature]) => {
        console.log(signature)
        this.result = "成功: 鍵ID: <span class="key-id">" +
          keyID.toHex() + "</span> 時刻: " +
          moment(signature.packets[0].created).format("YYYY年MM月DD日 HH:mm:ss Z")
        this.$store.commit("setOutputText", {
          section: "VerifyClearSignResult", text: this.result
        })
      })
      .catch(e => {
        this.result = "失敗: " + e.message
        this.$store.commit("setOutputText", {
          section: "VerifyClearSignResult", text: this.result
        })
        return
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
